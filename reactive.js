function toggleSidebar() {
    const sidebar = document.getElementById('hubSidebar');
    sidebar.classList.toggle('collapsed');
    
    // Optional: Log to console to verify
    console.log("Sidebar toggled");
}

// Logic to automatically collapse on smaller screens
window.addEventListener('load', () => {
    const sidebar = document.getElementById('hubSidebar');
    if (sidebar && window.innerWidth < 768) { 
        sidebar.classList.add('collapsed');
    }
});

// Partners Track Hover Effect, Pause on Hover
const partnersTrack = document.querySelector(".partners-track");

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
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const damping = 20; 
        
        const translateX = mouseX / damping;
        const translateY = mouseY / damping;

        container.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });

    section.addEventListener('mouseleave', () => {
        container.style.transform = `translate(0px, 0px)`;
    });
}

// Contact Us
function openContactUsModal() {
    document.getElementById('contactUsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeContactUsModal() {
    document.getElementById('contactUsOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// About Us Modal Functions
function openAboutUsModal() {
    const modal = document.getElementById('aboutUsModal');
    const mainContent = document.querySelector('.fade-in-page');
    
    if (modal) {
        modal.style.display = 'block'; 
        document.body.style.overflow = 'hidden'; 
        
        if (mainContent) {
            mainContent.classList.add('page-blur');
        }

        setTimeout(() => {
            modal.classList.add('is-visible');
        }, 10);
    }
}

function closeAboutUsModal() {
    const modal = document.getElementById('aboutUsModal');
    const mainContent = document.querySelector('.fade-in-page');
    
    if (modal) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = ''; 
        
        if (mainContent) {
            mainContent.classList.remove('page-blur');
        }
        
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
        document.body.style.overflow = 'hidden'; 
    }
}

function closeJoinModal() {
    const joinForm = document.getElementById('joinTeamForm');
    if (joinForm) {
        joinForm.reset();
        const fileText = document.getElementById('fileUploadText');
        const fileLabel = document.getElementById('fileUploadLabel');
        if (fileText) {
            fileText.innerHTML = 'Choose a file (PDF, DOCX) <span style="color: #718096; font-size: 0.85rem;">(Optional)</span>';
        }
        if (fileLabel) {
            fileLabel.classList.remove('file-attached');
        }
    }
    const joinOverlay = document.getElementById('joinTeamOverlay');
    if (joinOverlay) {
        joinOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function closeContactModal() {
    const contactForm = document.getElementById('contactInquiryForm');
    if (contactForm) {
        contactForm.reset();
    }
    const contactOverlay = document.getElementById('contactUsOverlay');
    if (contactOverlay) {
        contactOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

/* ==========================================================================
                            INTRO CAROUSEL
   ========================================================================== */
let heroCarouselTimer = null;
const heroSlideDuration = 15000; 

function switchHeroSlide(targetIndex) {
    const slides = document.querySelectorAll('#introduction .hero-slide');
    const dots = document.querySelectorAll('#introduction .hero-dot');
    
    if (slides.length === 0 || dots.length === 0) return;

    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (dots[idx]) dots[idx].classList.remove('active');
        
        const video = slide.querySelector('.hero-video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

    slides[targetIndex].classList.add('active');
    if (dots[targetIndex]) dots[targetIndex].classList.add('active');

    const activeVideo = slides[targetIndex].querySelector('.hero-video');
    if (activeVideo) {
        activeVideo.play().catch(err => {
            console.log("Video play interrupted or blockaded by browser policy:", err);
        });
    }

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
                           RESPONSIVE WINDOW CONTROLLER
   ========================================================================== */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        
        if (typeof setDropdownOpen === 'function') {
            const dropdown = document.querySelector('.nav-dropdown');
            if (dropdown) setDropdownOpen(dropdown, false);
        }
        
        const sidebar = document.getElementById('hubSidebar');
        if (sidebar) {
            if (width < 768) {
                sidebar.classList.add('collapsed');
            } else {
                if (typeof closeModal === 'function') closeModal();
            }
        }
        console.log(`Viewport adjusted: ${width}px. Layout parameters synchronized.`);
    }, 150);
});

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
    row.style.opacity = "0";
    row.style.transform = "translateY(50px)";
    row.style.transition = "all 0.8s ease-out";
    serviceObserver.observe(row);
});

document.styleSheets[0].insertRule('.service-row.visible { opacity: 1 !important; transform: translateY(0) !important; }', 0);

/* ==========================================================================
                INITIALIZATION & FLOATING CONTACT PILL
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const initialVideo = document.querySelector('.hero-slide.active .hero-video');
    if (initialVideo) {
        initialVideo.play().catch(err => console.log("Autoplay context notice:", err));
    }
    startHeroCarouselTimer();

    const pill = document.getElementById('floatingContactPill');
    const servicesSection = document.querySelector('.services-section');
    const pillObserverOptions = { threshold: 0.1 };

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
    const mainContent = document.querySelector('.fade-in-page');

    if (modal) {
        modal.style.display = 'block'; 
        document.body.style.overflow = 'hidden'; 
        if (mainContent) mainContent.classList.add('page-blur');
        setTimeout(() => modal.classList.add('is-visible'), 10);
    }    

    const serviceData = {
        'e-konsulta': {
            title: "E-Konsulta Integration",
            img: "./images/About.jpg",
            desc: `<p>Lorem ipsum dolor sit amet...</p>`
        },
        'e-claims': {
            title: "E-Claims System",
            img: "./images/Diagram-Temporary-Placeholde.png",
            desc: `<p>Lorem ipsum dolor sit amet...</p>`
        },
        'mobile': {
            title: "Mobile Accessibility",
            img: "./images/Mobile.jpg",
            desc: `<p>Lorem ipsum dolor sit amet...</p>`
        }
    };

    const targetData = serviceData[serviceType] || serviceData['e-konsulta'];
    if (titleEl && imgEl && descEl) {
        titleEl.innerText = targetData.title;
        imgEl.src = targetData.img;
        descEl.innerHTML = targetData.desc;
    }
}

function closeServicesModal() {
    const modal = document.getElementById('servicesModal');
    const mainContent = document.querySelector('.fade-in-page');
    if (modal) {
        modal.classList.remove('is-visible');
        document.body.style.overflow = ''; 
        if (mainContent) mainContent.classList.remove('page-blur');
        setTimeout(() => { modal.style.display = 'none'; }, 500); 
    }
}

/* Reveal Animation for About Us Section */
document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.querySelector("#about-us-section");
    const aboutImage = document.querySelector(".about-us-bg");
    const options = { threshold: 0.15 };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutImage.classList.add("animate");
            } else {
                aboutImage.classList.remove("animate");
            }
        });
    }, options);

    if (aboutSection && aboutImage) observer.observe(aboutSection);
});

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

    if (dropdown.dataset.dropdownBound === 'true') return;
    dropdown.dataset.dropdownBound = 'true';

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        setDropdownOpen(dropdown, !isOpen);
    });

    toggleBtn.addEventListener('mousedown', (e) => e.stopPropagation());

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

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) setDropdownOpen(dropdown, false);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavDropdown();
    setTimeout(initNavDropdown, 50);
    setTimeout(initNavDropdown, 250);
});

