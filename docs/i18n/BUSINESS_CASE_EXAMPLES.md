# 🏢 Business Case Usage Examples
**Real-world code examples for each of the 6 industry namespaces**

---

## 1️⃣ 🍽️ **RESTAURANT - Full POS System**

### **Scenario:** Restaurant POS with kitchen display

```typescript
// components/restaurant/KitchenDisplay.tsx
import { useTranslation } from '@/lib/i18n';

export const KitchenDisplay = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tRestaurant } = useTranslation('workspace-restaurant');
  const { t: tConcept } = useTranslation('concept-restaurant');

  const orders = [
    {
      id: 1,
      table: 5,
      items: [
        { name: 'Steak', modifier: 'wellDone', station: 'grill' },
        { name: 'Fries', modifier: 'extraSauce', station: 'fry' }
      ]
    }
  ];

  return (
    <div>
      <h1>{tRestaurant('kitchen.station.grill')}</h1>  {/* "Grill Station" */}

      {orders.map(order => (
        <div key={order.id}>
          <span>{tConcept('guest.count.partySize')}: Table {order.table}</span>

          {order.items.map(item => (
            <div>
              <p>{item.name}</p>
              <Badge>{tRestaurant(`pos.modifier.${item.modifier}`)}</Badge>
              {/* "Well Done" or "Extra Sauce" */}
            </div>
          ))}

          <Button onClick={() => fireOrder(order.id)}>
            {tRestaurant('kitchen.order.fire')}  {/* "Fire Order" */}
          </Button>

          <Button onClick={() => plateOrder(order.id)}>
            {tRestaurant('kitchen.order.plate')}  {/* "Plate" */}
          </Button>
        </div>
      ))}
    </div>
  );
};
```

### **Multi-language Support:**
```typescript
// Spanish (es)
t('kitchen.order.fire')  // "Iniciar Pedido"
t('pos.modifier.wellDone')  // "Bien Cocido"

// Arabic (ar)
t('kitchen.order.fire')  // "ابدأ الطلب"
t('pos.modifier.wellDone')  // "جيد الطهي"

// Chinese (zh)
t('kitchen.order.fire')  // "开始订单"
t('pos.modifier.wellDone')  // "全熟"
```

---

## 2️⃣ ⚖️ **LEGAL FIRM - Case Management**

### **Scenario:** Legal case dashboard with deadlines

```typescript
// components/legal/CaseDashboard.tsx
import { useTranslation } from '@/lib/i18n';

export const CaseDashboard = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tLegal } = useTranslation('workspace-legal');
  const { t: tConcept } = useTranslation('concept-legal-firm');

  const legalCase = {
    id: 'CASE-2024-001',
    type: 'civil',
    status: 'litigation',
    deadlines: [
      { type: 'filingDeadline', date: '2025-01-15' },
      { type: 'statuteOfLimitations', date: '2025-06-30' }
    ]
  };

  return (
    <div>
      <h1>{tConcept(`caseType.${legalCase.type}`)}</h1>  {/* "Civil" */}
      <Status>{tLegal(`case.status.${legalCase.status}`)}</Status>  {/* "In Litigation" */}

      <section>
        <h2>{tCommon('labels.deadline')}</h2>
        {legalCase.deadlines.map(deadline => (
          <div key={deadline.type}>
            <strong>{tLegal(`docket.deadline.${deadline.type}`)}</strong>
            {/* "Filing Deadline" or "Statute of Limitations" */}
            <span>{deadline.date}</span>
          </div>
        ))}
      </section>

      <div>
        <Button onClick={() => runConflictCheck()}>
          {tLegal('matter.conflictCheck')}  {/* "Conflict Check" */}
        </Button>

        <Button onClick={() => assignAttorney()}>
          {tLegal('case.action.assignAttorney')}  {/* "Assign Attorney" */}
        </Button>
      </div>

      <TimeTracking>
        <Activity>{tLegal('timeTracking.activity.legalResearch')}</Activity>
        {/* "Legal Research" */}
        <Activity>{tLegal('timeTracking.activity.courtAppearance')}</Activity>
        {/* "Court Appearance" */}
      </TimeTracking>
    </div>
  );
};
```

### **Multi-language Support:**
```typescript
// Spanish (es)
t('docket.deadline.statuteOfLimitations')  // "Estatuto de Limitaciones"
t('matter.conflictCheck')  // "Verificación de Conflictos"

// French (fr)
t('docket.deadline.statuteOfLimitations')  // "Prescription"
t('matter.conflictCheck')  // "Vérification des Conflits"
```

---

## 3️⃣ 📻 **RADIO STATION - AI Host Control**

### **Scenario:** Virtual DJ control panel

