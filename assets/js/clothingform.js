(function () {
    const form = document.getElementById('productForm');
    const successAlert = document.getElementById('formSuccessAlert');

    const departmentSelect = document.getElementById('productDepartment');
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

    // Hierarchical Data Structure: Department -> Category -> Subcategories
    const catalogData = {
        Men: {
            'Tops': [
                { id: 'M-TOP-01', name: 'T-Shirts & Polos' },
                { id: 'M-TOP-02', name: 'Casual Shirts' },
                { id: 'M-TOP-03', name: 'Dress Shirts' },
                { id: 'M-TOP-04', name: 'Hoodies & Sweatshirts' }
            ],
            'Bottoms': [
                { id: 'M-BOT-01', name: 'Jeans & Denim' },
                { id: 'M-BOT-02', name: 'Chinos & Trousers' },
                { id: 'M-BOT-03', name: 'Shorts' }
            ],
            'Outerwear': [
                { id: 'M-OUT-01', name: 'Jackets & Coats' },
                { id: 'M-OUT-02', name: 'Blazers & Vests' }
            ]
        },
        Women: {
            'Tops & Blouses': [
                { id: 'W-TOP-01', name: 'T-Shirts & Tops' },
                { id: 'W-TOP-02', name: 'Blouses & Shirts' },
                { id: 'W-TOP-03', name: 'Sweaters & Cardigans' }
            ],
            'Dresses & Jumpers': [
                { id: 'W-DRS-01', name: 'Casual Dresses' },
                { id: 'W-DRS-02', name: 'Evening & Formal Dresses' },
                { id: 'W-DRS-03', name: 'Jumpsuits & Rompers' }
            ],
            'Bottoms': [
                { id: 'W-BOT-01', name: 'Jeans & Denim' },
                { id: 'W-BOT-02', name: 'Skirts' },
                { id: 'W-BOT-03', name: 'Pants & Leggings' }
            ]
        },
        Accessories: {
            'Bags & Wallets': [
                { id: 'A-BAG-01', name: 'Handbags & Purses' },
                { id: 'A-BAG-02', name: 'Backpacks & Totes' }
            ]
        }
    };

    // Populate Category Dropdown based on selected Department
    function populateCategories() {
        const selectedDept = departmentSelect.value;
        categorySelect.innerHTML = '<option value="" selected disabled>Select Category</option>';
        categoryIdSelect.innerHTML = '<option value="" selected disabled>Select Category First</option>';
        categoryIdSelect.disabled = true;

        if (selectedDept && catalogData[selectedDept]) {
            categorySelect.disabled = false;
            Object.keys(catalogData[selectedDept]).forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                categorySelect.appendChild(opt);
            });
        } else {
            categorySelect.disabled = true;
        }
    }

    // Populate Subcategory ID Dropdown based on Department + Category
    function populateCategoryIds() {
        const selectedDept = departmentSelect.value;
        const selectedCat = categorySelect.value;
        categoryIdSelect.innerHTML = '<option value="" selected disabled>Select Subcategory / ID</option>';

        if (selectedDept && selectedCat && catalogData[selectedDept][selectedCat]) {
            categoryIdSelect.disabled = false;
            catalogData[selectedDept][selectedCat].forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = `${item.id} - ${item.name}`;
                categoryIdSelect.appendChild(opt);
            });
        } else {
            categoryIdSelect.disabled = true;
        }
    }

    function updatePreview() {
        previewTitle.textContent = nameInput.value.trim() || 'Product Name';

        const dept = departmentSelect.value ? `${departmentSelect.value}'s` : '';
        const selectedSubText = categoryIdSelect.options[categoryIdSelect.selectedIndex]?.text;
        const subCat = selectedSubText && !categoryIdSelect.disabled ? selectedSubText : (categorySelect.value || '');

        previewCategory.textContent = [dept, subCat].filter(Boolean).join(' - ') || 'Department / Category';

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

    // Event Handlers
    departmentSelect.addEventListener('change', function () {
        populateCategories();
        updatePreview();
    });

    categorySelect.addEventListener('change', function () {
        populateCategoryIds();
        updatePreview();
    });

    [nameInput, categoryIdSelect, priceInput, bestSellerCheckbox].forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
    });

    imageUrlInput.addEventListener('input', function () {
        setPreviewImage(this.value.trim() || null);
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

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            successAlert.style.display = 'none';
            return;
        }

        const sizes = Array.from(document.querySelectorAll('.size-check-group input:checked')).map(el => el.value);

        const productData = {
            department: departmentSelect.value,
            name: nameInput.value.trim(),
            category: categorySelect.value,
            categoryId: categoryIdSelect.value,
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

        console.log("Unified Product Submitted:", productData);

        form.classList.remove('was-validated');
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('reset', function () {
        setTimeout(() => {
            form.classList.remove('was-validated');
            successAlert.style.display = 'none';
            setPreviewImage(null);
            populateCategories();
            updatePreview();
        }, 0);
    });

    populateCategories();
    updatePreview();
})();