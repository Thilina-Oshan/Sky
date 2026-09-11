// ---- ES Module Imports (Must be at the top) ----
import { auth, googleProvider } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ---- Rotating Quotes (Skylark brand style guide) ----
const quotes = [
  { num: "01", text: "Elegance isn't about being noticed, it's about being remembered.", cite: "— Skylark Style Guide" },
  { num: "02", text: "Fashion passes, but authentic style remains eternal.", cite: "— Skylark Style Guide" },
  { num: "03", text: "Dress how you want to be addressed — wear your confidence.", cite: "— Skylark Style Guide" }
];
let qIndex = 0;
const quoteNum = document.getElementById('quoteNum');
const quoteText = document.getElementById('quoteText');
const quoteCite = document.getElementById('quoteCite');

if (quoteNum && quoteText && quoteCite) {
    setInterval(() => {
      qIndex = (qIndex + 1) % quotes.length;
      const q = quotes[qIndex];
      quoteText.style.opacity = 0;
      setTimeout(() => {
        quoteNum.textContent = q.num;
        quoteText.textContent = q.text;
        quoteCite.textContent = q.cite;
        quoteText.style.transition = 'opacity 0.4s ease';
        quoteText.style.opacity = 1;
      }, 250);
    }, 6000);
}

// ---- Password Visibility Toggle ----
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggleBtn');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      if (eyeOpen) eyeOpen.style.display = isPassword ? 'none' : 'block';
      if (eyeClosed) eyeClosed.style.display = isPassword ? 'block' : 'none';
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
}

// ---- Form Elements & Validation Setup ----
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const statusBanner = document.getElementById('statusBanner');
const googleBtn = document.getElementById("googleBtn");
const forgotLink = document.getElementById('forgotLink');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(input, errorEl, message) {
  if (message) {
    input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
  } else {
    input.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
  }
}

// Real-time validations
if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        setError(emailInput, emailError, 'Enter a valid email address.');
      } else {
        setError(emailInput, emailError, '');
      }
    });
}

if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
        setError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      } else {
        setError(passwordInput, passwordError, '');
      }
    });
}

// ---- Firebase Email/Password Login Handler ----
if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusBanner.classList.remove('show');

      let hasError = false;

      if (!emailInput.value) {
        setError(emailInput, emailError, 'Email is required.');
        hasError = true;
      } else if (!isValidEmail(emailInput.value)) {
        setError(emailInput, emailError, 'Enter a valid email address.');
        hasError = true;
      }

      if (!passwordInput.value) {
        setError(passwordInput, passwordError, 'Password is required.');
        hasError = true;
      } else if (passwordInput.value.length < 6) {
        setError(passwordInput, passwordError, 'Password must be at least 6 characters.');
        hasError = true;
      }

      if (hasError) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Signing in...';

      try {
        await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Login error:", error);
        statusBanner.style.color = '#842029';
        statusBanner.style.backgroundColor = '#f8d7da';
        statusBanner.style.borderColor = '#f5c2c7';
        statusBanner.textContent = 'Invalid email or password. Please try again.';
        statusBanner.classList.add('show');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Sign in';
      }
    });
}

// ---- Firebase Google Login Handler ----
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Google login error:", error);
      statusBanner.style.color = '#842029';
      statusBanner.style.backgroundColor = '#f8d7da';
      statusBanner.style.borderColor = '#f5c2c7';
      statusBanner.textContent = error.message;
      statusBanner.classList.add('show');
    }
  });
}

// ---- Firebase Password Reset Handler ----
if (forgotLink) {
    forgotLink.addEventListener('click', async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!email) {
        setError(emailInput, emailError, 'Please enter your email address first.');
        return;
      }

      if (!isValidEmail(email)) {
        setError(emailInput, emailError, 'Please enter a valid email address.');
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);

        statusBanner.style.color = '#0f5132';
        statusBanner.style.backgroundColor = '#d1e7dd';
        statusBanner.style.borderColor = '#badbcc';
        statusBanner.textContent = `Password reset link sent to ${email}! Check your inbox.`;
        statusBanner.classList.add('show');

        setError(emailInput, emailError, '');
      } catch (error) {
        console.error("Password Reset Error:", error);

        statusBanner.style.color = '#842029';
        statusBanner.style.backgroundColor = '#f8d7da';
        statusBanner.style.borderColor = '#f5c2c7';

        if (error.code === 'auth/user-not-found') {
          statusBanner.textContent = 'No user found with this email address.';
        } else {
          statusBanner.textContent = 'Failed to send reset email. Please try again.';
        }
        statusBanner.classList.add('show');
      }
    });
}