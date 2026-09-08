// ---- Rotating Quotes (Skylark Brand Style Guide) ----
const quotes = [
    { num: "01", text: "Elegance isn't about being noticed, it's about being remembered.", cite: "— Skylark Style Guide" },
    { num: "02", text: "Fashion passes, but authentic style remains eternal.", cite: "— Skylark Style Guide" },
    { num: "03", text: "Dress how you want to be addressed — wear your confidence.", cite: "— Skylark Style Guide" }
];

let qIndex = 0;
const quoteNum = document.getElementById('quoteNum');
const quoteText = document.getElementById('quoteText');
const quoteCite = document.getElementById('quoteCite');

// Function to rotate quotes every 5 seconds
function rotateQuotes() {
    if (!quoteNum || !quoteText || !quoteCite) return;
    
    qIndex = (qIndex + 1) % quotes.length;
    
    // Smooth transition fade out and fade in
    quoteText.style.opacity = '0';
    quoteNum.style.opacity = '0';
    quoteCite.style.opacity = '0';
    
    setTimeout(() => {
        quoteNum.textContent = quotes[qIndex].num;
        quoteText.textContent = quotes[qIndex].text;
        quoteCite.textContent = quotes[qIndex].cite;
        
        quoteText.style.opacity = '1';
        quoteNum.style.opacity = '1';
        quoteCite.style.opacity = '1';
    }, 400);
}

// Start auto-rotating quotes every 5 seconds
setInterval(rotateQuotes, 5000);


// ---- Password Visibility Toggle ----
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggleBtn');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

toggleBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeOpen.style.display = isPassword ? 'none' : 'block';
    eyeClosed.style.display = isPassword ? 'block' : 'none';
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});


// ---- Password Strength Indicator ----
const segs = document.querySelectorAll('.strength-seg');
const strengthLabel = document.getElementById('strengthLabel');
const strengthColors = ['#B4543A', '#C98A3A', '#8B6F47', '#4C7A5A'];
const strengthText = ['Weak', 'Okay', 'Good', 'Strong'];

function scorePassword(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    return score;
}

passwordInput.addEventListener('input', () => {
    const pw = passwordInput.value;
    const score = pw.length === 0 ? 0 : Math.max(1, scorePassword(pw));
    
    segs.forEach((seg, i) => {
        seg.style.background = i < score ? strengthColors[score - 1] : '#E4DFD3';
    });
    
    strengthLabel.textContent = pw.length === 0
        ? 'Use 8+ characters with a number and a symbol.'
        : strengthText[score - 1] + ' password.';

    if (pw.length > 0 && pw.length < 8) {
        setError(passwordInput, document.getElementById('passwordError'), 'Password must be at least 8 characters.');
    } else {
        setError(passwordInput, document.getElementById('passwordError'), '');
    }
});


// ---- Validation Helpers ----
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(input, errorEl, message) {
    if (message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        errorEl.textContent = message;
    } else {
        input.classList.remove('is-invalid');
        errorEl.textContent = '';
    }
}

const fields = {
    firstName: { input: document.getElementById('firstName'), error: document.getElementById('firstNameError') },
    lastName: { input: document.getElementById('lastName'), error: document.getElementById('lastNameError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
};

// Real-time email validation listener
fields.email.input.addEventListener('input', () => {
    if (fields.email.input.value && !isValidEmail(fields.email.input.value)) {
        setError(fields.email.input, fields.email.error, 'Enter a valid email address.');
    } else {
        setError(fields.email.input, fields.email.error, '');
    }
});


// ---- Form Submission Handling ----
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const statusBanner = document.getElementById('statusBanner');
const termsCheckbox = document.getElementById('terms');
const termsError = document.getElementById('termsError');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusBanner.classList.remove('show');
    let hasError = false;

    // Validate first name
    if (!fields.firstName.input.value.trim()) {
        setError(fields.firstName.input, fields.firstName.error, 'First name is required.');
        hasError = true;
    } else {
        setError(fields.firstName.input, fields.firstName.error, '');
    }

    // Validate last name
    if (!fields.lastName.input.value.trim()) {
        setError(fields.lastName.input, fields.lastName.error, 'Last name is required.');
        hasError = true;
    } else {
        setError(fields.lastName.input, fields.lastName.error, '');
    }

    // Validate email
    if (!fields.email.input.value) {
        setError(fields.email.input, fields.email.error, 'Email is required.');
        hasError = true;
    } else if (!isValidEmail(fields.email.input.value)) {
        setError(fields.email.input, fields.email.error, 'Enter a valid email address.');
        hasError = true;
    }

    // Validate password
    if (!passwordInput.value) {
        setError(passwordInput, document.getElementById('passwordError'), 'Password is required.');
        hasError = true;
    } else if (passwordInput.value.length < 8) {
        setError(passwordInput, document.getElementById('passwordError'), 'Password must be at least 8 characters.');
        hasError = true;
    }

    // Validate terms checkbox
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must accept the terms to continue.';
        hasError = true;
    } else {
        termsError.textContent = '';
    }

    if (hasError) return;

    // Set submit button loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Creating account...';

    // Simulate account creation and redirect to store dashboard
    setTimeout(() => {
        window.location.href = `dashboard.html?role=customer&email=${encodeURIComponent(fields.email.input.value)}`;
    }, 1200);
});