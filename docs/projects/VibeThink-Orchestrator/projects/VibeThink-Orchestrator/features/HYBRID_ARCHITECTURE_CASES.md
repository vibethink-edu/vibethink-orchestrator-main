# Casos de Uso - Arquitectura Híbrida React + Python਍ഀഀ
## Resumen Ejecutivo਍ഀഀ
Esta documentación detalla los casos de uso específicos para la arquitectura híbrida que combina React (frontend) con Python (backend) para optimizar el rendimiento y capacidades de IA en nuestro SaaS empresarial multitenant. El enfoque principal es la implementación de agentes IA personalizados con bases de datos vectoriales aisladas por cliente, permitiendo "mundos de datos" independientes para cada empresa.਍ഀഀ
## Arquitectura General਍ഀഀ
```਍ఀ%%%%%%%%%%%%%%%%%ဥ‥   ఀ%%%%%%%%%%%%%%%%%ဥ‥   ఀ%%%%%%%%%%%%%%%%%ဥഥഀ
│   React Frontend│    │  Supabase Edge  │    │  Python Workers │਍Ȁ‥  ⠀吀礀瀀攀匀挀爀椀瀀琀⤀  Ȁ쐥%%먥ȥ‥  䘀甀渀挀琀椀漀渀猀     Ȁ쐥%%먥ȥ‥  ⠀䘀愀猀琀䄀倀䤀⤀     Ȁഥഀ
└─────────────────┘    └─────────────────┘    └─────────────────┘਍         Ȁ‥                      Ȁ‥                      Ȁഥഀ
         │                       │                       │਍         밀‥                      밀‥                      밀ഥഀ
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐਍Ȁ‥  匀甀瀀愀戀愀猀攀 䐀䈀   Ȁ‥   Ȁ‥ 嘀攀挀琀漀爀 䐀䈀      Ȁ‥   Ȁ‥ 䄀䤀⼀䴀䰀 匀攀爀瘀椀挀攀猀 Ȁഥഀ
│   (PostgreSQL)  │    │  (Pinecone/Qdrant)│  │  (OpenAI/Claude)│਍᐀%%%%%%%%%%%%%%%%%ᠥ‥   ᐀%%%%%%%%%%%%%%%%%ᠥ‥   ᐀%%%%%%%%%%%%%%%%%ᠥഥഀ
```਍ഀഀ
## Caso de Uso 1: Agentes IA Personalizados por Cliente਍ഀഀ
### Descripción਍匀椀猀琀攀洀愀 搀攀 愀最攀渀琀攀猀 䤀䄀 焀甀攀 猀攀 愀搀愀瀀琀愀渀 愀氀 挀漀渀琀攀砀琀漀 攀猀瀀攀挀昀椀挀漀 搀攀 挀愀搀愀 攀洀瀀爀攀猀愀Ⰰ 甀琀椀氀椀稀愀渀搀漀 戀愀猀攀猀 搀攀 搀愀琀漀猀 瘀攀挀琀漀爀椀愀氀攀猀 愀椀猀氀愀搀愀猀 瀀漀爀 挀氀椀攀渀琀攀⸀ 䌀愀搀愀 攀洀瀀爀攀猀愀 琀椀攀渀攀 猀甀 瀀爀漀瀀椀漀 ∀洀甀渀搀漀 搀攀 搀愀琀漀猀∀ 焀甀攀 瀀攀爀洀椀琀攀 爀攀猀瀀甀攀猀琀愀猀 挀漀渀琀攀砀琀甀愀氀椀稀愀搀愀猀 礀 瀀攀爀猀漀渀愀氀椀稀愀搀愀猀⸀ഀഀ
਍⌀⌀⌀ 䄀爀焀甀椀琀攀挀琀甀爀愀 搀攀 䄀最攀渀琀攀猀 瀀漀爀 倀氀愀渀ഀഀ
```python਍⌀ 倀礀琀栀漀渀 圀漀爀欀攀爀 ⴀ 䄀䤀 䄀最攀渀琀 匀礀猀琀攀洀ഀഀ
from enum import Enum਍昀爀漀洀 琀礀瀀椀渀最 椀洀瀀漀爀琀 䐀椀挀琀Ⰰ 䰀椀猀琀Ⰰ 伀瀀琀椀漀渀愀氀ഀഀ
import asyncio਍昀爀漀洀 瀀礀搀愀渀琀椀挀 椀洀瀀漀爀琀 䈀愀猀攀䴀漀搀攀氀ഀഀ
਍挀氀愀猀猀 䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⠀䔀渀甀洀⤀㨀ഀഀ
    DOCUMENT_ANALYSIS = "document_analysis"਍    䌀唀匀吀伀䴀䔀刀开匀唀倀倀伀刀吀 㴀 ∀挀甀猀琀漀洀攀爀开猀甀瀀瀀漀爀琀∀ഀഀ
    SALES_ASSISTANT = "sales_assistant"਍    䘀䤀一䄀一䌀䤀䄀䰀开䄀䐀嘀䤀匀伀刀 㴀 ∀昀椀渀愀渀挀椀愀氀开愀搀瘀椀猀漀爀∀ഀഀ
    HR_ASSISTANT = "hr_assistant"਍    吀䔀䌀䠀一䤀䌀䄀䰀开匀唀倀倀伀刀吀 㴀 ∀琀攀挀栀渀椀挀愀氀开猀甀瀀瀀漀爀琀∀ഀഀ
਍挀氀愀猀猀 䌀漀洀瀀愀渀礀䄀䤀䄀最攀渀琀㨀ഀഀ
    def __init__(self, company_id: str, plan_type: str):਍        猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀 㴀 挀漀洀瀀愀渀礀开椀搀ഀഀ
        self.plan_type = plan_type਍        猀攀氀昀⸀瘀攀挀琀漀爀开搀戀 㴀 最攀琀开挀漀洀瀀愀渀礀开瘀攀挀琀漀爀开搀戀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
        self.company_context = load_company_context(company_id)਍        猀攀氀昀⸀瀀氀愀渀开氀椀洀椀琀猀 㴀 最攀琀开瀀氀愀渀开氀椀洀椀琀猀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
        self.agent_capabilities = self.get_agent_capabilities(plan_type)਍    ഀഀ
    def get_agent_capabilities(self, plan_type: str) -> List[AgentCapability]:਍        ∀∀∀䐀攀昀椀渀攀 挀愀瀀愀挀椀搀愀搀攀猀 搀攀氀 愀最攀渀琀攀 猀攀最切渀 攀氀 瀀氀愀渀 搀攀氀 挀氀椀攀渀琀攀∀∀∀ഀഀ
        plan_capabilities = {਍            ∀戀愀猀椀挀∀㨀 嬀䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⸀䌀唀匀吀伀䴀䔀刀开匀唀倀倀伀刀吀崀Ⰰഀഀ
            "professional": [਍                䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⸀䌀唀匀吀伀䴀䔀刀开匀唀倀倀伀刀吀Ⰰഀഀ
                AgentCapability.DOCUMENT_ANALYSIS,਍                䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⸀匀䄀䰀䔀匀开䄀匀匀䤀匀吀䄀一吀ഀഀ
            ],਍            ∀攀渀琀攀爀瀀爀椀猀攀∀㨀 嬀ഀഀ
                AgentCapability.CUSTOMER_SUPPORT,਍                䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⸀䐀伀䌀唀䴀䔀一吀开䄀一䄀䰀夀匀䤀匀Ⰰഀഀ
                AgentCapability.SALES_ASSISTANT,਍                䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⸀䘀䤀一䄀一䌀䤀䄀䰀开䄀䐀嘀䤀匀伀刀Ⰰഀഀ
                AgentCapability.HR_ASSISTANT,਍                䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀⸀吀䔀䌀䠀一䤀䌀䄀䰀开匀唀倀倀伀刀吀ഀഀ
            ]਍        紀ഀഀ
        return plan_capabilities.get(plan_type, [AgentCapability.CUSTOMER_SUPPORT])਍    ഀഀ
    async def process_query(self, query: str, user_context: dict, capability: AgentCapability = None):਍        ⌀ ㄀⸀ 嘀愀氀椀搀愀挀椀渀 搀攀 挀愀瀀愀挀椀搀愀搀攀猀 猀攀最切渀 瀀氀愀渀ഀഀ
        if capability and capability not in self.agent_capabilities:਍            爀愀椀猀攀 嘀愀氀甀攀䔀爀爀漀爀⠀昀∀䌀愀瀀愀戀椀氀椀琀礀 笀挀愀瀀愀戀椀氀椀琀礀紀 渀漀琀 愀瘀愀椀氀愀戀氀攀 椀渀 瀀氀愀渀 笀猀攀氀昀⸀瀀氀愀渀开琀礀瀀攀紀∀⤀ഀഀ
        ਍        ⌀ ㈀⸀ 䈀切猀焀甀攀搀愀 猀攀洀渀琀椀挀愀 攀渀 挀漀渀琀攀砀琀漀 搀攀 氀愀 攀洀瀀爀攀猀愀ഀഀ
        relevant_docs = await self.vector_db.similarity_search(਍            焀甀攀爀礀㴀焀甀攀爀礀Ⰰഀഀ
            filter={਍                ∀挀漀洀瀀愀渀礀开椀搀∀㨀 猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀Ⰰഀഀ
                "capability": capability.value if capability else None਍            紀Ⰰഀഀ
            k=5਍        ⤀ഀഀ
        ਍        ⌀ ㌀⸀ 䌀漀渀猀琀爀甀挀挀椀渀 搀攀氀 瀀爀漀洀瀀琀 挀漀渀琀攀砀琀甀愀氀椀稀愀搀漀ഀഀ
        context_prompt = self.build_contextual_prompt(਍            焀甀攀爀礀㴀焀甀攀爀礀Ⰰഀഀ
            relevant_docs=relevant_docs,਍            挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀㴀猀攀氀昀⸀挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀Ⰰഀഀ
            user_context=user_context,਍            挀愀瀀愀戀椀氀椀琀礀㴀挀愀瀀愀戀椀氀椀琀礀ഀഀ
        )਍        ഀഀ
        # 4. Selección del modelo óptimo según plan਍        洀漀搀攀氀 㴀 猀攀氀昀⸀最攀琀开漀瀀琀椀洀愀氀开洀漀搀攀氀⠀⤀ഀഀ
        ਍        ⌀ 㔀⸀ 䜀攀渀攀爀愀挀椀渀 搀攀 爀攀猀瀀甀攀猀琀愀 挀漀渀 䤀䄀ഀഀ
        response = await generate_ai_response(਍            瀀爀漀洀瀀琀㴀挀漀渀琀攀砀琀开瀀爀漀洀瀀琀Ⰰഀഀ
            model=model,਍            琀攀洀瀀攀爀愀琀甀爀攀㴀　⸀㜀Ⰰഀഀ
            max_tokens=self.get_token_limit()਍        ⤀ഀഀ
        ਍        ⌀ 㘀⸀ 䰀漀最最椀渀最 礀 洀琀爀椀挀愀猀ഀഀ
        await log_ai_interaction(਍            挀漀洀瀀愀渀礀开椀搀㴀猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀Ⰰഀഀ
            query=query,਍            爀攀猀瀀漀渀猀攀㴀爀攀猀瀀漀渀猀攀Ⰰഀഀ
            tokens_used=response.usage.total_tokens,਍            挀愀瀀愀戀椀氀椀琀礀㴀挀愀瀀愀戀椀氀椀琀礀⸀瘀愀氀甀攀 椀昀 挀愀瀀愀戀椀氀椀琀礀 攀氀猀攀 ∀最攀渀攀爀愀氀∀ഀഀ
        )਍        ഀഀ
        return {਍            ∀爀攀猀瀀漀渀猀攀∀㨀 爀攀猀瀀漀渀猀攀⸀挀栀漀椀挀攀猀嬀　崀⸀琀攀砀琀Ⰰഀഀ
            "capability_used": capability.value if capability else "general",਍            ∀琀漀欀攀渀猀开甀猀攀搀∀㨀 爀攀猀瀀漀渀猀攀⸀甀猀愀最攀⸀琀漀琀愀氀开琀漀欀攀渀猀Ⰰഀഀ
            "relevant_docs": relevant_docs਍        紀ഀഀ
    ਍    搀攀昀 最攀琀开漀瀀琀椀洀愀氀开洀漀搀攀氀⠀猀攀氀昀⤀ ⴀ㸀 猀琀爀㨀ഀഀ
        """Selecciona el modelo óptimo según el plan"""਍        洀漀搀攀氀开洀愀瀀瀀椀渀最 㴀 笀ഀഀ
            "basic": "gpt-3.5-turbo",਍            ∀瀀爀漀昀攀猀猀椀漀渀愀氀∀㨀 ∀最瀀琀ⴀ㐀∀Ⰰഀഀ
            "enterprise": "gpt-4-turbo"਍        紀ഀഀ
        return model_mapping.get(self.plan_type, "gpt-3.5-turbo")਍    ഀഀ
    def get_token_limit(self) -> int:਍        ∀∀∀䐀攀昀椀渀攀 氀洀椀琀攀猀 搀攀 琀漀欀攀渀猀 猀攀最切渀 攀氀 瀀氀愀渀∀∀∀ഀഀ
        token_limits = {਍            ∀戀愀猀椀挀∀㨀 ㄀　　　Ⰰഀഀ
            "professional": 4000,਍            ∀攀渀琀攀爀瀀爀椀猀攀∀㨀 㠀　　　ഀഀ
        }਍        爀攀琀甀爀渀 琀漀欀攀渀开氀椀洀椀琀猀⸀最攀琀⠀猀攀氀昀⸀瀀氀愀渀开琀礀瀀攀Ⰰ ㄀　　　⤀ഀഀ
਍⌀ 䔀渀搀瀀漀椀渀琀 瀀愀爀愀 椀渀琀攀爀愀挀挀椀渀 挀漀渀 愀最攀渀琀攀猀ഀഀ
@router.post("/ai-agent/query")਍愀猀礀渀挀 搀攀昀 愀椀开愀最攀渀琀开焀甀攀爀礀⠀ഀഀ
    query: AIQueryInput,਍    挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀Ⰰഀഀ
    user_id: str਍⤀㨀ഀഀ
    # Obtener plan de la empresa਍    挀漀洀瀀愀渀礀开瀀氀愀渀 㴀 愀眀愀椀琀 最攀琀开挀漀洀瀀愀渀礀开瀀氀愀渀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
    ਍    ⌀ 䌀爀攀愀爀 愀最攀渀琀攀 瀀攀爀猀漀渀愀氀椀稀愀搀漀ഀഀ
    agent = CompanyAIAgent(company_id, company_plan)਍    ഀഀ
    return await agent.process_query(਍        焀甀攀爀礀⸀琀攀砀琀Ⰰ ഀഀ
        query.user_context, ਍        焀甀攀爀礀⸀挀愀瀀愀戀椀氀椀琀礀ഀഀ
    )਍怀怀怀ഀഀ
਍⌀⌀⌀ 䌀漀渀昀椀最甀爀愀挀椀渀 䘀爀漀渀琀攀渀搀 挀漀渀 䠀漀漀欀猀 倀攀爀猀漀渀愀氀椀稀愀搀漀猀ഀഀ
```typescript਍⼀⼀ 刀攀愀挀琀 䠀漀漀欀 ⴀ 䄀䤀 䄀最攀渀琀 挀漀渀 挀愀瀀愀挀椀搀愀搀攀猀 瀀漀爀 瀀氀愀渀ഀഀ
interface AIQueryInput {਍  琀攀砀琀㨀 猀琀爀椀渀最㬀ഀഀ
  user_context?: any;਍  挀愀瀀愀戀椀氀椀琀礀㼀㨀 䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀㬀ഀഀ
}਍ഀഀ
const useAIAgent = () => {਍  挀漀渀猀琀 笀 甀猀攀爀Ⰰ 栀愀猀倀攀爀洀椀猀猀椀漀渀 紀 㴀 甀猀攀䄀甀琀栀⠀⤀㬀ഀഀ
  const [isLoading, setIsLoading] = useState(false);਍  挀漀渀猀琀 嬀愀瘀愀椀氀愀戀氀攀䌀愀瀀愀戀椀氀椀琀椀攀猀Ⰰ 猀攀琀䄀瘀愀椀氀愀戀氀攀䌀愀瀀愀戀椀氀椀琀椀攀猀崀 㴀 甀猀攀匀琀愀琀攀㰀䄀最攀渀琀䌀愀瀀愀戀椀氀椀琀礀嬀崀㸀⠀嬀崀⤀㬀ഀഀ
  ਍  ⼀⼀ 䌀愀爀最愀爀 挀愀瀀愀挀椀搀愀搀攀猀 搀椀猀瀀漀渀椀戀氀攀猀 猀攀最切渀 攀氀 瀀氀愀渀ഀഀ
  useEffect(() => {਍    挀漀渀猀琀 氀漀愀搀䌀愀瀀愀戀椀氀椀琀椀攀猀 㴀 愀猀礀渀挀 ⠀⤀ 㴀㸀 笀ഀഀ
      const plan = await getCompanyPlan(user.company_id);਍      挀漀渀猀琀 挀愀瀀愀戀椀氀椀琀椀攀猀 㴀 最攀琀倀氀愀渀䌀愀瀀愀戀椀氀椀琀椀攀猀⠀瀀氀愀渀⤀㬀ഀഀ
      setAvailableCapabilities(capabilities);਍    紀㬀ഀഀ
    ਍    椀昀 ⠀甀猀攀爀㼀⸀挀漀洀瀀愀渀礀开椀搀⤀ 笀ഀഀ
      loadCapabilities();਍    紀ഀഀ
  }, [user?.company_id]);਍  ഀഀ
  const queryAgent = async (query: string, context?: any, capability?: AgentCapability) => {਍    猀攀琀䤀猀䰀漀愀搀椀渀最⠀琀爀甀攀⤀㬀ഀഀ
    try {਍      挀漀渀猀琀 爀攀猀瀀漀渀猀攀 㴀 愀眀愀椀琀 昀攀琀挀栀⠀✀⼀愀瀀椀⼀瀀礀琀栀漀渀⼀愀椀ⴀ愀最攀渀琀⼀焀甀攀爀礀✀Ⰰ 笀ഀഀ
        method: 'POST',਍        栀攀愀搀攀爀猀㨀 笀 ഀഀ
          'Authorization': `Bearer ${user.token}`,਍          ✀䌀漀渀琀攀渀琀ⴀ吀礀瀀攀✀㨀 ✀愀瀀瀀氀椀挀愀琀椀漀渀⼀樀猀漀渀✀ഀഀ
        },਍        戀漀搀礀㨀 䨀匀伀一⸀猀琀爀椀渀最椀昀礀⠀笀ഀഀ
          text: query,਍          甀猀攀爀开挀漀渀琀攀砀琀㨀 挀漀渀琀攀砀琀Ⰰഀഀ
          capability: capability?.value,਍          挀漀洀瀀愀渀礀开椀搀㨀 甀猀攀爀⸀挀漀洀瀀愀渀礀开椀搀ഀഀ
        })਍      紀⤀㬀ഀഀ
      ਍      椀昀 ⠀℀爀攀猀瀀漀渀猀攀⸀漀欀⤀ 笀ഀഀ
        throw new Error('Error en la consulta del agente');਍      紀ഀഀ
      ਍      挀漀渀猀琀 爀攀猀甀氀琀 㴀 愀眀愀椀琀 爀攀猀瀀漀渀猀攀⸀樀猀漀渀⠀⤀㬀ഀഀ
      return result;਍    紀 挀愀琀挀栀 ⠀攀爀爀漀爀⤀ 笀ഀഀ
      console.error('Error querying AI agent:', error);਍      琀栀爀漀眀 攀爀爀漀爀㬀ഀഀ
    } finally {਍      猀攀琀䤀猀䰀漀愀搀椀渀最⠀昀愀氀猀攀⤀㬀ഀഀ
    }਍  紀㬀ഀഀ
  ਍  爀攀琀甀爀渀 笀 ഀഀ
    queryAgent, ਍    椀猀䰀漀愀搀椀渀最Ⰰ ഀഀ
    availableCapabilities ਍  紀㬀ഀഀ
};਍ഀഀ
// Componente de chat con agente IA਍挀漀渀猀琀 䄀䤀䄀最攀渀琀䌀栀愀琀㨀 刀攀愀挀琀⸀䘀䌀 㴀 ⠀⤀ 㴀㸀 笀ഀഀ
  const { queryAgent, isLoading, availableCapabilities } = useAIAgent();਍  挀漀渀猀琀 嬀洀攀猀猀愀最攀猀Ⰰ 猀攀琀䴀攀猀猀愀最攀猀崀 㴀 甀猀攀匀琀愀琀攀㰀䌀栀愀琀䴀攀猀猀愀最攀嬀崀㸀⠀嬀崀⤀㬀ഀഀ
  const [selectedCapability, setSelectedCapability] = useState<AgentCapability | null>(null);਍  ഀഀ
  const sendMessage = async (text: string) => {਍    挀漀渀猀琀 甀猀攀爀䴀攀猀猀愀最攀㨀 䌀栀愀琀䴀攀猀猀愀最攀 㴀 笀ഀഀ
      id: Date.now().toString(),਍      琀攀砀琀Ⰰഀഀ
      sender: 'user',਍      琀椀洀攀猀琀愀洀瀀㨀 渀攀眀 䐀愀琀攀⠀⤀ഀഀ
    };਍    ഀഀ
    setMessages(prev => [...prev, userMessage]);਍    ഀഀ
    try {਍      挀漀渀猀琀 爀攀猀瀀漀渀猀攀 㴀 愀眀愀椀琀 焀甀攀爀礀䄀最攀渀琀⠀琀攀砀琀Ⰰ 渀甀氀氀Ⰰ 猀攀氀攀挀琀攀搀䌀愀瀀愀戀椀氀椀琀礀⤀㬀ഀഀ
      ਍      挀漀渀猀琀 愀椀䴀攀猀猀愀最攀㨀 䌀栀愀琀䴀攀猀猀愀最攀 㴀 笀ഀഀ
        id: (Date.now() + 1).toString(),਍        琀攀砀琀㨀 爀攀猀瀀漀渀猀攀⸀爀攀猀瀀漀渀猀攀Ⰰഀഀ
        sender: 'ai',਍        琀椀洀攀猀琀愀洀瀀㨀 渀攀眀 䐀愀琀攀⠀⤀Ⰰഀഀ
        metadata: {਍          挀愀瀀愀戀椀氀椀琀礀㨀 爀攀猀瀀漀渀猀攀⸀挀愀瀀愀戀椀氀椀琀礀开甀猀攀搀Ⰰഀഀ
          tokens_used: response.tokens_used਍        紀ഀഀ
      };਍      ഀഀ
      setMessages(prev => [...prev, aiMessage]);਍    紀 挀愀琀挀栀 ⠀攀爀爀漀爀⤀ 笀ഀഀ
      // Manejo de errores਍    紀ഀഀ
  };਍  ഀഀ
  return (਍    㰀搀椀瘀 挀氀愀猀猀一愀洀攀㴀∀昀氀攀砀 昀氀攀砀ⴀ挀漀氀 栀ⴀ昀甀氀氀∀㸀ഀഀ
      {/* Selector de capacidad */}਍      㰀搀椀瘀 挀氀愀猀猀一愀洀攀㴀∀瀀ⴀ㐀 戀漀爀搀攀爀ⴀ戀∀㸀ഀഀ
        <select ਍          瘀愀氀甀攀㴀笀猀攀氀攀挀琀攀搀䌀愀瀀愀戀椀氀椀琀礀㼀⸀瘀愀氀甀攀 簀簀 ✀✀紀 ഀഀ
          onChange={(e) => setSelectedCapability(e.target.value as AgentCapability)}਍          挀氀愀猀猀一愀洀攀㴀∀眀ⴀ昀甀氀氀 瀀ⴀ㈀ 戀漀爀搀攀爀 爀漀甀渀搀攀搀∀ഀഀ
        >਍          㰀漀瀀琀椀漀渀 瘀愀氀甀攀㴀∀∀㸀䌀愀瀀愀挀椀搀愀搀 䜀攀渀攀爀愀氀㰀⼀漀瀀琀椀漀渀㸀ഀഀ
          {availableCapabilities.map(cap => (਍            㰀漀瀀琀椀漀渀 欀攀礀㴀笀挀愀瀀⸀瘀愀氀甀攀紀 瘀愀氀甀攀㴀笀挀愀瀀⸀瘀愀氀甀攀紀㸀ഀഀ
              {cap.label}਍            㰀⼀漀瀀琀椀漀渀㸀ഀഀ
          ))}਍        㰀⼀猀攀氀攀挀琀㸀ഀഀ
      </div>਍      ഀഀ
      {/* Chat messages */}਍      㰀搀椀瘀 挀氀愀猀猀一愀洀攀㴀∀昀氀攀砀ⴀ㄀ 漀瘀攀爀昀氀漀眀ⴀ礀ⴀ愀甀琀漀 瀀ⴀ㐀∀㸀ഀഀ
        {messages.map(message => (਍          㰀䌀栀愀琀䴀攀猀猀愀最攀䌀漀洀瀀漀渀攀渀琀 欀攀礀㴀笀洀攀猀猀愀最攀⸀椀搀紀 洀攀猀猀愀最攀㴀笀洀攀猀猀愀最攀紀 ⼀㸀ഀഀ
        ))}਍      㰀⼀搀椀瘀㸀ഀഀ
      ਍      笀⼀⨀ 䤀渀瀀甀琀 ⨀⼀紀ഀഀ
      <ChatInput onSend={sendMessage} disabled={isLoading} />਍    㰀⼀搀椀瘀㸀ഀഀ
  );਍紀㬀ഀഀ
