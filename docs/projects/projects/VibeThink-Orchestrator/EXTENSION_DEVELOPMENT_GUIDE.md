# 🛠️ Guía de Desarrollo de Extensiones - AI Pair Orchestrator Pro

## 📋 Resumen Ejecutivo

Guía práctica para desarrollar extensiones de navegador e integraciones nativas con Office 365 y Google Workspace, incluyendo mejores prácticas, código de ejemplo y estrategias de implementación.

---

## 🎯 Stack Tecnológico Recomendado

### **Frontend Stack**
```typescript
// Stack recomendado para extensiones
const extensionStack = {
  framework: 'React 18 + TypeScript',
  buildTool: 'Webpack 5 + Manifest V3',
  styling: 'Tailwind CSS + CSS Modules',
  stateManagement: 'Zustand (lightweight)',
  testing: 'Jest + React Testing Library',
  linting: 'ESLint + Prettier',
  bundling: 'Rollup para múltiples navegadores'
};
```

### **Backend Integration**
```typescript
// Stack para integraciones nativas
const integrationStack = {
  googleWorkspace: {
    language: 'TypeScript/JavaScript',
    framework: 'Google Apps Script',
    apis: ['Gmail API', 'Docs API', 'Sheets API'],
    authentication: 'OAuth 2.0'
  },
  microsoftOffice: {
    language: 'TypeScript/JavaScript',
    framework: 'Office.js',
    apis: ['Microsoft Graph API', 'Outlook API'],
    authentication: 'Azure AD'
  }
};
```

---

## 🌐 Chrome Extension (Manifest V3)

### **Estructura del Proyecto**
```
chrome-extension/
├── src/
│   ├── popup/
│   │   ├── Popup.tsx
│   │   ├── popup.html
│   │   └── popup.css
│   ├── content/
│   │   ├── GmailContent.tsx
│   │   ├── OutlookContent.tsx
│   │   └── content.css
│   ├── background/
│   │   └── service-worker.ts
│   ├── options/
│   │   ├── Options.tsx
│   │   └── options.html
│   └── utils/
│       ├── api.ts
│       ├── auth.ts
│       └── storage.ts
├── public/
│   ├── manifest.json
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
├── webpack.config.js
├── package.json
└── tsconfig.json
```

### **Manifest V3 Configuration**
```json
{
  "manifest_version": 3,
  "name": "AI Pair Orchestrator Pro",
  "version": "1.0.0",
  "description": "AI-powered productivity assistant for enterprise",
  "permissions": [
    "activeTab",
    "storage",
    "identity",
    "scripting"
  ],
  "host_permissions": [
    "https://*.google.com/*",
    "https://*.microsoft.com/*",
    "https://*.office.com/*",
    "https://*.supabase.co/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://mail.google.com/*",
        "https://outlook.office.com/*",
        "https://docs.google.com/*",
        "https://*.office.com/*"
      ],
      "js": ["content.js"],
      "css": ["styles.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "AI Pair Orchestrator Pro"
  },
  "web_accessible_resources": [
    {
      "resources": ["injected.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### **Popup Component**
```typescript
// src/popup/Popup.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAIChat } from '@/hooks/useAIChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PopupProps {
  className?: string;
}

