document.addEventListener("DOMContentLoaded", function () {

    // Updated Carousel Logic for 2 pages and manual buttons
    let currentPage = 0;
    const totalPages = 2;
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');

    function goToPage(pageIndex) {
        currentPage = pageIndex;
        updateCarousel();
        resetTimer();
    }

    function prevPage() {
        currentPage = (currentPage - 1 + totalPages) % totalPages;
        updateCarousel();
        resetTimer();
    }

    function nextPage() {
        currentPage = (currentPage + 1) % totalPages;
        updateCarousel();
        resetTimer();
    }

    function updateCarousel() {
        if (track) {
            track.style.transform = `translateX(-${currentPage * (100 / totalPages)}%)`;
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    let autoScroll = setInterval(nextPage, 8000);

    function resetTimer() {
        clearInterval(autoScroll);
        autoScroll = setInterval(nextPage, 8000);
    }

    // ---- Hero Carousel ----
    let heroCurrent = 0;
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero .dot');

    let heroAutoPlay = setInterval(() => heroMoveSlide(1), 4000);

    window.heroMoveSlide = function(dir) {
        heroGoToSlide((heroCurrent + dir + heroSlides.length) % heroSlides.length);
    }

    window.heroGoToSlide = function(index) {
        heroSlides[heroCurrent].classList.remove('active');
        heroDots[heroCurrent].classList.remove('active');

        heroCurrent = index;

        heroSlides[heroCurrent].classList.add('active');
        heroDots[heroCurrent].classList.add('active');

        clearInterval(heroAutoPlay);
        heroAutoPlay = setInterval(() => heroMoveSlide(1), 4000);
    }

    // Swiper JS
    const swiper = new Swiper('.partners-slider', {
        slidesPerView: 4,
        spaceBetween: 50,
        loop: true,
        display: 'center',

        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },

        breakpoints: {
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
        }
    });

});

function toggleSidebar() {
    const sidebar = document.getElementById('hubSidebar');
    sidebar.classList.toggle('collapsed');
    
    // Optional: Log to console to verify
    console.log("Sidebar toggled");
}

// Logic to automatically collapse on smaller screens
window.addEventListener('load', () => {
    if (window.innerWidth < 768) {
        document.getElementById('hubSidebar').classList.add('collapsed');
    }
});

// Contact Us

function openContactUsModal() {
    document.getElementById('contactUsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // prevents background scroll
}

function closeContactUsModal() {
    document.getElementById('contactUsOverlay').classList.remove('active');
    document.body.style.overflow = '';
}