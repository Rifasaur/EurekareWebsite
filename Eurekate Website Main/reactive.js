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

const moduleData = {
    1: { title: "PhilHealth Integration", desc: "Automated YAKAP & eClaims processing.", img: "p1.png" },
    2: { title: "Mobile App", desc: "Patient access and engagement module.", img: "p2.png" },
    3: { title: "Pharmacy Module", desc: "Inventory and dispensing management.", img: "p3.png" },
    4: { title: "HIS", desc: "Hospital Information System integration.", img: "p4.png" },
    5: { title: "Healthcare Card", desc: "Access and identity management.", img: "p5.png" },
    6: { title: "RadiSen", desc: "AI Diagnostics and Triage system.", img: "p6.png" }
};

// Store the original default content
const defaultTitle = "eCARE EMR (Central Hub)";
const defaultDesc = "Select a module from the diagram to view details.";

function selectModule(id) {
    const data = moduleData[id];
    const icon = document.getElementById(`icon${id}`);
    const isAlreadySelected = icon.classList.contains('selected');

    // 1. If the same icon is clicked again, DESELECT
    if (isAlreadySelected) {
        deselectAll();
        return; // Exit the function early
    }

    // 2. Otherwise, SELECT the new icon
    document.querySelectorAll('.hub-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');

    // Update Desktop Sidebar
    if (window.innerWidth > 768) {
        document.getElementById('sideTitle').innerText = data.title;
        document.getElementById('sideDesc').innerText = data.desc;
        document.getElementById('hubSidebar').classList.remove('collapsed');
    } else {
        showModal(data);
    }
}

function deselectAll() {
    // Remove selected class from all icons
    document.querySelectorAll('.hub-icon').forEach(i => i.classList.remove('selected'));
    
    // Reset Sidebar to default text
    document.getElementById('sideTitle').innerText = defaultTitle;
    document.getElementById('sideDesc').innerText = defaultDesc;
    
    // Optional: Collapse sidebar on deselect (uncomment if desired)
    // document.getElementById('hubSidebar').classList.add('collapsed');
}

function showModal(data) {
    const modal = document.getElementById('mobileModal');
    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <img src="${data.img}" style="width:100px;">
        <h2>${data.title}</h2>
        <p>${data.desc}</p>
    `;
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('mobileModal').style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('mobileModal');
    if (event.target == modal) modal.style.display = "none";
}
const container = document.getElementById('tiltContainer');
const section = document.querySelector('.hub-section');

section.addEventListener('mousemove', (e) => {
    // Get the dimensions of the section
    const rect = section.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the section (0 to 1)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Movement intensity (Increase for more movement, decrease for subtle)
    const damping = 20; 
    
    const translateX = mouseX / damping;
    const translateY = mouseY / damping;

    // Apply the transformation
    container.style.transform = `translate(${translateX}px, ${translateY}px)`;
});

// Reset position when mouse leaves the section
section.addEventListener('mouseleave', () => {
    container.style.transform = `translate(0px, 0px)`;
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