export const Popup: React.FC<PopupProps> = ({ className }) => {
  const { user, login, logout } = useAuth();
  const { messages, sendMessage, isLoading } = useAIChat();
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`w-96 h-96 flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">AI Pair Orchestrator Pro</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {!user ? (
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={login} className="w-full">
              Iniciar Sesión
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    message.role === 'user'
                      ? 'bg-blue-100 ml-4'
                      : 'bg-gray-100 mr-4'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                Enviar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );
};
```

### **Gmail Content Script**
```typescript
// src/content/GmailContent.tsx
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useAIChat } from '@/hooks/useAIChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GmailContentProps {
  className?: string;
}

export const GmailContent: React.FC<GmailContentProps> = ({ className }) => {
  const { sendMessage, isLoading } = useAIChat();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detectar si estamos en Gmail
    if (window.location.hostname === 'mail.google.com') {
      injectGmailUI();
    }
  }, []);

  const injectGmailUI = () => {
    // Crear contenedor para nuestro UI
    const container = document.createElement('div');
    container.id = 'ai-pair-gmail-container';
    container.className = 'ai-pair-gmail-widget';
    
    // Insertar en el sidebar de Gmail
    const sidebar = document.querySelector('[role="complementary"]');
    if (sidebar) {
      sidebar.appendChild(container);
      
      // Renderizar React component
      const root = createRoot(container);
      root.render(<GmailWidget />);
    }
  };

  const GmailWidget = () => (
    <Card className="m-4">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">AI Assistant</h3>
        <div className="space-y-2">
          <Button
            size="sm"
            onClick={() => handleSmartReply()}
            disabled={isLoading}
            className="w-full"
          >
            Smart Reply
          </Button>
          <Button
            size="sm"
            onClick={() => handleSummarize()}
            disabled={isLoading}
            className="w-full"
          >
            Summarize Email
          </Button>
          <Button
            size="sm"
            onClick={() => handleExtractTasks()}
            disabled={isLoading}
            className="w-full"
          >
            Extract Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleSmartReply = async () => {
    const emailContent = getCurrentEmailContent();
    const response = await sendMessage(
      `Generate a smart reply for this email: ${emailContent}`
    );
    // Insertar respuesta en el campo de texto
    insertReply(response);
  };

  const handleSummarize = async () => {
    const emailContent = getCurrentEmailContent();
    const summary = await sendMessage(
      `Summarize this email in 2-3 bullet points: ${emailContent}`
    );
    showSummary(summary);
  };

  const handleExtractTasks = async () => {
    const emailContent = getCurrentEmailContent();
    const tasks = await sendMessage(
      `Extract actionable tasks from this email: ${emailContent}`
    );
    createTasks(tasks);
  };

  const getCurrentEmailContent = (): string => {
    // Obtener contenido del email actual
    const emailBody = document.querySelector('[role="main"]');
    return emailBody?.textContent || '';
  };

  const insertReply = (reply: string) => {
    // Insertar respuesta en el campo de texto de Gmail
    const replyField = document.querySelector('[role="textbox"]');
    if (replyField) {
      (replyField as HTMLTextAreaElement).value = reply;
    }
  };

  const showSummary = (summary: string) => {
    // Mostrar resumen en un tooltip o modal
    console.log('Summary:', summary);
  };

  const createTasks = (tasks: string) => {
    // Crear tareas en el sistema
    console.log('Tasks:', tasks);
  };

  return null; // Este componente no renderiza nada directamente
};
```

---

## 🔌 Google Workspace Add-ons

### **Gmail Add-on Structure**
```
gmail-addon/
├── src/
│   ├── Code.gs
│   ├── sidebar.html
│   ├── sidebar.js
│   └── utils.gs
├── appsscript.json
├── package.json
└── README.md
```

### **Google Apps Script Configuration**
```json
// appsscript.json
{
  "timeZone": "America/Bogota",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Gmail",
        "version": "v1",
        "serviceId": "gmail"
      }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

### **Main Script (Code.gs)**
```javascript
// Code.gs
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  GmailApp.createCustomMenu()
    .addItem('AI Assistant', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('AI Pair Orchestrator Pro')
    .setWidth(400);
  GmailApp.getUi().showSidebar(html);
}

function getCurrentEmail() {
  const thread = GmailApp.getActiveThread();
  const message = thread.getMessages()[thread.getMessageCount() - 1];
  
  return {
    subject: message.getSubject(),
    body: message.getPlainBody(),
    sender: message.getFrom(),
    date: message.getDate()
  };
}

function generateSmartReply(emailContent) {
  // Llamar a la API de AI Pair
  const response = UrlFetchApp.fetch('https://api.VibeThink.co/ai/generate-reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getApiKey()
    },
    payload: JSON.stringify({
      email: emailContent,
      type: 'smart_reply'
    })
  });
  
  return JSON.parse(response.getContentText());
}

function summarizeEmail(emailContent) {
  // Llamar a la API de AI Pair
  const response = UrlFetchApp.fetch('https://api.VibeThink.co/ai/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getApiKey()
    },
    payload: JSON.stringify({
      content: emailContent,
      type: 'email_summary'
    })
  });
  
  return JSON.parse(response.getContentText());
}

