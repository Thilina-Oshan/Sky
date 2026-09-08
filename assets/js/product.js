document.addEventListener('DOMContentLoaded', () => {
    let cartCount = 0;
    const cartBadge = document.getElementById('cartCount');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Add to Cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            cartBadge.textContent = cartCount;

            // Simple button feedback
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.classList.replace('btn-outline-primary', 'btn-success');

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.replace('btn-success', 'btn-outline-primary');
            }, 1000);
        });
    });
});