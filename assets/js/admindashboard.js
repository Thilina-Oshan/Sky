// In production, the role comes from the authenticated session, not the
// URL — this is a stand-in until real auth/session handling is wired up.
const params = new URLSearchParams(window.location.search);
const role = params.get('role') || 'admin';
const email = params.get('email');

if (role !== 'admin' && role !== 'super_admin') {
    window.location.href = 'login.html';
}

const isSuperAdmin = role === 'super_admin';
document.getElementById('roleTag').textContent = isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN';
document.getElementById('pageSub').textContent = isSuperAdmin
    ? 'Manage accounts, roles, and access for staff and customers — including other admins.'
    : 'Manage customer accounts and content. Adding new admins requires a Super Admin.';

if (email) {
    document.getElementById('whoEmail').textContent = email;
    document.getElementById('avatarInitials').textContent = email.charAt(0).toUpperCase();
}

document.getElementById('addAccountLink').href =
    `admin-add-account.html?role=${encodeURIComponent(role)}&email=${encodeURIComponent(email || '')}`;
