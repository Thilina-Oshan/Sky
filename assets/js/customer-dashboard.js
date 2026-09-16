(function () {
    // --- Sample data — replace with data fetched from your backend/API for the logged-in user ---
    const customer = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        rewardPoints: 320
    };

    let orders = [
        { id: 'ORD-1042', date: '2026-09-10', items: 3, total: 8600, status: 'Delivered' },
        { id: 'ORD-1029', date: '2026-08-22', items: 1, total: 3200, status: 'Delivered' },
        { id: 'ORD-1015', date: '2026-08-05', items: 2, total: 5400, status: 'Shipped' },
        { id: 'ORD-0998', date: '2026-07-18', items: 1, total: 1800, status: 'Cancelled' }
    ];

    let wishlist = [
        { id: 1, name: 'Pullover Hoodie', price: 2500, image: 'https://placehold.co/400x480?text=Hoodie' },
        { id: 2, name: 'Skinny Fit Jeans', price: 3200, image: 'https://placehold.co/400x480?text=Skinny+Jeans' },
        { id: 3, name: 'Aviator Sunglasses', price: 2800, image: 'https://placehold.co/400x480?text=Sunglasses' }
    ];

    let addresses = [
        { id: 1, label: 'Home', line1: '42 Galle Road', city: 'Colombo 03', postal: '00300', phone: '+94 77 123 4567', isDefault: true },
        { id: 2, label: 'Office', line1: '15 Duplication Road', city: 'Colombo 04', postal: '00400', phone: '+94 77 987 6543', isDefault: false }
    ];

    let notifications = [
        { id: 1, message: 'Your order ORD-1042 has been delivered.', time: '2 days ago', read: false },
        { id: 2, message: 'Your order ORD-1015 has shipped.', time: '5 days ago', read: false },
        { id: 3, message: 'New promo: 15% off with code WELCOME15.', time: '1 week ago', read: true },
        { id: 4, message: 'You earned 50 reward points from your last order.', time: '2 weeks ago', read: true }
    ];

    const LOYALTY_TIERS = [
        { name: 'Bronze', min: 0, benefits: ['Standard shipping rates', 'Birthday discount'] },
        { name: 'Silver', min: 200, benefits: ['Free standard shipping', 'Early access to sales'] },
        { name: 'Gold', min: 500, benefits: ['Free express shipping', 'Exclusive member gifts'] },
        { name: 'Platinum', min: 1000, benefits: ['Personal stylist access', 'Priority support', 'All Gold benefits'] }
    ];

    const ORDER_STATUS_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

    function formatRs(amount) {
        return `Rs ${amount.toLocaleString()}`;
    }

    function statusBadgeClass(status) {
        switch (status) {
            case 'Delivered': return 'bg-success';
            case 'Shipped': return 'bg-primary';
            case 'Processing': return 'bg-warning text-dark';
            case 'Cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // --- Profile ---
    document.getElementById('profileName').textContent = customer.name;
    document.getElementById('profileEmail').textContent = customer.email;
    document.getElementById('profileInitials').textContent = customer.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // --- Overview stats ---
    function renderOverviewStats() {
        document.getElementById('statTotalOrders').textContent = orders.length;
        document.getElementById('statWishlistCount').textContent = wishlist.length;
        document.getElementById('statRewardPoints').textContent = customer.rewardPoints;
        const totalSpent = orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((sum, o) => sum + o.total, 0);
        document.getElementById('statTotalSpent').textContent = formatRs(totalSpent);
    }

    // --- Orders ---
    function orderRowHtml(order, withAction) {
        return `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.items}</td>
                        <td>${formatRs(order.total)}</td>
                        <td><span class="badge order-status-badge ${statusBadgeClass(order.status)}">${order.status}</span></td>
                        ${withAction ? `<td><button class="btn btn-sm btn-outline-secondary view-tracking-btn" data-id="${order.id}">View</button></td>` : ''}
                    </tr>
                `;
    }

    function renderOrders() {
        document.getElementById('recentOrdersBody').innerHTML =
            orders.slice(0, 3).map(o => orderRowHtml(o, false)).join('');
        document.getElementById('allOrdersBody').innerHTML =
            orders.map(o => orderRowHtml(o, true)).join('');
    }

    // --- Order tracking modal ---
    function getStatusIndex(status) {
        const map = { 'Processing': 1, 'Shipped': 2, 'Out for Delivery': 3, 'Delivered': 4 };
        return map[status] !== undefined ? map[status] : 0;
    }

    function openOrderTracking(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        document.getElementById('trackingOrderId').textContent = order.id;
        const cancelledAlert = document.getElementById('trackingCancelledAlert');
        const stepsList = document.getElementById('trackingStepsList');

        if (order.status === 'Cancelled') {
            cancelledAlert.style.display = 'block';
            stepsList.innerHTML = `
                        <li class="done">
                            <div class="step-label">Order Placed</div>
                            <div class="step-date">${order.date}</div>
                        </li>
                        <li class="done">
                            <div class="step-label">Cancelled</div>
                        </li>
                    `;
        } else {
            cancelledAlert.style.display = 'none';
            const currentIndex = getStatusIndex(order.status);
            stepsList.innerHTML = ORDER_STATUS_STEPS.map((label, idx) => {
                const isDone = idx <= currentIndex;
                return `
                            <li class="${isDone ? 'done' : 'pending'}">
                                <div class="step-label">${label}</div>
                                ${idx === 0 ? `<div class="step-date">${order.date}</div>` : ''}
                            </li>
                        `;
            }).join('');
        }

        const modalEl = document.getElementById('orderTrackingModal');
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }

    document.getElementById('allOrdersBody').addEventListener('click', function (e) {
        const btn = e.target.closest('.view-tracking-btn');
        if (!btn) return;
        openOrderTracking(btn.getAttribute('data-id'));
    });

    // --- Wishlist ---
    function renderWishlist() {
        const row = document.getElementById('wishlistRow');
        if (wishlist.length === 0) {
            row.innerHTML = '<p class="text-muted mb-0">Your wishlist is empty.</p>';
            return;
        }
        row.innerHTML = wishlist.map(item => `
                    <div class="col-12 col-sm-6 col-md-4">
                        <div class="wishlist-card-wrap product-card h-100">
                            <button class="wishlist-remove-btn" data-id="${item.id}" title="Remove from wishlist">✕</button>
                            <img src="${item.image}" class="img-fluid" alt="${item.name}">
                            <div class="product-card-body">
                                <h3 class="product-card-title">${item.name}</h3>
                                <div class="product-card-footer">
                                    <span class="product-card-price">${formatRs(item.price)}</span>
                                    <a href="#" class="btn btn-primary btn-sm">Add to Cart</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
    }

    document.getElementById('wishlistRow').addEventListener('click', function (e) {
        const btn = e.target.closest('.wishlist-remove-btn');
        if (!btn) return;
        const id = parseInt(btn.getAttribute('data-id'), 10);
        wishlist = wishlist.filter(item => item.id !== id);
        renderWishlist();
        renderOverviewStats();
    });

    // --- Addresses ---
    function renderAddresses() {
        const row = document.getElementById('addressesRow');
        if (addresses.length === 0) {
            row.innerHTML = '<p class="text-muted mb-0">No saved addresses yet.</p>';
            return;
        }
        row.innerHTML = addresses.map(addr => `
                    <div class="col-12 col-md-6">
                        <div class="address-card ${addr.isDefault ? 'is-default' : ''}">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <strong>${addr.label}</strong>
                                ${addr.isDefault ? '<span class="badge bg-dark default-badge">Default</span>' : ''}
                            </div>
                            <div class="text-muted small mb-1">${addr.line1}</div>
                            <div class="text-muted small mb-1">${addr.city} ${addr.postal || ''}</div>
                            <div class="text-muted small mb-3">${addr.phone || ''}</div>
                            <div class="d-flex gap-2">
                                ${!addr.isDefault ? `<button class="btn btn-sm btn-outline-secondary set-default-btn" data-id="${addr.id}">Set Default</button>` : ''}
                                <button class="btn btn-sm btn-outline-danger delete-address-btn" data-id="${addr.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `).join('');
    }

    document.getElementById('addressesRow').addEventListener('click', function (e) {
        const setDefaultBtn = e.target.closest('.set-default-btn');
        const deleteBtn = e.target.closest('.delete-address-btn');

        if (setDefaultBtn) {
            const id = parseInt(setDefaultBtn.getAttribute('data-id'), 10);
            addresses = addresses.map(a => ({ ...a, isDefault: a.id === id }));
            renderAddresses();
        }

        if (deleteBtn) {
            const id = parseInt(deleteBtn.getAttribute('data-id'), 10);
            addresses = addresses.filter(a => a.id !== id);
            renderAddresses();
        }
    });

    document.getElementById('addAddressForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const newAddress = {
            id: Date.now(),
            label: document.getElementById('addrLabel').value.trim(),
            line1: document.getElementById('addrLine1').value.trim(),
            city: document.getElementById('addrCity').value.trim(),
            postal: document.getElementById('addrPostal').value.trim(),
            phone: document.getElementById('addrPhone').value.trim(),
            isDefault: document.getElementById('addrIsDefault').checked
        };

        if (newAddress.isDefault) {
            addresses = addresses.map(a => ({ ...a, isDefault: false }));
        }
        addresses.push(newAddress);
        renderAddresses();

        this.reset();
        const modalEl = document.getElementById('addAddressModal');
        bootstrap.Modal.getInstance(modalEl).hide();
    });

    // --- Account settings ---
    document.getElementById('accountSettingsForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const mismatchMsg = document.getElementById('passwordMismatchMsg');

        if (newPassword && newPassword !== confirmPassword) {
            mismatchMsg.style.display = 'block';
            return;
        }
        mismatchMsg.style.display = 'none';

        const updatedSettings = {
            fullName: document.getElementById('settingsFullName').value.trim(),
            email: document.getElementById('settingsEmail').value.trim(),
            phone: document.getElementById('settingsPhone').value.trim(),
            dob: document.getElementById('settingsDob').value,
            emailNotifications: document.getElementById('emailNotifToggle').checked
        };

        // Replace with an API call to persist these changes.
        console.log('Account settings updated:', updatedSettings);

        document.getElementById('profileName').textContent = updatedSettings.fullName || customer.name;
        document.getElementById('profileEmail').textContent = updatedSettings.email || customer.email;

        const savedAlert = document.getElementById('settingsSavedAlert');
        savedAlert.style.display = 'block';
        setTimeout(() => { savedAlert.style.display = 'none'; }, 3000);

        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    });

    // --- Logout (placeholder) ---
    document.getElementById('logoutBtn').addEventListener('click', function () {
        // Replace with real logout logic (clear session/token, redirect to login page).
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = '/login.html';
        }
    });

    // --- Notifications ---
    function renderNotifications() {
        const list = document.getElementById('notifList');
        const badge = document.getElementById('notifBadge');
        const unreadCount = notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }

        if (notifications.length === 0) {
            list.innerHTML = '<div class="notif-empty">You have no notifications.</div>';
            return;
        }

        list.innerHTML = notifications.map(n => `
                    <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
                        <div>${n.message}</div>
                        <div class="notif-time">${n.time}</div>
                    </div>
                `).join('');
    }

    document.getElementById('notifList').addEventListener('click', function (e) {
        const item = e.target.closest('.notif-item');
        if (!item) return;
        const id = parseInt(item.getAttribute('data-id'), 10);
        const notif = notifications.find(n => n.id === id);
        if (notif) notif.read = true;
        renderNotifications();
    });

    document.getElementById('markAllReadBtn').addEventListener('click', function (e) {
        e.preventDefault();
        notifications = notifications.map(n => ({ ...n, read: true }));
        renderNotifications();
    });

    // --- Loyalty tier ---
    function tierBadgeClass(name) {
        switch (name) {
            case 'Bronze': return 'bg-secondary';
            case 'Silver': return 'bg-light text-dark border';
            case 'Gold': return 'bg-warning text-dark';
            case 'Platinum': return 'bg-dark';
            default: return 'bg-secondary';
        }
    }

    function renderLoyalty() {
        const points = customer.rewardPoints;
        let currentTier = LOYALTY_TIERS[0];
        for (let i = 0; i < LOYALTY_TIERS.length; i++) {
            if (points >= LOYALTY_TIERS[i].min) currentTier = LOYALTY_TIERS[i];
        }
        const currentIndex = LOYALTY_TIERS.indexOf(currentTier);
        const nextTier = LOYALTY_TIERS[currentIndex + 1] || null;

        const badgeEl = document.getElementById('loyaltyTierBadge');
        badgeEl.textContent = currentTier.name;
        badgeEl.className = 'badge ' + tierBadgeClass(currentTier.name);
        document.getElementById('loyaltyPointsLabel').textContent = `${points} points`;

        if (nextTier) {
            const pointsNeeded = nextTier.min - points;
            const rangeSize = nextTier.min - currentTier.min;
            const progressPct = Math.min(100, Math.max(0, Math.round(((points - currentTier.min) / rangeSize) * 100)));
            document.getElementById('loyaltyNextTierLabel').textContent = `${pointsNeeded} points to ${nextTier.name}`;
            document.getElementById('loyaltyProgressBar').style.width = progressPct + '%';
        } else {
            document.getElementById('loyaltyNextTierLabel').textContent = 'Highest tier reached';
            document.getElementById('loyaltyProgressBar').style.width = '100%';
        }

        document.getElementById('loyaltyBenefitsList').innerHTML =
            currentTier.benefits.map(b => `<li>✓ ${b}</li>`).join('');
    }

    renderOverviewStats();
    renderOrders();
    renderWishlist();
    renderAddresses();
    renderNotifications();
    renderLoyalty();
})();

document.addEventListener("DOMContentLoaded", function () {
    // 1. Fetch user data (Example local storage check or session data)
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
        name: "Janith Perera",
        email: "janith@example.com",
        orders: []
    };

    // 2. Render User Profile Information safely
    const welcomeName = document.getElementById("welcome-name");
    const profileName = document.getElementById("profile-name");
    const profileEmail = document.getElementById("profile-email");
    const profileInitials = document.getElementById("profileInitials");

    if (welcomeName) welcomeName.textContent = currentUser.name;
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;

    if (profileInitials && currentUser.name) {
        const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase();
        profileInitials.textContent = initials.substring(0, 2);
    }

    // 3. Render Dashboard Stats
    const totalOrdersEl = document.getElementById("stat-total-orders");
    const pendingOrdersEl = document.getElementById("stat-pending-orders");
    const completedOrdersEl = document.getElementById("stat-completed-orders");

    if (totalOrdersEl) totalOrdersEl.textContent = currentUser.orders.length;

    // 4. Handle Logout Functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }
});