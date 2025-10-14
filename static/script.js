document.addEventListener('DOMContentLoaded', () => {
    // --- NEW: PWA Install Button Logic ---
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the browser's default install prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Show our custom install button
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the browser's install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
                // Hide the button
                installBtn.style.display = 'none';
            }
        });
    }
    // --- End of new PWA logic ---


    // --- OLD: Existing Logic ---
    // Page Loader Logic
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        });
    }

    // Scroll-in Animation for Cards
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

    // Back-to-Top Button Logic
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

    // Aurora background follows mouse
    if (document.body.classList.contains('theme-aurora')) {
        document.body.addEventListener('mousemove', e => {
            document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
    }
});
