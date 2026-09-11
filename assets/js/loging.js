// ---- ES Module Imports ----
import { auth, googleProvider } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    RecaptchaVerifier, 
    signInWithPhoneNumber,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Global variables for phone verification
let confirmationResult = null;

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

// Real-time email validation
if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        setError(emailInput, emailError, 'Enter a valid email address.');
      } else {
        setError(emailInput, emailError, '');
      }
    });
}

// Real-time password validation
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
      await signInWithPopup(auth, googleProvider);
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

// ---- Firebase Phone OTP Password Reset Handler ----

// Helper to set up reCAPTCHA verifier
function setupRecaptcha() {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible'
        });
    }
}

// Helper to display status messages in the modal
function showModalStatus(message, type) {
    const modalStatus = document.getElementById('modalStatus');
    if (modalStatus) {
        modalStatus.className = `alert alert-${type} mt-3`;
        modalStatus.textContent = message;
        modalStatus.classList.remove('d-none');
    }
}

// Trigger SMS Reset Modal
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Reset Modal Form steps & input states
      const phoneStep = document.getElementById('phoneStep');
      const otpStep = document.getElementById('otpStep');
      const modalStatus = document.getElementById('modalStatus');
      
      if (phoneStep) phoneStep.style.display = 'block';
      if (otpStep) otpStep.style.display = 'none';
      if (modalStatus) modalStatus.classList.add('d-none');

      document.getElementById('resetPhone').value = '';
      document.getElementById('otpInput').value = '';
      document.getElementById('newPasswordInput').value = '';

      // Initialize Bootstrap Modal instance
      const forgotModalEl = document.getElementById('forgotModal');
      if (forgotModalEl) {
          const forgotModal = new bootstrap.Modal(forgotModalEl);
          forgotModal.show();
      }
    });
}

// Step 1: Send SMS OTP
const sendOtpBtn = document.getElementById('sendOtpBtn');
if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
        const phoneNumber = document.getElementById('resetPhone').value.trim();

        if (!phoneNumber || !phoneNumber.startsWith('+')) {
            showModalStatus('Please enter a valid phone number with country code (e.g. +94771234567).', 'danger');
            return;
        }

        try {
            sendOtpBtn.disabled = true;
            sendOtpBtn.textContent = 'Sending OTP...';

            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            // Send Verification Code via Firebase SMS
            confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

            showModalStatus('OTP sent successfully to ' + phoneNumber, 'success');

            // Switch to Step 2
            document.getElementById('phoneStep').style.display = 'none';
            document.getElementById('otpStep').style.display = 'block';

        } catch (error) {
            console.error("SMS OTP Error:", error);
            showModalStatus('Failed to send OTP: ' + error.message, 'danger');
        } finally {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = 'Send OTP';
        }
    });
}

// Step 2: Verify OTP Code & Update Password
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', async () => {
        const otpCode = document.getElementById('otpInput').value.trim();
        const newPassword = document.getElementById('newPasswordInput').value.trim();

        if (!otpCode || otpCode.length !== 6) {
            showModalStatus('Please enter a valid 6-digit OTP code.', 'danger');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            showModalStatus('New password must be at least 6 characters.', 'danger');
            return;
        }

        try {
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.textContent = 'Verifying...';

            // Confirm OTP Code with Firebase
            const result = await confirmationResult.confirm(otpCode);
            const user = result.user;

            // Update Password for User
            await updatePassword(user, newPassword);

            showModalStatus('Password updated successfully! Reloading...', 'success');

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("OTP Verification Error:", error);
            showModalStatus('Invalid OTP code or password reset failed.', 'danger');
        } finally {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.textContent = 'Reset Password';
        }
    });
}