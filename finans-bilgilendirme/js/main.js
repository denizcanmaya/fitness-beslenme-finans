// Modal yönetimi için fonksiyonlar
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Tüm modalları kapatma fonksiyonu
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
    document.body.style.overflow = 'auto';
}

// ESC tuşu ile modal kapatma
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Modal dışına tıklayınca kapatma
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// Smooth scroll fonksiyonu
function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const navbarHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll to top fonksiyonu
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Kartlara tıklama olayı ekleme
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top button
    const scrollToTopButton = document.getElementById('scrollToTop');
    
    if (scrollToTopButton) {
        // Scroll event listener
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopButton.classList.remove('opacity-0', 'invisible', 'translate-y-4');
                scrollToTopButton.classList.add('opacity-100', 'visible', 'translate-y-0');
            } else {
                scrollToTopButton.classList.add('opacity-0', 'invisible', 'translate-y-4');
                scrollToTopButton.classList.remove('opacity-100', 'visible', 'translate-y-0');
            }
        });

        // Click event listener
        scrollToTopButton.addEventListener('click', scrollToTop);
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Menü açıldığında scroll'u engelle
            if (!mobileMenu.classList.contains('hidden')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Mobile menü linklerine tıklandığında menüyü kapat
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        });
    }

    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            if (modalId) {
                openModal(modalId);
            }
        });
    });

    // Header sticky işlemi
    const header = document.querySelector('nav');
    const headerOffset = 100;

    window.addEventListener('scroll', () => {
        if (window.scrollY > headerOffset) {
            header.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'animate-fadeIn');
            header.classList.add('bg-dark-bg-secondary/95', 'backdrop-blur-sm');
        } else {
            header.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-50', 'animate-fadeIn');
            header.classList.remove('bg-dark-bg-secondary/95', 'backdrop-blur-sm');
        }
    });

    // Navbar linkleri için smooth scroll
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScroll(targetId);
        });
    });

    // Modal dışına tıklandığında kapatma
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const modalId = this.id;
                closeModal(modalId);
            }
        });
    });

    // ESC tuşu ile modal kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}); 