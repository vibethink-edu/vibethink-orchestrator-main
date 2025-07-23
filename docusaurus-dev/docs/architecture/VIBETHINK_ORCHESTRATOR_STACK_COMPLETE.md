# 🚀 VibeThink Orchestrator Version 1.0 - Stack Tecnológico Maestro 2025

> **Este documento es la única fuente oficial y centralizada del stack tecnológico de VibeThink Orchestrator Version 1.0. Toda referencia, actualización o consulta debe realizarse aquí.**

---

## 📋 INFORMACIÓN DEL PROYECTO

| Campo         | Valor                        |
|--------------|------------------------------|
| Producto     | VibeThink Orchestrator       |
| Versión      | 1.0.0                        |
| Metodología  | VThink 1.0 (CMMI-ML3)        |
| Arquitectura | Multi-tenant SaaS Enterprise |
| Tipo         | Plataforma SaaS Comercial     |
| Industria    | Enterprise Software          |

---

## 🎨 EFECTOS VISUALES Y ANIMACIONES (Nuevas Librerías)

### Librerías de Efectos Visuales Integradas

| Librería | Versión | URL | Descripción | Licencia |
|----------|---------|-----|-------------|----------|
| framer-motion | ^12.23.0 | https://www.framer.com/motion/ | Animaciones declarativas y gestos | MIT |
| react-spring | ^9.7.2 | https://www.react-spring.dev/ | Animaciones físicas basadas en spring | MIT |
| react-intersection-observer | ^9.4.3 | https://github.com/thebuilder/react-intersection-observer | Efectos al hacer scroll | MIT |
| react-parallax-tilt | ^1.8.84 | https://github.com/mkosir/react-parallax-tilt | Efectos tilt/parallax | MIT |
| react-confetti | ^6.1.0 | https://github.com/alampros/react-confetti | Confetti para celebraciones | MIT |
| react-lottie | ^1.2.3 | https://github.com/chenqingspring/react-lottie | Animaciones Lottie | MIT |
| react-awesome-reveal | ^4.1.3 | https://github.com/dennismorello/react-awesome-reveal | Animaciones de entrada | MIT |

### Ejemplos de Uso por App Core

#### 1. **Dashboard Principal - Efectos de Entrada**
```tsx
// src/apps/dashboard/components/AnimatedCard.tsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const AnimatedCard = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      {children}
    </motion.div>
  );
};
```

#### 2. **Helpdesk - Efectos de Interacción**
```tsx
// src/apps/helpdesk/components/TicketCard.tsx
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

export const TicketCard = ({ ticket }) => {
  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={800}
      transitionSpeed={1500}
      scale={1.05}
      gyroscope={true}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg"
      >
        <h3 className="font-semibold">{ticket.title}</h3>
        <p className="text-gray-600">{ticket.description}</p>
      </motion.div>
    </Tilt>
  );
};
```

#### 3. **CRM - Efectos de Celebración**
```tsx
// src/apps/crm/components/DealClosed.tsx
import { useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

export const DealClosed = ({ deal }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCloseDeal = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <motion.button
        onClick={handleCloseDeal}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-500 text-white px-6 py-3 rounded-lg"
      >
        Cerrar Deal - ${deal.value}
      </motion.button>
    </div>
  );
};
```

#### 4. **AI Chat - Animaciones de Mensajes**
```tsx
// src/apps/ai-chat/components/MessageBubble.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";

export const MessageBubble = ({ message, isUser }) => {
  const springProps = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 30 }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: isUser ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isUser ? 50 : -50 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <animated.div
          style={springProps}
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {message.content}
        </animated.div>
      </motion.div>
    </AnimatePresence>
  );
};
```

#### 5. **Login - Efectos de Transición**
```tsx
// src/apps/login/components/LoginForm.tsx
import { motion } from "framer-motion";
import { Fade } from "react-awesome-reveal";

export const LoginForm = () => {
  return (
    <Fade direction="up" duration={800} triggerOnce>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-2xl"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center mb-6"
        >
          Bienvenido a VibeThink Orchestrator
        </motion.h1>
        
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Form fields */}
        </motion.form>
      </motion.div>
    </Fade>
  );
};
```