/* ==========================================================================
                  CONFIRMATION MODAL ACTIONS & INTERACTION
   ========================================================================== */
function showConfirmationLoading() {
    const overlay = document.getElementById('confirmationModalOverlay');
    document.getElementById('confirmationHeader').style.backgroundColor = 'var(--eurekare-blue)';

    const iconBox = document.getElementById('confirmationIconContainer');
    iconBox.style.backgroundColor = 'rgba(0, 85, 164, 0.08)';
    iconBox.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin loading-icon"></i>';

    document.getElementById('confirmationStateLabel').innerText = 'Processing';
    document.getElementById('confirmationStateLabel').style.color = 'var(--eurekare-blue)';
    document.getElementById('confirmationTitleBody').innerText = 'Sending your request\u2026';
    document.getElementById('confirmationSubtitleBody').innerText = 'Please wait while we submit your request.';
    document.getElementById('confirmationMessage').innerText = 'We are validating your files and routing your message via secure SMTP servers.';
    document.getElementById('confirmationActions').style.display = 'none';

    document.body.style.overflow = 'hidden';
    overlay.classList.add('active');
}

function showConfirmationSuccess(message) {
    document.getElementById('confirmationHeader').style.backgroundColor = 'var(--eurekare-blue)';
    const iconBox = document.getElementById('confirmationIconContainer');
    iconBox.style.backgroundColor = 'rgba(0, 85, 164, 0.08)';
    iconBox.innerHTML = '<i class="fa-solid fa-circle-check success-icon"></i>';

    document.getElementById('confirmationStateLabel').innerText = 'Success';
    document.getElementById('confirmationStateLabel').style.color = 'var(--eurekare-blue)';
    document.getElementById('confirmationTitleBody').innerText = 'Submission Sent!';
    document.getElementById('confirmationSubtitleBody').innerText = 'Everything went through perfectly.';
    document.getElementById('confirmationMessage').innerText = message || 'Your details have been registered into our queue system successfully.';

    const actionsEl = document.getElementById('confirmationActions');
    actionsEl.innerHTML = `
        <button type="button" class="contact-us-btn-submit join-btn-submit" onclick="closeConfirmationModal()">
            Understood <i class="fa-solid fa-check"></i>
        </button>
    `;
    actionsEl.style.display = 'flex';
}

