(function () {
    // Sample dataset — replace with data fetched from your backend/API.
    let products = [
        { id: 1, name: 'Classic Crew Neck T-Shirt', collection: "Men's", category: 'Tops', sku: 'MEN-TOP-0001', price: 800, stock: 45 },
        { id: 2, name: 'Pique Polo Shirt', collection: "Men's", category: 'Tops', sku: 'MEN-TOP-0002', price: 1200, stock: 8 },
        { id: 3, name: 'Pullover Hoodie', collection: "Men's", category: 'Tops', sku: 'MEN-TOP-0003', price: 2500, stock: 0 },
        { id: 4, name: 'Skinny Fit Jeans', collection: "Men's", category: 'Bottoms', sku: 'MEN-BOT-0001', price: 3200, stock: 22 },
        { id: 5, name: 'Casual Chino Shorts', collection: "Men's", category: 'Bottoms', sku: 'MEN-BOT-0002', price: 1800, stock: 5 },
        { id: 6, name: 'Denim Jacket', collection: "Men's", category: 'Outerwear', sku: 'MEN-OUT-0001', price: 4500, stock: 14 },
        { id: 7, name: 'Two-Piece Slim Suit', collection: "Men's", category: 'Formalwear', sku: 'MEN-FOR-0001', price: 12500, stock: 3 },

        { id: 8, name: 'Crew Neck T-Shirt', collection: "Women's", category: 'Tops', sku: 'WOM-TOP-0001', price: 750, stock: 38 },
        { id: 9, name: 'Cropped Pullover Hoodie', collection: "Women's", category: 'Tops', sku: 'WOM-TOP-0002', price: 2300, stock: 0 },
        { id: 10, name: 'Skinny Fit Jeans', collection: "Women's", category: 'Bottoms', sku: 'WOM-BOT-0001', price: 3000, stock: 27 },
        { id: 11, name: 'Midi Skirt', collection: "Women's", category: 'Bottoms', sku: 'WOM-BOT-0002', price: 2200, stock: 6 },
        { id: 12, name: 'Floral Maxi Dress', collection: "Women's", category: 'Dresses', sku: 'WOM-DRS-0001', price: 4200, stock: 11 },
        { id: 13, name: 'Cocktail Dress', collection: "Women's", category: 'Formalwear', sku: 'WOM-FOR-0001', price: 8500, stock: 2 },

        { id: 14, name: 'Everyday Backpack', collection: 'Accessories', category: 'Bags', sku: 'ACC-BAG-0001', price: 4500, stock: 19 },
        { id: 15, name: 'Canvas Tote Bag', collection: 'Accessories', category: 'Bags', sku: 'ACC-BAG-0002', price: 1800, stock: 4 },
        { id: 16, name: 'Classic Baseball Cap', collection: 'Accessories', category: 'Headwear', sku: 'ACC-HEA-0001', price: 1500, stock: 0 },
        { id: 17, name: 'Aviator Sunglasses', collection: 'Accessories', category: 'Eyewear', sku: 'ACC-EYE-0001', price: 2800, stock: 33 },
        { id: 18, name: 'Minimalist Watch', collection: 'Accessories', category: 'Jewelry & Watches', sku: 'ACC-JEW-0001', price: 4200, stock: 9 }
    ];

    const tableBody = document.getElementById('stockTableBody');
    const searchInput = document.getElementById('searchInput');
    const collectionFilter = document.getElementById('collectionFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const lowThresholdInput = document.getElementById('lowThresholdInput');

    const summaryTotal = document.getElementById('summaryTotal');
    const summaryUnits = document.getElementById('summaryUnits');
    const summaryLow = document.getElementById('summaryLow');
    const summaryOut = document.getElementById('summaryOut');

    function getLowThreshold() {
        const val = parseInt(lowThresholdInput.value, 10);
        return isNaN(val) || val < 1 ? 10 : val;
    }

    function getStatus(stock) {
        const threshold = getLowThreshold();
        if (stock <= 0) return 'out';
        if (stock < threshold) return 'low';
        return 'in-stock';
    }

    function statusBadge(status) {
        if (status === 'out') return '<span class="badge bg-danger status-badge">Out of Stock</span>';
        if (status === 'low') return '<span class="badge bg-warning text-dark status-badge">Low Stock</span>';
        return '<span class="badge bg-success status-badge">In Stock</span>';
    }

    function populateCategoryFilter() {
        const categories = Array.from(new Set(products.map(p => p.category))).sort();
        categoryFilter.innerHTML = '<option value="">All Categories</option>' +
            categories.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    function getFilteredProducts() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const collectionVal = collectionFilter.value;
        const categoryVal = categoryFilter.value;
        const statusVal = statusFilter.value;

        return products.filter(p => {
            const matchesSearch = !searchTerm ||
                p.name.toLowerCase().includes(searchTerm) ||
                p.sku.toLowerCase().includes(searchTerm);
            const matchesCollection = !collectionVal || p.collection === collectionVal;
            const matchesCategory = !categoryVal || p.category === categoryVal;
            const matchesStatus = !statusVal || getStatus(p.stock) === statusVal;
            return matchesSearch && matchesCollection && matchesCategory && matchesStatus;
        });
    }

    function renderTable() {
        const filtered = getFilteredProducts();

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr class="no-results-row"><td colspan="8">No products match your filters.</td></tr>';
        } else {
            tableBody.innerHTML = filtered.map(p => {
                const status = getStatus(p.stock);
                const rowClass = status === 'out' ? 'row-out' : (status === 'low' ? 'row-low' : '');
                return `
                        <tr class="${rowClass}" data-id="${p.id}">
                            <td>${p.name}</td>
                            <td>${p.collection}</td>
                            <td>${p.category}</td>
                            <td><code>${p.sku}</code></td>
                            <td>Rs ${p.price.toLocaleString()}</td>
                            <td>
                                <input type="number" class="form-control form-control-sm qty-input stock-input" min="0" value="${p.stock}" data-id="${p.id}">
                            </td>
                            <td class="status-cell">${statusBadge(status)}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary save-btn" data-id="${p.id}">Save</button>
                            </td>
                        </tr>`;
            }).join('');
        }

        updateSummary();
    }

    function updateSummary() {
        const total = products.length;
        const units = products.reduce((sum, p) => sum + p.stock, 0);
        const low = products.filter(p => getStatus(p.stock) === 'low').length;
        const out = products.filter(p => getStatus(p.stock) === 'out').length;

        summaryTotal.textContent = total;
        summaryUnits.textContent = units.toLocaleString();
        summaryLow.textContent = low;
        summaryOut.textContent = out;
    }

    tableBody.addEventListener('click', function (e) {
        if (e.target.classList.contains('save-btn')) {
            const id = parseInt(e.target.getAttribute('data-id'), 10);
            const input = tableBody.querySelector(`.stock-input[data-id="${id}"]`);
            const newStock = Math.max(0, parseInt(input.value, 10) || 0);

            const product = products.find(p => p.id === id);
            if (product) {
                product.stock = newStock;
                // Replace this console.log with an API call to persist the update.
                console.log('Stock updated:', product);
            }

            renderTable();
        }
    });

    [searchInput, collectionFilter, categoryFilter, statusFilter, lowThresholdInput].forEach(el => {
        el.addEventListener('input', renderTable);
        el.addEventListener('change', renderTable);
    });

    function statusLabel(status) {
        if (status === 'out') return 'Out of Stock';
        if (status === 'low') return 'Low Stock';
        return 'In Stock';
    }

    function exportToExcel() {
        const rows = getFilteredProducts().map(p => {
            const status = getStatus(p.stock);
            return {
                'Product': p.name,
                'Collection': p.collection,
                'Category': p.category,
                'SKU': p.sku,
                'Price (Rs)': p.price,
                'Stock Qty': p.stock,
                'Status': statusLabel(status),
                'Inventory Value (Rs)': p.price * p.stock
            };
        });

        if (rows.length === 0) {
            alert('No products to export with the current filters.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Set reasonable column widths
        worksheet['!cols'] = [
            { wch: 30 }, // Product
            { wch: 12 }, // Collection
            { wch: 16 }, // Category
            { wch: 16 }, // SKU
            { wch: 12 }, // Price
            { wch: 10 }, // Stock Qty
            { wch: 14 }, // Status
            { wch: 18 }  // Inventory Value
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Report');

        // Add a summary sheet
        const totalUnits = rows.reduce((sum, r) => sum + r['Stock Qty'], 0);
        const totalValue = rows.reduce((sum, r) => sum + r['Inventory Value (Rs)'], 0);
        const lowCount = rows.filter(r => r.Status === 'Low Stock').length;
        const outCount = rows.filter(r => r.Status === 'Out of Stock').length;

        const summaryRows = [
            { Metric: 'Report Generated', Value: new Date().toLocaleString() },
            { Metric: 'Total Products', Value: rows.length },
            { Metric: 'Total Units in Stock', Value: totalUnits },
            { Metric: 'Total Inventory Value (Rs)', Value: totalValue },
            { Metric: 'Low Stock Items', Value: lowCount },
            { Metric: 'Out of Stock Items', Value: outCount }
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
        summarySheet['!cols'] = [{ wch: 26 }, { wch: 24 }];
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        const dateStr = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(workbook, `stock-report-${dateStr}.xlsx`);
    }

    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);

    populateCategoryFilter();
    renderTable();
})();