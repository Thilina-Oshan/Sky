// ---- Firebase Imports ----
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

function rotateQuotes() {
    if (!quoteNum || !quoteText || !quoteCite) return;

    qIndex = (qIndex + 1) % quotes.length;

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

setInterval(rotateQuotes, 5000);


// ---- Password Visibility Toggle ----
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggleBtn');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
}


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

if (passwordInput) {
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
}


// ---- Validation Helpers ----
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(input, errorEl, message) {
    if (!input || !errorEl) return;
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
    address: { input: document.getElementById('address'), error: document.getElementById('addressError') },
    phone: { input: document.getElementById('phone_n'), error: document.getElementById('phoneError') }
};

if (fields.email.input) {
    fields.email.input.addEventListener('input', () => {
        if (fields.email.input.value && !isValidEmail(fields.email.input.value)) {
            setError(fields.email.input, fields.email.error, 'Enter a valid email address.');
        } else {
            setError(fields.email.input, fields.email.error, '');
        }
    });
}


// ---- International Phone Input Initialization ----
const phoneInput = document.querySelector("#phone_n");
let iti = null;

if (phoneInput && window.intlTelInput) {
    iti = window.intlTelInput(phoneInput, {
        initialCountry: "lk",
        separateDialCode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js"
    });

    phoneInput.addEventListener('input', function () {
        let value = phoneInput.value.trim();
        if (value.startsWith("0")) {
            iti.setCountry("lk");
        }
    });
}


// ---- Form Submission Handling (Firebase Auth + Firestore) ----
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const statusBanner = document.getElementById('statusBanner');
const termsCheckbox = document.getElementById('terms');
const termsError = document.getElementById('termsError');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusBanner) {
        statusBanner.classList.remove('show');
        statusBanner.textContent = '';
    }
    
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

    // Validate phone number
    if (!fields.phone.input.value.trim()) {
        setError(fields.phone.input, fields.phone.error, 'Phone number is required.');
        hasError = true;
    } else {
        setError(fields.phone.input, fields.phone.error, '');
    }

    // Validate address
    if (!fields.address.input.value.trim()) {
        setError(fields.address.input, fields.address.error, 'Address is required.');
        hasError = true;
    } else {
        setError(fields.address.input, fields.address.error, '');
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

    // UI Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Creating account...';

    // Get Form Data
    const firstName = fields.firstName.input.value.trim();
    const lastName = fields.lastName.input.value.trim();
    const email = fields.email.input.value.trim();
    const password = passwordInput.value;
    const address = fields.address.input.value.trim();
    const phone = iti ? iti.getNumber() : fields.phone.input.value.trim();

    try {
        // 1. Firebase Authentication eken User registger kirema
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. User ge Additional details (Address, Phone, Name) Firestore eke save kirema
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            firstName: firstName,
            lastName: lastName,
            fullName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            address: address,
            role: "customer",
            createdAt: new Date().toISOString()
        });

        // 3. Success Feedback & Redirect
        if (statusBanner) {
            statusBanner.style.color = "#2e7d32";
            statusBanner.textContent = "Account created successfully! Redirecting...";
            statusBanner.classList.add('show');
        }

        setTimeout(() => {
            window.location.href = `/loging/loging.html`;
        }, 1500);

    } catch (error) {
        console.error("Firebase Registration Error:", error);

        // Firebase Error Messages Handle kirema
        if (error.code === 'auth/email-already-in-use') {
            setError(fields.email.input, fields.email.error, 'This email address is already in use.');
        } else if (error.code === 'auth/invalid-email') {
            setError(fields.email.input, fields.email.error, 'Invalid email address format.');
        } else if (error.code === 'auth/weak-password') {
            setError(passwordInput, document.getElementById('passwordError'), 'Password is too weak.');
        } else {
            if (statusBanner) {
                statusBanner.style.color = "#d32f2f";
                statusBanner.textContent = error.message || "An error occurred during signup.";
                statusBanner.classList.add('show');
            }
        }
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Create account';
    }
});