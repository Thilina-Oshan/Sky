(function () {
    // Sample product data — replace with data fetched via query param / API (e.g. product-detail.html?id=1)
    const product = {
        id: 1,
        name: 'Classic Crew Neck T-Shirt',
        category: 'Tops',
        collection: "Men's Collection",
        collectionUrl: '/menscollection.html',
        price: 800,
        originalPrice: 1000,
        stock: 45,
        images: [
            'https://placehold.co/700x875?text=Product+Image+1',
            'https://placehold.co/700x875?text=Product+Image+2',
            'https://placehold.co/700x875?text=Product+Image+3',
            'https://placehold.co/700x875?text=Product+Image+4'
        ]
    };

    const relatedProducts = [
        { name: 'Pique Polo Shirt', price: 1200, image: 'https://placehold.co/500x600?text=Polo+Shirt' },
        { name: 'Pullover Hoodie', price: 2500, image: 'https://placehold.co/500x600?text=Hoodie' },
        { name: 'Crewneck Sweater', price: 2200, image: 'https://placehold.co/500x600?text=Sweater' },
        { name: 'Skinny Fit Jeans', price: 3200, image: 'https://placehold.co/500x600?text=Skinny+Jeans' }
    ];

    // --- Populate breadcrumb & basic info ---
    document.getElementById('breadcrumbCollection').textContent = product.collection;
    document.getElementById('breadcrumbCollection').href = product.collectionUrl;
    document.getElementById('breadcrumbProduct').textContent = product.name;
    document.getElementById('productCategoryTag').textContent = product.category;
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productPrice').textContent = `Rs ${product.price.toLocaleString()}`;
    if (product.originalPrice && product.originalPrice > product.price) {
        document.getElementById('productOriginalPrice').textContent = `Rs ${product.originalPrice.toLocaleString()}`;
    } else {
        document.getElementById('productOriginalPrice').style.display = 'none';
    }

    // --- Stock status ---
    const stockEl = document.getElementById('stockStatus');
    const qtyInput = document.getElementById('qtyInput');
    if (product.stock <= 0) {
        stockEl.textContent = 'Out of Stock';
        stockEl.className = 'stock-status out-stock mb-3';
        document.getElementById('addToCartBtn').disabled = true;
        qtyInput.disabled = true;
    } else if (product.stock < 10) {
        stockEl.textContent = `Only ${product.stock} left in stock`;
        stockEl.className = 'stock-status low-stock mb-3';
        qtyInput.max = product.stock;
    } else {
        stockEl.textContent = `In Stock — ${product.stock} available`;
        stockEl.className = 'stock-status in-stock mb-3';
        qtyInput.max = product.stock;
    }

    // --- Gallery ---
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailRow = document.getElementById('thumbnailRow');

    mainImage.src = product.images[0];
    thumbnailRow.innerHTML = product.images.map((src, idx) => `
                <div class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-src="${src}">
                    <img src="${src}" alt="Thumbnail ${idx + 1}">
                </div>
            `).join('');

    thumbnailRow.addEventListener('click', function (e) {
        const item = e.target.closest('.thumbnail-item');
        if (!item) return;
        mainImage.src = item.getAttribute('data-src');
        thumbnailRow.querySelectorAll('.thumbnail-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
    });

    // --- Color swatches ---
    const colorSwatches = document.querySelectorAll('.color-options .color-swatch');
    const selectedColorLabel = document.getElementById('selectedColorLabel');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function () {
            colorSwatches.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedColorLabel.textContent = this.getAttribute('data-color');
        });
    });

    // --- Quantity selector ---
    const qtyDecrease = document.getElementById('qtyDecrease');
    const qtyIncrease = document.getElementById('qtyIncrease');

    qtyDecrease.addEventListener('click', function () {
        const current = parseInt(qtyInput.value, 10) || 1;
        if (current > 1) qtyInput.value = current - 1;
    });

    qtyIncrease.addEventListener('click', function () {
        const current = parseInt(qtyInput.value, 10) || 1;
        const max = parseInt(qtyInput.max, 10) || 999;
        if (current < max) qtyInput.value = current + 1;
    });

    // --- Add to cart ---
    const addToCartToastEl = document.getElementById('addToCartToast');
    const addToCartToast = new bootstrap.Toast(addToCartToastEl, { delay: 2500 });

    document.getElementById('addToCartBtn').addEventListener('click', function () {
        const selectedSize = document.querySelector('input[name="sizeOption"]:checked');
        const size = selectedSize ? selectedSize.nextElementSibling.textContent : 'M';
        const color = selectedColorLabel.textContent;
        const qty = parseInt(qtyInput.value, 10) || 1;

        const cartItem = {
            productId: product.id,
            name: product.name,
            size: size,
            color: color,
            quantity: qty,
            price: product.price
        };

        // Replace this with actual cart logic (localStorage, API call, state management, etc.)
        console.log('Added to cart:', cartItem);

        document.getElementById('addToCartToastBody').textContent =
            `Added ${qty} × ${product.name} (${size}, ${color}) to cart.`;
        addToCartToast.show();
    });

    // --- Wishlist (placeholder behavior) ---
    const wishlistBtn = document.getElementById('wishlistBtn');
    let wishlisted = false;
    wishlistBtn.addEventListener('click', function () {
        wishlisted = !wishlisted;
        this.textContent = wishlisted ? '♥' : '♡';
        this.classList.toggle('btn-outline-dark', !wishlisted);
        this.classList.toggle('btn-dark', wishlisted);
    });

    // --- Related products ---
    const relatedRow = document.getElementById('relatedProductsRow');
    relatedRow.innerHTML = relatedProducts.map(p => `
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="product-card h-100">
                        <img src="${p.image}" class="img-fluid" alt="${p.name}">
                        <div class="product-card-body">
                            <span class="product-card-category">${product.category}</span>
                            <h3 class="product-card-title">${p.name}</h3>
                            <div class="product-card-ratings-wrapper">
                                <img src="https://codingyaar.com/wp-content/uploads/star.png" alt="star">
                                <img src="https://codingyaar.com/wp-content/uploads/star.png" alt="star">
                                <img src="https://codingyaar.com/wp-content/uploads/star.png" alt="star">
                                <img src="https://codingyaar.com/wp-content/uploads/star.png" alt="star">
                                <img src="https://codingyaar.com/wp-content/uploads/star.png" alt="star">
                            </div>
                            <div class="product-card-footer">
                                <span class="product-card-price">Rs ${p.price.toLocaleString()}</span>
                                <a href="#" class="btn btn-primary btn-sm">Add to Cart</a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
})();