#### 6. **E-commerce - Efectos de Productos**
```tsx
// src/apps/ecommerce/components/ProductCard.tsx
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const ProductCard = ({ product }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-lg overflow-hidden shadow-lg"
    >
      <motion.img
        src={product.image}
        alt={product.name}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-green-600 font-bold">${product.price}</p>
      </div>
    </motion.div>
  );
};
```

---

## 🏗️ STACK GLOBAL (Frameworks, Herramientas, Dependencias)

### Tabla de dependencias y componentes (con versión y URL oficial)

> **Usa esta tabla para planificar upgrades, auditorías y revisiones de seguridad.**

| Categoría | Paquete/Componente | Versión | URL Oficial |
|-----------|--------------------|---------|-------------|
| Core      | next               | ^15.3.4 | https://nextjs.org/ |
| Core      | react              | ^19.0.0 | https://react.dev/ |
| Core      | react-dom          | ^19.0.0 | https://react.dev/ |
| Core      | typescript         | ^5.4.0  | https://www.typescriptlang.org/ |
| UI        | @radix-ui/react-*  | varias  | https://www.radix-ui.com/docs/primitives/overview/introduction |
| UI        | tailwindcss        | ^3.4.17 | https://tailwindcss.com/ |
| UI        | tailwindcss-animate| ^1.0.7  | https://github.com/joe-bell/tailwindcss-animate |
| UI        | class-variance-authority | ^0.7.1 | https://cva.style/ |
| UI        | clsx               | ^2.1.1  | https://github.com/lukeed/clsx |
| UI        | tailwind-merge     | ^2.6.0  | https://github.com/dcastil/tailwind-merge |
| UI        | lucide-react       | ^0.294.0| https://lucide.dev/ |
| UI        | framer-motion      | ^12.23.0| https://www.framer.com/motion/ |
| UI        | vaul               | ^1.1.2  | https://vaul.dev/ |
| UI        | embla-carousel-react| ^8.6.0 | https://www.embla-carousel.com/ |
| UI        | react-resizable-panels | ^3.0.3 | https://github.com/bvaughn/react-resizable-panels |
| UI        | cmdk               | ^0.2.1  | https://cmdk.paco.me/ |
| UI        | input-otp          | ^1.4.2  | https://github.com/valdemarjunior/input-otp |
| UI        | react-day-picker   | ^9.8.0  | https://react-day-picker.js.org/ |
| UI        | next-themes        | ^0.4.6  | https://github.com/pacocoursey/next-themes |
| Efectos   | react-spring       | ^9.7.2  | https://www.react-spring.dev/ |
| Efectos   | react-intersection-observer | ^9.4.3 | https://github.com/thebuilder/react-intersection-observer |
| Efectos   | react-parallax-tilt | ^1.8.84 | https://github.com/mkosir/react-parallax-tilt |
| Efectos   | react-confetti     | ^6.1.0  | https://github.com/alampros/react-confetti |
| Efectos   | react-lottie       | ^1.2.3  | https://github.com/chenqingspring/react-lottie |
| Efectos   | react-awesome-reveal | ^4.1.3 | https://github.com/dennismorello/react-awesome-reveal |
| Backend   | @supabase/supabase-js | ^2.50.3 | https://supabase.com/docs/reference/javascript |
| Backend   | @supabase/auth-helpers-nextjs | ^0.9.0 | https://supabase.com/docs/guides/auth/auth-helpers/nextjs |
| Backend   | @supabase/auth-helpers-react | ^0.4.0 | https://supabase.com/docs/guides/auth/auth-helpers/react |
| Backend   | @supabase/auth-ui-react | ^0.4.7 | https://supabase.com/docs/guides/auth/auth-ui |
| Backend   | @supabase/auth-ui-shared | ^0.1.8 | https://supabase.com/docs/guides/auth/auth-ui |
| Backend   | prisma             | ^6.10.1 | https://www.prisma.io/ |
| Backend   | @prisma/client     | ^6.10.1 | https://www.prisma.io/docs/concepts/components/prisma-client |
| Estado    | @tanstack/react-query | ^5.8.4 | https://tanstack.com/query/latest |
| Estado    | @tanstack/react-table | ^8.21.3 | https://tanstack.com/table/latest |
| Estado    | zustand            | ^4.4.7  | https://zustand-demo.pmnd.rs/ |
| Estado    | jotai              | ^2.6.4  | https://jotai.org/ |
| Estado    | valtio             | ^1.13.1 | https://valtio.pmnd.rs/ |
| Formularios| react-hook-form   | ^7.60.0 | https://react-hook-form.com/ |
| Formularios| @hookform/resolvers | ^3.10.0 | https://react-hook-form.com/docs/useform |
| Formularios| zod               | ^3.25.74| https://zod.dev/ |
| Formularios| yup               | ^1.4.0  | https://github.com/jquense/yup |
| Formularios| ajv               | ^8.12.0 | https://ajv.js.org/ |
| i18n      | i18next            | ^23.16.8| https://www.i18next.com/ |
| i18n      | i18next-browser-languagedetector | ^7.2.2 | https://github.com/i18next/i18next-browser-languageDetector |
| i18n      | react-i18next      | ^13.5.0 | https://react.i18next.com/ |
| i18n      | next-intl          | ^3.9.1  | https://next-intl-docs.vercel.app/ |
| Workflow  | @dnd-kit/core      | ^6.3.1  | https://dndkit.com/ |
| Workflow  | @dnd-kit/sortable  | ^10.0.0 | https://dndkit.com/ |
| Workflow  | @dnd-kit/utilities | ^3.2.2  | https://dndkit.com/ |
| Workflow  | reactflow          | ^11.10.1| https://reactflow.dev/ |
| Workflow  | @xyflow/react      | ^11.10.1| https://xyflow.com/ |
| Charts    | recharts           | ^2.15.4 | https://recharts.org/ |
| Charts    | d3                 | ^7.8.5  | https://d3js.org/ |
| Charts    | nivo               | ^0.84.0 | https://nivo.rocks/ |
| Charts    | visx               | ^3.3.0  | https://airbnb.io/visx/ |
| HTTP/API  | axios              | ^1.10.0 | https://axios-http.com/ |
| HTTP/API  | ky                 | ^1.2.0  | https://github.com/sindresorhus/ky |
| HTTP/API  | swr                | ^2.2.4  | https://swr.vercel.app/ |
| Email     | @react-email/components | ^0.0.15 | https://react.email/docs/components |
| Email     | @react-email/render | ^0.0.12 | https://react.email/docs/render |
| Email     | react-email        | ^2.1.0  | https://react.email/ |
| Email     | nodemailer         | ^7.0.3  | https://nodemailer.com/ |
| Email     | resend             | ^3.1.0  | https://resend.com/ |
| Email     | sonner             | ^1.7.4  | https://sonner.emilkowal.ski/ |
| Email     | react-hot-toast    | ^2.4.1  | https://react-hot-toast.com/ |
| Files     | multer             | ^2.0.1  | https://github.com/expressjs/multer |
| Files     | pdf-parse          | ^1.1.1  | https://github.com/modesty/pdf-parse |
| Files     | xml2js             | ^0.6.2  | https://github.com/Leonidas-from-XIV/node-xml2js |
| Files     | archiver           | ^7.0.1  | https://www.archiverjs.com/ |
| Files     | chardet            | ^2.1.0  | https://github.com/runk/node-chardet |
| Files     | react-dropzone     | ^14.2.3 | https://react-dropzone.js.org/ |
| Utils     | date-fns           | ^2.30.0 | https://date-fns.org/ |
| Utils     | dotenv             | ^16.5.0 | https://github.com/motdotla/dotenv |
| Utils     | lodash             | ^4.17.21| https://lodash.com/ |
| Utils     | uuid               | ^9.0.1  | https://github.com/uuidjs/uuid |
| Utils     | nanoid             | ^5.0.6  | https://github.com/ai/nanoid |
| Utils     | js-cookie          | ^3.0.5  | https://github.com/js-cookie/js-cookie |
| Utils     | cookies-next       | ^4.1.1  | https://github.com/andreizanik/cookies-next |
| AI        | openai             | ^4.20.1 | https://platform.openai.com/docs |
| AI        | langchain          | ^0.1.0  | https://js.langchain.com/docs/ |
| AI        | ai                 | ^3.0.0  | https://github.com/vercel/ai |
| AI        | ai-sdk             | ^0.0.0  | https://github.com/vercel/ai |
| Analytics | @vercel/analytics  | ^1.1.1  | https://vercel.com/analytics |
| Analytics | @vercel/speed-insights | ^1.0.0 | https://vercel.com/speed-insights |
| Analytics | posthog-js         | ^1.96.0 | https://posthog.com/docs/libraries/js |
| Analytics | mixpanel-browser   | ^2.49.0 | https://developer.mixpanel.com/docs/javascript |
| Analytics | amplitude-js       | ^8.18.1 | https://www.docs.developers.amplitude.com/data/sdks/javascript/ |
| Seguridad | bcryptjs           | ^2.4.3  | https://github.com/dcodeIO/bcrypt.js |
| Seguridad | jsonwebtoken       | ^9.0.2  | https://github.com/auth0/node-jsonwebtoken |
| Seguridad | crypto-js          | ^4.2.0  | https://github.com/brix/crypto-js |
| Seguridad | helmet             | ^7.1.0  | https://helmetjs.github.io/ |
| Seguridad | cors               | ^2.8.5  | https://github.com/expressjs/cors |
| Performance| @next/bundle-analyzer | ^15.3.4 | https://www.npmjs.com/package/@next/bundle-analyzer |
| Performance| compression        | ^1.7.4  | https://github.com/expressjs/compression |
| Performance| sharp              | ^0.33.2 | https://sharp.pixelplumbing.com/ |
| Performance| imagemin           | ^8.0.1  | https://github.com/imagemin/imagemin |
| Performance| webp-converter     | ^2.3.3  | https://github.com/scionoftech/webp-converter |
| DevTools   | vite               | ^6.3.5  | https://vitejs.dev/ |
| DevTools   | @vitejs/plugin-react | ^4.1.1 | https://github.com/vitejs/vite-plugin-react |
| DevTools   | tsx                | ^4.6.2  | https://github.com/esbuild/tsx |
| DevTools   | autoprefixer       | ^10.4.21| https://github.com/postcss/autoprefixer |
| DevTools   | postcss            | ^8.5.6  | https://postcss.org/ |
| DevTools   | cssnano            | ^6.0.3  | https://cssnano.co/ |
| DevTools   | husky              | ^9.1.7  | https://typicode.github.io/husky/ |
| DevTools   | lint-staged        | ^16.1.2 | https://github.com/okonet/lint-staged |
| DevTools   | inquirer           | ^12.7.0 | https://github.com/SBoudrias/Inquirer.js/ |
| DevTools   | glob               | ^11.0.3 | https://github.com/isaacs/node-glob |
| DevTools   | snyk               | ^1.1260.0 | https://snyk.io/ |
| DevTools   | supabase           | ^2.26.9 | https://supabase.com/docs/reference/cli |
| DevTools   | rimraf             | ^5.0.5  | https://github.com/isaacs/rimraf |
| DevTools   | concurrently       | ^8.2.2  | https://github.com/open-cli-tools/concurrently |
| DevTools   | cross-env          | ^7.0.3  | https://github.com/kentcdodds/cross-env |
| DevTools   | vercel             | ^33.5.1 | https://vercel.com/docs/cli |
| DevTools   | @vercel/nft        | ^0.25.0 | https://github.com/vercel/nft |
| DevTools   | webpack-bundle-analyzer | ^4.10.1 | https://www.npmjs.com/package/webpack-bundle-analyzer |
| DevTools   | lighthouse         | ^11.6.0 | https://github.com/GoogleChrome/lighthouse |
| DevTools   | lighthouse-ci      | ^0.9.0  | https://github.com/GoogleChrome/lighthouse-ci |
| Testing    | vitest             | ^3.2.4  | https://vitest.dev/ |
| Testing    | @playwright/test   | ^1.40.1 | https://playwright.dev/ |
| Testing    | @testing-library/react | ^14.1.2 | https://testing-library.com/docs/react-testing-library/intro/ |
| Testing    | @testing-library/jest-dom | ^6.1.5 | https://github.com/testing-library/jest-dom |
| Testing    | @testing-library/user-event | ^14.5.1 | https://testing-library.com/docs/user-event/intro/ |
| Testing    | jsdom              | ^23.0.1 | https://github.com/jsdom/jsdom |
| Testing    | happy-dom          | ^18.0.1 | https://github.com/capricorn86/happy-dom |
| Testing    | msw                | ^2.0.8  | https://mswjs.io/ |
| Testing    | nock               | ^13.3.0 | https://github.com/nock/nock |
| Testing    | puppeteer          | ^24.10.2| https://pptr.dev/ |
| Typings    | @types/node        | ^20.10.0| https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node |
| Typings    | @types/react       | ^18.2.37| https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react |
| Typings    | @types/react-dom   | ^18.2.15| https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom |
| Typings    | @types/bcryptjs    | ^2.4.6  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/bcryptjs |
| Typings    | @types/jsonwebtoken| ^9.0.5  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/jsonwebtoken |
| Typings    | @types/crypto-js   | ^4.2.1  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/crypto-js |
| Typings    | @types/compression | ^1.7.5  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/compression |
| Typings    | @types/cors        | ^2.8.17 | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/cors |
| Typings    | @types/multer      | ^1.4.11 | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/multer |
| Typings    | @types/nodemailer  | ^6.4.14 | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/nodemailer |
| Typings    | @types/uuid        | ^9.0.7  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/uuid |
| Typings    | @types/lodash      | ^4.14.202| https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/lodash |
| Typings    | @types/js-cookie   | ^3.0.6  | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/js-cookie |
| Linting    | eslint             | ^8.53.0 | https://eslint.org/ |
| Linting    | @typescript-eslint/eslint-plugin | ^6.21.0 | https://typescript-eslint.io/ |
| Linting    | @typescript-eslint/parser | ^6.21.0 | https://typescript-eslint.io/ |
| Linting    | eslint-plugin-react-hooks | ^4.6.0 | https://www.npmjs.com/package/eslint-plugin-react-hooks |
| Linting    | eslint-plugin-react-refresh | ^0.4.4 | https://www.npmjs.com/package/eslint-plugin-react-refresh |
| Linting    | eslint-config-prettier | ^9.1.0 | https://github.com/prettier/eslint-config-prettier |
| Linting    | eslint-plugin-prettier | ^5.1.3 | https://github.com/prettier/eslint-plugin-prettier |
| Linting    | prettier            | ^3.2.4  | https://prettier.io/ |
| Linting    | prettier-plugin-tailwindcss | ^0.6.13 | https://github.com/tailwindlabs/prettier-plugin-tailwindcss |

