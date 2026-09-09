document.addEventListener("DOMContentLoaded", () => {
    // Load Navbar component into the DOM
    fetch("/includes/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            
            // Initialize dropdown event listeners after navbar finishes loading
            initNavbarDropdowns();
        })
        .catch(error => console.error("Error loading navbar:", error));

    // Load Footer component into the DOM
    fetch("/includes/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});

// Dropdown Functionality Logic
function initNavbarDropdowns() {
    // Select all top-level dropdowns and nested sub-dropdown containers
    const dropdowns = document.querySelectorAll('.navbar-nav .dropdown, .dropdown-menu .dropend');

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector(':scope > .dropdown-menu');
        const toggleBtn = dropdown.querySelector(':scope > a');
        let timeoutId = null;

        if (!menu) return;

        // ==========================================
        // 1. DESKTOP VIEW (Hover Behavior)
        // ==========================================
        dropdown.addEventListener('mouseenter', function () {
            if (window.innerWidth >= 992) {
                clearTimeout(timeoutId);
                
                // Close any open sibling sub-menus on the same level
                const siblings = dropdown.parentElement.querySelectorAll(':scope > .dropend > .dropdown-menu');
                siblings.forEach(sibMenu => {
                    if (sibMenu !== menu) {
                        sibMenu.classList.remove('show', 'animate-in');
                    }
                });

                // Show and animate current dropdown menu
                menu.classList.add('show', 'animate-in');
                menu.classList.remove('animate-out');
            }
        });

        dropdown.addEventListener('mouseleave', function () {
            if (window.innerWidth >= 992) {
                menu.classList.add('animate-out');
                menu.classList.remove('animate-in');

                // Delay removal of visibility class until exit animation completes
                timeoutId = setTimeout(() => {
                    if (menu.classList.contains('animate-out')) {
                        menu.classList.remove('show', 'animate-out');
                    }
                }, 200); // Matches CSS transition duration (ms)
            }
        });

        // ==========================================
        // 2. MOBILE VIEW (Click / Tap Behavior)
        // ==========================================
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function (e) {
                if (window.innerWidth < 992) {
                    // Prevent page navigation and stop event bubbling
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other currently open sibling dropdown menus
                    const currentUl = dropdown.parentElement;
                    const openSiblings = currentUl.querySelectorAll(':scope > .dropend > .dropdown-menu.show, :scope > .dropdown > .dropdown-menu.show');
                    
                    openSiblings.forEach(sib => {
                        if (sib !== menu) {
                            sib.classList.remove('show');
                        }
                    });

                    // Toggle visibility of the current clicked sub-menu
                    menu.classList.toggle('show');
                }
            });
        }
    });
}