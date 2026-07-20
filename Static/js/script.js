/* ==========================================
   1. DETECÇÃO DE SISTEMA (ROBUSTA)
   ========================================== */
function detectarSistema() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Identifica iPad (mesmo em modo desktop), iPhone ou Android
    const isIPad = (/iPad|iPhone|iPod/.test(userAgent)) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(userAgent);

    if (isIPad) {
        document.body.classList.add('ios-theme');
        console.log("Sistema detectado: iOS/iPadOS");
    } else if (isAndroid) {
        document.body.classList.add('android-theme');
        console.log("Sistema detectado: Android");
    } else {
        console.log("Sistema: Desktop padrão.");
    }
}
detectarSistema();

// Efeito Ripple apenas para Android
if (document.body.classList.contains('android-theme')) {
    document.querySelectorAll('.btn-adaptativo').forEach(botao => {
        botao.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;
            const rect = this.getBoundingClientRect();

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const rippleExistente = this.querySelector('.ripple');
            if (rippleExistente) rippleExistente.remove(); 
            this.appendChild(circle);
        });
    });
}

/* ==========================================
   2. INTEGRAÇÃO APPLE MUSIC API (VIA BFF PYTHON)
   ========================================== */
const carrosselContainer = document.querySelector('.carrossel_de_album');
const albumViewOverlay = document.getElementById('album-view');
const btnFecharAlbum = document.getElementById('btn-fechar-album');

if (btnFecharAlbum && albumViewOverlay) {
    btnFecharAlbum.addEventListener('click', () => {
        albumViewOverlay.classList.remove('ativa');
    });
}

async function construirCarrossel() {
    if (!carrosselContainer) return;

    try {
        const response = await fetch('/api/playlist');
        const data = await response.json();

        if (data.error) {
            carrosselContainer.innerHTML = `<p class="text-adaptativo" style="color: #ff4444;">${data.error}</p>`;
            return;
        }

        const tracks = data.results;
        carrosselContainer.innerHTML = '';

        tracks.forEach(track => {
            const trackName = track.trackName;
            const artistName = track.artistName;
            const coverImage = track.artworkUrl100.replace('100x100bb', '600x600bb');

            const itemDiv = document.createElement('div');
            itemDiv.className = 'album';
            
            itemDiv.innerHTML = `
                <div class="capa-wrapper surface-adaptativa">
                    <img class="img-album img-adaptativa" src="${coverImage}" alt="${trackName}">
                </div>
                <h3 class="text-adaptativo" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 160px;">${trackName}</h3>
                <p class="color-adaptativa--muted" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 160px;">${artistName}</p>
            `;

            itemDiv.addEventListener('click', () => {
                const detailImg = document.getElementById('detail-img');
                const detailTitle = document.getElementById('detail-title');
                const detailArtist = document.getElementById('detail-artist');
                const audioPlayer = document.getElementById('audio-player');
                const audioSource = audioPlayer.querySelector('source');

                detailImg.src = coverImage;
                detailTitle.textContent = trackName;
                detailArtist.textContent = artistName;
                
                audioSource.src = track.previewUrl; 
                audioPlayer.load();
                audioPlayer.play().catch(e => console.log("User interaction required for audio."));

                albumViewOverlay.classList.add('ativa');
            });

            carrosselContainer.appendChild(itemDiv);
        });

    } catch (error) {
        console.error(error);
        carrosselContainer.innerHTML = '<p class="text-adaptativo">Erro fatal na comunicação com o servidor Python.</p>';
    }
}

construirCarrossel();