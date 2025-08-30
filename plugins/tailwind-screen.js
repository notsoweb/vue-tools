/**
 * Calcula u obtiene el tamaño de pantalla del dispositivo actual
 */
class TailwindScreen {
    constructor(){}

    isXs = () => (screen.width < 640) ? true : false;

    isSm = () => (screen.width >= 640 && screen.width < 768) ? true : false;

    isMd = () => (screen.width >= 768 && screen.width < 1024) ? true : false;

    isLg = () => (screen.width >= 1024 && screen.width < 1280) ? true : false;

    isXl = () => (screen.width >= 1280 && screen.width < 1536) ? true : false;
    
    is2Xl = () => (screen.width >= 1536) ? true : false;

    /**
     * Obtiene el tamaño de pantalla que usa tailwind
     */
    getScreen = () => {
        if(this.isXs()) {
            return 'xs';
        }
        
        if(this.isSm()) {
            return 'sm';
        }

        if(this.isMd()) {
            return 'md';
        }

        if(this.isLg()) {
            return 'lg';
        }

        if(this.isXl()) {
            return 'xl';
        }

        if(this.is2Xl()) {
            return '2xl';
        }
    }

    /**
     * Pregunta si es un tipo de dispositivo
     * 
     * @param {*} device Tipo de dispositivo 
     */
    isDevice(device) {
        switch (device) {
            case 'phone':
                if(this.isXs() || this.isSm()) {
                    return true;
                }
                break;
            case 'tablet':
                if(this.isMd()) {
                    return true;
                }
                break;
            case 'pc':
                if(this.isLg() || this.isXl() || this.is2Xl()) {
                    return true;
                }
                break;
        
            default:
                break;
        }
            
        return false;
    }

    /**
     * Obtiene el tipo de dispositivo y la variante
     */
    getDevice() {
        if(this.isXs() || this.isSm()) {
            return 'phone';
        }
        
        if(this.isMd()) {
            return 'tablet';
        }

        if(this.isLg()) {
            return 'pc-sm';
        }

        if(this.isXl()) {
            return 'pc-md';
        }

        if(this.is2Xl()) {
            return 'pc-lg';
        }
    }
}

export default TailwindScreen