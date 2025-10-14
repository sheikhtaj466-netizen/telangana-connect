document.addEventListener('DOMContentLoaded', () => {
    // --- FINAL PWA Install Button Logic ---
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt event fired.');
        e.preventDefault();
        deferredPrompt = e;

        if (installBtn) {
            // Change button to "Install App"
            installBtn.disabled = false;
            installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                installBtn.style.display = 'none'; // Hide button after interaction
            }
        });
    }

    // Hide button if app is already installed
    window.addEventListener('appinstalled', () => {
        console.log('App was installed.');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
    // --- End of PWA logic ---


    // --- Existing Logic (No changes below) ---
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        });
    }

    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.remove('hidden');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach((card, index) => {
            card.classList.add('hidden');
            card.style.animationDelay = `${index * 100}ms`;
            observer.observe(card);
        });
    }

    const backToTopButton = document.getElementById('back-to-top-btn');
    if (backToTopButton) {
        window.onscroll = () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        };
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (document.body.classList.contains('theme-aurora')) {
        document.body.addEventListener('mousemove', e => {
            document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }
});
