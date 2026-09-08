const params = new URLSearchParams(window.location.search);
const operatorRole = params.get('role') || 'admin';
const operatorEmail = params.get('email') || '';
const operatorId = params.get('operator_id') || ''; // Read operator ID from URL

// List of allowed Super Admin IDs (Only 3 super admins allowed
const ALLOWED_SUPER_ADMIN_IDS = ['SA-001', 'SA-002', 'SA-003'];

// Check if current user is an authorized Super Admin
const isSuperAdmin = operatorRole === 'super_admin' && ALLOWED_SUPER_ADMIN_IDS.includes(operatorId);

// Redirect unauthorized users to login page
if (operatorRole !== 'admin' && !isSuperAdmin) {
    window.location.href = '/loging/loging.html';
}

// Update Topbar Info
document.getElementById('operatorRoleTag').textContent = isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN';
document.getElementById('operatorEmail').textContent = operatorEmail ? `Signed in as ${operatorEmail}` : 'Signed in';
document.getElementById('operatorAvatar').textContent = (operatorEmail || 'A').charAt(0).toUpperCase();

// ---- Lock Admin / Super Admin creation for non-authorized super admins ----
const restrictedRoles = ['super_admin', 'admin'];
if (!isSuperAdmin) {
    restrictedRoles.forEach(roleValue => {
        const card = document.querySelector(`.role-card[data-role="${roleValue}"]`);
        if (card) {
            card.classList.add('locked');
            const input = card.querySelector('input');
            if (input) input.disabled = true;
            
            const note = document.createElement('div');
            note.className = 'lock-note';
            note.textContent = '🔒 Authorized Super Admin only';
            card.appendChild(note);
        }
    });

    const gateNote = document.getElementById('roleGateNote');
    if (gateNote) {
        gateNote.textContent = "You don't have authorization to create Admin or Super Admin accounts. Only designated Super Admins can perform this action.";
        gateNote.style.display = 'block';
    }
}

// ---- Role card selection ----
const roleCards = document.querySelectorAll('.role-card');
roleCards.forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('locked')) return;
        roleCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const input = card.querySelector('input');
        if (input) input.checked = true;
    });
});

// ---- Invite vs manual password method toggle ----
const methodButtons = document.querySelectorAll('#methodToggle button');
const passwordFields = document.getElementById('passwordFields');
let currentMethod = 'invite';

methodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        methodButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMethod = btn.dataset.method;
        passwordFields.classList.toggle('show', currentMethod === 'manual');
    });
});

// ---- Generate password ----
document.getElementById('generateBtn').addEventListener('click', () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pw = '';
    for (let i = 0; i < 14; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById('tempPassword').value = pw;
    setError(document.getElementById('tempPassword'), document.getElementById('tempPasswordError'), '');
});

// ---- Helper Validation Functions ----
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(input, errorEl, message) {
    if (!input || !errorEl) return;
    if (message) {
        input.classList.add('is-invalid');
        errorEl.textContent = message;
    } else {
        input.classList.remove('is-invalid');
        errorEl.textContent = '';
    }
}

// Input references
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const tempPassword = document.getElementById('tempPassword');

// Email live validation
email.addEventListener('input', () => {
    if (email.value && !isValidEmail(email.value)) {
        setError(email, document.getElementById('emailError'), 'Enter a valid work email.');
    } else {
        setError(email, document.getElementById('emailError'), '');
    }
});

// ---- Form Submit Event ----
const form = document.getElementById('adminForm');
const submitBtn = document.getElementById('submitBtn');
const statusBanner = document.getElementById('statusBanner');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusBanner.classList.remove('show');
    let hasError = false;

    if (!firstName.value.trim()) {
        setError(firstName, document.getElementById('firstNameError'), 'Required.');
        hasError = true;
    } else setError(firstName, document.getElementById('firstNameError'), '');

    if (!lastName.value.trim()) {
        setError(lastName, document.getElementById('lastNameError'), 'Required.');
        hasError = true;
    } else setError(lastName, document.getElementById('lastNameError'), '');

    if (!email.value) {
        setError(email, document.getElementById('emailError'), 'Email is required.');
        hasError = true;
    } else if (!isValidEmail(email.value)) {
        setError(email, document.getElementById('emailError'), 'Enter a valid work email.');
        hasError = true;
    } else setError(email, document.getElementById('emailError'), '');

    if (currentMethod === 'manual' && !tempPassword.value) {
        setError(tempPassword, document.getElementById('tempPasswordError'), 'Set or generate a password.');
        hasError = true;
    } else if (currentMethod === 'manual') {
        setError(tempPassword, document.getElementById('tempPasswordError'), '');
    }

    if (hasError) return;

    const checkedRoleInput = document.querySelector('input[name="role"]:checked');
    const role = checkedRoleInput ? checkedRoleInput.value : 'editor';

    // Enforcement Check: Reject creation if user is not in the allowed Super Admin list
    if (!isSuperAdmin && (role === 'admin' || role === 'super_admin')) {
        statusBanner.textContent = 'Only authorized Super Admins are allowed to create Admin or Super Admin accounts.';
        statusBanner.classList.add('show');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Creating...';

    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Create account';
        statusBanner.textContent = `Account created successfully as ${role}${currentMethod === 'invite' ? ' (Invitation sent via email)' : ''}.`;
        statusBanner.classList.add('show');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1000);
});

// ---- Cancel Button Event ----
document.getElementById('cancelBtn').addEventListener('click', () => {
    form.reset();
    roleCards.forEach(c => c.classList.remove('selected'));
    const defaultCard = document.querySelector('.role-card[data-role="editor"]');
    if (defaultCard) {
        defaultCard.classList.add('selected');
        const defaultInput = defaultCard.querySelector('input');
        if (defaultInput) defaultInput.checked = true;
    }
    passwordFields.classList.remove('show');
    methodButtons.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-method="invite"]').classList.add('active');
    currentMethod = 'invite';
    statusBanner.classList.remove('show');
});