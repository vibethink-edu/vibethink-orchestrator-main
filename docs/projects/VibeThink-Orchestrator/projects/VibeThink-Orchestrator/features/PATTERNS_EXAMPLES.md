# Ejemplos Prácticos de Patrones de Diseño en el Stack

---

## 1. Facade
**Contexto:** Unificar el envío de notificaciones (email, SMS, push) bajo una sola interfaz.

```ts
// Notifier Facade
class NotifierFacade {
  constructor(private emailService, private smsService, private pushService) {}
  sendNotification(type: 'email' | 'sms' | 'push', message: string, to: string) {
    switch (type) {
      case 'email': return this.emailService.send(to, message);
      case 'sms': return this.smsService.send(to, message);
      case 'push': return this.pushService.send(to, message);
    }
  }
}
```
**Uso:**
```ts
const notifier = new NotifierFacade(emailService, smsService, pushService);
notifier.sendNotification('email', 'Hola!', 'user@demo.com');
```

---

## 2. Singleton
**Contexto:** Gestor global de temas de UI.

```ts
class ThemeManager {
  private static instance: ThemeManager;
  private theme: string = 'default';
  private constructor() {}
  static getInstance() {
    if (!ThemeManager.instance) ThemeManager.instance = new ThemeManager();
    return ThemeManager.instance;
  }
  setTheme(theme: string) { this.theme = theme; }
  getTheme() { return this.theme; }
}
```
**Uso:**
```ts
const themeManager = ThemeManager.getInstance();
themeManager.setTheme('dark');
```

---

## 3. Factory
**Contexto:** Crear componentes UI según el tipo de usuario.

```ts
interface Dashboard {
  render(): void;
}
class AdminDashboard implements Dashboard { render() { /* ... */ } }
class UserDashboard implements Dashboard { render() { /* ... */ } }

class DashboardFactory {
  static create(role: string): Dashboard {
    if (role === 'ADMIN') return new AdminDashboard();
    return new UserDashboard();
  }
}
```
**Uso:**
```ts
const dashboard = DashboardFactory.create(user.role);
dashboard.render();
```

---

## 4. Observer
**Contexto:** Actualizar la UI cuando cambian las preferencias del usuario.

```ts
class Preferences {
  private observers: Function[] = [];
  private theme: string = 'default';
  subscribe(fn: Function) { this.observers.push(fn); }
  setTheme(theme: string) {
    this.theme = theme;
    this.observers.forEach(fn => fn(theme));
  }
}
```
**Uso:**
```ts
const prefs = new Preferences();
prefs.subscribe((theme) => updateUI(theme));
prefs.setTheme('dark');
```

---

## 5. Decorator
**Contexto:** Añadir logging a un servicio sin modificar su código base.

```ts
class ApiService {
  fetchData() { /* ... */ }
}
function withLogging(service: ApiService) {
  return {
    fetchData: () => {
      console.log('Fetching data...');
      return service.fetchData();
    }
  };
}
```
**Uso:**
```ts
const api = new ApiService();
const apiWithLogging = withLogging(api);
apiWithLogging.fetchData();
```

---

## 6. Strategy
**Contexto:** Seleccionar algoritmo de autenticación según el proveedor.

```ts
interface AuthStrategy {
  authenticate(user: string, pass: string): boolean;
}
class GoogleAuth implements AuthStrategy {
  authenticate(u, p) { /* lógica Google */ return true; }
}
class MicrosoftAuth implements AuthStrategy {
  authenticate(u, p) { /* lógica Microsoft */ return true; }
}
class AuthContext {
  constructor(private strategy: AuthStrategy) {}
  setStrategy(strategy: AuthStrategy) { this.strategy = strategy; }
  login(u, p) { return this.strategy.authenticate(u, p); }
}
```
**Uso:**
```ts
const auth = new AuthContext(new GoogleAuth());
auth.login('user', 'pass');
auth.setStrategy(new MicrosoftAuth());
auth.login('user', 'pass');
```

---

**Todos los ejemplos pueden adaptarse y extenderse según los retos y necesidades del stack.** 