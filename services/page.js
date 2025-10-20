import { reactive } from "vue";
import { api, closeSession } from './api.js';
import { resetPermissions } from './role-permission.js';

/**
 * Cache
 * 
 * Permite cargar los datos una vez para la sesión actual. Se mantienen mientras
 * no se recargue la página.
 */
const page = reactive({
    lang: 'es',
    app: {},
    user: {
        id: 0,
        name: 'public'
    }
})

/**
 * Recarga datos en cache
 */
const reloadApp = () => {
    const user = localStorage.user
    const app = localStorage.app

    if(user) {
        page.user = JSON.parse(user);
    }

    if(app) {
        page.app = JSON.parse(app);
    }
}

/**
 * Limpiar sesión de usuario
 */
const resetPage = () => {
    localStorage.removeItem('user');
}

/**
 * Permite buscar una opcionalmente
 */
const view = ({
    name = '',
    params = {},
    query = {},
}) => ({
    name: name,
    params,
    query,
})

/**
 * Almacenar datos usuario
 */
const defineUser = (user) => {
    localStorage.user = JSON.stringify({
        id: user.id,
        name: user.name,
        lastname: `${user.paternal} ${user?.maternal ?? ''}`,
        email: user.email,
        phone: user.phone,
        profile_photo_url: user.profile_photo_url,
        profile_photo_path: user.profile_photo_path,
    });
}

/**
 * Definir datos de la aplicación
 */
const defineApp = (app) => {
    localStorage.app = JSON.stringify(app);
}

/**
 * Instalar el componente de forma nativa
 */
const pagePlugin = {
    install: (app, options) => {
        app.config.globalProperties.$page = page;
        app.config.globalProperties.$view = view;
    }
}

/**
 * Reload user
 */
const reloadUser = () => {
    return api.get(route('user.show'), {
        onSuccess: (r) => {
            defineUser(r.user)
            reloadApp()

            return r.user;
        }
    });
}

/**
 * Cerrar sesión
 */
const logout = () => {
    resetPermissions()
    resetPage()
  
    api.post(route('auth.logout'), {
      onSuccess: (r) => {
        if(r.is_revoked === true) {
          closeSession()

          location.replace('/auth')
        }
      }
    });
};

export {
    pagePlugin,
    page,
    defineApp,
    defineUser,
    reloadApp,
    reloadUser,
    resetPage,
    logout,
    view
}