/**
 * Servicio de comunicación API
 * 
 * @author Moisés Cortés C. <moises.cortes@notsoweb.com>
 * @version 1.0.0
 */

import axios from 'axios';
import { reactive, ref } from 'vue';

axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;

/**
 * Códigos de falla
 */
const failCodes = [
    400,
    409,
    422
];

/**
 * Servidor a utilizar
 */
const token     = ref(localStorage.token);
const csrfToken = ref(localStorage.csrfToken);

/**
 * Define el token de la api
 */
const defineApiToken = (x) => {
    token.value = x;
    localStorage.token = x;
}

/**
 * Define CSRF token
 */
const defineCsrfToken = (x) => {
    csrfToken.value = x;
    localStorage.csrfToken = x;
}

/**
 * Define el token de la api
 */
const resetApiToken = () => {
    token.value = undefined;
    localStorage.removeItem('token');
}

/**
 * Reset CSRF token
 */
const resetCsrfToken = () => {
    csrfToken.value = undefined;
    localStorage.removeItem('csrfToken');
}

/**
 * Determina si el token tiene algo o no
 */
const hasToken = () => {
    return token.value !== undefined;
}

/**
 * Fuerza el cierre de la sesión
 */
const closeSession = () => {
    resetApiToken()
    resetCsrfToken()

    Notify.info(Lang('session.closed'))

    location.replace('/')
}

/**
 * API URL
 */
const apiURL = (url) => {
    return `${import.meta.env.VITE_API_URL}/api/${url}`;
}

/**
 * Asset URL
 */
const assetURL = (url) => {
    return `${import.meta.env.VITE_API_URL}/${url}`;
}

/**
 * Composición de llaves
 * 
 * Utilizado para transformar llaves en FormData
 */
function composeKey(parent, key) {
  return parent ? parent + '[' + key + ']' : key
}

/**
 * Instancia de la API de uso directo
 */
const api = {
    errors: {},
    hasErrors: false,
    processing: false,
    wasSuccessful: false,
    async load({
        method,
        url,
        apiToken = token.value,
        options = { 
            data:{},
            params:{}
        }
    }) {
        this.errors        = {};
        this.hasErrors     = false;
        this.processing    = true;
        this.wasSuccessful = false;

        try {
            console.log(options)
            if(options.hasOwnProperty('onStart')) {
                options.onStart();
            }

            let { data } = await axios({
                method: method,
                url,
                data: options.data,
                params: options.params,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                }
            });

            if(data.status == 'success') {
                this.wasSuccessful = true;

                if(options.hasOwnProperty('onSuccess')) {
                    options.onSuccess(data.data, data);
                }
            } else if(data.status == 'fail') {
                if(options.hasOwnProperty('onFail')) {
                    options.onFail(data.data);
                }
            }

            if(options.hasOwnProperty('onFinish')) {
                options.onFinish(data.data);
            }
        } catch (error) {
            console.error(error)

            this.hasErrors = true;

            let { response } = error

            // Código de sesión invalida
            if(response.status === 401 && response.data?.message == 'Unauthenticated.') {
                Notify.error(Lang('session.expired'));

                closeSession();

                return
            }

            // Fallas
            if(failCodes.includes(response.status)) {
                options.hasOwnProperty('onFail')
                    // ? options.onFail(response.data.data)
                    // : Notify.warning(response.data.errors.message);

                if(response.data?.errors != null) {
                    this.errors = response.data.errors;

                    for(let e in this.errors) {
                        Notify.error(this.errors[e])
                    }
                }
                
                return
            }
            

            if(options.hasOwnProperty('onError')) {
                options.onError(response.data);
            }

            if(response.data != null) {
                this.errors = response.data.errors;
            }
        }

        this.processing = false;
    },
    get(url, options) {
        this.load({
            method: 'get',
            url,
            options
        })
    },
    post(url, options) {
        this.load({
            method: 'post',
            url,
            options
        })
    },
    put(url, options) {
        this.load({
            method: 'put',
            url,
            options
        })
    },
    patch(url, options) {
        this.load('patch', {
            method: 'patch',
            url,
            options
        })
    },
    delete(url, options) {
        this.load({
            method: 'delete',
            url,
            options
        })
    },
    resource(resources, options) {
        this.post(apiURL('catalogs/get'), {
            ...options,
            data: resources
        })
    },
    download(url, file, params = {}) {
        axios({
            url: url,
            params: params,
            method: 'GET',
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        }).then((res) => {
            const href = URL.createObjectURL(res.data);
            const link = document.createElement('a');

            link.href = href;
            link.setAttribute('download', file);
            document.body.appendChild(link);
            link.click();
        
            document.body.removeChild(link);

            URL.revokeObjectURL(href);
        });
    },
}

