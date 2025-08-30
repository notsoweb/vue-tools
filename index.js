import TailwindScreen from "./plugins/tailwind-screen.js";
import * as Api from "./services/api.js";

export {
    apiURL,
    closeSession,
    defineApiToken,
    defineCsrfToken,
    hasToken,
    resetApiToken,
    useApi,
    useForm,
    useSearcher
} from './services/api.js';

export {
    defineApp,
    defineUser,
    reloadApp,
    reloadUser,
    logout,
    view,
} from './services/page.js';

export {
    bootPermissions,
    bootRoles,
    hasPermission,
    hasRole,
} from './services/role-permission.js';

export {
    Api,
    TailwindScreen,
};
