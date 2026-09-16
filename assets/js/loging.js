import { auth, googleProvider } from "./firebase.js";

// Import core Firebase authentication SDK methods from CDN
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


// ---- Rotating Quotes Section (Skylark Brand Style) ----
// Array of quote objects to display dynamically on the login interface
const quotes = [
  { num: "01", text: "Elegance isn't about being noticed, it's about being remembered.", cite: "— Skylark Style Guide" },
  { num: "02", text: "Fashion passes, but authentic style remains eternal.", cite: "— Skylark Style Guide" },
  { num: "03", text: "Dress how you want to be addressed — wear your confidence.", cite: "— Skylark Style Guide" }
];

let qIndex = 0; // Tracks current quote index

// Get DOM elements for the quote widget
const quoteNum = document.getElementById('quoteNum');
const quoteText = document.getElementById('quoteText');
const quoteCite = document.getElementById('quoteCite');

// Run the quote rotator interval only if all required elements exist in DOM
if (quoteNum && quoteText && quoteCite) {
  setInterval(() => {
    // Increment quote index and loop back to start when reaching the end
    qIndex = (qIndex + 1) % quotes.length;
    const q = quotes[qIndex];

    // Fade out current quote text
    quoteText.style.opacity = 0;

    // Wait for fade-out animation before updating text values
    setTimeout(() => {
      quoteNum.textContent = q.num;
      quoteText.textContent = q.text;
      quoteCite.textContent = q.cite;

      // Fade in new quote text smoothly
      quoteText.style.transition = 'opacity 0.4s ease';
      quoteText.style.opacity = 1;
    }, 250);
  }, 6000); // Rotates every 6 seconds
}


// ---- Password Visibility Toggle Handler ----
// Get password input field and eye icon toggle controls
const passwordInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggleBtn');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

// Setup toggle functionality if elements are present
if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener('click', () => {
    // Check if current input type is 'password'
    const isPassword = passwordInput.type === 'password';

    // Switch input type between 'password' and 'text'
    passwordInput.type = isPassword ? 'text' : 'password';

    // Toggle visibility state of the eye icons
    if (eyeOpen) eyeOpen.style.display = isPassword ? 'none' : 'block';
    if (eyeClosed) eyeClosed.style.display = isPassword ? 'block' : 'none';

    // Update screen reader accessibility label dynamically
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
}


// ---- Form Elements & Validation Setup ----
// Select core login form inputs, error display containers, and action triggers
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const statusBanner = document.getElementById('statusBanner');
const googleBtn = document.getElementById("googleBtn");
const forgotLink = document.getElementById('forgotLink');

/**
 * Validates email structure using standard Regular Expression matching
 * @param {string} value - Email address string to test
 * @returns {boolean} True if format is valid
 */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Updates UI field styling and displays appropriate field-level validation messages
 * @param {HTMLElement} input - Input element being validated
 * @param {HTMLElement} errorEl - DOM container designated to render error text
 * @param {string} message - Error text message (empty string removes error state)
 */
function setError(input, errorEl, message) {
  if (message) {
    input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = message;
  } else {
    input.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
  }
}

// Real-time listener for user typing inside Email input
if (emailInput) {
  emailInput.addEventListener('input', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      setError(emailInput, emailError, 'Enter a valid email address.');
    } else {
      setError(emailInput, emailError, '');
    }
  });
}

// Real-time listener for user typing inside Password input
if (passwordInput) {
  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
      setError(passwordInput, passwordError, 'Password must be at least 6 characters.');
    } else {
      setError(passwordInput, passwordError, '');
    }
  });
}


// ---- Firebase Email & Password Login Submission Handler ----
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default browser form refresh behavior
    statusBanner.classList.remove('show'); // Clear previous global status alert

    let hasError = false;

    // Validate Email input field before submission
    if (!emailInput.value) {
      setError(emailInput, emailError, 'Email is required.');
      hasError = true;
    } else if (!isValidEmail(emailInput.value)) {
      setError(emailInput, emailError, 'Enter a valid email address.');
      hasError = true;
    }

    // Validate Password input field before submission
    if (!passwordInput.value) {
      setError(passwordInput, passwordError, 'Password is required.');
      hasError = true;
    } else if (passwordInput.value.length < 6) {
      setError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      hasError = true;
    }

    // Stop execution if client-side validation fails
    if (hasError) return;

    // Apply UI loading state on submit button during async request
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Signing in...';

    try {
      // Authenticate user credentials against Firebase Auth database
      await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);

      // Redirect user to home/dashboard page upon successful login
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Login error:", error);

      // Apply Bootstrap error styling and display message inside status banner
      statusBanner.style.color = '#842029';
      statusBanner.style.backgroundColor = '#f8d7da';
      statusBanner.style.borderColor = '#f5c2c7';
      statusBanner.textContent = 'Invalid email or password. Please try again.';
      statusBanner.classList.add('show');
    } finally {
      // Reset button UI state after operation finishes
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Sign in';
    }
  });
}


// ---- Firebase Google Provider Single Sign-On (SSO) Handler ----
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      // Trigger Google OAuth popup window
      const result = await signInWithPopup(auth, googleProvider);

      // Redirect user upon successful OAuth flow completion
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Google login error:", error);

      // Display OAuth error feedback inside status banner
      statusBanner.style.color = '#842029';
      statusBanner.style.backgroundColor = '#f8d7da';
      statusBanner.style.borderColor = '#f5c2c7';
      statusBanner.textContent = error.message;
      statusBanner.classList.add('show');
    }
  });
}


// ---- Firebase Password Reset Link Handler ----
if (forgotLink) {
  forgotLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent standard hyperlink navigation

    const email = emailInput.value.trim();

    // Ensure user has provided an email address to send reset instructions to
    if (!email) {
      setError(emailInput, emailError, 'Please enter your email address first.');
      return;
    }

    if (!isValidEmail(email)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      return;
    }

    try {
      // Dispatch password reset email via Firebase Auth service
      await sendPasswordResetEmail(auth, email);

      // Apply Bootstrap success styling and show notification message
      statusBanner.style.color = '#0f5132';
      statusBanner.style.backgroundColor = '#d1e7dd';
      statusBanner.style.borderColor = '#badbcc';
      statusBanner.textContent = `Password reset link sent to ${email}! Check your inbox.`;
      statusBanner.classList.add('show');

      // Clear any prior validation error messages on input
      setError(emailInput, emailError, '');
    } catch (error) {
      console.error("Password Reset Error:", error);

      // Apply error alert styles
      statusBanner.style.color = '#842029';
      statusBanner.style.backgroundColor = '#f8d7da';
      statusBanner.style.borderColor = '#f5c2c7';

      // Custom error handling based on Firebase error codes
      if (error.code === 'auth/user-not-found') {
        statusBanner.textContent = 'No user found with this email address.';
      } else {
        statusBanner.textContent = 'Failed to send reset email. Please try again.';
      }
      statusBanner.classList.add('show');
    }
  });
}