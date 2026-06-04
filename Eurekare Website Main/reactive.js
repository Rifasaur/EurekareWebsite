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

// Partners Track Hover Effect, Pause on Hover
const partnersTrack = document.querySelector(".partners-track");

if (partnersTrack) {
    partnersTrack.addEventListener("mouseenter", () => {
      partnersTrack.style.animationPlayState = "paused";
    });

    partnersTrack.addEventListener("mouseleave", () => {
      partnersTrack.style.animationPlayState = "running";
    });
}

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

if (section && container) {
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
}

// Contact Us
function openContactUsModal() {
    document.getElementById('contactUsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // prevents background scroll
}

function closeContactUsModal() {
    document.getElementById('contactUsOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// About Us Modal Functions
function openAboutUsModal() {
    const modal = document.getElementById('aboutUsModal');
    if (modal) {
        modal.style.display = 'block'; // Make it exist
        document.body.style.overflow = 'hidden'; // Lock scrolling
        setTimeout(() => {
            modal.classList.add('is-visible');
        }, 10);
    }
}

function closeAboutUsModal() {
    const modal = document.getElementById('aboutUsModal');
    if (modal) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = ''; // Instantly restore browser default scroll rules
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500); 
    }
}

// Join the Team Modal 
function openJoinModal() {
    const modal = document.getElementById('joinTeamOverlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevents background body scrolling
    }
}

function closeJoinModal() {
    const modal = document.getElementById('joinTeamOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restores background window viewport scroll
    }
}

/* ==========================================================================
                            INTRO CAROUSEL
   ========================================================================== */
let heroCarouselTimer = null;
const heroSlideDuration = 15000; // 15 seconds strict loop timing

function switchHeroSlide(targetIndex) {
    const slides = document.querySelectorAll('#introduction .hero-slide');
    const dots = document.querySelectorAll('#introduction .hero-dot');
    
    if (slides.length === 0 || dots.length === 0) return;

    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (dots[idx]) dots[idx].classList.remove('active');
        
        // Stop and reset other videos
        const video = slide.querySelector('.hero-video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

    // Activate target slide and indicator dot
    slides[targetIndex].classList.add('active');
    if (dots[targetIndex]) dots[targetIndex].classList.add('active');

    // Play the video in the now-active slide
    const activeVideo = slides[targetIndex].querySelector('.hero-video');
    if (activeVideo) {
        activeVideo.play().catch(err => {
            console.log("Video play interrupted or blockaded by browser policy:", err);
        });
    }

    // Reset the interval timer upon slide transition (manually or automatically triggered)
    startHeroCarouselTimer();
}

function nextHeroSlide() {
    const slides = document.querySelectorAll('#introduction .hero-slide');
    if (slides.length === 0) return;

    let currentActiveIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentActiveIndex = index;
        }
    });

    // Loop cleanly back to 0 if at the end of the collection
    let nextIndex = (currentActiveIndex + 1) % slides.length;
    switchHeroSlide(nextIndex);
}

function startHeroCarouselTimer() {
    if (heroCarouselTimer) {
        clearInterval(heroCarouselTimer);
    }
    heroCarouselTimer = setInterval(nextHeroSlide, heroSlideDuration);
}

/* ==========================================================================
                        SERVICES SCROLL ANIMATIONS
   ========================================================================== */
const observerOptions = { threshold: 0.15 };

const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-row').forEach(row => {
    // Set initial hidden state
    row.style.opacity = "0";
    row.style.transform = "translateY(50px)";
    row.style.transition = "all 0.8s ease-out";
    
    // Create a visibility class
    serviceObserver.observe(row);
});

// Update the visibility logic
document.styleSheets[0].insertRule('.service-row.visible { opacity: 1 !important; transform: translateY(0) !important; }', 0);

