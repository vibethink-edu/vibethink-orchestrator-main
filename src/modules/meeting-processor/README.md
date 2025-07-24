# Meeting Processor

> **ES:** Este módulo sigue los principios de la metodología VThink 1.0. VThink 1.0 es únicamente la metodología, no como branding de producto.
> 
> **EN:** This module follows the principles of the VThink 1.0 methodology. VThink 1.0 is only the methodology, not the name of the product or system.

## Descripción
Módulo para procesamiento automático de reuniones usando DartAI y OpenAI.

## Funcionalidades
- Transcribir grabaciones de audio/video
- Extraer puntos clave y resúmenes
- Generar tareas automáticamente
- Integración con calendario
- Notificaciones automáticas

## Arquitectura
```
meeting-processor/
├── services/
│   ├── transcription.ts
│   ├── summarization.ts
│   └── task-generation.ts
├── types/
│   └── meeting.ts
├── utils/
│   └── audio-processing.ts
└── index.ts
```

## Configuración
```typescript
const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  dartAiToken: process.env.DART_AI_TOKEN,
  maxAudioDuration: 7200 horas
  supportedFormats:mp3, mp4wav,m4a]};
```

## Uso
```typescript
import [object Object]MeetingProcessor } from @/modules/meeting-processor';

const processor = new MeetingProcessor();
const result = await processor.processMeeting({
  audioUrl: 'https://example.com/meeting.mp3,  participants: [user1@company.com', user2.com'],
  duration: 3600
});
``` 