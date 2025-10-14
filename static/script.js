document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBtn.style.display = 'none';
            }
        });
    }

    // --- Baaki ka code waisa hi hai ---
    const loader = document.getElementById('loader');
    if(loader){window.addEventListener('load', () => {loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 500);});}
    const backToTopButton = document.getElementById('back-to-top-btn');
    if(backToTopButton){window.onscroll = () => {if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {backToTopButton.style.display = 'block';} else {backToTopButton.style.display = 'none';}}; backToTopButton.addEventListener('click', () => {window.scrollTo({ top: 0, behavior: 'smooth' });});}
    if(document.body.classList.contains('theme-aurora')){document.body.addEventListener('mousemove', e => {document.body.style.setProperty('--mouse-x', `${e.clientX}px`); document.body.style.setProperty('--mouse-y', `${e.clientY}px`);});}
});
