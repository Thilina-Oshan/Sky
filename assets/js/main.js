document.addEventListener("DOMContentLoaded", () => {
    // Load Navbar component
    fetch("/includes/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));

    // Load Footer component
    fetch("/includes/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});

document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.navbar-nav .dropdown, .dropdown-menu .dropend');

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector(':scope > .dropdown-menu');
        let timeoutId = null;

        if (!menu) return;

        // Mouse Enter (Desktop)
        dropdown.addEventListener('mouseenter', function () {
            if (window.innerWidth >= 992) {
                clearTimeout(timeoutId);
                
                // Close sibling open menus
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

        // Mouse Leave (Desktop)
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
});

