import axios from 'axios';
import { defineStore } from 'pinia'

// Almacén del modo oscuro
const useLoader = defineStore('loader', {
    state: () => ({
        processing: false
    }),
    getters: {
        isProcessing(state) {
            return state.processing
        }
    },
    actions: {
        boot() {
            axios.interceptors.request.use((config) => {
                this.processing = true
                return config;
            }, (error) => {
                this.processing = false
                return Promise.reject(error);
            });
            
            axios.interceptors.response.use((response) => {
                this.processing = false
                return response;
            }, (error) => {
                this.processing = false
                return Promise.reject(error);
            });
        }
    },
})

export default useLoader