function extractTasks(emailContent) {
  // Llamar a la API de AI Pair
  const response = UrlFetchApp.fetch('https://api.VibeThink.co/ai/extract-tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getApiKey()
    },
    payload: JSON.stringify({
      content: emailContent
    })
  });
  
  return JSON.parse(response.getContentText());
}

function getApiKey() {
  // Obtener API key desde Properties
  return PropertiesService.getScriptProperties().getProperty('AI_PAIR_API_KEY');
}
```

### **Sidebar HTML**
```html
<!-- sidebar.html -->
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 16px;
      background-color: #f8f9fa;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #1a73e8;
    }
    .button {
      background-color: #1a73e8;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .button:hover {
      background-color: #1557b0;
    }
    .button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .result {
      margin-top: 16px;
      padding: 12px;
      background-color: #f1f3f4;
      border-radius: 4px;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .loading {
      text-align: center;
      color: #666;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">AI Pair Orchestrator Pro</div>
    
    <button class="button" onclick="generateSmartReply()">
      Generate Smart Reply
    </button>
    
    <button class="button" onclick="summarizeEmail()">
      Summarize Email
    </button>
    
    <button class="button" onclick="extractTasks()">
      Extract Tasks
    </button>
    
    <div id="result"></div>
  </div>

  <script>
    function generateSmartReply() {
      showLoading('Generating smart reply...');
      
      google.script.run
        .withSuccessHandler(function(result) {
          showResult('Smart Reply:\n\n' + result.reply);
        })
        .withFailureHandler(function(error) {
          showResult('Error: ' + error.message);
        })
        .generateSmartReply();
    }
    
    function summarizeEmail() {
      showLoading('Summarizing email...');
      
      google.script.run
        .withSuccessHandler(function(result) {
          showResult('Summary:\n\n' + result.summary);
        })
        .withFailureHandler(function(error) {
          showResult('Error: ' + error.message);
        })
        .summarizeEmail();
    }
    
    function extractTasks() {
      showLoading('Extracting tasks...');
      
      google.script.run
        .withSuccessHandler(function(result) {
          showResult('Tasks:\n\n' + result.tasks.join('\n'));
        })
        .withFailureHandler(function(error) {
          showResult('Error: ' + error.message);
        })
        .extractTasks();
    }
    
    function showLoading(message) {
      document.getElementById('result').innerHTML = 
        '<div class="loading">' + message + '</div>';
    }
    
    function showResult(content) {
      document.getElementById('result').innerHTML = 
        '<div class="result">' + content + '</div>';
    }
  </script>
</body>
</html>
```

---

## 🔌 Microsoft Office Add-ins

### **Outlook Add-in Structure**
```
outlook-addin/
├── src/
│   ├── commands/
│   │   └── function-file.js
│   ├── taskpane/
│   │   ├── taskpane.html
│   │   ├── taskpane.js
│   │   └── taskpane.css
│   └── manifest.xml
├── package.json
└── README.md
```

### **Manifest XML**
```xml
<!-- manifest.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
           xsi:type="MailApp">
  <Id>12345678-1234-1234-1234-123456789012</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>AI Pair Orchestrator Pro</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="AI Pair Orchestrator Pro" />
  <Description DefaultValue="AI-powered productivity assistant" />
  <IconUrl DefaultValue="https://VibeThink.co/icon-32.png" />
  <HighResolutionIconUrl DefaultValue="https://VibeThink.co/icon-64.png" />
  <SupportUrl DefaultValue="https://VibeThink.co/support" />
  <AppDomains>
    <AppDomain>https://VibeThink.co</AppDomain>
  </AppDomains>
  <Hosts>
    <Host Name="Mailbox" />
  </Hosts>
  <Requirements>
    <Sets>
      <Set Name="Mailbox" MinVersion="1.1" />
    </Sets>
  </Requirements>
  <FormSettings>
    <Form xsi:type="ItemRead">
      <DesktopSettings>
        <SourceLocation DefaultValue="https://VibeThink.co/outlook/addin.html" />
        <RequestedHeight>450</RequestedHeight>
      </DesktopSettings>
    </Form>
  </FormSettings>
  <Permissions>ReadWriteItem</Permissions>
  <Rule xsi:type="RuleCollection" Mode="Or">
    <Rule xsi:type="ItemIs" ItemType="Message" FormType="Read" />
  </Rule>
</OfficeApp>
```

### **Taskpane HTML**
```html
<!-- taskpane.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI Pair Orchestrator Pro</title>
  
  <!-- Office JavaScript API -->
  <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script>
  
  <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/11.0.0/css/fabric.min.css"/>
  <link rel="stylesheet" href="taskpane.css" />
</head>

<body class="ms-font-m ms-welcome">
  <div id="container">
    <header class="ms-welcome__header">
      <h1 class="ms-font-xl">AI Pair Orchestrator Pro</h1>
    </header>
    
    <main class="ms-welcome__main">
      <div class="ms-welcome__features">
        <button class="ms-Button" id="smartReply">
          <span class="ms-Button-label">Generate Smart Reply</span>
        </button>
        
        <button class="ms-Button" id="summarize">
          <span class="ms-Button-label">Summarize Email</span>
        </button>
        
        <button class="ms-Button" id="extractTasks">
          <span class="ms-Button-label">Extract Tasks</span>
        </button>
        
        <div id="result" class="ms-welcome__result"></div>
      </div>
    </main>
  </div>
  
  <script src="taskpane.js"></script>
</body>
</html>
```

### **Taskpane JavaScript**
```javascript
// taskpane.js
Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById('smartReply').onclick = generateSmartReply;
    document.getElementById('summarize').onclick = summarizeEmail;
    document.getElementById('extractTasks').onclick = extractTasks;
  }
});

