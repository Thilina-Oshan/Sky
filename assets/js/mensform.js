(function () {
    const form = document.getElementById('menProductForm');
    const successAlert = document.getElementById('formSuccessAlert');

    const nameInput = document.getElementById('productName');
    const categorySelect = document.getElementById('productCategory');
    const categoryIdSelect = document.getElementById('categoryIdSelect');
    const priceInput = document.getElementById('productPrice');
    const bestSellerCheckbox = document.getElementById('productBestSeller');
    const imageUrlInput = document.getElementById('productImageUrl');
    const imageFileInput = document.getElementById('productImageFile');

    const previewTitle = document.getElementById('previewTitle');
    const previewCategory = document.getElementById('previewCategory');
    const previewPrice = document.getElementById('previewPrice');
    const previewBestSellerLabel = document.getElementById('previewBestSellerLabel');
    const previewImage = document.getElementById('previewImage');
    const previewImagePlaceholder = document.getElementById('previewImagePlaceholder');

    // Data mapping primary categories to subcategory options
    const categoryData = {
        'Tops': [
            { id: 'CAT-TOP-01', name: 'T-Shirts & Polos' },
            { id: 'CAT-TOP-02', name: 'Casual Shirts' },
            { id: 'CAT-TOP-03', name: 'Dress Shirts' },
            { id: 'CAT-TOP-04', name: 'Hoodies & Sweatshirts' }
        ],
        'Bottoms': [
            { id: 'CAT-BOT-01', name: 'Jeans & Denim' },
            { id: 'CAT-BOT-02', name: 'Chinos & Trousers' },
            { id: 'CAT-BOT-03', name: 'Shorts' },
            { id: 'CAT-BOT-04', name: 'Sweatpants & Joggers' }
        ],
        'Outerwear': [
            { id: 'CAT-OUT-01', name: 'Jackets & Coats' },
            { id: 'CAT-OUT-02', name: 'Blazers & Vests' },
            { id: 'CAT-OUT-03', name: 'Rainwear' }
        ],
        'Activewear': [
            { id: 'CAT-ACT-01', name: 'Gym Tops & Tanks' },
            { id: 'CAT-ACT-02', name: 'Performance Shorts' },
            { id: 'CAT-ACT-03', name: 'Tracksuits' }
        ],
        'Footwear & Accessories': [
            { id: 'CAT-ACC-01', name: 'Sneakers & Casual Shoes' },
            { id: 'CAT-ACC-02', name: 'Formal Shoes' },
            { id: 'CAT-ACC-03', name: 'Belts & Wallets' },
            { id: 'CAT-ACC-04', name: 'Hats & Caps' }
        ],
        'Formalwear': [
            { id: 'CAT-FRM-01', name: 'Suits & Tuxedos' },
            { id: 'CAT-FRM-02', name: 'Ties & Bowties' },
            { id: 'CAT-FRM-03', name: 'Dress Pants' }
        ]
    };

    // Populate and unblock Category ID select
    function populateCategoryIdOptions() {
        if (!categoryIdSelect) return;

        const selectedCategory = categorySelect.value;
        categoryIdSelect.innerHTML = '<option value="" selected disabled>Select Category ID</option>';

        if (selectedCategory && categoryData[selectedCategory]) {
            categoryIdSelect.disabled = false; // Removes the block

            categoryData[selectedCategory].forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.id} - ${item.name}`;
                categoryIdSelect.appendChild(option);
            });
        } else {
            categoryIdSelect.disabled = true; // Keeps blocked if no category selected
            categoryIdSelect.innerHTML = '<option value="" selected disabled>Select Category First</option>';
        }
    }

    function updatePreview() {
        previewTitle.textContent = nameInput.value.trim() || 'Product Name';
        previewCategory.textContent = categorySelect.value || 'Category';

        const priceVal = parseFloat(priceInput.value);
        previewPrice.textContent = !isNaN(priceVal) ? `Rs ${priceVal.toLocaleString()}` : 'Rs 0';

        previewBestSellerLabel.style.display = bestSellerCheckbox.checked ? 'inline-block' : 'none';
    }

    function setPreviewImage(src) {
        if (src) {
            previewImage.src = src;
            previewImage.style.display = 'block';
            previewImagePlaceholder.style.display = 'none';
        } else {
            previewImage.style.display = 'none';
            previewImagePlaceholder.style.display = 'block';
        }
    }

    // Trigger dropdown populate when primary category changes
    categorySelect.addEventListener('change', function () {
        populateCategoryIdOptions();
        updatePreview();
    });

    [nameInput, priceInput, bestSellerCheckbox].forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });

    imageUrlInput.addEventListener('input', function () {
        if (this.value.trim()) {
            setPreviewImage(this.value.trim());
        } else {
            setPreviewImage(null);
        }
    });

    imageFileInput.addEventListener('change', function () {
        const file = this.files && this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            successAlert.style.display = 'none';
            return;
        }

        const sizes = Array.from(document.querySelectorAll('.size-check-group input:checked')).map(el => el.value);

        const productData = {
            name: nameInput.value.trim(),
            category: categorySelect.value,
            categoryId: categoryIdSelect ? categoryIdSelect.value : '',
            description: (document.getElementById('productDescription')?.value || '').trim(),
            price: parseFloat(priceInput.value),
            stock: parseInt(document.getElementById('productStock')?.value || '0', 10),
            sku: (document.getElementById('productSku')?.value || '').trim(),
            bestSeller: bestSellerCheckbox.checked,
            sizes: sizes,
            colors: (document.getElementById('productColors')?.value || '')
                .split(',')
                .map(c => c.trim())
                .filter(Boolean),
            imageUrl: imageUrlInput.value.trim()
        };

        console.log('Men\'s collection product submitted:', productData);

        form.classList.remove('was-validated');
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('reset', function () {
        setTimeout(() => {
            form.classList.remove('was-validated');
            successAlert.style.display = 'none';
            setPreviewImage(null);
            populateCategoryIdOptions();
            updatePreview();
        }, 0);
    });

    updatePreview();
})();