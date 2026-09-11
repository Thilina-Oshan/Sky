import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const guestNav = document.getElementById("guest-nav");
const userNav = document.getElementById("user-nav");
const navUserName = document.getElementById("navUserName");
const navUserImg = document.getElementById("navUserImg");
const logoutBtn = document.getElementById("logoutBtn");

// Check Authentication Status
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User Login වී ඇත්නම්:
        guestNav.style.display = "none";
        userNav.style.display = "flex";

        // Display Name හෝ Email එක පෙන්වීම
        navUserName.textContent = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];

        // Google photo එකක් තිබේ නම් එයද, නැතහොත් default avatar එකක්ද යෙදීම
        if (user.photoURL) {
            navUserImg.src = user.photoURL;
        } else {
            navUserImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(navUserName.textContent)}&background=8B6F47&color=fff`;
        }
    } else {
        // User Logout වී ඇත්නම්:
        guestNav.style.display = "block";
        userNav.style.display = "none";
    }
});

// Logout Feature
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            alert("Sign out successful!");
            window.location.reload(); // Page එක Refresh කිරීම
        } catch (error) {
            console.error("Logout Error:", error);
        }
    });
}