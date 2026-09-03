document.addEventListener("DOMContentLoaded", () => {
    // Load Navbar component
    fetch("/pages/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));

    // Load Footer component
    fetch("/pages/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});


// Function to highlight active navbar link based on current page URL
document.addEventListener("DOMContentLoaded", function () {
    // Get current page path (e.g., "/collection.html" or "/index.html")
    const currentPath = window.location.pathname;

    // Select all navigation links inside the navbar
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    // Loop through each navbar link
    navLinks.forEach(link => {
        // Get the href attribute of the link
        const linkHref = link.getAttribute("href");

        // Check if user is on index.html, root path (/), or other pages
        const isHome = (currentPath === "/" || currentPath.endsWith("index.html")) && (linkHref.endsWith("index.html") || linkHref === "/");
        const isOtherPage = currentPath.endsWith(linkHref) && linkHref !== "index.html" && linkHref !== "/";

        if (isHome || isOtherPage) {
            // Add 'active' class to highlight current page link
            link.classList.add("active");
            // Set aria-current attribute for accessibility
            link.setAttribute("aria-current", "page");
        } else {
            // Remove 'active' class from non-active links
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
});

