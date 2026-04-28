// Updated Carousel Logic for 2 pages and manual buttons
let currentPage = 0;
const totalPages = 2; // Updated to 2 pages (2x2 grid)
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
    track.style.transform = `translateX(-${currentPage * (100 / totalPages)}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPage);
    });
}

let autoScroll = setInterval(nextPage, 8000);

function resetTimer() {
    clearInterval(autoScroll);
    autoScroll = setInterval(nextPage, 8000);
}