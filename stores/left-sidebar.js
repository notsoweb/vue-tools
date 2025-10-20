import { defineStore } from 'pinia'

// Almacenar estado de la barra lateral derecha
const useLeftSidebar = defineStore('left-sidebar', {
    state: () => ({
        isActive: true
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
        boot() {
            this.apply(localStorage.leftSidebar == 'true');
        },
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
            localStorage.leftSidebar = state
        }
    }
})

export default useLeftSidebar