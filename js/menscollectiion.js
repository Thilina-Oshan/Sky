// Highlight active category in sticky nav on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.category-nav .nav-link');

window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 80) {
            currentId = section.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
});