---

## 🧩 STACK POR APP CORE

### 1. **Dashboard Principal**
- Componentes: Layout, Sidebar, Widgets, Analytics, Notificaciones
- Estado: **Aprobado** (portado Next.js 15, Bundui Premium integrado)
- Personalizaciones: Branding dinámico por tenant, soporte multilenguaje, control de dashboards
- Efectos Visuales: Animaciones de entrada, hover effects, transiciones suaves
- URL: `/dashboard`

### 2. **Helpdesk**
- Componentes: Ticketing, Chat Soporte, FAQ, Integración AI
- Estado: **En desarrollo** (migración a Next.js 15, integración React Flow para workflows de soporte)
- Personalizaciones: Workflows visuales, integración con Supabase y AI
- Efectos Visuales: Tilt effects, animaciones de tarjetas, efectos de interacción
- URL: `/helpdesk`

### 3. **CRM**
- Componentes: Gestión de clientes, Pipeline, Actividades, Integración con Email
- Estado: **En desarrollo** (migración avanzada, componentes Bundui y custom CRM)
- Personalizaciones: Campos custom, integración con workflows visuales
- Efectos Visuales: Confetti para celebraciones, animaciones de pipeline, efectos de éxito
- URL: `/crm`

### 4. **AI Chat**
- Componentes: Chatbot, Integración OpenAI, Historial, Multi-tenant context
- Estado: **Aprobado** (funcional, integración OpenAI y Supabase)
- Personalizaciones: Contexto por tenant, soporte multilenguaje
- Efectos Visuales: Animaciones de mensajes, efectos de typing, transiciones de chat
- URL: `/ai-chat`

