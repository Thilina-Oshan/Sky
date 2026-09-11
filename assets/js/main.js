document.addEventListener("DOMContentLoaded", () => {
    // Load Navbar component dynamically
    fetch("/includes/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            
            // Re-initialize Bootstrap dropdowns for dynamic HTML
            const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
            dropdownElementList.forEach(dropdownToggle => {
                new bootstrap.Dropdown(dropdownToggle);
            });

            // Initialize custom hover dropdown behavior
            initDropdowns();
        })
        .catch(error => console.error("Error loading navbar:", error));

    // Load Footer component dynamically
    fetch("/includes/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});

// Function to handle desktop hover interactions for dropdowns
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.navbar-nav .dropdown, .dropdown-menu .dropend');

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector(':scope > .dropdown-menu');
        let timeoutId = null;

        if (!menu) return;

        // Mouse Enter event for desktop devices
        dropdown.addEventListener('mouseenter', function () {
            if (window.innerWidth >= 992) {
                clearTimeout(timeoutId);
                
                // Close open sibling submenus
                const siblings = dropdown.parentElement.querySelectorAll(':scope > .dropend > .dropdown-menu');
                siblings.forEach(sibMenu => {
                    if (sibMenu !== menu) {
                        sibMenu.classList.remove('show', 'animate-in');
                    }
                });

                menu.classList.add('show', 'animate-in');
                menu.classList.remove('animate-out');
            }
        });

        // Mouse Leave event for desktop devices
        dropdown.addEventListener('mouseleave', function () {
            if (window.innerWidth >= 992) {
                menu.classList.add('animate-out');
                menu.classList.remove('animate-in');

                timeoutId = setTimeout(() => {
                    if (menu.classList.contains('animate-out')) {
                        menu.classList.remove('show', 'animate-out');
                    }
                }, 200);
            }
        });
    });
}