/**
 * Instancia de la API
 */
const useApi = () => reactive({...api});

/**
 * Instancia de la API para formularios
 */
const useForm = (form = {}) =>  {
    // Permite agregar datos mediante una transformación
    let transform = (data) => data

    // Contador de archivos
    let filesCounter = 0

    // Procesar elementos del formulario
    const append = (formData, key, value) => {
        if(Array.isArray(value)) {
            return Array.from(value.keys()).forEach((index) => append(formData, composeKey(key, index), value[index]));
        } else if(value instanceof Date) {
            return formData.append(key, value.toISOString())
        } else if(value instanceof File) {
            filesCounter++
            return formData.append(key, value, value.name)
        } else if (value instanceof Blob) {
            return formData.append(key, value)
        } else if(typeof value === 'boolean') {
            return formData.append(key, value ? '1' : '0')
        } else if (typeof value === 'string') {
            return formData.append(key, value)
        } else if (typeof value === 'number') {
            return formData.append(key, `${value}`)
        } else if(value === null || value === undefined) {
            return formData.append(key, '')
        } else if (typeof value === 'object') {
            objectToFormData(formData, key, value);
        }
    }

     // Convertir objeto a elemento de FormData
    const objectToFormData = (formData, parentKey = null, value) => {
        value = value || {}
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            append(formData, composeKey(parentKey, key), value[key])
          }
        }

        return formData
    }

    // Transforma todos los datos
    const prepareData = (data) => {
        let formData = new FormData();

        for (let i in data) {
            append(formData, i, data[i]);
        }

        return formData;
    }

    return reactive({
        ...form,
        errors: {},
        hasErrors: false,
        processing: false,
        wasSuccessful: false,
        _inputs: Object.keys(form),
        _original: {
            ...form
        },
        reset() {
            for(let i in this._original) {
                this[i] = this._original[i]
            }

            this.errors = {};
            this.hasErrors = false;
            this.wasSuccessful = false;
        },
        data() {
            let data = {};

            for (let i in this) {
                if(typeof this[i] !== 'function' && this._inputs.includes(i)){
                    data[i] = this[i]
                }
            }

            return data;
        },
        transform(callback) {
            transform = callback

            return this
        },
        async load({
            method,
            url,
            apiToken = token.value,
            options = { 
                data:{},
                params:{}
            }
        }) {
            this.errors        = {};
            this.hasErrors     = false;
            this.processing    = true;
            this.wasSuccessful = false;

            try {
                if(options.hasOwnProperty('onStart')) {
                    options.onStart(options);
                }

                let { data } = await axios({
                    method: method,
                    url,
                    data: prepareData(transform(this.data())),
                    headers: {
                        'Content-Type': (filesCounter > 0)
                            ? 'multipart/form-data  boundary='
                            : 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${apiToken}`,
                        'X-CSRF-TOKEN': csrfToken.value
                    }
                });

                if(data.status == 'success') {
                    this.wasSuccessful = true;

                    if(options.hasOwnProperty('onSuccess')) {
                        options.onSuccess(data?.data);
                    }
                } else if(data.status == 'fail') {
                    if(options.hasOwnProperty('onFail')) {
                        options.onFail(data?.data);
                    }
                }

                if(options.hasOwnProperty('onFinish')) {
                    options.onFinish(data?.data);
                }
            } catch (error) {
                console.error(error);

                this.hasErrors = true;

                let { response } = error
                
                if(options.hasOwnProperty('onError')) {
                    options.onError(response);
                }

                if(response.data?.errors != null) {
                    this.errors = response.data.errors;

                    for(let e in this.errors) {
                        Notify.error(this.errors[e])
                    }
                }
            }

            this.processing = false;
        },
        fill(model) {
            this._inputs.forEach(element => {
                this[element] = (element == 'is_active')
                    ? (model[element] == 1)
                    : model[element] ?? this[element]
            });
        },
        get(url, options) {
            this.load({
                method: 'get',
                url,
                options
            })
        },
        post(url, options) {
            this.load({
                method: 'post',
                url,
                options
            })
        },
        put(url, options) {
            this.load({
                method: 'put',
                url,
                options
            })
        },
        patch(url, options) {
            this.load('patch', {
                method: 'patch',
                url,
                options
            })
        },
        delete(url, options) {
            this.load({
                method: 'delete',
                url,
                options
            })
        },
    })
}

/**
 * Instancia de a API para buscador
 */
const useSearcher = (options = {
    url: '',
    filters: () => ({})
}) => reactive({
    query: '',
    lastUrlPagination: '',
    errors: {},
    hasErrors: false,
    processing: false,
    wasSuccessful: false,
    async load({
        url,
        apiToken = token.value,
        filters,
    }) {
        this.errors = {};
        this.processing = true;
        this.hasErrors = false;
        this.wasSuccessful = false;

        try {
            if(options.hasOwnProperty('onStart')) {
                options.onStart();
            }

            let defaultFilters = {};

            if (typeof options.filters === 'function') {
                defaultFilters = options.filters();
            } else if (typeof options.filters === 'object' && options.filters !== null) {
                defaultFilters = options.filters;
            }

            let { data } = await axios({
                method: 'get',
                url,
                params: {
                    q: this.query,
                    ...filters,
                    ...defaultFilters
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                }
            });

            if(data.status == 'success') {
                this.wasSuccessful = true;

                if(options.hasOwnProperty('onSuccess')) {
                    options.onSuccess(data.data);
                }
            } else if(data.status == 'fail') {
                if(options.hasOwnProperty('onFail')) {
                    options.onFail(data.data);
                }
            }

            if(options.hasOwnProperty('onFinish')) {
                options.onFinish(data.data);
            }
        } catch (error) {
            console.error(error);

            this.hasErrors = true;

            let { response } = error

            // Código de sesión invalida
            if(response.status === 401 && response.data.message == 'Unauthenticated.') {
                Notify.error(Lang('session.expired'));
                closeSession();
                return
            }
            
            if(options.hasOwnProperty('onError')) {
                options.onError(response);
            }

            if(response.data?.errors != null) {
                this.errors = response.data.errors;
                for(let e in this.errors) {
                    Notify.error(this.errors[e])
                }
            }
        }

        this.processing = false;
    },
    pagination(url, filter = {}) {
        this.lastUrlPagination = url;
        this.load({
            url,
            filters : filter
        })
    },
    search(q = '', filter = {}) {
        this.query = q
        this.load({
            url: options.url,
            filters : filter
        })
    },
    refresh(filter = {}) {
        this.load({
            url: options.url,
            filters: filter
        })
    },
    refreshPagination(filter = {}) {
        if(this.lastUrlPagination != '') {
            this.load({
                url: this.lastUrlPagination,
                filters: filter
            })
        } else {
            this.load({
                url: options.url,
                filters: filter
            })
        }
    }
})

export {
    api,
    token,
    apiURL,
    assetURL,
    closeSession,
    defineCsrfToken,
    defineApiToken,
    hasToken,
    resetApiToken,
    useApi,
    useForm,
    useSearcher
}