```typescript
// components/radio/AIHostControl.tsx
import { useTranslation } from '@/lib/i18n';

export const AIHostControl = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tRadio } = useTranslation('workspace-radio-control');
  const { t: tConcept } = useTranslation('concept-radio-station');

  const [voice, setVoice] = useState('female');
  const [personality, setPersonality] = useState('energetic');
  const [playlist, setPlaylist] = useState([]);

  return (
    <div>
      <h1>{tRadio('aiHost.voice.female')}</h1>  {/* "Female Voice" */}

      <Select value={personality} onChange={setPersonality}>
        <option value="energetic">
          {tRadio('aiHost.personality.energetic')}  {/* "Energetic" */}
        </option>
        <option value="calm">
          {tRadio('aiHost.personality.calm')}  {/* "Calm" */}
        </option>
        <option value="humorous">
          {tRadio('aiHost.personality.humorous')}  {/* "Humorous" */}
        </option>
      </Select>

      <Controls>
        <Checkbox>{tRadio('aiHost.control.autoIntro')}</Checkbox>  {/* "Auto Intro" */}
        <Checkbox>{tRadio('aiHost.control.talkover')}</Checkbox>   {/* "Talkover" */}
        <Checkbox>{tRadio('aiHost.control.backAnnounce')}</Checkbox>  {/* "Back Announce" */}
      </Controls>

      <Playout>
        <Status>{tRadio('playout.queue.nowPlaying')}: Song Title</Status>
        {/* "Now Playing" */}

        <MixingControls>
          <Button>{tRadio('playout.mixing.crossfade')}</Button>  {/* "Crossfade" */}
          <Button>{tRadio('playout.mixing.segue')}</Button>      {/* "Segue" */}
          <Button>{tRadio('playout.mixing.hardCut')}</Button>    {/* "Hard Cut" */}
        </MixingControls>
      </Playout>

      <Live>
        <Button onClick={() => goLive()}>
          {tRadio('live.broadcast.goLive')}  {/* "Go Live" */}
        </Button>

        <Monitoring>
          <Metric>{tRadio('live.monitoring.listeners')}: 1,523</Metric>
          {/* "Active Listeners" */}
          <Metric>{tRadio('live.monitoring.bitrate')}: 320kbps</Metric>
          {/* "Bitrate" */}
        </Monitoring>
      </Live>
    </div>
  );
};
```

### **Multi-language Support:**
```typescript
// Spanish (es)
t('aiHost.control.talkover')  // "Hablar sobre la Música"
t('playout.mixing.crossfade')  // "Fundido Cruzado"

// Portuguese (pt)
t('aiHost.control.talkover')  // "Falar sobre a Música"
t('playout.mixing.crossfade')  // "Crossfade"
```

---

## 4️⃣ 🏥 **HEALTHCARE - EMR System**

### **Scenario:** Patient chart with vital signs

```typescript
// components/healthcare/PatientChart.tsx
import { useTranslation } from '@/lib/i18n';

export const PatientChart = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tHealthcare } = useTranslation('workspace-healthcare');
  const { t: tConcept } = useTranslation('concept-healthcare');

  const patient = {
    id: 'PT-12345',
    type: 'newPatient',
    appointment: 'checkup',
    vitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      oxygenSaturation: 98
    },
    queue: 'waitingRoom'
  };

  return (
    <div>
      <Header>
        <h1>{tConcept(`patient.type.${patient.type}`)}</h1>  {/* "New Patient" */}
        <Badge>{tConcept(`appointment.type.${patient.appointment}`)}</Badge>  {/* "Check-up" */}
      </Header>

      <VitalSigns>
        <h2>{tHealthcare('emr.chart.vitals')}</h2>  {/* "Vital Signs" */}

        <Vital>
          <Label>{tHealthcare('emr.chart.bloodPressure')}</Label>  {/* "Blood Pressure" */}
          <Value>{patient.vitals.bloodPressure}</Value>
        </Vital>

        <Vital>
          <Label>{tHealthcare('emr.chart.heartRate')}</Label>  {/* "Heart Rate" */}
          <Value>{patient.vitals.heartRate} bpm</Value>
        </Vital>

        <Vital>
          <Label>{tHealthcare('emr.chart.oxygenSaturation')}</Label>  {/* "Oxygen Saturation" */}
          <Value>{patient.vitals.oxygenSaturation}%</Value>
        </Vital>
      </VitalSigns>

      <Queue>
        <Status>{tHealthcare(`scheduling.queue.${patient.queue}`)}</Status>
        {/* "Waiting Room" */}
      </Queue>

      <Documentation>
        <Field>
          <Label>{tHealthcare('emr.documentation.chiefComplaint')}</Label>
          {/* "Chief Complaint" */}
          <Textarea />
        </Field>

        <Field>
          <Label>{tHealthcare('emr.documentation.assessment')}</Label>
          {/* "Assessment" */}
          <Textarea />
        </Field>
      </Documentation>

      <Billing>
        <Code>{tHealthcare('billing.coding.icd10')}: J18.9</Code>  {/* "ICD-10 Code" */}
        <Code>{tHealthcare('billing.coding.cpt')}: 99213</Code>    {/* "CPT Code" */}
      </Billing>
    </div>
  );
};
```

