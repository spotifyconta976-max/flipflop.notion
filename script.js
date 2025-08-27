class FlipClock {
    constructor() {
        this.previousTime = {
            hour1: '',
            hour2: '',
            min1: '',
            min2: '',
            sec1: '',
            sec2: ''
        };
        this.isAnimating = {};
        this.init();
    }

    init() {
        // Inicializa imediatamente
        this.updateTime();
        this.setupEventListeners();
        
        // Atualiza o relógio a cada segundo
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const currentDigits = {
            hour1: hours[0],
            hour2: hours[1],
            min1: minutes[0],
            min2: minutes[1],
            sec1: seconds[0],
            sec2: seconds[1]
        };
        
        // Atualiza cada dígito individualmente
        Object.keys(currentDigits).forEach(key => {
            this.updateDigit(key, currentDigits[key], this.previousTime[key]);
            this.previousTime[key] = currentDigits[key];
        });
    }

    updateDigit(elementId, newValue, oldValue) {
        // Evita animações sobrepostas
        if (this.isAnimating[elementId]) {
            return;
        }
        
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const front = element.querySelector('.flip-card-front');
        const back = element.querySelector('.flip-card-back');
        
        if (!front || !back) return;
        
        // Se o valor mudou e não é a primeira inicialização
        if (newValue !== oldValue && oldValue !== '') {
            this.isAnimating[elementId] = true;
            
            // Prepara o novo valor na parte de trás
            back.textContent = newValue;
            
            // Remove classe anterior se existir
            element.classList.remove('flipping');
            
            // Força reflow
            element.offsetHeight;
            
            // Adiciona a classe de flip
            element.classList.add('flipping');
            
            // Após a animação, atualiza a frente e remove a classe
            setTimeout(() => {
                front.textContent = newValue;
                element.classList.remove('flipping');
                this.isAnimating[elementId] = false;
            }, 300);
        } else {
            // Se não mudou ou é a primeira vez, apenas atualiza sem animação
            front.textContent = newValue;
            back.textContent = newValue;
        }
    }

    setupEventListeners() {
        // Botão de tela cheia
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        fullscreenBtn.addEventListener('click', this.toggleFullscreen);
        
        // Tecla F11 para tela cheia
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // Tecla ESC para sair da tela cheia
            if (e.key === 'Escape' && document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
        
        // Atualiza o texto do botão quando entra/sai da tela cheia
        const fullscreenEvents = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange'
        ];
        
        fullscreenEvents.forEach(event => {
            document.addEventListener(event, () => {
                const btn = document.getElementById('fullscreen-btn');
                if (this.isFullscreen()) {
                    btn.textContent = '⛶ Sair da Tela Cheia';
                } else {
                    btn.textContent = '⛶ Tela Cheia';
                }
            });
        });
    }

    toggleFullscreen() {
        if (!this.isFullscreen()) {
            this.enterFullscreen().catch(err => {
                console.log('Erro ao entrar em tela cheia:', err);
                // Fallback para dispositivos que não suportam fullscreen
                this.simulateFullscreen();
            });
        } else {
            this.exitFullscreen().catch(err => {
                console.log('Erro ao sair da tela cheia:', err);
                this.exitSimulatedFullscreen();
            });
        }
    }

    isFullscreen() {
        return !!(document.fullscreenElement || 
                 document.webkitFullscreenElement || 
                 document.mozFullScreenElement || 
                 document.msFullscreenElement ||
                 document.body.classList.contains('simulated-fullscreen'));
    }

    enterFullscreen() {
        const element = document.documentElement;
        
        if (element.requestFullscreen) {
            return element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            return element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            return element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            return element.msRequestFullscreen();
        } else {
            return Promise.reject('Fullscreen não suportado');
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            return document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            return document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            return document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            return document.msExitFullscreen();
        } else {
            return Promise.reject('Exit fullscreen não suportado');
        }
    }

    simulateFullscreen() {
        document.body.classList.add('simulated-fullscreen');
        const btn = document.getElementById('fullscreen-btn');
        btn.textContent = '⛶ Sair da Tela Cheia';
    }

    exitSimulatedFullscreen() {
        document.body.classList.remove('simulated-fullscreen');
        const btn = document.getElementById('fullscreen-btn');
        btn.textContent = '⛶ Tela Cheia';
    }
}

// Inicializa o relógio quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    new FlipClock();
});