```਍ഀഀ
## Caso de Uso 2: Procesamiento de Documentos Inteligente਍ഀഀ
### Descripción਍倀爀漀挀攀猀愀洀椀攀渀琀漀 愀甀琀漀洀琀椀挀漀 搀攀 搀漀挀甀洀攀渀琀漀猀 攀洀瀀爀攀猀愀爀椀愀氀攀猀 挀漀渀 攀砀琀爀愀挀挀椀渀 搀攀 椀渀昀漀爀洀愀挀椀渀Ⰰ 挀氀愀猀椀昀椀挀愀挀椀渀 礀 最攀渀攀爀愀挀椀渀 搀攀 椀渀猀椀最栀琀猀 甀猀愀渀搀漀 䤀䄀⸀ 䰀漀猀 搀漀挀甀洀攀渀琀漀猀 猀攀 愀氀洀愀挀攀渀愀渀 攀渀 氀愀 戀愀猀攀 瘀攀挀琀漀爀椀愀氀 攀猀瀀攀挀昀椀挀愀 搀攀 挀愀搀愀 攀洀瀀爀攀猀愀⸀ഀഀ
਍⌀⌀⌀ 䘀氀甀樀漀 搀攀 倀爀漀挀攀猀愀洀椀攀渀琀漀 䄀瘀愀渀稀愀搀漀ഀഀ
```python਍⌀ 倀礀琀栀漀渀 圀漀爀欀攀爀 ⴀ 䄀搀瘀愀渀挀攀搀 䐀漀挀甀洀攀渀琀 倀爀漀挀攀猀猀椀渀最ഀഀ
from typing import List, Dict, Any਍椀洀瀀漀爀琀 愀猀礀渀挀椀漀ഀഀ
from pydantic import BaseModel਍ഀഀ
class DocumentProcessor:਍    搀攀昀 开开椀渀椀琀开开⠀猀攀氀昀Ⰰ 挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀⤀㨀ഀഀ
        self.company_id = company_id਍        猀攀氀昀⸀瘀攀挀琀漀爀开搀戀 㴀 最攀琀开挀漀洀瀀愀渀礀开瘀攀挀琀漀爀开搀戀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
        self.company_context = load_company_context(company_id)਍    ഀഀ
    async def process_document(self, document: DocumentInput) -> Dict[str, Any]:਍        ⌀ ㄀⸀ 䔀砀琀爀愀挀挀椀渀 搀攀 挀漀渀琀攀渀椀搀漀ഀഀ
        extracted_content = await self.extract_content(document.file_path)਍        ഀഀ
        # 2. Análisis de estructura del documento਍        搀漀挀甀洀攀渀琀开猀琀爀甀挀琀甀爀攀 㴀 愀眀愀椀琀 猀攀氀昀⸀愀渀愀氀礀稀攀开搀漀挀甀洀攀渀琀开猀琀爀甀挀琀甀爀攀⠀攀砀琀爀愀挀琀攀搀开挀漀渀琀攀渀琀⤀ഀഀ
        ਍        ⌀ ㌀⸀ 䔀砀琀爀愀挀挀椀渀 搀攀 攀渀琀椀搀愀搀攀猀 礀 挀漀渀挀攀瀀琀漀猀 挀氀愀瘀攀ഀഀ
        entities = await self.extract_entities(extracted_content)਍        ഀഀ
        # 4. Clasificación automática਍        挀氀愀猀猀椀昀椀挀愀琀椀漀渀 㴀 愀眀愀椀琀 猀攀氀昀⸀挀氀愀猀猀椀昀礀开搀漀挀甀洀攀渀琀⠀攀砀琀爀愀挀琀攀搀开挀漀渀琀攀渀琀⤀ഀഀ
        ਍        ⌀ 㔀⸀ 䜀攀渀攀爀愀挀椀渀 搀攀 爀攀猀甀洀攀渀 攀樀攀挀甀琀椀瘀漀ഀഀ
        summary = await self.generate_summary(extracted_content)਍        ഀഀ
        # 6. Almacenamiento en base vectorial con metadatos enriquecidos਍        瘀攀挀琀漀爀开椀搀 㴀 愀眀愀椀琀 猀攀氀昀⸀猀琀漀爀攀开椀渀开瘀攀挀琀漀爀开搀戀⠀ഀഀ
            content=extracted_content,਍            洀攀琀愀搀愀琀愀㴀笀ഀഀ
                "company_id": self.company_id,਍                ∀搀漀挀甀洀攀渀琀开琀礀瀀攀∀㨀 搀漀挀甀洀攀渀琀⸀琀礀瀀攀Ⰰഀഀ
                "structure": document_structure,਍                ∀攀渀琀椀琀椀攀猀∀㨀 攀渀琀椀琀椀攀猀Ⰰഀഀ
                "classification": classification,਍                ∀猀甀洀洀愀爀礀∀㨀 猀甀洀洀愀爀礀Ⰰഀഀ
                "user_id": document.user_id,਍                ∀甀瀀氀漀愀搀开搀愀琀攀∀㨀 搀漀挀甀洀攀渀琀⸀甀瀀氀漀愀搀开搀愀琀攀Ⰰഀഀ
                "file_size": document.file_size,਍                ∀氀愀渀最甀愀最攀∀㨀 搀漀挀甀洀攀渀琀⸀氀愀渀最甀愀最攀ഀഀ
            }਍        ⤀ഀഀ
        ਍        ⌀ 㜀⸀ 䄀挀琀甀愀氀椀稀愀挀椀渀 搀攀 渀搀椀挀攀猀 搀攀 戀切猀焀甀攀搀愀ഀഀ
        await self.update_search_indices(vector_id, entities, classification)਍        ഀഀ
        return {਍            ∀瘀攀挀琀漀爀开椀搀∀㨀 瘀攀挀琀漀爀开椀搀Ⰰഀഀ
            "analysis": {਍                ∀猀琀爀甀挀琀甀爀攀∀㨀 搀漀挀甀洀攀渀琀开猀琀爀甀挀琀甀爀攀Ⰰഀഀ
                "entities": entities,਍                ∀挀氀愀猀猀椀昀椀挀愀琀椀漀渀∀㨀 挀氀愀猀猀椀昀椀挀愀琀椀漀渀Ⰰഀഀ
                "summary": summary਍            紀ഀഀ
        }਍    ഀഀ
    async def extract_entities(self, content: str) -> List[Dict[str, Any]]:਍        ∀∀∀䔀砀琀爀愀攀 攀渀琀椀搀愀搀攀猀 攀猀瀀攀挀昀椀挀愀猀 搀攀氀 搀漀洀椀渀椀漀 攀洀瀀爀攀猀愀爀椀愀氀∀∀∀ഀഀ
        entities = await self.ai_client.extract_entities(਍            琀攀砀琀㴀挀漀渀琀攀渀琀Ⰰഀഀ
            entity_types=[਍                ∀倀䔀刀匀伀一∀Ⰰ ∀伀刀䜀䄀一䤀娀䄀吀䤀伀一∀Ⰰ ∀䴀伀一䔀夀∀Ⰰ ∀䐀䄀吀䔀∀Ⰰ ഀഀ
                "LOCATION", "PRODUCT", "CONTRACT", "POLICY"਍            崀ഀഀ
        )਍        ഀഀ
        # Enriquecimiento con contexto de la empresa਍        攀渀爀椀挀栀攀搀开攀渀琀椀琀椀攀猀 㴀 嬀崀ഀഀ
        for entity in entities:਍            挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀 㴀 愀眀愀椀琀 猀攀氀昀⸀最攀琀开挀漀洀瀀愀渀礀开攀渀琀椀琀礀开挀漀渀琀攀砀琀⠀攀渀琀椀琀礀⤀ഀഀ
            enriched_entities.append({਍                ⨀⨀攀渀琀椀琀礀Ⰰഀഀ
                "company_relevance": company_context.relevance_score,਍                ∀搀攀瀀愀爀琀洀攀渀琀∀㨀 挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀⸀搀攀瀀愀爀琀洀攀渀琀Ⰰഀഀ
                "priority": company_context.priority਍            紀⤀ഀഀ
        ਍        爀攀琀甀爀渀 攀渀爀椀挀栀攀搀开攀渀琀椀琀椀攀猀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 挀氀愀猀猀椀昀礀开搀漀挀甀洀攀渀琀⠀猀攀氀昀Ⰰ 挀漀渀琀攀渀琀㨀 猀琀爀⤀ ⴀ㸀 䐀椀挀琀嬀猀琀爀Ⰰ 䄀渀礀崀㨀ഀഀ
        """Clasificación automática del documento"""਍        挀氀愀猀猀椀昀椀挀愀琀椀漀渀 㴀 愀眀愀椀琀 猀攀氀昀⸀愀椀开挀氀椀攀渀琀⸀挀氀愀猀猀椀昀礀开琀攀砀琀⠀ഀഀ
            text=content,਍            挀愀琀攀最漀爀椀攀猀㴀嬀ഀഀ
                "CONTRACT", "INVOICE", "REPORT", "PROPOSAL", ਍                ∀倀伀䰀䤀䌀夀∀Ⰰ ∀䴀䄀一唀䄀䰀∀Ⰰ ∀䌀伀刀刀䔀匀倀伀一䐀䔀一䌀䔀∀Ⰰ ∀䘀䤀一䄀一䌀䤀䄀䰀∀ഀഀ
            ]਍        ⤀ഀഀ
        ਍        爀攀琀甀爀渀 笀ഀഀ
            "primary_category": classification.primary,਍            ∀挀漀渀昀椀搀攀渀挀攀∀㨀 挀氀愀猀猀椀昀椀挀愀琀椀漀渀⸀挀漀渀昀椀搀攀渀挀攀Ⰰഀഀ
            "secondary_categories": classification.secondary,਍            ∀琀愀最猀∀㨀 挀氀愀猀猀椀昀椀挀愀琀椀漀渀⸀琀愀最猀ഀഀ
        }਍ഀഀ
# Endpoint para procesamiento de documentos਍䀀爀漀甀琀攀爀⸀瀀漀猀琀⠀∀⼀搀漀挀甀洀攀渀琀猀⼀瀀爀漀挀攀猀猀∀⤀ഀഀ
async def process_document(਍    搀漀挀甀洀攀渀琀㨀 䐀漀挀甀洀攀渀琀䤀渀瀀甀琀Ⰰഀഀ
    company_id: str਍⤀㨀ഀഀ
    processor = DocumentProcessor(company_id)਍    爀攀琀甀爀渀 愀眀愀椀琀 瀀爀漀挀攀猀猀漀爀⸀瀀爀漀挀攀猀猀开搀漀挀甀洀攀渀琀⠀搀漀挀甀洀攀渀琀⤀ഀഀ
```਍ഀഀ
## Caso de Uso 3: Workflows Automatizados con IA਍ഀഀ
### Descripción਍匀椀猀琀攀洀愀猀 搀攀 眀漀爀欀昀氀漀眀 焀甀攀 挀漀洀戀椀渀愀渀 爀攀最氀愀猀 搀攀 渀攀最漀挀椀漀 挀漀渀 挀愀瀀愀挀椀搀愀搀攀猀 搀攀 䤀䄀 瀀愀爀愀 愀甀琀漀洀愀琀椀稀愀爀 瀀爀漀挀攀猀漀猀 攀洀瀀爀攀猀愀爀椀愀氀攀猀 挀漀洀瀀氀攀樀漀猀Ⰰ 愀搀愀瀀琀渀搀漀猀攀 愀 氀愀猀 渀攀挀攀猀椀搀愀搀攀猀 攀猀瀀攀挀昀椀挀愀猀 搀攀 挀愀搀愀 攀洀瀀爀攀猀愀⸀ഀഀ
਍⌀⌀⌀ 䤀洀瀀氀攀洀攀渀琀愀挀椀渀 搀攀 圀漀爀欀昀氀漀眀猀 䤀渀琀攀氀椀最攀渀琀攀猀ഀഀ
```python਍⌀ 倀礀琀栀漀渀 圀漀爀欀攀爀 ⴀ 䤀渀琀攀氀氀椀最攀渀琀 圀漀爀欀昀氀漀眀 䔀渀最椀渀攀ഀഀ
class AIWorkflowEngine:਍    搀攀昀 开开椀渀椀琀开开⠀猀攀氀昀Ⰰ 挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀⤀㨀ഀഀ
        self.company_id = company_id਍        猀攀氀昀⸀眀漀爀欀昀氀漀眀猀 㴀 氀漀愀搀开挀漀洀瀀愀渀礀开眀漀爀欀昀氀漀眀猀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
        self.vector_db = get_company_vector_db(company_id)਍        猀攀氀昀⸀挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀 㴀 氀漀愀搀开挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 攀砀攀挀甀琀攀开眀漀爀欀昀氀漀眀⠀猀攀氀昀Ⰰ 眀漀爀欀昀氀漀眀开椀搀㨀 猀琀爀Ⰰ 椀渀瀀甀琀开搀愀琀愀㨀 搀椀挀琀⤀ ⴀ㸀 䐀椀挀琀嬀猀琀爀Ⰰ 䄀渀礀崀㨀ഀഀ
        workflow = self.workflows.get(workflow_id)਍        椀昀 渀漀琀 眀漀爀欀昀氀漀眀㨀ഀഀ
            raise ValueError(f"Workflow {workflow_id} not found")਍        ഀഀ
        # 1. Validación y enriquecimiento de entrada਍        攀渀爀椀挀栀攀搀开搀愀琀愀 㴀 愀眀愀椀琀 猀攀氀昀⸀攀渀爀椀挀栀开椀渀瀀甀琀开搀愀琀愀⠀椀渀瀀甀琀开搀愀琀愀Ⰰ 眀漀爀欀昀氀漀眀⤀ഀഀ
        ਍        ⌀ ㈀⸀ 䔀樀攀挀甀挀椀渀 搀攀 瀀愀猀漀猀 搀攀氀 眀漀爀欀昀氀漀眀ഀഀ
        execution_context = {਍            ∀挀漀洀瀀愀渀礀开椀搀∀㨀 猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀Ⰰഀഀ
            "workflow_id": workflow_id,਍            ∀猀琀愀爀琀开琀椀洀攀∀㨀 搀愀琀攀琀椀洀攀⸀渀漀眀⠀⤀Ⰰഀഀ
            "current_state": enriched_data,਍            ∀栀椀猀琀漀爀礀∀㨀 嬀崀ഀഀ
        }਍        ഀഀ
        for step in workflow.steps:਍            猀琀攀瀀开爀攀猀甀氀琀 㴀 愀眀愀椀琀 猀攀氀昀⸀攀砀攀挀甀琀攀开眀漀爀欀昀氀漀眀开猀琀攀瀀⠀猀琀攀瀀Ⰰ 攀砀攀挀甀琀椀漀渀开挀漀渀琀攀砀琀⤀ഀഀ
            execution_context["current_state"].update(step_result)਍            攀砀攀挀甀琀椀漀渀开挀漀渀琀攀砀琀嬀∀栀椀猀琀漀爀礀∀崀⸀愀瀀瀀攀渀搀⠀笀ഀഀ
                "step_id": step.id,਍                ∀爀攀猀甀氀琀∀㨀 猀琀攀瀀开爀攀猀甀氀琀Ⰰഀഀ
                "timestamp": datetime.now()਍            紀⤀ഀഀ
        ਍        ⌀ ㌀⸀ 䄀氀洀愀挀攀渀愀洀椀攀渀琀漀 搀攀 爀攀猀甀氀琀愀搀漀 礀 挀漀渀琀攀砀琀漀ഀഀ
        await self.store_workflow_result(workflow_id, execution_context)਍        ഀഀ
        # 4. Actualización de base vectorial con nuevo conocimiento਍        愀眀愀椀琀 猀攀氀昀⸀甀瀀搀愀琀攀开欀渀漀眀氀攀搀最攀开戀愀猀攀⠀攀砀攀挀甀琀椀漀渀开挀漀渀琀攀砀琀⤀ഀഀ
        ਍        爀攀琀甀爀渀 笀ഀഀ
            "workflow_id": workflow_id,਍            ∀猀琀愀琀甀猀∀㨀 ∀挀漀洀瀀氀攀琀攀搀∀Ⰰഀഀ
            "result": execution_context["current_state"],਍            ∀攀砀攀挀甀琀椀漀渀开琀椀洀攀∀㨀 搀愀琀攀琀椀洀攀⸀渀漀眀⠀⤀ ⴀ 攀砀攀挀甀琀椀漀渀开挀漀渀琀攀砀琀嬀∀猀琀愀爀琀开琀椀洀攀∀崀ഀഀ
        }਍    ഀഀ
    async def execute_workflow_step(self, step: WorkflowStep, context: dict) -> Dict[str, Any]:਍        ∀∀∀䔀樀攀挀甀琀愀 甀渀 瀀愀猀漀 攀猀瀀攀挀昀椀挀漀 搀攀氀 眀漀爀欀昀氀漀眀∀∀∀ഀഀ
        if step.type == "ai_decision":਍            爀攀琀甀爀渀 愀眀愀椀琀 猀攀氀昀⸀攀砀攀挀甀琀攀开愀椀开搀攀挀椀猀椀漀渀开猀琀攀瀀⠀猀琀攀瀀Ⰰ 挀漀渀琀攀砀琀⤀ഀഀ
        elif step.type == "business_rule":਍            爀攀琀甀爀渀 愀眀愀椀琀 猀攀氀昀⸀攀砀攀挀甀琀攀开戀甀猀椀渀攀猀猀开爀甀氀攀开猀琀攀瀀⠀猀琀攀瀀Ⰰ 挀漀渀琀攀砀琀⤀ഀഀ
        elif step.type == "external_api":਍            爀攀琀甀爀渀 愀眀愀椀琀 猀攀氀昀⸀攀砀攀挀甀琀攀开攀砀琀攀爀渀愀氀开愀瀀椀开猀琀攀瀀⠀猀琀攀瀀Ⰰ 挀漀渀琀攀砀琀⤀ഀഀ
        elif step.type == "data_processing":਍            爀攀琀甀爀渀 愀眀愀椀琀 猀攀氀昀⸀攀砀攀挀甀琀攀开搀愀琀愀开瀀爀漀挀攀猀猀椀渀最开猀琀攀瀀⠀猀琀攀瀀Ⰰ 挀漀渀琀攀砀琀⤀ഀഀ
        else:਍            爀愀椀猀攀 嘀愀氀甀攀䔀爀爀漀爀⠀昀∀唀渀欀渀漀眀渀 猀琀攀瀀 琀礀瀀攀㨀 笀猀琀攀瀀⸀琀礀瀀攀紀∀⤀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 攀砀攀挀甀琀攀开愀椀开搀攀挀椀猀椀漀渀开猀琀攀瀀⠀猀攀氀昀Ⰰ 猀琀攀瀀㨀 圀漀爀欀昀氀漀眀匀琀攀瀀Ⰰ 挀漀渀琀攀砀琀㨀 搀椀挀琀⤀ ⴀ㸀 䐀椀挀琀嬀猀琀爀Ⰰ 䄀渀礀崀㨀ഀഀ
        """Ejecuta un paso de decisión basado en IA"""਍        ⌀ 䈀切猀焀甀攀搀愀 搀攀 挀漀渀琀攀砀琀漀 爀攀氀攀瘀愀渀琀攀ഀഀ
        relevant_docs = await self.vector_db.similarity_search(਍            焀甀攀爀礀㴀猀琀攀瀀⸀瀀爀漀洀瀀琀Ⰰഀഀ
            filter={਍                ∀挀漀洀瀀愀渀礀开椀搀∀㨀 猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀Ⰰഀഀ
                "workflow_type": step.workflow_type,਍                ∀猀琀攀瀀开椀搀∀㨀 猀琀攀瀀⸀椀搀ഀഀ
            },਍            欀㴀㔀ഀഀ
        )਍        ഀഀ
        # Construcción del prompt contextualizado਍        搀攀挀椀猀椀漀渀开瀀爀漀洀瀀琀 㴀 猀攀氀昀⸀戀甀椀氀搀开搀攀挀椀猀椀漀渀开瀀爀漀洀瀀琀⠀ഀഀ
            step=step,਍            挀漀渀琀攀砀琀㴀挀漀渀琀攀砀琀Ⰰഀഀ
            relevant_docs=relevant_docs਍        ⤀ഀഀ
        ਍        ⌀ 䜀攀渀攀爀愀挀椀渀 搀攀 搀攀挀椀猀椀渀ഀഀ
        decision = await self.ai_client.generate_decision(਍            瀀爀漀洀瀀琀㴀搀攀挀椀猀椀漀渀开瀀爀漀洀瀀琀Ⰰഀഀ
            options=step.options,਍            琀攀洀瀀攀爀愀琀甀爀攀㴀　⸀㌀ഀഀ
        )਍        ഀഀ
        return {਍            ∀愀椀开搀攀挀椀猀椀漀渀∀㨀 搀攀挀椀猀椀漀渀⸀挀栀漀椀挀攀Ⰰഀഀ
            "confidence": decision.confidence,਍            ∀爀攀愀猀漀渀椀渀最∀㨀 搀攀挀椀猀椀漀渀⸀爀攀愀猀漀渀椀渀最Ⰰഀഀ
            "relevant_context": relevant_docs਍        紀ഀഀ
਍⌀ 䔀渀搀瀀漀椀渀琀 瀀愀爀愀 眀漀爀欀昀氀漀眀猀ഀഀ
@router.post("/workflows/execute")਍愀猀礀渀挀 搀攀昀 攀砀攀挀甀琀攀开眀漀爀欀昀氀漀眀⠀ഀഀ
    workflow_id: str,਍    椀渀瀀甀琀开搀愀琀愀㨀 搀椀挀琀Ⰰഀഀ
    company_id: str਍⤀㨀ഀഀ
    engine = AIWorkflowEngine(company_id)਍    爀攀琀甀爀渀 愀眀愀椀琀 攀渀最椀渀攀⸀攀砀攀挀甀琀攀开眀漀爀欀昀氀漀眀⠀眀漀爀欀昀氀漀眀开椀搀Ⰰ 椀渀瀀甀琀开搀愀琀愀⤀ഀഀ
```਍ഀഀ
## Caso de Uso 4: Análisis Predictivo y Business Intelligence਍ഀഀ
### Descripción਍匀椀猀琀攀洀愀 搀攀 愀渀氀椀猀椀猀 瀀爀攀搀椀挀琀椀瘀漀 焀甀攀 甀琀椀氀椀稀愀 搀愀琀漀猀 栀椀猀琀爀椀挀漀猀 搀攀 氀愀 攀洀瀀爀攀猀愀 礀 洀漀搀攀氀漀猀 搀攀 䤀䄀 瀀愀爀愀 最攀渀攀爀愀爀 椀渀猀椀最栀琀猀 礀 瀀爀攀搀椀挀挀椀漀渀攀猀Ⰰ 愀搀愀瀀琀渀搀漀猀攀 愀氀 挀漀渀琀攀砀琀漀 攀猀瀀攀挀昀椀挀漀 搀攀 挀愀搀愀 挀氀椀攀渀琀攀⸀ഀഀ
਍⌀⌀⌀ 䤀洀瀀氀攀洀攀渀琀愀挀椀渀 搀攀 䄀渀愀氀礀琀椀挀猀 倀爀攀搀椀挀琀椀瘀漀ഀഀ
```python਍⌀ 倀礀琀栀漀渀 圀漀爀欀攀爀 ⴀ 倀爀攀搀椀挀琀椀瘀攀 䄀渀愀氀礀琀椀挀猀ഀഀ
class PredictiveAnalytics:਍    搀攀昀 开开椀渀椀琀开开⠀猀攀氀昀Ⰰ 挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀⤀㨀ഀഀ
        self.company_id = company_id਍        猀攀氀昀⸀搀愀琀愀开眀愀爀攀栀漀甀猀攀 㴀 最攀琀开挀漀洀瀀愀渀礀开搀愀琀愀开眀愀爀攀栀漀甀猀攀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
        self.ml_models = load_company_ml_models(company_id)਍        猀攀氀昀⸀瘀攀挀琀漀爀开搀戀 㴀 最攀琀开挀漀洀瀀愀渀礀开瘀攀挀琀漀爀开搀戀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 最攀渀攀爀愀琀攀开挀漀洀瀀爀攀栀攀渀猀椀瘀攀开椀渀猀椀最栀琀猀⠀猀攀氀昀Ⰰ 愀渀愀氀礀猀椀猀开爀攀焀甀攀猀琀㨀 䄀渀愀氀礀猀椀猀刀攀焀甀攀猀琀⤀ ⴀ㸀 䐀椀挀琀嬀猀琀爀Ⰰ 䄀渀礀崀㨀ഀഀ
        # 1. Extracción de datos históricos਍        栀椀猀琀漀爀椀挀愀氀开搀愀琀愀 㴀 愀眀愀椀琀 猀攀氀昀⸀攀砀琀爀愀挀琀开栀椀猀琀漀爀椀挀愀氀开搀愀琀愀⠀愀渀愀氀礀猀椀猀开爀攀焀甀攀猀琀⤀ഀഀ
        ਍        ⌀ ㈀⸀ 倀爀攀瀀爀漀挀攀猀愀洀椀攀渀琀漀 礀 氀椀洀瀀椀攀稀愀ഀഀ
        processed_data = await self.preprocess_data(historical_data)਍        ഀഀ
        # 3. Análisis estadístico descriptivo਍        搀攀猀挀爀椀瀀琀椀瘀攀开猀琀愀琀猀 㴀 愀眀愀椀琀 猀攀氀昀⸀最攀渀攀爀愀琀攀开搀攀猀挀爀椀瀀琀椀瘀攀开猀琀愀琀椀猀琀椀挀猀⠀瀀爀漀挀攀猀猀攀搀开搀愀琀愀⤀ഀഀ
        ਍        ⌀ 㐀⸀ 䄀瀀氀椀挀愀挀椀渀 搀攀 洀漀搀攀氀漀猀 瀀爀攀搀椀挀琀椀瘀漀猀ഀഀ
        predictions = await self.apply_predictive_models(processed_data, analysis_request.type)਍        ഀഀ
        # 5. Generación de insights con IA਍        愀椀开椀渀猀椀最栀琀猀 㴀 愀眀愀椀琀 猀攀氀昀⸀最攀渀攀爀愀琀攀开愀椀开椀渀猀椀最栀琀猀⠀ഀഀ
            data=processed_data,਍            瀀爀攀搀椀挀琀椀漀渀猀㴀瀀爀攀搀椀挀琀椀漀渀猀Ⰰഀഀ
            analysis_type=analysis_request.type਍        ⤀ഀഀ
        ਍        ⌀ 㘀⸀ 刀攀挀漀洀攀渀搀愀挀椀漀渀攀猀 搀攀 愀挀挀椀渀ഀഀ
        recommendations = await self.generate_action_recommendations(਍            椀渀猀椀最栀琀猀㴀愀椀开椀渀猀椀最栀琀猀Ⰰഀഀ
            predictions=predictions,਍            挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀㴀愀渀愀氀礀猀椀猀开爀攀焀甀攀猀琀⸀挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀ഀഀ
        )਍        ഀഀ
        # 7. Almacenamiento en base vectorial਍        愀眀愀椀琀 猀攀氀昀⸀猀琀漀爀攀开愀渀愀氀礀琀椀挀猀开椀渀开瘀攀挀琀漀爀开搀戀⠀笀ഀഀ
            "analysis_type": analysis_request.type,਍            ∀椀渀猀椀最栀琀猀∀㨀 愀椀开椀渀猀椀最栀琀猀Ⰰഀഀ
            "predictions": predictions,਍            ∀爀攀挀漀洀洀攀渀搀愀琀椀漀渀猀∀㨀 爀攀挀漀洀洀攀渀搀愀琀椀漀渀猀Ⰰഀഀ
            "timestamp": datetime.now()਍        紀⤀ഀഀ
        ਍        爀攀琀甀爀渀 笀ഀഀ
            "descriptive_statistics": descriptive_stats,਍            ∀瀀爀攀搀椀挀琀椀漀渀猀∀㨀 瀀爀攀搀椀挀琀椀漀渀猀Ⰰഀഀ
            "ai_insights": ai_insights,਍            ∀爀攀挀漀洀洀攀渀搀愀琀椀漀渀猀∀㨀 爀攀挀漀洀洀攀渀搀愀琀椀漀渀猀Ⰰഀഀ
            "confidence_scores": self.calculate_confidence_scores(predictions),਍            ∀搀愀琀愀开焀甀愀氀椀琀礀开猀挀漀爀攀∀㨀 猀攀氀昀⸀愀猀猀攀猀猀开搀愀琀愀开焀甀愀氀椀琀礀⠀瀀爀漀挀攀猀猀攀搀开搀愀琀愀⤀ഀഀ
        }਍    ഀഀ
    async def apply_predictive_models(self, data: pd.DataFrame, analysis_type: str) -> Dict[str, Any]:਍        ∀∀∀䄀瀀氀椀挀愀 洀漀搀攀氀漀猀 瀀爀攀搀椀挀琀椀瘀漀猀 猀攀最切渀 攀氀 琀椀瀀漀 搀攀 愀渀氀椀猀椀猀∀∀∀ഀഀ
        models_config = {਍            ∀猀愀氀攀猀开昀漀爀攀挀愀猀琀∀㨀 笀ഀഀ
                "models": ["arima", "prophet", "lstm"],਍                ∀琀愀爀最攀琀开挀漀氀甀洀渀∀㨀 ∀猀愀氀攀猀开愀洀漀甀渀琀∀Ⰰഀഀ
                "features": ["date", "product_category", "region"]਍            紀Ⰰഀഀ
            "customer_churn": {਍                ∀洀漀搀攀氀猀∀㨀 嬀∀爀愀渀搀漀洀开昀漀爀攀猀琀∀Ⰰ ∀砀最戀漀漀猀琀∀Ⰰ ∀渀攀甀爀愀氀开渀攀琀眀漀爀欀∀崀Ⰰഀഀ
                "target_column": "churn_probability",਍                ∀昀攀愀琀甀爀攀猀∀㨀 嬀∀甀猀愀最攀开昀爀攀焀甀攀渀挀礀∀Ⰰ ∀猀甀瀀瀀漀爀琀开琀椀挀欀攀琀猀∀Ⰰ ∀瀀愀礀洀攀渀琀开栀椀猀琀漀爀礀∀崀ഀഀ
            },਍            ∀椀渀瘀攀渀琀漀爀礀开漀瀀琀椀洀椀稀愀琀椀漀渀∀㨀 笀ഀഀ
                "models": ["time_series", "regression"],਍                ∀琀愀爀最攀琀开挀漀氀甀洀渀∀㨀 ∀漀瀀琀椀洀愀氀开猀琀漀挀欀∀Ⰰഀഀ
                "features": ["demand_history", "lead_time", "seasonality"]਍            紀ഀഀ
        }਍        ഀഀ
        config = models_config.get(analysis_type)਍        椀昀 渀漀琀 挀漀渀昀椀最㨀ഀഀ
            raise ValueError(f"Unsupported analysis type: {analysis_type}")਍        ഀഀ
        predictions = {}਍        昀漀爀 洀漀搀攀氀开渀愀洀攀 椀渀 挀漀渀昀椀最嬀∀洀漀搀攀氀猀∀崀㨀ഀഀ
            model = self.ml_models.get(f"{analysis_type}_{model_name}")਍            椀昀 渀漀琀 洀漀搀攀氀㨀ഀഀ
                # Entrenamiento de nuevo modelo਍                洀漀搀攀氀 㴀 愀眀愀椀琀 猀攀氀昀⸀琀爀愀椀渀开洀漀搀攀氀⠀搀愀琀愀Ⰰ 洀漀搀攀氀开渀愀洀攀Ⰰ 挀漀渀昀椀最⤀ഀഀ
                self.ml_models[f"{analysis_type}_{model_name}"] = model਍            ഀഀ
            predictions[model_name] = model.predict(data)਍        ഀഀ
        # Ensamblaje de predicciones਍        攀渀猀攀洀戀氀攀开瀀爀攀搀椀挀琀椀漀渀 㴀 猀攀氀昀⸀攀渀猀攀洀戀氀攀开瀀爀攀搀椀挀琀椀漀渀猀⠀瀀爀攀搀椀挀琀椀漀渀猀⤀ഀഀ
        ਍        爀攀琀甀爀渀 笀ഀഀ
            "individual_models": predictions,਍            ∀攀渀猀攀洀戀氀攀∀㨀 攀渀猀攀洀戀氀攀开瀀爀攀搀椀挀琀椀漀渀Ⰰഀഀ
            "model_performance": self.evaluate_model_performance(predictions, data)਍        紀ഀഀ
਍⌀ 䔀渀搀瀀漀椀渀琀 瀀愀爀愀 愀渀愀氀礀琀椀挀猀ഀഀ
@router.post("/analytics/predictive")਍愀猀礀渀挀 搀攀昀 瀀爀攀搀椀挀琀椀瘀攀开愀渀愀氀礀琀椀挀猀⠀ഀഀ
    analysis_request: AnalysisRequest,਍    挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀ഀഀ
):਍    愀渀愀氀礀琀椀挀猀 㴀 倀爀攀搀椀挀琀椀瘀攀䄀渀愀氀礀琀椀挀猀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
    return await analytics.generate_comprehensive_insights(analysis_request)਍怀怀怀ഀഀ
਍⌀⌀ 䌀愀猀漀 搀攀 唀猀漀 㔀㨀 䜀攀猀琀椀渀 搀攀 䌀漀渀漀挀椀洀椀攀渀琀漀 䔀洀瀀爀攀猀愀爀椀愀氀ഀഀ
਍⌀⌀⌀ 䐀攀猀挀爀椀瀀挀椀渀ഀഀ
Sistema de gestión de conocimiento que utiliza bases de datos vectoriales para crear un repositorio inteligente de información empresarial, permitiendo búsquedas semánticas y descubrimiento de conocimiento.਍ഀഀ
### Implementación de Knowledge Management਍怀怀怀瀀礀琀栀漀渀ഀഀ
# Python Worker - Knowledge Management System਍挀氀愀猀猀 䬀渀漀眀氀攀搀最攀䴀愀渀愀最攀洀攀渀琀匀礀猀琀攀洀㨀ഀഀ
    def __init__(self, company_id: str):਍        猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀 㴀 挀漀洀瀀愀渀礀开椀搀ഀഀ
        self.vector_db = get_company_vector_db(company_id)਍        猀攀氀昀⸀欀渀漀眀氀攀搀最攀开最爀愀瀀栀 㴀 氀漀愀搀开挀漀洀瀀愀渀礀开欀渀漀眀氀攀搀最攀开最爀愀瀀栀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
        self.company_context = load_company_context(company_id)਍    ഀഀ
    async def add_knowledge_item(self, item: KnowledgeItem) -> Dict[str, Any]:਍        ⌀ ㄀⸀ 倀爀漀挀攀猀愀洀椀攀渀琀漀 搀攀氀 挀漀渀琀攀渀椀搀漀ഀഀ
        processed_content = await self.process_content(item.content)਍        ഀഀ
        # 2. Extracción de conceptos clave y relaciones਍        欀渀漀眀氀攀搀最攀开攀砀琀爀愀挀琀椀漀渀 㴀 愀眀愀椀琀 猀攀氀昀⸀攀砀琀爀愀挀琀开欀渀漀眀氀攀搀最攀⠀瀀爀漀挀攀猀猀攀搀开挀漀渀琀攀渀琀⤀ഀഀ
        ਍        ⌀ ㌀⸀ 䜀攀渀攀爀愀挀椀渀 搀攀 攀洀戀攀搀搀椀渀最猀ഀഀ
        embeddings = await self.generate_embeddings(processed_content)਍        ഀഀ
        # 4. Almacenamiento en base vectorial਍        瘀攀挀琀漀爀开椀搀 㴀 愀眀愀椀琀 猀攀氀昀⸀瘀攀挀琀漀爀开搀戀⸀愀搀搀开搀漀挀甀洀攀渀琀猀⠀ഀഀ
            documents=[processed_content],਍            洀攀琀愀搀愀琀愀猀㴀嬀笀ഀഀ
                "company_id": self.company_id,਍                ∀琀礀瀀攀∀㨀 椀琀攀洀⸀琀礀瀀攀Ⰰഀഀ
                "key_concepts": knowledge_extraction.concepts,਍                ∀爀攀氀愀琀椀漀渀猀栀椀瀀猀∀㨀 欀渀漀眀氀攀搀最攀开攀砀琀爀愀挀琀椀漀渀⸀爀攀氀愀琀椀漀渀猀栀椀瀀猀Ⰰഀഀ
                "author": item.author,਍                ∀挀爀攀愀琀攀搀开愀琀∀㨀 椀琀攀洀⸀挀爀攀愀琀攀搀开愀琀Ⰰഀഀ
                "department": item.department,਍                ∀琀愀最猀∀㨀 椀琀攀洀⸀琀愀最猀Ⰰഀഀ
                "access_level": item.access_level਍            紀崀Ⰰഀഀ
            ids=[str(uuid.uuid4())]਍        ⤀ഀഀ
        ਍        ⌀ 㔀⸀ 䄀挀琀甀愀氀椀稀愀挀椀渀 搀攀氀 最爀愀昀漀 搀攀 挀漀渀漀挀椀洀椀攀渀琀漀ഀഀ
        await self.update_knowledge_graph(਍            挀漀渀挀攀瀀琀猀㴀欀渀漀眀氀攀搀最攀开攀砀琀爀愀挀琀椀漀渀⸀挀漀渀挀攀瀀琀猀Ⰰഀഀ
            relationships=knowledge_extraction.relationships,਍            瘀攀挀琀漀爀开椀搀㴀瘀攀挀琀漀爀开椀搀嬀　崀ഀഀ
        )਍        ഀഀ
        # 6. Notificación a usuarios relevantes਍        愀眀愀椀琀 猀攀氀昀⸀渀漀琀椀昀礀开爀攀氀攀瘀愀渀琀开甀猀攀爀猀⠀椀琀攀洀Ⰰ 欀渀漀眀氀攀搀最攀开攀砀琀爀愀挀琀椀漀渀⤀ഀഀ
        ਍        爀攀琀甀爀渀 笀ഀഀ
            "vector_id": vector_id[0],਍            ∀攀砀琀爀愀挀琀攀搀开欀渀漀眀氀攀搀最攀∀㨀 欀渀漀眀氀攀搀最攀开攀砀琀爀愀挀琀椀漀渀Ⰰഀഀ
            "graph_updated": True਍        紀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 猀攀愀爀挀栀开欀渀漀眀氀攀搀最攀⠀猀攀氀昀Ⰰ 焀甀攀爀礀㨀 猀琀爀Ⰰ 昀椀氀琀攀爀猀㨀 搀椀挀琀 㴀 一漀渀攀⤀ ⴀ㸀 䐀椀挀琀嬀猀琀爀Ⰰ 䄀渀礀崀㨀ഀഀ
        # Búsqueda semántica਍        猀攀愀爀挀栀开爀攀猀甀氀琀猀 㴀 愀眀愀椀琀 猀攀氀昀⸀瘀攀挀琀漀爀开搀戀⸀猀椀洀椀氀愀爀椀琀礀开猀攀愀爀挀栀⠀ഀഀ
            query=query,਍            昀椀氀琀攀爀㴀笀∀挀漀洀瀀愀渀礀开椀搀∀㨀 猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀Ⰰ ⨀⨀⠀昀椀氀琀攀爀猀 漀爀 笀紀⤀紀Ⰰഀഀ
            k=10਍        ⤀ഀഀ
        ਍        ⌀ 䔀渀爀椀焀甀攀挀椀洀椀攀渀琀漀 挀漀渀 挀漀渀琀攀砀琀漀 搀攀氀 最爀愀昀漀 搀攀 挀漀渀漀挀椀洀椀攀渀琀漀ഀഀ
        enriched_results = await self.enrich_with_knowledge_graph(search_results)਍        ഀഀ
        # Generación de insights relacionados਍        爀攀氀愀琀攀搀开椀渀猀椀最栀琀猀 㴀 愀眀愀椀琀 猀攀氀昀⸀最攀渀攀爀愀琀攀开爀攀氀愀琀攀搀开椀渀猀椀最栀琀猀⠀焀甀攀爀礀Ⰰ 攀渀爀椀挀栀攀搀开爀攀猀甀氀琀猀⤀ഀഀ
        ਍        ⌀ 匀甀最攀爀攀渀挀椀愀猀 搀攀 戀切猀焀甀攀搀愀ഀഀ
        search_suggestions = await self.generate_search_suggestions(query, enriched_results)਍        ഀഀ
        return {਍            ∀爀攀猀甀氀琀猀∀㨀 攀渀爀椀挀栀攀搀开爀攀猀甀氀琀猀Ⰰഀഀ
            "related_insights": related_insights,਍            ∀猀攀愀爀挀栀开猀甀最最攀猀琀椀漀渀猀∀㨀 猀攀愀爀挀栀开猀甀最最攀猀琀椀漀渀猀Ⰰഀഀ
            "total_found": len(enriched_results)਍        紀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 攀砀琀爀愀挀琀开欀渀漀眀氀攀搀最攀⠀猀攀氀昀Ⰰ 挀漀渀琀攀渀琀㨀 猀琀爀⤀ ⴀ㸀 䬀渀漀眀氀攀搀最攀䔀砀琀爀愀挀琀椀漀渀㨀ഀഀ
        """Extrae conocimiento estructurado del contenido"""਍        ⌀ 䔀砀琀爀愀挀挀椀渀 搀攀 挀漀渀挀攀瀀琀漀猀 挀氀愀瘀攀ഀഀ
        concepts = await self.ai_client.extract_concepts(਍            琀攀砀琀㴀挀漀渀琀攀渀琀Ⰰഀഀ
            domain=self.company_context.industry਍        ⤀ഀഀ
        ਍        ⌀ 䤀搀攀渀琀椀昀椀挀愀挀椀渀 搀攀 爀攀氀愀挀椀漀渀攀猀ഀഀ
        relationships = await self.ai_client.extract_relationships(਍            琀攀砀琀㴀挀漀渀琀攀渀琀Ⰰഀഀ
            concepts=concepts਍        ⤀ഀഀ
        ਍        ⌀ 䌀氀愀猀椀昀椀挀愀挀椀渀 搀攀 挀漀渀漀挀椀洀椀攀渀琀漀ഀഀ
        classification = await self.ai_client.classify_knowledge(਍            琀攀砀琀㴀挀漀渀琀攀渀琀Ⰰഀഀ
            concepts=concepts਍        ⤀ഀഀ
        ਍        爀攀琀甀爀渀 䬀渀漀眀氀攀搀最攀䔀砀琀爀愀挀琀椀漀渀⠀ഀഀ
            concepts=concepts,਍            爀攀氀愀琀椀漀渀猀栀椀瀀猀㴀爀攀氀愀琀椀漀渀猀栀椀瀀猀Ⰰഀഀ
            classification=classification਍        ⤀ഀഀ
਍⌀ 䔀渀搀瀀漀椀渀琀猀 瀀愀爀愀 最攀猀琀椀渀 搀攀 挀漀渀漀挀椀洀椀攀渀琀漀ഀഀ
@router.post("/knowledge/add")਍愀猀礀渀挀 搀攀昀 愀搀搀开欀渀漀眀氀攀搀最攀开椀琀攀洀⠀ഀഀ
    item: KnowledgeItem,਍    挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀ഀഀ
):਍    欀洀猀 㴀 䬀渀漀眀氀攀搀最攀䴀愀渀愀最攀洀攀渀琀匀礀猀琀攀洀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
    return await kms.add_knowledge_item(item)਍ഀഀ
@router.get("/knowledge/search")਍愀猀礀渀挀 搀攀昀 猀攀愀爀挀栀开欀渀漀眀氀攀搀最攀⠀ഀഀ
    query: str,਍    昀椀氀琀攀爀猀㨀 搀椀挀琀 㴀 一漀渀攀Ⰰഀഀ
    company_id: str = None਍⤀㨀ഀഀ
    kms = KnowledgeManagementSystem(company_id)਍    爀攀琀甀爀渀 愀眀愀椀琀 欀洀猀⸀猀攀愀爀挀栀开欀渀漀眀氀攀搀最攀⠀焀甀攀爀礀Ⰰ 昀椀氀琀攀爀猀⤀ഀഀ
```਍ഀഀ
## Configuración de Infraestructura਍ഀഀ
### Docker Compose para Desarrollo਍怀怀怀礀愀洀氀ഀഀ
# docker-compose.yml਍瘀攀爀猀椀漀渀㨀 ✀㌀⸀㠀✀ഀഀ
਍猀攀爀瘀椀挀攀猀㨀ഀഀ
  # Frontend React਍  昀爀漀渀琀攀渀搀㨀ഀഀ
    build: .਍    瀀漀爀琀猀㨀ഀഀ
      - "3000:3000"਍    攀渀瘀椀爀漀渀洀攀渀琀㨀ഀഀ
      - REACT_APP_API_URL=http://localhost:8000਍      ⴀ 刀䔀䄀䌀吀开䄀倀倀开匀唀倀䄀䈀䄀匀䔀开唀刀䰀㴀␀笀匀唀倀䄀䈀䄀匀䔀开唀刀䰀紀ഀഀ
      - REACT_APP_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}਍    搀攀瀀攀渀搀猀开漀渀㨀ഀഀ
      - python-workers਍ഀഀ
  # Python Workers਍  瀀礀琀栀漀渀ⴀ眀漀爀欀攀爀猀㨀ഀഀ
    build: ./python-workers਍    瀀漀爀琀猀㨀ഀഀ
      - "8000:8000"਍    攀渀瘀椀爀漀渀洀攀渀琀㨀ഀഀ
      - DATABASE_URL=${DATABASE_URL}਍      ⴀ 嘀䔀䌀吀伀刀开䐀䈀开唀刀䰀㴀␀笀嘀䔀䌀吀伀刀开䐀䈀开唀刀䰀紀ഀഀ
      - OPENAI_API_KEY=${OPENAI_API_KEY}਍      ⴀ 匀唀倀䄀䈀䄀匀䔀开唀刀䰀㴀␀笀匀唀倀䄀䈀䄀匀䔀开唀刀䰀紀ഀഀ
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}਍      ⴀ 刀䔀䐀䤀匀开唀刀䰀㴀爀攀搀椀猀㨀⼀⼀爀攀搀椀猀㨀㘀㌀㜀㤀ഀഀ
    volumes:਍      ⴀ ⸀⼀瀀礀琀栀漀渀ⴀ眀漀爀欀攀爀猀㨀⼀愀瀀瀀ഀഀ
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload਍    搀攀瀀攀渀搀猀开漀渀㨀ഀഀ
      - vector-db਍      ⴀ 爀攀搀椀猀ഀഀ
਍  ⌀ 嘀攀挀琀漀爀 䐀愀琀愀戀愀猀攀 ⠀儀搀爀愀渀琀⤀ഀഀ
  vector-db:਍    椀洀愀最攀㨀 焀搀爀愀渀琀⼀焀搀爀愀渀琀㨀氀愀琀攀猀琀ഀഀ
    ports:਍      ⴀ ∀㘀㌀㌀㌀㨀㘀㌀㌀㌀∀ഀഀ
    volumes:਍      ⴀ 瘀攀挀琀漀爀开搀愀琀愀㨀⼀焀搀爀愀渀琀⼀猀琀漀爀愀最攀ഀഀ
    environment:਍      ⴀ 儀䐀刀䄀一吀开开匀䔀刀嘀䤀䌀䔀开开䠀吀吀倀开倀伀刀吀㴀㘀㌀㌀㌀ഀഀ
਍  ⌀ 刀攀搀椀猀 瀀愀爀愀 挀愀挀栀 礀 挀漀氀愀猀ഀഀ
  redis:਍    椀洀愀最攀㨀 爀攀搀椀猀㨀愀氀瀀椀渀攀ഀഀ
    ports:਍      ⴀ ∀㘀㌀㜀㤀㨀㘀㌀㜀㤀∀ഀഀ
    volumes:਍      ⴀ 爀攀搀椀猀开搀愀琀愀㨀⼀搀愀琀愀ഀഀ
਍  ⌀ 倀爀漀洀攀琀栀攀甀猀 瀀愀爀愀 洀琀爀椀挀愀猀ഀഀ
  prometheus:਍    椀洀愀最攀㨀 瀀爀漀洀⼀瀀爀漀洀攀琀栀攀甀猀㨀氀愀琀攀猀琀ഀഀ
    ports:਍      ⴀ ∀㤀　㤀　㨀㤀　㤀　∀ഀഀ
    volumes:਍      ⴀ ⸀⼀洀漀渀椀琀漀爀椀渀最⼀瀀爀漀洀攀琀栀攀甀猀⸀礀洀氀㨀⼀攀琀挀⼀瀀爀漀洀攀琀栀攀甀猀⼀瀀爀漀洀攀琀栀攀甀猀⸀礀洀氀ഀഀ
      - prometheus_data:/prometheus਍ഀഀ
  # Grafana para visualización਍  最爀愀昀愀渀愀㨀ഀഀ
    image: grafana/grafana:latest਍    瀀漀爀琀猀㨀ഀഀ
      - "3001:3000"਍    攀渀瘀椀爀漀渀洀攀渀琀㨀ഀഀ
      - GF_SECURITY_ADMIN_PASSWORD=admin਍    瘀漀氀甀洀攀猀㨀ഀഀ
      - grafana_data:/var/lib/grafana਍ഀഀ
volumes:਍  瘀攀挀琀漀爀开搀愀琀愀㨀ഀഀ
  redis_data:਍  瀀爀漀洀攀琀栀攀甀猀开搀愀琀愀㨀ഀഀ
  grafana_data:਍怀怀怀ഀഀ
਍⌀⌀⌀ 䌀漀渀昀椀最甀爀愀挀椀渀 搀攀 䘀愀猀琀䄀倀䤀 挀漀渀 䴀椀搀搀氀攀眀愀爀攀 䄀瘀愀渀稀愀搀漀ഀഀ
```python਍⌀ 瀀礀琀栀漀渀ⴀ眀漀爀欀攀爀猀⼀洀愀椀渀⸀瀀礀ഀഀ
from fastapi import FastAPI, Depends, HTTPException, Request਍昀爀漀洀 昀愀猀琀愀瀀椀⸀洀椀搀搀氀攀眀愀爀攀⸀挀漀爀猀 椀洀瀀漀爀琀 䌀伀刀匀䴀椀搀搀氀攀眀愀爀攀ഀഀ
from fastapi.security import HTTPBearer਍昀爀漀洀 昀愀猀琀愀瀀椀⸀爀攀猀瀀漀渀猀攀猀 椀洀瀀漀爀琀 䨀匀伀一刀攀猀瀀漀渀猀攀ഀഀ
import os਍椀洀瀀漀爀琀 琀椀洀攀ഀഀ
from contextlib import asynccontextmanager਍ഀഀ
# Configuración de lifespan਍䀀愀猀礀渀挀挀漀渀琀攀砀琀洀愀渀愀最攀爀ഀഀ
async def lifespan(app: FastAPI):਍    ⌀ 匀琀愀爀琀甀瀀ഀഀ
    print("Starting AI-Pair Orchestrator Python Workers...")਍    愀眀愀椀琀 椀渀椀琀椀愀氀椀稀攀开猀攀爀瘀椀挀攀猀⠀⤀ഀഀ
    yield਍    ⌀ 匀栀甀琀搀漀眀渀ഀഀ
    print("Shutting down AI-Pair Orchestrator Python Workers...")਍    愀眀愀椀琀 挀氀攀愀渀甀瀀开猀攀爀瘀椀挀攀猀⠀⤀ഀഀ
਍愀瀀瀀 㴀 䘀愀猀琀䄀倀䤀⠀ഀഀ
    title="AI-Pair Orchestrator Python Workers",਍    搀攀猀挀爀椀瀀琀椀漀渀㴀∀䈀愀挀欀攀渀搀 眀漀爀欀攀爀猀 昀漀爀 䄀䤀 瀀爀漀挀攀猀猀椀渀最 愀渀搀 瘀攀挀琀漀爀 漀瀀攀爀愀琀椀漀渀猀∀Ⰰഀഀ
    version="1.0.0",਍    氀椀昀攀猀瀀愀渀㴀氀椀昀攀猀瀀愀渀ഀഀ
)਍ഀഀ
# Configuración CORS਍愀瀀瀀⸀愀搀搀开洀椀搀搀氀攀眀愀爀攀⠀ഀഀ
    CORSMiddleware,਍    愀氀氀漀眀开漀爀椀最椀渀猀㴀嬀漀猀⸀最攀琀攀渀瘀⠀∀䘀刀伀一吀䔀一䐀开唀刀䰀∀Ⰰ ∀栀琀琀瀀㨀⼀⼀氀漀挀愀氀栀漀猀琀㨀㌀　　　∀⤀崀Ⰰഀഀ
    allow_credentials=True,਍    愀氀氀漀眀开洀攀琀栀漀搀猀㴀嬀∀⨀∀崀Ⰰഀഀ
    allow_headers=["*"],਍⤀ഀഀ
਍⌀ 䴀椀搀搀氀攀眀愀爀攀 搀攀 愀甀琀攀渀琀椀挀愀挀椀渀 礀 挀漀渀琀攀砀琀漀ഀഀ
@app.middleware("http")਍愀猀礀渀挀 搀攀昀 愀搀搀开挀漀洀瀀愀渀礀开挀漀渀琀攀砀琀⠀爀攀焀甀攀猀琀㨀 刀攀焀甀攀猀琀Ⰰ 挀愀氀氀开渀攀砀琀⤀㨀ഀഀ
    start_time = time.time()਍    ഀഀ
    # Extracción de contexto de empresa del token਍    琀漀欀攀渀 㴀 爀攀焀甀攀猀琀⸀栀攀愀搀攀爀猀⸀最攀琀⠀∀愀甀琀栀漀爀椀稀愀琀椀漀渀∀⤀ഀഀ
    if token:਍        琀爀礀㨀ഀഀ
            company_id = extract_company_from_token(token)਍            爀攀焀甀攀猀琀⸀猀琀愀琀攀⸀挀漀洀瀀愀渀礀开椀搀 㴀 挀漀洀瀀愀渀礀开椀搀ഀഀ
            request.state.user_id = extract_user_from_token(token)਍        攀砀挀攀瀀琀 䔀砀挀攀瀀琀椀漀渀 愀猀 攀㨀ഀഀ
            return JSONResponse(਍                猀琀愀琀甀猀开挀漀搀攀㴀㐀　㄀Ⰰഀഀ
                content={"error": "Invalid token", "details": str(e)}਍            ⤀ഀഀ
    ਍    ⌀ 倀爀漀挀攀猀愀洀椀攀渀琀漀 搀攀 氀愀 爀攀焀甀攀猀琀ഀഀ
    response = await call_next(request)਍    ഀഀ
    # Logging de métricas਍    瀀爀漀挀攀猀猀开琀椀洀攀 㴀 琀椀洀攀⸀琀椀洀攀⠀⤀ ⴀ 猀琀愀爀琀开琀椀洀攀ഀഀ
    response.headers["X-Process-Time"] = str(process_time)਍    ഀഀ
    return response਍ഀഀ
# Middleware de rate limiting਍䀀愀瀀瀀⸀洀椀搀搀氀攀眀愀爀攀⠀∀栀琀琀瀀∀⤀ഀഀ
async def rate_limit_middleware(request: Request, call_next):਍    挀漀洀瀀愀渀礀开椀搀 㴀 最攀琀愀琀琀爀⠀爀攀焀甀攀猀琀⸀猀琀愀琀攀Ⰰ ✀挀漀洀瀀愀渀礀开椀搀✀Ⰰ 一漀渀攀⤀ഀഀ
    if company_id:਍        ⌀ 䤀洀瀀氀攀洀攀渀琀愀爀 爀愀琀攀 氀椀洀椀琀椀渀最 瀀漀爀 攀洀瀀爀攀猀愀ഀഀ
        if await is_rate_limited(company_id):਍            爀攀琀甀爀渀 䨀匀伀一刀攀猀瀀漀渀猀攀⠀ഀഀ
                status_code=429,਍                挀漀渀琀攀渀琀㴀笀∀攀爀爀漀爀∀㨀 ∀刀愀琀攀 氀椀洀椀琀 攀砀挀攀攀搀攀搀∀紀ഀഀ
            )਍    ഀഀ
    return await call_next(request)਍ഀഀ
# Health check਍䀀愀瀀瀀⸀最攀琀⠀∀⼀栀攀愀氀琀栀∀⤀ഀഀ
async def health_check():਍    爀攀琀甀爀渀 笀ഀഀ
        "status": "healthy",਍        ∀猀攀爀瘀椀挀攀∀㨀 ∀瀀礀琀栀漀渀ⴀ眀漀爀欀攀爀猀∀Ⰰഀഀ
        "timestamp": time.time(),਍        ∀瘀攀爀猀椀漀渀∀㨀 ∀㄀⸀　⸀　∀ഀഀ
    }਍ഀഀ
# Métricas਍䀀愀瀀瀀⸀最攀琀⠀∀⼀洀攀琀爀椀挀猀∀⤀ഀഀ
async def get_metrics():਍    爀攀琀甀爀渀 愀眀愀椀琀 挀漀氀氀攀挀琀开洀攀琀爀椀挀猀⠀⤀ഀഀ
```਍ഀഀ
## Métricas y Monitoreo Avanzado਍ഀഀ
### Implementación de Métricas Detalladas਍怀怀怀瀀礀琀栀漀渀ഀഀ
# python-workers/metrics.py਍椀洀瀀漀爀琀 琀椀洀攀ഀഀ
from functools import wraps਍昀爀漀洀 瀀爀漀洀攀琀栀攀甀猀开挀氀椀攀渀琀 椀洀瀀漀爀琀 䌀漀甀渀琀攀爀Ⰰ 䠀椀猀琀漀最爀愀洀Ⰰ 䜀愀甀最攀Ⰰ 匀甀洀洀愀爀礀ഀഀ
from typing import Dict, Any਍ഀഀ
# Métricas Prometheus਍刀䔀儀唀䔀匀吀开䌀伀唀一吀 㴀 䌀漀甀渀琀攀爀⠀✀愀椀开爀攀焀甀攀猀琀猀开琀漀琀愀氀✀Ⰰ ✀吀漀琀愀氀 䄀䤀 爀攀焀甀攀猀琀猀✀Ⰰ 嬀✀挀漀洀瀀愀渀礀开椀搀✀Ⰰ ✀攀渀搀瀀漀椀渀琀✀Ⰰ ✀挀愀瀀愀戀椀氀椀琀礀✀崀⤀ഀഀ
REQUEST_DURATION = Histogram('ai_request_duration_seconds', 'AI request duration', ['company_id', 'endpoint'])਍吀伀䬀䔀一开唀匀䄀䜀䔀 㴀 䌀漀甀渀琀攀爀⠀✀愀椀开琀漀欀攀渀猀开甀猀攀搀开琀漀琀愀氀✀Ⰰ ✀吀漀琀愀氀 琀漀欀攀渀猀 甀猀攀搀✀Ⰰ 嬀✀挀漀洀瀀愀渀礀开椀搀✀Ⰰ ✀洀漀搀攀氀✀Ⰰ ✀挀愀瀀愀戀椀氀椀琀礀✀崀⤀ഀഀ
ACTIVE_WORKERS = Gauge('active_workers', 'Number of active workers')਍嘀䔀䌀吀伀刀开䐀䈀开伀倀䔀刀䄀吀䤀伀一匀 㴀 䌀漀甀渀琀攀爀⠀✀瘀攀挀琀漀爀开搀戀开漀瀀攀爀愀琀椀漀渀猀开琀漀琀愀氀✀Ⰰ ✀嘀攀挀琀漀爀 䐀䈀 漀瀀攀爀愀琀椀漀渀猀✀Ⰰ 嬀✀挀漀洀瀀愀渀礀开椀搀✀Ⰰ ✀漀瀀攀爀愀琀椀漀渀✀崀⤀ഀഀ
WORKFLOW_EXECUTIONS = Counter('workflow_executions_total', 'Workflow executions', ['company_id', 'workflow_type'])਍䐀伀䌀唀䴀䔀一吀开倀刀伀䌀䔀匀匀䤀一䜀 㴀 䌀漀甀渀琀攀爀⠀✀搀漀挀甀洀攀渀琀开瀀爀漀挀攀猀猀椀渀最开琀漀琀愀氀✀Ⰰ ✀䐀漀挀甀洀攀渀琀 瀀爀漀挀攀猀猀椀渀最✀Ⰰ 嬀✀挀漀洀瀀愀渀礀开椀搀✀Ⰰ ✀搀漀挀甀洀攀渀琀开琀礀瀀攀✀崀⤀ഀഀ
਍⌀ 䴀琀爀椀挀愀猀 搀攀 渀攀最漀挀椀漀ഀഀ
PLAN_USAGE = Gauge('plan_usage_percentage', 'Plan usage percentage', ['company_id', 'plan_type'])਍䄀䤀开儀唀䄀䰀䤀吀夀开匀䌀伀刀䔀 㴀 䜀愀甀最攀⠀✀愀椀开焀甀愀氀椀琀礀开猀挀漀爀攀✀Ⰰ ✀䄀䤀 爀攀猀瀀漀渀猀攀 焀甀愀氀椀琀礀 猀挀漀爀攀✀Ⰰ 嬀✀挀漀洀瀀愀渀礀开椀搀✀Ⰰ ✀挀愀瀀愀戀椀氀椀琀礀✀崀⤀ഀഀ
਍搀攀昀 琀爀愀挀欀开洀攀琀爀椀挀猀⠀挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀Ⰰ 攀渀搀瀀漀椀渀琀㨀 猀琀爀Ⰰ 挀愀瀀愀戀椀氀椀琀礀㨀 猀琀爀 㴀 一漀渀攀⤀㨀ഀഀ
    def decorator(func):਍        䀀眀爀愀瀀猀⠀昀甀渀挀⤀ഀഀ
        async def wrapper(*args, **kwargs):਍            猀琀愀爀琀开琀椀洀攀 㴀 琀椀洀攀⸀琀椀洀攀⠀⤀ഀഀ
            try:਍                爀攀猀甀氀琀 㴀 愀眀愀椀琀 昀甀渀挀⠀⨀愀爀最猀Ⰰ ⨀⨀欀眀愀爀最猀⤀ഀഀ
                ਍                ⌀ 䴀琀爀椀挀愀猀 搀攀 爀攀焀甀攀猀琀ഀഀ
                REQUEST_COUNT.labels(਍                    挀漀洀瀀愀渀礀开椀搀㴀挀漀洀瀀愀渀礀开椀搀Ⰰ ഀഀ
                    endpoint=endpoint,਍                    挀愀瀀愀戀椀氀椀琀礀㴀挀愀瀀愀戀椀氀椀琀礀 漀爀 ∀最攀渀攀爀愀氀∀ഀഀ
                ).inc()਍                ഀഀ
                # Métricas de tokens si aplica਍                椀昀 栀愀猀愀琀琀爀⠀爀攀猀甀氀琀Ⰰ ✀琀漀欀攀渀猀开甀猀攀搀✀⤀㨀ഀഀ
                    TOKEN_USAGE.labels(਍                        挀漀洀瀀愀渀礀开椀搀㴀挀漀洀瀀愀渀礀开椀搀Ⰰഀഀ
                        model=result.model,਍                        挀愀瀀愀戀椀氀椀琀礀㴀挀愀瀀愀戀椀氀椀琀礀 漀爀 ∀最攀渀攀爀愀氀∀ഀഀ
                    ).inc(result.tokens_used)਍                ഀഀ
                return result਍            攀砀挀攀瀀琀 䔀砀挀攀瀀琀椀漀渀 愀猀 攀㨀ഀഀ
                # Métricas de errores਍                刀䔀儀唀䔀匀吀开䌀伀唀一吀⸀氀愀戀攀氀猀⠀ഀഀ
                    company_id=company_id,਍                    攀渀搀瀀漀椀渀琀㴀攀渀搀瀀漀椀渀琀Ⰰഀഀ
                    capability="error"਍                ⤀⸀椀渀挀⠀⤀ഀഀ
                raise਍            昀椀渀愀氀氀礀㨀ഀഀ
                duration = time.time() - start_time਍                刀䔀儀唀䔀匀吀开䐀唀刀䄀吀䤀伀一⸀氀愀戀攀氀猀⠀ഀഀ
                    company_id=company_id, ਍                    攀渀搀瀀漀椀渀琀㴀攀渀搀瀀漀椀渀琀ഀഀ
                ).observe(duration)਍        爀攀琀甀爀渀 眀爀愀瀀瀀攀爀ഀഀ
    return decorator਍ഀഀ
async def collect_metrics() -> Dict[str, Any]:਍    ∀∀∀刀攀挀漀瀀椀氀愀 洀琀爀椀挀愀猀 瀀攀爀猀漀渀愀氀椀稀愀搀愀猀∀∀∀ഀഀ
    return {਍        ∀愀挀琀椀瘀攀开挀漀洀瀀愀渀椀攀猀∀㨀 愀眀愀椀琀 最攀琀开愀挀琀椀瘀攀开挀漀洀瀀愀渀椀攀猀开挀漀甀渀琀⠀⤀Ⰰഀഀ
        "total_ai_interactions": await get_total_ai_interactions(),਍        ∀愀瘀攀爀愀最攀开爀攀猀瀀漀渀猀攀开琀椀洀攀∀㨀 愀眀愀椀琀 最攀琀开愀瘀攀爀愀最攀开爀攀猀瀀漀渀猀攀开琀椀洀攀⠀⤀Ⰰഀഀ
        "vector_db_size": await get_vector_db_size(),਍        ∀眀漀爀欀昀氀漀眀开猀甀挀挀攀猀猀开爀愀琀攀∀㨀 愀眀愀椀琀 最攀琀开眀漀爀欀昀氀漀眀开猀甀挀挀攀猀猀开爀愀琀攀⠀⤀ഀഀ
    }਍怀怀怀ഀഀ
਍⌀⌀ 倀氀愀渀 搀攀 䤀洀瀀氀攀洀攀渀琀愀挀椀渀 䐀攀琀愀氀氀愀搀漀ഀഀ
਍⌀⌀⌀ 䘀愀猀攀 ㄀㨀 䤀渀昀爀愀攀猀琀爀甀挀琀甀爀愀 䈀愀猀攀 ⠀匀攀洀愀渀愀猀 ㄀ⴀ㈀⤀ഀഀ
1. **Configuración de Docker y FastAPI**਍   ⴀ 匀攀琀甀瀀 搀攀 挀漀渀琀攀渀攀搀漀爀攀猀ഀഀ
   - Configuración de redes਍   ⴀ 嘀愀爀椀愀戀氀攀猀 搀攀 攀渀琀漀爀渀漀ഀഀ
਍㈀⸀ ⨀⨀䤀渀琀攀最爀愀挀椀渀 挀漀渀 匀甀瀀愀戀愀猀攀⨀⨀ഀഀ
   - Conexión a base de datos਍   ⴀ 䌀漀渀昀椀最甀爀愀挀椀渀 搀攀 刀䰀匀ഀഀ
   - Autenticación JWT਍ഀഀ
3. **Configuración de Base de Datos Vectorial**਍   ⴀ 匀攀琀甀瀀 搀攀 儀搀爀愀渀琀ഀഀ
   - Configuración de índices਍   ⴀ 倀漀氀琀椀挀愀猀 搀攀 愀椀猀氀愀洀椀攀渀琀漀 瀀漀爀 攀洀瀀爀攀猀愀ഀഀ
਍㐀⸀ ⨀⨀匀椀猀琀攀洀愀 搀攀 䄀甀琀攀渀琀椀挀愀挀椀渀 礀 䄀甀琀漀爀椀稀愀挀椀渀⨀⨀ഀഀ
   - Middleware de autenticación਍   ⴀ 嘀愀氀椀搀愀挀椀渀 搀攀 琀漀欀攀渀猀ഀഀ
   - Control de acceso por rol਍ഀഀ
### Fase 2: Casos de Uso Core (Semanas 3-6)਍㄀⸀ ⨀⨀匀椀猀琀攀洀愀 搀攀 䄀最攀渀琀攀猀 䤀䄀 䈀猀椀挀漀⨀⨀ഀഀ
   - Implementación de agentes por plan਍   ⴀ 䤀渀琀攀最爀愀挀椀渀 挀漀渀 戀愀猀攀 瘀攀挀琀漀爀椀愀氀ഀഀ
   - Sistema de capacidades਍ഀഀ
2. **Procesamiento de Documentos**਍   ⴀ 䔀砀琀爀愀挀挀椀渀 搀攀 挀漀渀琀攀渀椀搀漀ഀഀ
   - Análisis con IA਍   ⴀ 䄀氀洀愀挀攀渀愀洀椀攀渀琀漀 瘀攀挀琀漀爀椀愀氀ഀഀ
਍㌀⸀ ⨀⨀圀漀爀欀昀氀漀眀猀 匀椀洀瀀氀攀猀⨀⨀ഀഀ
   - Motor de workflows básico਍   ⴀ 倀愀猀漀猀 搀攀 搀攀挀椀猀椀渀 䤀䄀ഀഀ
   - Integración con reglas de negocio਍ഀഀ
4. **Integración con Herramientas Externas**਍   ⴀ 䌀漀渀攀挀琀漀爀攀猀 戀猀椀挀漀猀ഀഀ
   - Sincronización de datos਍   ⴀ 䔀渀爀椀焀甀攀挀椀洀椀攀渀琀漀 挀漀渀 䤀䄀ഀഀ
਍⌀⌀⌀ 䘀愀猀攀 ㌀㨀 䘀甀渀挀椀漀渀愀氀椀搀愀搀攀猀 䄀瘀愀渀稀愀搀愀猀 ⠀匀攀洀愀渀愀猀 㜀ⴀ㄀　⤀ഀഀ
1. **Analytics Predictivo**਍   ⴀ 䴀漀搀攀氀漀猀 䴀䰀 戀猀椀挀漀猀ഀഀ
   - Generación de insights਍   ⴀ 刀攀挀漀洀攀渀搀愀挀椀漀渀攀猀 搀攀 愀挀挀椀渀ഀഀ
਍㈀⸀ ⨀⨀䜀攀猀琀椀渀 搀攀 䌀漀渀漀挀椀洀椀攀渀琀漀⨀⨀ഀഀ
   - Sistema de búsqueda semántica਍   ⴀ 䜀爀愀昀漀 搀攀 挀漀渀漀挀椀洀椀攀渀琀漀ഀഀ
   - Extracción de conceptos਍ഀഀ
3. **Optimizaciones de Rendimiento**਍   ⴀ 䌀愀挀栀 刀攀搀椀猀ഀഀ
   - Procesamiento asíncrono਍   ⴀ 伀瀀琀椀洀椀稀愀挀椀渀 搀攀 挀漀渀猀甀氀琀愀猀ഀഀ
਍㐀⸀ ⨀⨀䴀漀渀椀琀漀爀攀漀 礀 䴀琀爀椀挀愀猀⨀⨀ഀഀ
   - Prometheus/Grafana਍   ⴀ 䄀氀攀爀琀愀猀 愀甀琀漀洀琀椀挀愀猀ഀഀ
   - Dashboards de métricas਍ഀഀ
### Fase 4: Producción y Escalabilidad (Semanas 11-12)਍㄀⸀ ⨀⨀吀攀猀琀椀渀最 䔀砀栀愀甀猀琀椀瘀漀⨀⨀ഀഀ
   - Tests unitarios਍   ⴀ 吀攀猀琀猀 搀攀 椀渀琀攀最爀愀挀椀渀ഀഀ
   - Tests de carga਍ഀഀ
2. **Optimización de Costos**਍   ⴀ 䄀渀氀椀猀椀猀 搀攀 甀猀漀 搀攀 爀攀挀甀爀猀漀猀ഀഀ
   - Optimización de modelos IA਍   ⴀ 䔀猀琀爀愀琀攀最椀愀猀 搀攀 挀愀挀栀ഀഀ
਍㌀⸀ ⨀⨀䐀漀挀甀洀攀渀琀愀挀椀渀 䌀漀洀瀀氀攀琀愀⨀⨀ഀഀ
   - API documentation਍   ⴀ 䜀甀愀猀 搀攀 甀猀甀愀爀椀漀ഀഀ
   - Documentación técnica਍ഀഀ
4. **Despliegue en Producción**਍   ⴀ 䌀漀渀昀椀最甀爀愀挀椀渀 搀攀 瀀爀漀搀甀挀挀椀渀ഀഀ
   - Monitoreo en vivo਍   ⴀ 倀氀愀渀 搀攀 爀漀氀氀戀愀挀欀ഀഀ
਍⌀⌀ 䌀漀渀猀椀搀攀爀愀挀椀漀渀攀猀 搀攀 匀攀最甀爀椀搀愀搀 䄀瘀愀渀稀愀搀愀猀ഀഀ
਍⌀⌀⌀ 䄀椀猀氀愀洀椀攀渀琀漀 搀攀 䐀愀琀漀猀 瀀漀爀 䔀洀瀀爀攀猀愀ഀഀ
```python਍⌀ 䤀洀瀀氀攀洀攀渀琀愀挀椀渀 搀攀 愀椀猀氀愀洀椀攀渀琀漀 攀猀琀爀椀挀琀漀ഀഀ
class CompanyDataIsolation:਍    搀攀昀 开开椀渀椀琀开开⠀猀攀氀昀Ⰰ 挀漀洀瀀愀渀礀开椀搀㨀 猀琀爀⤀㨀ഀഀ
        self.company_id = company_id਍        猀攀氀昀⸀椀猀漀氀愀琀椀漀渀开瀀漀氀椀挀椀攀猀 㴀 氀漀愀搀开椀猀漀氀愀琀椀漀渀开瀀漀氀椀挀椀攀猀⠀挀漀洀瀀愀渀礀开椀搀⤀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 瘀愀氀椀搀愀琀攀开搀愀琀愀开愀挀挀攀猀猀⠀猀攀氀昀Ⰰ 搀愀琀愀开琀礀瀀攀㨀 猀琀爀Ⰰ 漀瀀攀爀愀琀椀漀渀㨀 猀琀爀⤀ ⴀ㸀 戀漀漀氀㨀ഀഀ
        """Valida que la operación esté permitida para la empresa"""਍        瀀漀氀椀挀礀 㴀 猀攀氀昀⸀椀猀漀氀愀琀椀漀渀开瀀漀氀椀挀椀攀猀⸀最攀琀⠀搀愀琀愀开琀礀瀀攀⤀ഀഀ
        if not policy:਍            爀攀琀甀爀渀 䘀愀氀猀攀ഀഀ
        ਍        爀攀琀甀爀渀 漀瀀攀爀愀琀椀漀渀 椀渀 瀀漀氀椀挀礀⸀愀氀氀漀眀攀搀开漀瀀攀爀愀琀椀漀渀猀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 昀椀氀琀攀爀开搀愀琀愀开戀礀开挀漀洀瀀愀渀礀⠀猀攀氀昀Ⰰ 搀愀琀愀㨀 䰀椀猀琀嬀䐀椀挀琀崀⤀ ⴀ㸀 䰀椀猀琀嬀䐀椀挀琀崀㨀ഀഀ
        """Filtra datos para asegurar aislamiento"""਍        爀攀琀甀爀渀 嬀椀琀攀洀 昀漀爀 椀琀攀洀 椀渀 搀愀琀愀 椀昀 椀琀攀洀⸀最攀琀⠀✀挀漀洀瀀愀渀礀开椀搀✀⤀ 㴀㴀 猀攀氀昀⸀挀漀洀瀀愀渀礀开椀搀崀ഀഀ
    ਍    愀猀礀渀挀 搀攀昀 猀愀渀椀琀椀稀攀开漀甀琀瀀甀琀⠀猀攀氀昀Ⰰ 漀甀琀瀀甀琀㨀 䐀椀挀琀⤀ ⴀ㸀 䐀椀挀琀㨀ഀഀ
        """Sanitiza la salida para remover datos sensibles"""਍        ⌀ 䤀洀瀀氀攀洀攀渀琀愀爀 氀最椀挀愀 搀攀 猀愀渀椀琀椀稀愀挀椀渀ഀഀ
        return output਍怀怀怀ഀഀ
਍⌀⌀⌀ 䌀漀渀琀爀漀氀 搀攀 䄀挀挀攀猀漀 䜀爀愀渀甀氀愀爀ഀഀ
- Validación de tokens JWT en cada request਍ⴀ 嘀攀爀椀昀椀挀愀挀椀渀 搀攀 瀀攀爀洀椀猀漀猀 瀀漀爀 爀漀氀 礀 攀洀瀀爀攀猀愀ഀഀ
- Rate limiting por empresa y usuario਍ⴀ 䄀甀搀椀琀漀爀愀 挀漀洀瀀氀攀琀愀 搀攀 琀漀搀愀猀 氀愀猀 漀瀀攀爀愀挀椀漀渀攀猀ഀഀ
਍⌀⌀⌀ 䔀渀挀爀椀瀀琀愀挀椀渀 礀 倀爀漀琀攀挀挀椀渀 搀攀 䐀愀琀漀猀ഀഀ
- Encriptación en tránsito (TLS 1.3)਍ⴀ 䔀渀挀爀椀瀀琀愀挀椀渀 攀渀 爀攀瀀漀猀漀 瀀愀爀愀 搀愀琀漀猀 猀攀渀猀椀戀氀攀猀ഀഀ
- Rotación automática de claves਍ⴀ 䌀甀洀瀀氀椀洀椀攀渀琀漀 䜀䐀倀刀 礀 氀攀礀攀猀 挀漀氀漀洀戀椀愀渀愀猀ഀഀ
਍⌀⌀ 䌀漀渀挀氀甀猀椀渀ഀഀ
਍䔀猀琀愀 愀爀焀甀椀琀攀挀琀甀爀愀 栀戀爀椀搀愀 瀀爀漀瀀漀爀挀椀漀渀愀 氀愀 昀氀攀砀椀戀椀氀椀搀愀搀 渀攀挀攀猀愀爀椀愀 瀀愀爀愀 椀洀瀀氀攀洀攀渀琀愀爀 挀愀猀漀猀 搀攀 甀猀漀 挀漀洀瀀氀攀樀漀猀 搀攀 䤀䄀 洀椀攀渀琀爀愀猀 洀愀渀琀椀攀渀攀 氀愀 猀椀洀瀀氀椀挀椀搀愀搀 漀瀀攀爀愀挀椀漀渀愀氀⸀ 䰀愀 猀攀瀀愀爀愀挀椀渀 挀氀愀爀愀 搀攀 爀攀猀瀀漀渀猀愀戀椀氀椀搀愀搀攀猀 攀渀琀爀攀 刀攀愀挀琀 ⠀唀䤀⤀Ⰰ 匀甀瀀愀戀愀猀攀 ⠀搀愀琀漀猀 礀 愀甀琀攀渀琀椀挀愀挀椀渀⤀ 礀 倀礀琀栀漀渀 ⠀瀀爀漀挀攀猀愀洀椀攀渀琀漀 瀀攀猀愀搀漀⤀ 瀀攀爀洀椀琀攀 漀瀀琀椀洀椀稀愀爀 挀愀搀愀 挀漀洀瀀漀渀攀渀琀攀 瀀愀爀愀 猀甀 瀀爀漀瀀猀椀琀漀 攀猀瀀攀挀昀椀挀漀⸀ഀഀ
਍䰀漀猀 挀愀猀漀猀 搀攀 甀猀漀 搀漀挀甀洀攀渀琀愀搀漀猀 搀攀洀甀攀猀琀爀愀渀 挀洀漀 氀愀 挀漀洀戀椀渀愀挀椀渀 搀攀 戀愀猀攀猀 搀攀 搀愀琀漀猀 瘀攀挀琀漀爀椀愀氀攀猀Ⰰ 愀最攀渀琀攀猀 䤀䄀 瀀攀爀猀漀渀愀氀椀稀愀搀漀猀 礀 瀀爀漀挀攀猀愀洀椀攀渀琀漀 倀礀琀栀漀渀 瀀甀攀搀攀 挀爀攀愀爀 甀渀 猀椀猀琀攀洀愀 攀洀瀀爀攀猀愀爀椀愀氀 瀀漀琀攀渀琀攀 礀 攀猀挀愀氀愀戀氀攀 焀甀攀 猀攀 愀搀愀瀀琀愀 愀 氀愀猀 渀攀挀攀猀椀搀愀搀攀猀 攀猀瀀攀挀昀椀挀愀猀 搀攀 挀愀搀愀 挀氀椀攀渀琀攀Ⰰ 洀愀渀琀攀渀椀攀渀搀漀 攀氀 愀椀猀氀愀洀椀攀渀琀漀 搀攀 搀愀琀漀猀 礀 氀愀 瀀攀爀猀漀渀愀氀椀稀愀挀椀渀 瀀漀爀 瀀氀愀渀⸀ഀഀ
਍䰀愀 椀洀瀀氀攀洀攀渀琀愀挀椀渀 最爀愀搀甀愀氀 瀀攀爀洀椀琀攀 瘀愀氀椀搀愀爀 挀愀搀愀 挀漀洀瀀漀渀攀渀琀攀 愀渀琀攀猀 搀攀 攀猀挀愀氀愀爀Ⰰ 洀椀渀椀洀椀稀愀渀搀漀 爀椀攀猀最漀猀 礀 愀猀攀最甀爀愀渀搀漀 甀渀愀 愀搀漀瀀挀椀渀 攀砀椀琀漀猀愀 搀攀氀 猀椀猀琀攀洀愀⸀ഀഀ
