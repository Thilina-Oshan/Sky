// ---- rotating quotes (Skylark brand style guide) ----
const quotes = [
  { num: "01", text: "Elegance isn't about being noticed, it's about being remembered.", cite: "— Skylark Style Guide" },
  { num: "02", text: "Fashion passes, but authentic style remains eternal.", cite: "— Skylark Style Guide" },
  { num: "03", text: "Dress how you want to be addressed — wear your confidence.", cite: "— Skylark Style Guide" }
];
let qIndex = 0;
const quoteNum = document.getElementById('quoteNum');
const quoteText = document.getElementById('quoteText');
const quoteCite = document.getElementById('quoteCite');

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

// ---- password visibility toggle ----
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

// ---- form validation + authentication handler ----
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const statusBanner = document.getElementById('statusBanner');

// Utility function to validate email structure
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Display or clear error state on inputs
function setError(input, errorEl, message) {
  if (message) {
    input.classList.add('is-invalid');
    errorEl.textContent = message;
  } else {
    input.classList.remove('is-invalid');
    errorEl.textContent = '';
  }
}

// Real-time email validation
emailInput.addEventListener('input', () => {
  if (emailInput.value && !isValidEmail(emailInput.value)) {
    setError(emailInput, errorEl, 'Enter a valid email address.');
  } else {
    setError(emailInput, emailError, '');
  }
});

// Real-time password validation
passwordInput.addEventListener('input', () => {
  if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
    setError(passwordInput, passwordError, 'Password must be at least 6 characters.');
  } else {
    setError(passwordInput, passwordError, '');
  }
});

// Handle form submission
form.addEventListener('submit', (e) => {
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

  // Simulate authenticating Skylark user
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Signing in...';

  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Sign in';
    statusBanner.textContent = 'Welcome to Skylark! Connect this form to your PHP backend to log in users.';
    statusBanner.classList.add('show');
  }, 1200);
});

// Social sign-in placeholder
document.getElementById('googleBtn').addEventListener('click', () => {
  statusBanner.textContent = 'Google sign-in is not configured yet. Connect your Skylark OAuth provider.';
  statusBanner.classList.add('show');
});

// Password reset placeholder
document.getElementById('forgotLink').addEventListener('click', (e) => {
  e.preventDefault();
  statusBanner.textContent = 'Password reset feature will be connected to your Skylark backend.';
  statusBanner.classList.add('show');
});


import { auth, googleProvider } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// HTML eke thiyena Google Login Button eke ID eka "googleBtn" kiyala hithamuko:
const googleBtn = document.getElementById("googleBtn");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in user:", result.user);
      alert("Successfully Logged In! " + result.user.displayName);

      // Dashboard ekata navigate karawanna:
      window.location.href = "../index.html";
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.message);
    }
  });
}
// Password reset handler
const forgotLink = document.getElementById('forgotLink');

forgotLink.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  // Check if email field is empty
  if (!email) {
    setError(emailInput, emailError, 'Please enter your email address first.');
    return;
  }

  // Validate email format
  if (!isValidEmail(email)) {
    setError(emailInput, emailError, 'Please enter a valid email address.');
    return;
  }

  try {
    // Send Firebase password reset email
    await sendPasswordResetEmail(auth, email);

    // Show success message in status banner
    statusBanner.style.color = '#0f5132';
    statusBanner.style.backgroundColor = '#d1e7dd';
    statusBanner.style.borderColor = '#badbcc';
    statusBanner.textContent = `Password reset link sent to ${email}! Please check your inbox.`;
    statusBanner.classList.add('show');

    setError(emailInput, emailError, '');
  } catch (error) {
    console.error("Password Reset Error:", error);

    // Handle Firebase specific errors
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