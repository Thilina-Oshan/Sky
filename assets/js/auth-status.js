import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// A function that waits for the navbar to be injected and then updates the UI.
function updateNavUI(user) {
    const guestNav = document.getElementById("guest-nav");
    const userNav = document.getElementById("user-nav");
    const navUserName = document.getElementById("navUserName");
    const navUserEmail = document.getElementById("navUserEmail");
    const navUserImg = document.getElementById("navUserImg");

    if (!guestNav || !userNav) {
        // If the navbar has not yet loaded into the DOM, it retries after half a second.
        setTimeout(() => updateNavUI(user), 100);
        return;
    }

    if (user) {
        // User Logged In
        guestNav.style.display = "none";
        userNav.style.display = "block";

        const displayName = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];
        if (navUserName) navUserName.textContent = displayName;
        if (navUserEmail) navUserEmail.textContent = user.email;

        if (navUserImg) {
            if (user.photoURL) {
                navUserImg.src = user.photoURL;
            } else {
                navUserImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=8B6F47&color=fff`;
            }
        }
    } else {
        // User Logged Out
        guestNav.style.display = "block";
        userNav.style.display = "none";
    }
}

// Firebase Auth State Listener
onAuthStateChanged(auth, (user) => {
    updateNavUI(user);
});

// Handling the Logout Button using Event Delegation
document.addEventListener("click", async (e) => {
    if (e.target && e.target.closest("#logoutBtn")) {
        try {
            await signOut(auth);
            window.location.reload();
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }
});