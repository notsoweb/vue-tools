import { defineStore } from 'pinia'

// Almacenar estado de la barra lateral derecha
const useRightSidebar = defineStore('right-sidebar', {
    state: () => ({
        isActive: false
    }),
    getters: {
        isOpened(state) {
            return state.isActive === true;
        },
        isClosed(state) {
            return state.isActive === false;
        }
    },
    actions: {
        open() {
            this.apply(true);
        },
        close() {
            this.apply(false);
        },
        toggle() {
            this.apply(!this.isActive)
        },
        apply(state) {
            this.isActive = state
            localStorage.rightSidebar = state
        }
    },
})

export default useRightSidebar