async function generateSmartReply() {
  try {
    showLoading('Generating smart reply...');
    
    const emailContent = await getCurrentEmail();
    const response = await fetch('https://api.VibeThink.co/ai/generate-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      body: JSON.stringify({
        email: emailContent,
        type: 'smart_reply'
      })
    });
    
    const result = await response.json();
    showResult('Smart Reply:\n\n' + result.reply);
    
  } catch (error) {
    showResult('Error: ' + error.message);
  }
}

async function summarizeEmail() {
  try {
    showLoading('Summarizing email...');
    
    const emailContent = await getCurrentEmail();
    const response = await fetch('https://api.VibeThink.co/ai/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      body: JSON.stringify({
        content: emailContent,
        type: 'email_summary'
      })
    });
    
    const result = await response.json();
    showResult('Summary:\n\n' + result.summary);
    
  } catch (error) {
    showResult('Error: ' + error.message);
  }
}

async function extractTasks() {
  try {
    showLoading('Extracting tasks...');
    
    const emailContent = await getCurrentEmail();
    const response = await fetch('https://api.VibeThink.co/ai/extract-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getApiKey()
      },
      body: JSON.stringify({
        content: emailContent
      })
    });
    
    const result = await response.json();
    showResult('Tasks:\n\n' + result.tasks.join('\n'));
    
  } catch (error) {
    showResult('Error: ' + error.message);
  }
}

async function getCurrentEmail() {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item.body.getAsync(
      Office.CoercionType.Text,
      (result) => {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          resolve(result.value);
        } else {
          reject(new Error('Failed to get email content'));
        }
      }
    );
  });
}

function getApiKey() {
  // Obtener API key desde configuración
  return localStorage.getItem('ai_pair_api_key');
}

function showLoading(message) {
  document.getElementById('result').innerHTML = 
    '<div class="loading">' + message + '</div>';
}

function showResult(content) {
  document.getElementById('result').innerHTML = 
    '<div class="result">' + content + '</div>';
}
```

---

## 🚀 Próximos Pasos

### **Implementación Recomendada**
1. **Fase 1**: Gmail Add-on (4 semanas)
2. **Fase 2**: Chrome Extension (4 semanas)
3. **Fase 3**: Outlook Add-in (4 semanas)

### **Recursos Adicionales**
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Google Workspace Add-ons](https://developers.google.com/apps-script/add-ons)
- [Microsoft Office Add-ins](https://docs.microsoft.com/en-us/office/dev/add-ins/)

---

**Última actualización**: 19 de Enero 2025  
**Responsable**: Equipo de Desarrollo  
**Estado**: 🔄 **EN DESARROLLO**  
**Próxima revisión**: 26 de Enero 2025 