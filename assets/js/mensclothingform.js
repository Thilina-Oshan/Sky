(function () {
    const form = document.getElementById('menProductForm');
    const successAlert = document.getElementById('formSuccessAlert');

    const nameInput = document.getElementById('productName');
    const categorySelect = document.getElementById('productCategory');
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

    [nameInput, categorySelect, priceInput, bestSellerCheckbox].forEach(el => {
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

        // Collect form data into an object (replace this block with an API call as needed)
        const sizes = Array.from(document.querySelectorAll('.size-check-group input:checked')).map(el => el.value);

        const productData = {
            name: nameInput.value.trim(),
            category: categorySelect.value,
            subcategory: document.getElementById('productSubcategory').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            price: parseFloat(priceInput.value),
            stock: parseInt(document.getElementById('productStock').value, 10),
            sku: document.getElementById('productSku').value.trim(),
            bestSeller: bestSellerCheckbox.checked,
            sizes: sizes,
            colors: document.getElementById('productColors').value
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
            updatePreview();
        }, 0);
    });

    updatePreview();
})();
