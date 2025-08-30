# @notsoweb/holos-tools

> Herramientas que facilitan iniciar una plantilla desde 0 en Vue.js. Permite mantener estados típicos, reconocer tamaños de pantalla, y comunicación directa con su contraparte de holos-backend.

## 📦 Instalación

```bash
npm install @notsoweb/holos-tools
```

## 🚀 Uso Rápido

### Importación Individual
```javascript
import { api, hasPermission, TailwindScreen } from '@notsoweb/holos-tools';
```

### Importación Agrupada (Recomendado)
```javascript
import { Api, Permissions, Screen, Forms, Page } from '@notsoweb/holos-tools';
```

## 📚 Módulos Disponibles

### 🖥️ Screen Detection (TailwindScreen)

Detecta el tamaño de pantalla basado en los breakpoints de Tailwind CSS.

```javascript
import { Screen } from '@notsoweb/holos-tools';
// o
import { TailwindScreen } from '@notsoweb/holos-tools';

const screen = new Screen();

// Verificar tamaños específicos
screen.isXs()    // < 640px
screen.isSm()    // 640px - 768px
screen.isMd()    // 768px - 1024px
screen.isLg()    // 1024px - 1280px
screen.isXl()    // 1280px - 1536px
screen.is2Xl()   // >= 1536px

// Obtener el tamaño actual
screen.getScreen() // 'xs', 'sm', 'md', 'lg', 'xl', '2xl'

// Detectar tipo de dispositivo
screen.isDevice('phone')  // xs, sm
screen.isDevice('tablet') // md
screen.isDevice('pc')     // lg, xl, 2xl

// Obtener dispositivo con variante
screen.getDevice() // 'phone', 'tablet', 'pc-sm', 'pc-md', 'pc-lg'
```

### 🌐 API Service

Servicio completo para comunicación con APIs REST.

```javascript
import { Api, Forms } from '@notsoweb/holos-tools';

// Configuración de tokens
Api.defineApiToken('your-api-token');
Api.defineCsrfToken('csrf-token');

// Realizar peticiones
const response = await Api.api.get('/users');
const user = await Api.api.post('/users', { data: { name: 'Juan' } });

// Verificar autenticación
if (Api.hasToken()) {
    // Usuario autenticado
}

// Cerrar sesión
Api.closeSession();
```

#### Formularios Reactivos

```javascript
import { Forms } from '@notsoweb/holos-tools';

const form = Forms.useForm({
    name: '',
    email: '',
    password: ''
});

// Enviar formulario
form.post('/register', {
    onSuccess: (response) => {
        console.log('Usuario registrado:', response.user);
    },
    onError: (errors) => {
        console.log('Errores:', form.errors);
    }
});

// Estados del formulario
form.processing  // true/false
form.hasErrors   // true/false
form.wasSuccessful // true/false
```

#### Buscador con Filtros

```javascript
const searcher = Forms.useSearcher({
    url: '/api/users',
    filters: () => ({
        search: '',
        status: 'active',
        role: ''
    })
});

// Buscar
searcher.search();

// Acceder a resultados
searcher.data     // Resultados
searcher.loading  // Estado de carga
searcher.filters  // Filtros actuales
```

### 👤 Page Management

Gestión de estado de página y usuario.

```javascript
import { Page } from '@notsoweb/holos-tools';

// Configurar usuario
Page.defineUser({
    id: 1,
    name: 'Juan',
    email: 'juan@example.com'
});

// Configurar aplicación
Page.defineApp({
    name: 'Mi App',
    version: '1.0.0'
});

// Acceder al estado
console.log(Page.page.user);
console.log(Page.page.app);

// Recargar datos
Page.reloadApp();
Page.reloadUser();

// Cerrar sesión
Page.logout();

// Crear vistas
const homeView = Page.view({
    name: 'home',
    params: { id: 1 },
    query: { tab: 'profile' }
});
```

#### Plugin para Vue

```javascript
import { createApp } from 'vue';
import { Page } from '@notsoweb/holos-tools';

const app = createApp({});
app.use(Page.pagePlugin);

// Disponible en componentes como:
// this.$page y this.$view
```

### 🔐 Permissions & Roles

Sistema completo de permisos y roles.

