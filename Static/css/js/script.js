console.log("script.js carregado com sucesso!");

const debugEl = document.getElementById('debug-info');
const botao = document.getElementById('meu-botao');

// 1. Detector de sistema operacional (Runtime Detection)
const userAgent = navigator.userAgent || navigator.vendor || window.opera;
const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
const isAndroid = /android/i.test(userAgent);

if (isIOS) {
  document.body.classList.add('ios-theme');
  debugEl.innerText = "Modo: iOS (Liquid Glass)";
} else if (isAndroid) {
  document.body.classList.add('android-theme');
  debugEl.innerText = "Modo: Android (Material 3)";
  
  // 2. Criação dinâmica do efeito Ripple exclusivo para Android
  botao.addEventListener('click', function(e) {
    const circle = document.createElement('span');
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = this.getElementsByClassName('ripple')[0];
    if (ripple) { 
      ripple.remove(); 
    }

    this.appendChild(circle);
  });
} else {
  debugEl.innerText = "Modo: Desktop (Padrão)";
}