/* ==========================================================================
                INITIALIZATION & FLOATING CONTACT PILL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Intro Carousel 15s Timer Loop
    const initialVideo = document.querySelector('.hero-slide.active .hero-video');
    if (initialVideo) {
        initialVideo.play().catch(err => console.log("Autoplay context notice:", err));
    }
    
    // Spin up the interval loops independent of playback state tracking
    startHeroCarouselTimer();

    // 2. Initialize Floating Contact Pill Observer
    const pill = document.getElementById('floatingContactPill');
    const servicesSection = document.querySelector('.services-section');

    const pillObserverOptions = {
        threshold: 0.1 
    };

    const pillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pill.classList.add('is-visible');
            } else {
                pill.classList.remove('is-visible');
            }
        });
    }, pillObserverOptions);

    if (servicesSection && pill) {
        pillObserver.observe(servicesSection);
    }
});

/* ==========================================================================
                            SERVICES MODAL
   ========================================================================== */
function openServicesModal(serviceType) {
    const modal = document.getElementById('servicesModal');
    const titleEl = document.getElementById('servicesModalTitle');
    const descEl = document.getElementById('servicesModalDescription');
    const imgEl = document.getElementById('servicesModalImage');

    const serviceData = {
        'e-konsulta': {
            title: "E-Konsulta Integration",
            img: "./images/About.jpg",
            desc: `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            `
        },
        'e-claims': {
            title: "E-Claims System",
            img: "./images/Diagram-Temporary-Placeholde.png",
            desc: `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            `
        },
        'mobile': {
            title: "Mobile Accessibility",
            img: "./images/Mobile.jpg",
            desc: `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>
            `
        }
    };

    const targetData = serviceData[serviceType] || serviceData['e-konsulta'];

    if (titleEl && imgEl && descEl) {
        titleEl.innerText = targetData.title;
        imgEl.src = targetData.img;
        descEl.innerHTML = targetData.desc;
    }

    if (modal) {
        modal.style.display = 'block'; 
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        setTimeout(() => {
            modal.classList.add('is-visible');
        }, 10);
    }
}

function closeServicesModal() {
    const modal = document.getElementById('servicesModal');
    if (modal) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = ''; // Restore browser scroll behavior
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500); // Wait for the stylesheet transitions to complete
    }
}

/* ==========================================================================
                           NAV DROPDOWN (Our Services)
   ========================================================================== */

function setDropdownOpen(dropdownEl, isOpen) {
    if (!dropdownEl) return;
    dropdownEl.classList.toggle('open', isOpen);

    const toggleBtn = dropdownEl.querySelector('.nav-dropdown-toggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(isOpen));
}

function initNavDropdown() {
    const dropdown = document.getElementById('servicesDropdown');
    if (!dropdown) return;

    const toggleBtn = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!toggleBtn || !menu) return;

    // Prevent double-binding on re-init
    if (dropdown.dataset.dropdownBound === 'true') return;
    dropdown.dataset.dropdownBound = 'true';

    // Click to toggle (works on desktop + mobile)
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        setDropdownOpen(dropdown, !isOpen);
    });

    // Prevent outside-click handler from immediately closing on toggle click
    toggleBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    // Handle dropdown item click => open modal (and close menu)
    menu.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-services-modal]');
        if (!link) return;

        const serviceType = link.getAttribute('data-services-modal');
        if (serviceType && typeof openServicesModal === 'function') {
            e.preventDefault();
            setDropdownOpen(dropdown, false);
            openServicesModal(serviceType);
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            setDropdownOpen(dropdown, false);
        }
    });

    // Close when resizing to desktop/mobile thresholds
    window.addEventListener('resize', () => {
        setDropdownOpen(dropdown, false);
    });
}

// Nav is injected into #header via fetch in each page, so we must init after injection.
// `DOMContentLoaded` is not enough.
document.addEventListener('DOMContentLoaded', () => {
    // Try init right away
    initNavDropdown();

    // Also try again shortly (covers cases where nav injection finishes after DOMContentLoaded)
    setTimeout(initNavDropdown, 50);
    setTimeout(initNavDropdown, 250);
    setTimeout(initNavDropdown, 1000);
});