```javascript
import { Permissions } from '@notsoweb/holos-tools';

// Inicializar permisos
await Permissions.bootPermissions();
await Permissions.bootRoles();

// Verificar permisos
if (Permissions.hasPermission('user.edit|user.create')) {
    // Usuario tiene permiso para editar O crear usuarios
}

// Verificar roles
if (Permissions.hasRole('admin|moderator')) {
    // Usuario es admin O moderador
}

// Obtener todos los permisos/roles
const allPermissions = Permissions.getAllPermissions();
const allRoles = Permissions.getAllRoles();
const roleIds = Permissions.getAllRolesIds();

// Recargar permisos
Permissions.reloadPermissions();
Permissions.reloadRoles();

// Limpiar permisos
Permissions.resetPermissions();
Permissions.resetRoles();
```

### 🔔 Notifications (Notify)

Sistema de notificaciones con Toastr.

```javascript
import { Notify } from '@notsoweb/holos-tools';

const notify = new Notify();

// Notificaciones básicas
notify.success('¡Operación exitosa!');
notify.error('Error en la operación');
notify.info('Información importante');
notify.warning('Advertencia');

// Notificación personalizada
notify.flash({
    message: 'Mensaje personalizado',
    type: 'success',
    timeout: 10, // segundos
    title: 'Título personalizado'
});
```

### 🗄️ Pinia Stores

Stores predefinidos para Pinia.

#### Counter Store

```javascript
import { useCounterStore } from '@notsoweb/holos-tools/stores/counter';

const counter = useCounterStore();

// Estado
counter.count        // Valor actual
counter.doubleCount  // Valor * 2
counter.isEven       // true si es par
counter.history      // Historial de operaciones

// Acciones
counter.increment();
counter.decrement();
counter.reset();
counter.setCount(10);
```

#### User Store

```javascript
import { useUserStore } from '@notsoweb/holos-tools/stores/user';

const userStore = useUserStore();

// Estado
userStore.user        // Datos del usuario
userStore.isLoggedIn  // Estado de autenticación
userStore.loading     // Estado de carga

// Acciones
userStore.setUser({ name: 'Juan', email: 'juan@example.com' });
userStore.updatePreferences({ theme: 'light' });
userStore.logout();

// Login
await userStore.login({ email: 'user@example.com', password: 'password' });
```

## 📋 Exports Disponibles

### Exports Individuales
```javascript
// Plugins
import { TailwindScreen } from '@notsoweb/holos-tools';

// API
import { 
    api, token, apiURL, closeSession, 
    defineCsrfToken, defineApiToken, hasToken, 
    resetApiToken, useApi, useForm, useSearcher 
} from '@notsoweb/holos-tools';

// Page
import { 
    pagePlugin, page, defineApp, defineUser, 
    reloadApp, reloadUser, resetPage, logout, view 
} from '@notsoweb/holos-tools';

// Permissions
import { 
    bootPermissions, bootRoles, hasPermission, hasRole,
    reloadPermissions, reloadRoles, resetPermissions, 
    resetRoles, getAllPermissions, getAllRoles, getAllRolesIds 
} from '@notsoweb/holos-tools';
```

### Exports Agrupados (Alias)
```javascript
import { Api, Forms, Page, Permissions, Screen } from '@notsoweb/holos-tools';
```

### Exports Específicos
```javascript
// Acceso directo a módulos específicos
import TailwindScreen from '@notsoweb/holos-tools/Plugins/TailwindScreen';
import { api } from '@notsoweb/holos-tools/Services/Api';
import { page } from '@notsoweb/holos-tools/Services/Page';
import { hasPermission } from '@notsoweb/holos-tools/Services/RolePermission';
```

## 🔧 Dependencias

### Peer Dependencies
- **Vue.js** ^3.0.0
- **Axios** ^1.11.0

### Dependencias Opcionales
- **Pinia** (para usar los stores)
- **Toastr** (para notificaciones)

## 📝 Licencia

MIT © [Moisés Cortés C.](https://github.com/notsoweb)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/notsoweb/vue-holos-tools/issues)
- **Email**: moises.cortes@notsoweb.com
- **Documentación**: [GitHub Repository](https://github.com/notsoweb/vue-holos-tools)