### 5. **Login & Autenticación**
- Componentes: Login, Registro, Recuperación, Consentimiento cookies, MFA
- Estado: **Aprobado** (portado, Supabase Auth, cookies modernas)
- Personalizaciones: Branding por tenant, flujos custom de onboarding
- Efectos Visuales: Animaciones de entrada, efectos de formulario, transiciones de página
- URL: `/login`

### 6. **E-commerce**
- Componentes: Catálogo, Carrito, Checkout, Integración pagos
- Estado: **En desarrollo** (migración, integración Medusa opcional)
- Personalizaciones: Métodos de pago custom, branding
- Efectos Visuales: Animaciones de productos, efectos de hover, transiciones de carrito
- URL: `/ecommerce`

---

## 🛠️ COMPONENTES Y DESARROLLOS PERSONALIZADOS

| Componente/Desarrollo         | App         | Estado      | Descripción breve / Notas         |
|------------------------------|-------------|-------------|-----------------------------------|
| Branding dinámico por tenant  | Todas       | Aprobado    | Selector de logo, colores, assets |
| Banner consentimiento cookies | Login       | Aprobado    | Cumple GDPR, multi-idioma         |
| Workflows visuales (ReactFlow)| Helpdesk, CRM | En desarrollo | Editor visual de procesos         |
| Multi-idioma (i18next)       | Todas       | Aprobado    | Español, inglés, portugués        |
| Control de dashboards        | Dashboard   | Aprobado    | Permite customización por usuario |
| Integración OpenAI           | AI Chat     | Aprobado    | Prompting avanzado, contexto      |
| Auditoría y logs             | Todas       | En desarrollo | Trazabilidad multi-tenant         |
| Preferencias de privacidad   | Todas       | Aprobado    | Opt-in/out granular               |
| MFA (autenticación 2FA)      | Login       | En desarrollo | Integración Supabase + UI         |
| Integración Medusa           | E-commerce  | Opcional    | E-commerce headless               |
| Integración Strapi           | Opcional    | Opcional    | CMS headless                      |
| Efectos visuales (framer-motion)| Todas    | Aprobado    | Animaciones declarativas           |
| Efectos de scroll (intersection-observer)| Todas | Aprobado | Animaciones al hacer scroll       |
| Efectos de celebración (confetti)| CRM, AI Chat | Aprobado | Confetti para logros              |
| Efectos de tilt (parallax-tilt)| Helpdesk, Dashboard | Aprobado | Efectos 3D en tarjetas           |

