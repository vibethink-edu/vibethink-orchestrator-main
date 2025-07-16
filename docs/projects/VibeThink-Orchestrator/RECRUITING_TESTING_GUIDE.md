# Guía de Testing - Módulo Agentic de Recruiting

## Índice
1. [Estrategia de Testing](#estrategia-de-testing)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [E2E Tests](#e2e-tests)
5. [Performance Tests](#performance-tests)
6. [Security Tests](#security-tests)
7. [Testing de Agentes](#testing-de-agentes)
8. [CI/CD Pipeline](#cicd-pipeline)

---

## Estrategia de Testing

### Pirámide de Testing

```
        E2E Tests (10%)
    ┌─────────────────┐
    │                 │
    │  Integration    │
    │    Tests        │ (20%)
    │                 │
┌─────────────────────────┐
│                         │
│      Unit Tests         │ (70%)
│                         │
└─────────────────────────┘
```

### Cobertura Objetivo

- **Unit Tests**: >90%
- **Integration Tests**: >80%
- **E2E Tests**: >70%
- **Performance Tests**: 100% de endpoints críticos

---

## Unit Tests

### Configuración de Pytest

```python
# tests/conftest.py
import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

# Base de datos de testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### Tests de Modelos

```python
# tests/unit/test_models.py
import pytest
from pydantic import ValidationError
from app.models.recruiting import (
    RecruitingWorkflowRequest,
    PositionRequest,
    RequirementsRequest
)

class TestPositionRequest:
    def test_valid_position(self):
        data = {
            "title": "Senior Software Engineer",
            "department": "Engineering",
            "location": "Bogotá, Colombia",
            "position_type": "full-time"
        }
        position = PositionRequest(**data)
        assert position.title == "Senior Software Engineer"
        assert position.position_type == "full-time"
    
    def test_invalid_position_type(self):
        data = {
            "title": "Developer",
            "location": "Bogotá",
            "position_type": "invalid"
        }
        with pytest.raises(ValidationError):
            PositionRequest(**data)
    
    def test_missing_required_fields(self):
        data = {"title": "Developer"}
        with pytest.raises(ValidationError):
            PositionRequest(**data)

class TestRequirementsRequest:
    def test_valid_requirements(self):
        data = {
            "skills": ["Python", "React"],
            "experience_years": 3,
            "education": "Bachelor's degree",
            "languages": ["Spanish", "English"]
        }
        requirements = RequirementsRequest(**data)
        assert len(requirements.skills) == 2
        assert requirements.experience_years == 3
    
    def test_empty_skills_list(self):
        data = {
            "skills": [],
            "experience_years": 3
        }
        with pytest.raises(ValidationError):
            RequirementsRequest(**data)
    
    def test_invalid_experience_years(self):
        data = {
            "skills": ["Python"],
            "experience_years": -1
        }
        with pytest.raises(ValidationError):
            RequirementsRequest(**data)
```

### Tests de Servicios

```python
# tests/unit/test_services.py
import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.services.linkedin_service import LinkedInService
from app.services.email_service import EmailService

class TestLinkedInService:
    @pytest.fixture
    def linkedin_service(self):
        return LinkedInService("test_api_key")
    
    @pytest.mark.asyncio
    async def test_search_people_success(self, linkedin_service):
        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.json.return_value = {
                "elements": [
                    {
                        "id": "123",
                        "firstName": "John",
                        "lastName": "Doe",
                        "headline": "Software Engineer"
                    }
                ]
            }
            mock_response.status_code = 200
            mock_get.return_value = mock_response
            
            result = await linkedin_service.search_people(
                keywords=["Python", "React"],
                location="Bogotá"
            )
            
            assert len(result) == 1
            assert result[0]["id"] == "123"
    
    @pytest.mark.asyncio
    async def test_search_people_api_error(self, linkedin_service):
        with patch('requests.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 401
            mock_get.return_value = mock_response
            
            with pytest.raises(Exception):
                await linkedin_service.search_people(
                    keywords=["Python"],
                    location="Bogotá"
                )

class TestEmailService:
    @pytest.fixture
    def email_service(self):
        return EmailService("test_api_key", "test@company.com")
    
    @pytest.mark.asyncio
    async def test_send_template_email_success(self, email_service):
        with patch('sendgrid.SendGridAPIClient') as mock_sg:
            mock_instance = Mock()
            mock_instance.send.return_value.status_code = 202
            mock_sg.return_value = mock_instance
            
            result = await email_service.send_template_email(
                to_email="test@example.com",
                template_id="template_123",
                dynamic_data={"name": "John"}
            )
            
            assert result is True
    
    @pytest.mark.asyncio
    async def test_send_template_email_failure(self, email_service):
        with patch('sendgrid.SendGridAPIClient') as mock_sg:
            mock_instance = Mock()
            mock_instance.send.side_effect = Exception("API Error")
            mock_sg.return_value = mock_instance
            
            result = await email_service.send_template_email(
                to_email="test@example.com",
                template_id="template_123",
                dynamic_data={"name": "John"}
            )
            
            assert result is False
```

### Tests de Agentes

```python
# tests/unit/test_agents.py
import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.agents.market_research_agent import MarketResearchAgent
from app.agents.linkedin_scraper_agent import LinkedInScraperAgent

class TestMarketResearchAgent:
    @pytest.fixture
    def agent(self):
        return MarketResearchAgent("company_123")
    
    @pytest.mark.asyncio
    async def test_analyze_market(self, agent):
        with patch.object(agent, '_fetch_market_data') as mock_fetch:
            mock_fetch.return_value = {
                "salary_range": "4000-6000",
                "competitors": ["TechCorp", "StartupXYZ"],
                "trends": ["Remote work", "AI/ML"]
            }
            
            result = await agent.analyze_market("Senior Developer", "Bogotá")
            
            assert result["salary_range"] == "4000-6000"
            assert len(result["competitors"]) == 2
    
    @pytest.mark.asyncio
    async def test_identify_keywords(self, agent):
        result = await agent.identify_keywords(
            position="Senior Software Engineer",
            requirements=["Python", "React", "AWS"]
        )
        
        assert "Python" in result
        assert "React" in result
        assert "AWS" in result
        assert "Senior" in result

class TestLinkedInScraperAgent:
    @pytest.fixture
    def agent(self):
        return LinkedInScraperAgent("company_123")
    
    @pytest.mark.asyncio
    async def test_search_candidates(self, agent):
        with patch.object(agent, '_perform_search') as mock_search:
            mock_search.return_value = [
                {
                    "id": "123",
                    "name": "María González",
                    "title": "Senior Developer",
                    "company": "TechCorp"
                }
            ]
            
            result = await agent.search_candidates(
                keywords=["Python", "React"],
                location="Bogotá"
            )
            
            assert len(result) == 1
            assert result[0]["name"] == "María González"
    
    @pytest.mark.asyncio
    async def test_scrape_profile_details(self, agent):
        with patch.object(agent, '_scrape_page') as mock_scrape:
            mock_scrape.return_value = {
                "experience": [
                    {"title": "Senior Developer", "company": "TechCorp"}
                ],
                "education": [
                    {"school": "Universidad Nacional", "degree": "Ingeniería"}
                ]
            }
            
            result = await agent.scrape_profile_details("profile_url")
            
            assert len(result["experience"]) == 1
            assert len(result["education"]) == 1
```

---

## Integration Tests

### Tests de API

```python
# tests/integration/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

class TestRecruitingAPI:
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_create_workflow_success(self, client):
        workflow_data = {
            "company_id": "company_123",
            "position": {
                "title": "Senior Developer",
                "department": "Engineering",
                "location": "Bogotá, Colombia",
                "position_type": "full-time"
            },
            "requirements": {
                "skills": ["Python", "React"],
                "experience_years": 3,
                "education": "Bachelor's degree",
                "languages": ["Spanish", "English"]
            },
            "search_strategy": {
                "internal_search": True,
                "linkedin_search": True,
                "external_portals": ["Indeed"],
                "outreach_channels": ["email"]
            }
        }
        
        response = client.post("/workflows/start", json=workflow_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "workflow_id" in data
        assert data["status"] == "initiated"
    
    def test_create_workflow_invalid_data(self, client):
        workflow_data = {
            "company_id": "company_123",
            "position": {
                "title": "Developer"
                # Missing required fields
            }
        }
        
        response = client.post("/workflows/start", json=workflow_data)
        
        assert response.status_code == 422
    
    def test_get_workflow_status(self, client):
        # First create a workflow
        workflow_data = {
            "company_id": "company_123",
            "position": {
                "title": "Developer",
                "location": "Bogotá",
                "position_type": "full-time"
            },
            "requirements": {
                "skills": ["Python"],
                "experience_years": 3
            },
            "search_strategy": {
                "internal_search": True,
                "linkedin_search": True,
                "external_portals": [],
                "outreach_channels": ["email"]
            }
        }
        
        create_response = client.post("/workflows/start", json=workflow_data)
        workflow_id = create_response.json()["workflow_id"]
        
        # Then get its status
        response = client.get(f"/workflows/{workflow_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["workflow_id"] == workflow_id
        assert "status" in data
    
    def test_get_candidates(self, client):
        # Create workflow and add some candidates
        workflow_data = {
            "company_id": "company_123",
            "position": {
                "title": "Developer",
                "location": "Bogotá",
                "position_type": "full-time"
            },
            "requirements": {
                "skills": ["Python"],
                "experience_years": 3
            },
            "search_strategy": {
                "internal_search": True,
                "linkedin_search": True,
                "external_portals": [],
                "outreach_channels": ["email"]
            }
        }
        
        create_response = client.post("/workflows/start", json=workflow_data)
        workflow_id = create_response.json()["workflow_id"]
        
        # Get candidates
        response = client.get(f"/workflows/{workflow_id}/candidates")
        
        assert response.status_code == 200
        data = response.json()
        assert "candidates" in data
        assert isinstance(data["candidates"], list)
```

### Tests de Base de Datos

```python
# tests/integration/test_database.py
import pytest
from sqlalchemy.orm import Session
from app.models.recruiting import RecruitingWorkflow, RecruitingCandidate
from app.services.workflow_service import WorkflowService

class TestWorkflowService:
    @pytest.fixture
    def workflow_service(self, db_session: Session):
        return WorkflowService(db_session)
    
    def test_create_workflow(self, workflow_service):
        workflow_data = {
            "company_id": "company_123",
            "position_title": "Senior Developer",
            "department": "Engineering",
            "location": "Bogotá",
            "requirements": {"skills": ["Python"]},
            "search_strategy": {"internal_search": True}
        }
        
        workflow = workflow_service.create_workflow(workflow_data)
        
        assert workflow.company_id == "company_123"
        assert workflow.position_title == "Senior Developer"
        assert workflow.status == "initiated"
    
    def test_get_workflow_by_id(self, workflow_service):
        # Create workflow first
        workflow_data = {
            "company_id": "company_123",
            "position_title": "Developer",
            "location": "Bogotá",
            "requirements": {"skills": ["Python"]},
            "search_strategy": {"internal_search": True}
        }
        
        created_workflow = workflow_service.create_workflow(workflow_data)
        
        # Get workflow by ID
        workflow = workflow_service.get_workflow_by_id(created_workflow.id)
        
        assert workflow is not None
        assert workflow.id == created_workflow.id
        assert workflow.position_title == "Developer"
    
    def test_add_candidate_to_workflow(self, workflow_service):
        # Create workflow
        workflow_data = {
            "company_id": "company_123",
            "position_title": "Developer",
            "location": "Bogotá",
            "requirements": {"skills": ["Python"]},
            "search_strategy": {"internal_search": True}
        }
        
        workflow = workflow_service.create_workflow(workflow_data)
        
        # Add candidate
        candidate_data = {
            "name": "María González",
            "title": "Senior Developer",
            "company": "TechCorp",
            "source": "linkedin",
            "skills": ["Python", "React"]
        }
        
        candidate = workflow_service.add_candidate(workflow.id, candidate_data)
        
        assert candidate.workflow_id == workflow.id
        assert candidate.name == "María González"
        assert candidate.source == "linkedin"
```

---

## E2E Tests

### Tests con Playwright

```python
# tests/e2e/test_workflow_e2e.py
import pytest
from playwright.async_api import async_playwright
import asyncio

class TestWorkflowE2E:
    @pytest.fixture
    async def browser(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            yield browser
            await browser.close()
    
    @pytest.fixture
    async def page(self, browser):
        page = await browser.new_page()
        yield page
        await page.close()
    
    @pytest.mark.asyncio
    async def test_complete_recruiting_workflow(self, page):
        # 1. Login to the system
        await page.goto("http://localhost:3000/login")
        await page.fill('input[name="email"]', "hr@company.com")
        await page.fill('input[name="password"]', "password123")
        await page.click('button[type="submit"]')
        
        # Wait for dashboard to load
        await page.wait_for_selector('.dashboard')
        
        # 2. Create new workflow
        await page.click('button:has-text("Nuevo Workflow")')
        
        # Fill position information
        await page.fill('input[name="position_title"]', "Senior Software Engineer")
        await page.fill('input[name="department"]', "Engineering")
        await page.fill('input[name="location"]', "Bogotá, Colombia")
        await page.select_option('select[name="position_type"]', "full-time")
        
        # Fill requirements
        await page.fill('input[name="skills"]', "Python, React, AWS")
        await page.fill('input[name="experience_years"]', "3")
        await page.fill('input[name="education"]', "Bachelor's degree")
        
        # Configure search strategy
        await page.check('input[name="internal_search"]')
        await page.check('input[name="linkedin_search"]')
        await page.check('input[name="email_outreach"]')
        
        # Submit workflow
        await page.click('button:has-text("Crear Workflow")')
        
        # 3. Wait for workflow to start
        await page.wait_for_selector('.workflow-status')
        status = await page.text_content('.workflow-status')
        assert "iniciado" in status.lower()
        
        # 4. Check that landing page was created
        await page.wait_for_selector('.landing-page-url')
        landing_url = await page.get_attribute('.landing-page-url', 'href')
        assert landing_url is not None
        
        # 5. Simulate candidate application
        await page.goto(landing_url)
        await page.fill('input[name="name"]', "María González")
        await page.fill('input[name="email"]', "maria@example.com")
        await page.fill('input[name="phone"]', "+57 300 123 4567")
        
        # Upload CV (simulate file upload)
        await page.set_input_files('input[name="cv"]', "tests/fixtures/sample_cv.pdf")
        
        await page.click('button:has-text("Enviar Aplicación")')
        
        # 6. Verify application was received
        await page.goto("http://localhost:3000/applications")
        await page.wait_for_selector('.application-item')
        
        candidate_name = await page.text_content('.application-item .candidate-name')
        assert "María González" in candidate_name
    
    @pytest.mark.asyncio
    async def test_candidate_management(self, page):
        # Login and navigate to candidates
        await page.goto("http://localhost:3000/login")
        await page.fill('input[name="email"]', "hr@company.com")
        await page.fill('input[name="password"]', "password123")
        await page.click('button[type="submit"]')
        
        await page.click('a:has-text("Candidatos")')
        
        # Filter candidates
        await page.select_option('select[name="status"]', "found")
        await page.click('button:has-text("Filtrar")')
        
        # Check that candidates are displayed
        await page.wait_for_selector('.candidate-item')
        candidates = await page.query_selector_all('.candidate-item')
        assert len(candidates) > 0
        
        # View candidate details
        await page.click('.candidate-item:first-child .view-profile')
        await page.wait_for_selector('.candidate-details')
        
        # Verify candidate information
        name = await page.text_content('.candidate-details .name')
        assert name is not None
        
        # Send outreach
        await page.click('button:has-text("Contactar")')
        await page.fill('textarea[name="message"]', "Hola, nos gustaría invitarte...")
        await page.click('button:has-text("Enviar")')
        
        # Verify outreach was sent
        await page.wait_for_selector('.outreach-sent')
        status = await page.text_content('.outreach-sent')
        assert "enviado" in status.lower()
```

---

## Performance Tests

### Tests con Locust

```python
# tests/performance/locustfile.py
from locust import HttpUser, task, between
import json

class RecruitingUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        # Login and get token
        response = self.client.post("/auth/login", json={
            "email": "hr@company.com",
            "password": "password123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(3)
    def get_workflows(self):
        self.client.get("/workflows", headers=self.headers)
    
    @task(2)
    def create_workflow(self):
        workflow_data = {
            "company_id": "company_123",
            "position": {
                "title": "Developer",
                "location": "Bogotá",
                "position_type": "full-time"
            },
            "requirements": {
                "skills": ["Python"],
                "experience_years": 3
            },
            "search_strategy": {
                "internal_search": True,
                "linkedin_search": True,
                "external_portals": [],
                "outreach_channels": ["email"]
            }
        }
        self.client.post("/workflows/start", 
                        json=workflow_data, 
                        headers=self.headers)
    
    @task(4)
    def get_candidates(self):
        self.client.get("/workflows/test_workflow/candidates", 
                       headers=self.headers)
    
    @task(2)
    def get_applications(self):
        self.client.get("/workflows/test_workflow/applications", 
                       headers=self.headers)
    
    @task(1)
    def get_metrics(self):
        self.client.get("/workflows/test_workflow/metrics", 
                       headers=self.headers)
```

### Tests de Carga con Artillery

```yaml
# tests/performance/artillery-config.yml
config:
  target: 'http://localhost:8000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  defaults:
    headers:
      Authorization: 'Bearer {{ $randomString() }}'

scenarios:
  - name: "API Load Test"
    weight: 100
    flow:
      - get:
          url: "/workflows"
      - think: 1
      - post:
          url: "/workflows/start"
          json:
            company_id: "company_123"
            position:
              title: "Developer"
              location: "Bogotá"
              position_type: "full-time"
            requirements:
              skills: ["Python"]
              experience_years: 3
            search_strategy:
              internal_search: true
              linkedin_search: true
              external_portals: []
              outreach_channels: ["email"]
      - think: 2
      - get:
          url: "/workflows/{{ workflow_id }}/candidates"
```

---

## Security Tests

### Tests de Autenticación

```python
# tests/security/test_auth.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

class TestAuthentication:
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_protected_endpoint_without_token(self, client):
        response = client.get("/workflows")
        assert response.status_code == 401
    
    def test_protected_endpoint_with_invalid_token(self, client):
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/workflows", headers=headers)
        assert response.status_code == 401
    
    def test_protected_endpoint_with_valid_token(self, client):
        # First login to get token
        login_response = client.post("/auth/login", json={
            "email": "hr@company.com",
            "password": "password123"
        })
        token = login_response.json()["access_token"]
        
        headers = {"Authorization": f"Bearer {token}"}
        response = client.get("/workflows", headers=headers)
        assert response.status_code == 200
    
    def test_company_isolation(self, client):
        # Login as company A
        login_response = client.post("/auth/login", json={
            "email": "hr@company_a.com",
            "password": "password123"
        })
        token_a = login_response.json()["access_token"]
        
        # Create workflow for company A
        headers_a = {"Authorization": f"Bearer {token_a}"}
        workflow_data = {
            "company_id": "company_a",
            "position": {
                "title": "Developer",
                "location": "Bogotá",
                "position_type": "full-time"
            },
            "requirements": {
                "skills": ["Python"],
                "experience_years": 3
            },
            "search_strategy": {
                "internal_search": True,
                "linkedin_search": True,
                "external_portals": [],
                "outreach_channels": ["email"]
            }
        }
        
        create_response = client.post("/workflows/start", 
                                    json=workflow_data, 
                                    headers=headers_a)
        workflow_id = create_response.json()["workflow_id"]
        
        # Login as company B
        login_response_b = client.post("/auth/login", json={
            "email": "hr@company_b.com",
            "password": "password123"
        })
        token_b = login_response_b.json()["access_token"]
        
        # Try to access company A's workflow
        headers_b = {"Authorization": f"Bearer {token_b}"}
        response = client.get(f"/workflows/{workflow_id}", headers=headers_b)
        
        # Should be forbidden
        assert response.status_code == 403
```

### Tests de Rate Limiting

```python
# tests/security/test_rate_limiting.py
import pytest
import time
from fastapi.testclient import TestClient
from app.main import app

class TestRateLimiting:
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    def test_rate_limiting_on_workflow_creation(self, client):
        # Login to get token
        login_response = client.post("/auth/login", json={
            "email": "hr@company.com",
            "password": "password123"
        })
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        workflow_data = {
            "company_id": "company_123",
            "position": {
                "title": "Developer",
                "location": "Bogotá",
                "position_type": "full-time"
            },
            "requirements": {
                "skills": ["Python"],
                "experience_years": 3
            },
            "search_strategy": {
                "internal_search": True,
                "linkedin_search": True,
                "external_portals": [],
                "outreach_channels": ["email"]
            }
        }
        
        # Send multiple requests quickly
        responses = []
        for i in range(15):  # More than the rate limit
            response = client.post("/workflows/start", 
                                 json=workflow_data, 
                                 headers=headers)
            responses.append(response)
        
        # Check that some requests were rate limited
        rate_limited = [r for r in responses if r.status_code == 429]
        assert len(rate_limited) > 0
    
    def test_rate_limiting_on_api_calls(self, client):
        # Login to get token
        login_response = client.post("/auth/login", json={
            "email": "hr@company.com",
            "password": "password123"
        })
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Send many API calls quickly
        responses = []
        for i in range(100):
            response = client.get("/workflows", headers=headers)
            responses.append(response)
        
        # Check that some requests were rate limited
        rate_limited = [r for r in responses if r.status_code == 429]
        assert len(rate_limited) > 0
```

---

## Testing de Agentes

### Tests de CrewAI

```python
# tests/agents/test_crewai_agents.py
import pytest
from unittest.mock import Mock, patch, AsyncMock
from app.agents.recruiting_crew import RecruitingAgentCrew

class TestRecruitingAgentCrew:
    @pytest.fixture
    def crew(self):
        return RecruitingAgentCrew("company_123")
    
    @pytest.mark.asyncio
    async def test_crew_creation(self, crew):
        assert len(crew.crew.agents) == 6  # 6 agents as defined
        assert len(crew.crew.tasks) == 6   # 6 tasks as defined
    
    @pytest.mark.asyncio
    async def test_market_research_agent(self, crew):
        market_agent = crew.crew.agents[0]
        assert market_agent.role == "Market Research Specialist"
        assert len(market_agent.tools) > 0
    
    @pytest.mark.asyncio
    async def test_database_search_agent(self, crew):
        db_agent = crew.crew.agents[1]
        assert db_agent.role == "Database Search Specialist"
        assert len(db_agent.tools) > 0
    
    @pytest.mark.asyncio
    async def test_linkedin_scraper_agent(self, crew):
        scraper_agent = crew.crew.agents[2]
        assert scraper_agent.role == "LinkedIn Research Specialist"
        assert len(scraper_agent.tools) > 0
    
    @pytest.mark.asyncio
    async def test_outreach_agent(self, crew):
        outreach_agent = crew.crew.agents[3]
        assert outreach_agent.role == "Outreach and Communication Specialist"
        assert len(outreach_agent.tools) > 0
    
    @pytest.mark.asyncio
    async def test_landing_page_agent(self, crew):
        landing_agent = crew.crew.agents[4]
        assert landing_agent.role == "Landing Page Creator"
        assert len(landing_agent.tools) > 0
    
    @pytest.mark.asyncio
    async def test_application_manager_agent(self, crew):
        app_agent = crew.crew.agents[5]
        assert app_agent.role == "Application Manager"
        assert len(app_agent.tools) > 0
    
    @pytest.mark.asyncio
    async def test_crew_execution(self, crew):
        with patch.object(crew.crew, 'kickoff') as mock_kickoff:
            mock_kickoff.return_value = {
                "candidates_found": 10,
                "outreach_sent": 5,
                "applications_received": 2
            }
            
            result = await crew.execute_workflow({
                "position": "Senior Developer",
                "requirements": {"skills": ["Python"]},
                "location": "Bogotá"
            })
            
            assert result["candidates_found"] == 10
            assert result["outreach_sent"] == 5
            assert result["applications_received"] == 2
```

### Tests de LangGraph

```python
# tests/agents/test_langgraph_workflows.py
import pytest
from app.workflows.document_signing_workflow import DocumentSigningWorkflow
from app.models.workflow_state import WorkflowState

class TestDocumentSigningWorkflow:
    @pytest.fixture
    def workflow(self):
        return DocumentSigningWorkflow()
    
    def test_workflow_creation(self, workflow):
        assert workflow.graph is not None
    
    @pytest.mark.asyncio
    async def test_workflow_execution(self, workflow):
        initial_state = WorkflowState(
            company_id="company_123",
            user_id="user_123",
            task_type="document_signing",
            data={
                "document_url": "https://example.com/doc.pdf",
                "signers": ["signer1@email.com", "signer2@email.com"]
            }
        )
        
        result = await workflow.graph.ainvoke(initial_state)
        
        assert result.status == "completed"
        assert "document_parsed" in result.results
        assert "signers_identified" in result.results
    
    @pytest.mark.asyncio
    async def test_workflow_with_error(self, workflow):
        initial_state = WorkflowState(
            company_id="company_123",
            user_id="user_123",
            task_type="document_signing",
            data={
                "document_url": "invalid_url",
                "signers": []
            }
        )
        
        result = await workflow.graph.ainvoke(initial_state)
        
        assert result.status == "error"
        assert "error" in result.results
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test Recruiting Module

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_recruiting
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Playwright
      run: npx playwright install chromium
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
    
    - name: Run linting
      run: |
        flake8 app/ tests/
        black --check app/ tests/
        isort --check-only app/ tests/
    
    - name: Run unit tests
      run: |
        pytest tests/unit/ -v --cov=app --cov-report=xml
    
    - name: Run integration tests
      run: |
        pytest tests/integration/ -v
    
    - name: Run E2E tests
      run: |
        pytest tests/e2e/ -v
    
    - name: Run security tests
      run: |
        pytest tests/security/ -v
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
        flags: unittests
        name: codecov-umbrella
    
    - name: Run performance tests
      run: |
        locust -f tests/performance/locustfile.py --headless -u 10 -r 5 --run-time 60s --html=performance_report.html
    
    - name: Upload performance report
      uses: actions/upload-artifact@v3
      with:
        name: performance-report
        path: performance_report.html

  security-scan:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Bandit security scan
      run: |
        pip install bandit
        bandit -r app/ -f json -o bandit-report.json
    
    - name: Upload security report
      uses: actions/upload-artifact@v3
      with:
        name: security-report
        path: bandit-report.json

  docker-build:
    runs-on: ubuntu-latest
    needs: [test, security-scan]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: |
          company/recruiting-agentic:latest
          company/recruiting-agentic:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-merge-conflict
  
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
        language_version: python3.11
  
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
        args: ["--profile", "black"]
  
  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
        args: [--max-line-length=88, --extend-ignore=E203,W503]
  
  - repo: https://github.com/pycqa/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
        args: [-r, app/]
  
  - repo: local
    hooks:
      - id: pytest
        name: pytest
        entry: pytest
        language: system
        pass_filenames: false
        always_run: true
        args: [tests/unit/]
```

Esta guía de testing proporciona una cobertura completa para asegurar la calidad, seguridad y rendimiento del módulo agentic de recruiting. 