### **Multi-language Support:**
```typescript
// Spanish (es)
t('emr.chart.bloodPressure')  // "Presión Arterial"
t('emr.documentation.chiefComplaint')  // "Motivo Principal de Consulta"

// Arabic (ar)
t('emr.chart.bloodPressure')  // "ضغط الدم"
t('emr.documentation.chiefComplaint')  // "الشكوى الرئيسية"
```

---

## 5️⃣ 🎗️ **CANCER CARE - Patient Portal**

### **Scenario:** Cancer patient journey tracker

```typescript
// components/cancer-care/PatientJourney.tsx
import { useTranslation } from '@/lib/i18n';

export const PatientJourney = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tCancer } = useTranslation('workspace-cancer-care');
  const { t: tConcept } = useTranslation('concept-cancer-care');

  const patient = {
    cancerType: 'breast',
    stage: 'stage2',
    treatment: 'chemotherapy',
    journey: 'treatment',
    symptoms: ['fatigue', 'nausea']
  };

  return (
    <div>
      <Header>
        <h1>{tConcept(`cancerType.${patient.cancerType}`)}</h1>  {/* "Breast Cancer" */}
        <Badge>{tConcept(`stage.${patient.stage}`)}</Badge>      {/* "Stage II" */}
      </Header>

      <Journey>
        <h2>{tCancer('patient.portal.myJourney')}</h2>  {/* "My Journey" */}
        <Stage active>{tCancer(`patient.journey.${patient.journey}`)}</Stage>
        {/* "Treatment" */}
      </Journey>

      <Treatment>
        <h3>{tConcept(`treatment.${patient.treatment}`)}</h3>  {/* "Chemotherapy" */}
        <Schedule>{tCancer('patient.portal.treatmentSchedule')}</Schedule>
        {/* "Treatment Schedule" */}
      </Treatment>

      <Symptoms>
        <h3>{tCancer('patient.portal.symptomTracker')}</h3>  {/* "Symptom Tracker" */}
        {patient.symptoms.map(symptom => (
          <Symptom key={symptom}>
            {tConcept(`symptom.${symptom}`)}  {/* "Fatigue", "Nausea" */}
          </Symptom>
        ))}
      </Symptoms>

      <Support>
        <Button onClick={() => connectWithSurvivor()}>
          {tCancer('patient.portal.connectWithSurvivor')}
          {/* "Connect with Survivor" */}
        </Button>
      </Support>

      <AICompanion>
        <h3>{tCancer('aiAgent.companion.type.symptom')}</h3>
        {/* "Symptom Tracking Agent" */}
        <Feature>{tCancer('aiAgent.capability.remindMedication')}</Feature>
        {/* "Medication Reminders" */}
      </AICompanion>
    </div>
  );
};
```

### **Sponsor Dashboard:**
```typescript
// components/cancer-care/SponsorDashboard.tsx
export const SponsorDashboard = () => {
  const { t } = useTranslation('workspace-cancer-care');

  return (
    <div>
      <h1>{t('sponsor.engagement.becomeSponsor')}</h1>  {/* "Become a Sponsor" */}

      <DonationOptions>
        <Option>{t('sponsor.donation.memorial')}</Option>  {/* "Memorial Donation" */}
        <Option>{t('sponsor.donation.honor')}</Option>    {/* "Honor Donation" */}
        <Option>{t('sponsor.donation.matching')}</Option> {/* "Matching Gift" */}
      </DonationOptions>

      <Impact>
        <h2>{t('sponsor.engagement.viewImpact')}</h2>  {/* "View Your Impact" */}
        <Metric>{t('sponsor.impact.patientsHelped')}: 127</Metric>  {/* "Patients Helped" */}
        <Metric>{t('sponsor.impact.fundsRaised')}: $45,000</Metric>  {/* "Funds Raised" */}
      </Impact>
    </div>
  );
};
```

---

## 6️⃣ 🏢 **VIBETHINK AGENCY - Client Portal**

### **Scenario:** Client subscription management

