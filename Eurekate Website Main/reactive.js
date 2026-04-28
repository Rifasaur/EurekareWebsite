// Logic to handle visual transitions when scrolling
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    
    // Add a shadow to the header once the blue bar is hidden
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});