function showConfirmationError(message) {
    document.getElementById('confirmationHeader').style.backgroundColor = '#c62828';
    const iconBox = document.getElementById('confirmationIconContainer');
    iconBox.style.backgroundColor = 'rgba(198, 40, 40, 0.08)';
    iconBox.innerHTML = '<i class="fa-solid fa-circle-xmark error-icon"></i>';

    document.getElementById('confirmationStateLabel').innerText = 'Error';
    document.getElementById('confirmationStateLabel').style.color = '#c62828';
    document.getElementById('confirmationTitleBody').innerText = 'Submission Failed';
    document.getElementById('confirmationSubtitleBody').innerText = 'An error occurred while dispatching data.';
    document.getElementById('confirmationMessage').innerText = message || 'Please check your network connection and try submitting the form again.';

    const actionsEl = document.getElementById('confirmationActions');
    actionsEl.innerHTML = `
        <button type="button" class="contact-us-btn-back" onclick="closeConfirmationModal()">
            <i class="fa-solid fa-chevron-left"></i> Try Again
        </button>
    `;
    actionsEl.style.display = 'flex';
}

function closeConfirmationModal() {
    document.getElementById('confirmationModalOverlay').classList.remove('active');
    document.body.style.overflow = ''; 
}

// Intercept form submissions securely
document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'contactInquiryForm') {
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append('form_type', 'inquiry'); 
        executeFormAsyncSubmit(formData, e.target, 'contactUsOverlay');
    }
    
    if (e.target && e.target.id === 'joinTeamForm') {
        e.preventDefault();
        let formData = new FormData(e.target);
        formData.append('form_type', 'career'); // Matches 'career' flag expected by send-email.php
        executeFormAsyncSubmit(formData, e.target, 'joinTeamOverlay');
    }
});

function executeFormAsyncSubmit(formData, originalFormElement, originalModalId) {
    showConfirmationLoading();
    
    fetch('send-email.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Server network connection drop fault detected.');
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            showConfirmationSuccess(data.message);
            originalFormElement.reset(); 
            
            const fileText = document.getElementById('fileUploadText');
            const fileLabel = document.getElementById('fileUploadLabel');
            if (fileText) fileText.innerHTML = 'Choose a file (PDF, DOCX) <span style="color: #718096; font-size: 0.85rem;">(Optional)</span>';
            if (fileLabel) fileLabel.classList.remove('file-attached');
            
            const baseModalOverlay = document.getElementById(originalModalId);
            if (baseModalOverlay) baseModalOverlay.classList.remove('active');
        } else {
            showConfirmationError(data.message);
        }
    })
    .catch(error => {
        showConfirmationError(error.message);
    });
}

/* ==========================================================================
                  LIVE FILE UPLOAD ATTACHMENT INDICATOR 
   ========================================================================== */
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'joinResumeInput') {
        const fileInput = e.target;
        const fileText = document.getElementById('fileUploadText');
        const fileLabel = document.getElementById('fileUploadLabel');
        
        if (fileInput.files && fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            fileText.innerHTML = `Selected: <strong style="color: #0055a4; font-weight: 600;">${fileName}</strong>`;
            fileLabel.classList.add('file-attached');
        } else {
            fileText.innerHTML = 'Choose a file (PDF, DOCX) <span style="color: #718096; font-size: 0.85rem;">(Optional)</span>';
            fileLabel.classList.remove('file-attached');
        }
    }
});

/* ==========================================================================
                    INTERACTIVE ECARD MODAL CONTROLLER 
   ========================================================================== */
function openEcardModal() {
    const modal = document.getElementById('ecardModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeEcardModal(event) {
    const modal = document.getElementById('ecardModal');
    const cardInner = document.getElementById('modalCardInner');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (cardInner) {
            setTimeout(() => { cardInner.classList.remove('flipped'); }, 400);
        }
    }
}

function toggleModalCardFlip() {
    const cardInner = document.getElementById('modalCardInner');
    if (cardInner) cardInner.classList.toggle('flipped');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEcardModal();
});

/* ==========================================================================
                    YAKAP SIDEBAR WIDGET INTERACTION CONTROLLER
   ========================================================================== */
function toggleYakapWidget(event) {
    event.stopPropagation();
    const widget = document.getElementById('yakapSidebarWidget');
    if (widget) widget.classList.toggle('widget-hidden');
}

/* ==========================================================================
                            SCRIPT FOR FAQ
   ========================================================================== */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Scroll opacity + color effect
const firstSection = document.querySelector('main > section:first-child');
/* ==========================================================================
                            NAV INITIALIZER
   ========================================================================== */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    const threshold = firstSection ? firstSection.offsetHeight : 100;

    if (window.scrollY > threshold) {
        nav.classList.add('scrolled');
        nav.classList.remove('at-top');
    } else if (window.scrollY > 10) {
        nav.classList.remove('scrolled');
        nav.classList.add('at-top');
    } else {
        nav.classList.remove('scrolled', 'at-top');
    }
});