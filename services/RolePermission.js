import { ref } from 'vue';
import { api } from './Api.js';

const permissionsInit = ref(false)
const allPermissions  = ref([])
const rolesInit = ref(false)
const allRoles = ref([])
const allRolesIds = ref([])

/**
 * Permite consultar si un usuario tiene un permiso especifico
 */
const hasPermission = (can) => {
    let verifyPermissions = can.split('|');

    for (let permision in verifyPermissions) {
        if(allPermissions.value.indexOf(verifyPermissions[permision]) != -1) {
            return true;
        }
    }
    
    return false;
}

const hasRole = (role) => {
    let verifyRoles = role.split('|');

    for (let role in verifyRoles) {
        if(allRoles.value.indexOf(verifyRoles[role]) != -1) {
            return true;
        }
    }

    return false;
}

const bootPermissions = () => {
    return new Promise((resolve, reject) => {
        if (!permissionsInit.value) {
            api.get(route('user.permissions'), {
                onSuccess: (res) => {
                    loadPermissions(res.permissions)

                    resolve(true)
                },
                onFinish: () => {
                    permissionsInit.value = true;
                },
                onError: () => {
                    reject(false)
                }
            })
        }
    })
}

const bootRoles = () => {
    return new Promise((resolve, reject) => {
        if (!rolesInit.value) {
            api.get(route('user.roles'), {
                onSuccess: (res) => {
                    loadRoles(res.roles)

                    resolve(true)
                },
                onFinish: () => {
                    rolesInit.value = true;
                },
                onError: () => {
                    reject(false)
                }
            })
        }
    })
}

const reloadPermissions = () => {
    permissionsInit.value = false;

    bootPermissions()
}

const reloadRoles = () => {
    rolesInit.value = false;

    bootRoles()
}

const resetPermissions = () => {
    allPermissions.value = [];
    permissionsInit.value = false;
}

const resetRoles = () => {
    allRoles.value = [];
    rolesInit.value = false;
}

const loadPermissions = (permissionList = []) => {
    // Permisos cargados
    let currentPermissions = [];

    if (permissionList.length > 0) {
        permissionList.forEach(element => {
            currentPermissions.push(element.name)
        });
    }

    allPermissions.value = currentPermissions;
}

const loadRoles = (roleList = []) => {
    if (roleList.length > 0) {
        roleList.forEach(element => {
            allRoles.value.push(element.name)
            allRolesIds.value.push(element.id)
        });
    }
}

const getAllPermissions = () => {
    return allPermissions.value;
}

const getAllRoles = () => {
    return allRoles.value;
}

const getAllRolesIds = () => {
    return allRolesIds.value;
}

export {
    bootPermissions,
    bootRoles,
    hasPermission,
    hasRole,
    reloadPermissions,
    reloadRoles,
    resetPermissions,
    resetRoles,
    getAllPermissions,
    getAllRoles,
    getAllRolesIds
};