```typescript
// components/agency/ClientPortal.tsx
import { useTranslation } from '@/lib/i18n';

export const ClientPortal = () => {
  const { t: tCommon } = useTranslation('common');
  const { t: tPortal } = useTranslation('workspace-client-portal');
  const { t: tConcept } = useTranslation('concept-agency');

  const client = {
    type: 'startup',
    industry: 'foodService',
    subscription: {
      plan: 'professional',
      billing: 'monthly',
      status: 'active'
    },
    integrations: [
      { provider: 'stripe', status: 'connected' },
      { provider: 'quickbooks', status: 'pending' }
    ]
  };

  return (
    <div>
      <Header>
        <h1>{tConcept(`client.type.${client.type}`)}</h1>  {/* "Startup" */}
        <Badge>{tConcept(`client.industry.${client.industry}`)}</Badge>  {/* "Food Service" */}
      </Header>

      <Subscription>
        <Plan>{tPortal(`portal.subscription.plan.${client.subscription.plan}`)}</Plan>
        {/* "Professional" */}

        <Billing>{tPortal(`portal.subscription.billing.${client.subscription.billing}`)}</Billing>
        {/* "Monthly" */}

        <Status>{tPortal(`portal.subscription.status.${client.subscription.status}`)}</Status>
        {/* "Active" */}
      </Subscription>

      <Integrations>
        <h2>{tCommon('labels.integrations')}</h2>
        {client.integrations.map(int => (
          <Integration key={int.provider}>
            <Provider>{tPortal(`portal.integration.provider.${int.provider}`)}</Provider>
            {/* "Stripe", "QuickBooks" */}

            <Status>{tPortal(`portal.integration.status.${int.status}`)}</Status>
            {/* "Connected", "Pending Authorization" */}

            <Button>{tPortal('portal.integration.action.configure')}</Button>
            {/* "Configure" */}
          </Integration>
        ))}
      </Integrations>

      <Support>
        <h2>{tPortal('portal.support.resource.knowledgeBase')}</h2>  {/* "Knowledge Base" */}

        <Button onClick={() => createTicket()}>
          {tPortal('portal.support.ticket.create')}  {/* "Create Ticket" */}
        </Button>
      </Support>

      <Analytics>
        <Metric>{tPortal('portal.analytics.metric.usage')}</Metric>  {/* "Usage" */}
        <Metric>{tPortal('portal.analytics.metric.requests')}: 12,450</Metric>  {/* "API Requests" */}
      </Analytics>
    </div>
  );
};
```

---

## 🌍 **MULTI-LANGUAGE SWITCHING**

All 6 business cases support **9 languages** seamlessly:

```typescript
// User changes language
const { locale, setLocale } = useI18n();

setLocale('es');  // All namespaces reload in Spanish
setLocale('ar');  // All namespaces reload in Arabic
setLocale('zh');  // All namespaces reload in Chinese
```

**Example - Same component in 3 languages:**

```typescript
// English (en)
t('kitchen.order.fire')  // "Fire Order"

// Spanish (es)
t('kitchen.order.fire')  // "Iniciar Pedido"

// Chinese (zh)
t('kitchen.order.fire')  // "开始订单"
```

---

## 📊 **NAMESPACE COMBINATION PATTERNS**

### **Pattern 1: Concept + Workspace**
```typescript
const { t: tConcept } = useTranslation('concept-restaurant');
const { t: tWorkspace } = useTranslation('workspace-restaurant');

// Concept: Industry terminology
tConcept('menu.category.appetizer');  // "Appetizer"

// Workspace: Operational terms
tWorkspace('kitchen.order.fire');  // "Fire Order"
```

### **Pattern 2: Common + Specific**
```typescript
const { t: tCommon } = useTranslation('common');
const { t: tLegal } = useTranslation('workspace-legal');

// Common: Universal actions
tCommon('buttons.save');  // "Save"

// Specific: Legal-only actions
tLegal('matter.conflictCheck');  // "Conflict Check"
```

### **Pattern 3: All Three Layers**
```typescript
const { t: tCommon } = useTranslation('common');
const { t: tConcept } = useTranslation('concept-healthcare');
const { t: tWorkspace } = useTranslation('workspace-healthcare');

// Layer 1: Universal
tCommon('buttons.submit');  // "Submit"

// Layer 2: Healthcare context
tConcept('appointment.type.checkup');  // "Check-up"

// Layer 3: EMR functionality
tWorkspace('emr.chart.bloodPressure');  // "Blood Pressure"
```

---

**Generated by:** Claude Code i18n System
**See also:**
- `NAMESPACE_STATUS.md` - Full namespace inventory
- `NO_DUPLICATION_EXAMPLES.md` - Duplication prevention guide