---

## 🌐 URLs y Documentación Relevante

- [Documentación oficial Next.js](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Bundui Premium](https://bundui.com/)
- [React Flow](https://reactflow.dev/)
- [Vercel Analytics](https://vercel.com/analytics)
- [OpenAI API](https://platform.openai.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Spring Docs](https://www.react-spring.dev/)

---

## 📝 Notas de Personalización y Extensibilidad

- Todos los componentes Bundui Premium están integrados y pueden ser extendidos por tenant.
- El sistema de roles es unificado y multi-tenant (EMPLOYEE, MANAGER, ADMIN, OWNER, SUPER_ADMIN).
- Se recomienda mantener este documento actualizado tras cada cambio relevante en dependencias, apps o componentes.
- Los desarrollos personalizados deben documentarse aquí y en la wiki interna.
- **Nuevo**: Las librerías de efectos visuales están disponibles para todas las apps y pueden ser usadas según las necesidades de UX/UI.

---

## 🕑 Historial de Cambios

- 2024-07-01: **VibeThink Orchestrator Version 1.0** - Agregadas librerías de efectos visuales (framer-motion, react-spring, react-intersection-observer, react-parallax-tilt, react-confetti, react-lottie, react-awesome-reveal) con ejemplos de uso por app core.
- 2024-06-30: Consolidación única del stack, agrupación por apps core y componentes personalizados.
- 2024-06-15: Integración completa de Bundui Premium y migración Next.js 15.

---

> **Este documento reemplaza cualquier otro archivo de stack previo. Si encuentras información duplicada o desactualizada en otros archivos, repórtalo para su eliminación.** 