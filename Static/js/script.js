console.log("script.js carregado com sucesso!");

const debugEl = document.getElementById('debug-info');
const botoes = document.querySelectorAll('.btn-adaptativo');

// 1. Detector de sistema operacional (Runtime Detection)
const userAgent = navigator.userAgent || navigator.vendor || window.opera;
const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
const isAndroid = /android/i.test(userAgent);

const setDebugText = (texto) => {
  if (debugEl) debugEl.innerText = texto;
};

if (isIOS) {
  document.body.classList.add('ios-theme');
  setDebugText("Modo: iOS (Liquid Glass)");
} 

else if (isAndroid) {
  document.body.classList.add('android-theme');
  setDebugText("Modo: Android (Material 3)");
  
  // 2. Criação dinâmica do efeito Ripple com matemática corrigida
  botoes.forEach(botao => {
    botao.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;

      // getBoundingClientRect resolve o bug de colisão que você tinha
      const rect = this.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const rippleExistente = this.querySelector('.ripple');
      if (rippleExistente) { 
        rippleExistente.remove(); 
      }

      this.appendChild(circle);
    });
  });
} 

else {
  setDebugText("Modo: Desktop (Padrão)");
}