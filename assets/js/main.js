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
        const toggleBtn = dropdown.querySelector(':scope > a');
        let timeoutId = null;

        if (!menu) return;

        // ==========================================
        // 1. DESKTOP VIEW (Hover Behavior)
        // ==========================================
        dropdown.addEventListener('mouseenter', function () {
            if (window.innerWidth >= 992) {
                clearTimeout(timeoutId);
                
                // Sibling sub-menus වහන්න
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

        // ==========================================
        // 2. MOBILE VIEW (Click/Tap Behavior)
        // ==========================================
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function (e) {
                if (window.innerWidth < 992) {
                    // Sub-menu එකක් තියෙන Link එකක් නම් (Men's / Women's) Link එකට යන්නේ නැතුව Dropdown එක Open කරන්න
                    if (dropdown.classList.contains('dropend') || dropdown.classList.contains('dropdown')) {
                        e.preventDefault();
                        e.stopPropagation();

                        // වෙනත් Open වී ඇති Sub-menus වහන්න
                        const openSiblings = dropdown.parentElement.querySelectorAll('.dropdown-menu.show');
                        openSiblings.forEach(sib => {
                            if (sib !== menu && !sib.contains(menu)) {
                                sib.classList.remove('show');
                            }
                        });

                        // Current Dropdown Toggle කරන්න
                        menu.classList.toggle('show');
                    }
                }
            });
        }
    });
});