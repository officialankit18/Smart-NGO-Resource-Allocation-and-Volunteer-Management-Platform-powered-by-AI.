/* ============================================
   LOGIN.JS (NO VERIFICATION REQUIRED)
   - Email login
   - Google login (role selection on first login)
   ============================================ */

let newGoogleUser = null;

const googleBtn = document.getElementById("googleBtn");
const googleBtnHtml = googleBtn ? googleBtn.innerHTML : "";

function setLoginError(msg) {
  const el = document.getElementById("loginError");
  if (el) el.textContent = msg || "";
}

function setLoginSuccess(msg) {
  const el = document.getElementById("loginSuccess");
  if (el) el.textContent = msg || "";
}

function showForgotPassword(showForgot) {
  const loginContent = document.getElementById("loginContent");
  const forgotContent = document.getElementById("forgotContent");
  const resetMsg = document.getElementById("resetMsg");

  if (loginContent) loginContent.classList.toggle("hidden", showForgot);
  if (forgotContent) forgotContent.classList.toggle("hidden", !showForgot);
  if (resetMsg && !showForgot) resetMsg.textContent = "";
}

// =============== EMAIL LOGIN ===============
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoginError("");
  setLoginSuccess("");

  const email = document.getElementById("loginEmail").value.trim();
  const pass  = document.getElementById("loginPassword").value;

  if (!email || !pass) {
    setLoginError("Please fill all fields");
    return;
  }

  const loginBtn = document.getElementById("loginBtn");

  try {
    loginBtn.textContent = "Logging in...";
    loginBtn.disabled = true;

    const result = await auth.signInWithEmailAndPassword(email, pass);
    const user = result.user;

    // ✅ NO email verification check
    // ✅ NO status check

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists) {
      await auth.signOut();
      setLoginError("Account not found in database. Please register.");
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    const data = doc.data();

    if (!data.role) {
      await auth.signOut();
      setLoginError("Role not found for this account. Please contact support.");
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    saveAndRedirect(data.role, user.email, user.uid);

  } catch (err) {
    console.error("Login Error:", err);
    setLoginError(getError(err.code));
    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
  }
});

// =============== GOOGLE LOGIN ===============
document.getElementById("googleBtn")?.addEventListener("click", async () => {
  setLoginError("");
  setLoginSuccess("");

  googleBtn.disabled = true;
  googleBtn.textContent = "Connecting...";

  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const doc = await db.collection("users").doc(user.uid).get();

    if (doc.exists && doc.data().role) {
      // Optional: keep user doc updated (not required)
      await db.collection("users").doc(user.uid).set({
        email: user.email || ""
      }, { merge: true });

      saveAndRedirect(doc.data().role, user.email, user.uid);
    } else {
      newGoogleUser = user;
      document.getElementById("rolePopup")?.classList.remove("hidden");
    }

  } catch (err) {
    console.error("Google Error:", err);

    if (err.code === "auth/popup-closed-by-user") {
      setLoginError("Popup closed. Try again.");
    } else if (err.code === "auth/popup-blocked") {
      setLoginError("Popup blocked by browser. Allow popups and try again.");
    } else if (err.code === "auth/unauthorized-domain") {
      setLoginError("Unauthorized domain. Add 127.0.0.1 and localhost in Firebase > Auth > Settings > Authorized domains.");
    } else {
      setLoginError(`${err.code} : ${err.message}`);
    }

  } finally {
    googleBtn.disabled = false;
    googleBtn.innerHTML = googleBtnHtml;
  }
});

// =============== SAVE ROLE (GOOGLE NEW USER) ===============
document.getElementById("saveRoleBtn")?.addEventListener("click", async () => {
  const role = document.getElementById("roleSelect").value;
  const roleErr = document.getElementById("roleError");
  if (roleErr) roleErr.textContent = "";

  if (!role) {
    if (roleErr) roleErr.textContent = "Please select a role";
    return;
  }
  if (!newGoogleUser) {
    if (roleErr) roleErr.textContent = "Session error. Please login again.";
    return;
  }

  const btn = document.getElementById("saveRoleBtn");

  try {
    btn.textContent = "Saving...";
    btn.disabled = true;

    const user = newGoogleUser;

    // Create user doc in Firestore for new google user
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      role: String(role).trim().toLowerCase(),
      fullName: user.displayName || "",
      email: user.email || "",
      loginMethod: "google",
      createdAt: new Date().toISOString()
    }, { merge: true });

    saveAndRedirect(role, user.email, user.uid);

  } catch (e) {
    console.error(e);
    if (roleErr) roleErr.textContent = `${e.code} : ${e.message}`;
    btn.textContent = "Continue";
    btn.disabled = false;
  }
});

document.getElementById("forgotLink")?.addEventListener("click", (e) => {
  e.preventDefault();
  showForgotPassword(true);
});

document.getElementById("backBtn")?.addEventListener("click", () => {
  showForgotPassword(false);
});

document.getElementById("resetBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("resetEmail")?.value.trim();
  const resetBtn = document.getElementById("resetBtn");
  const resetMsg = document.getElementById("resetMsg");

  if (resetMsg) resetMsg.textContent = "";

  if (!email) {
    if (resetMsg) resetMsg.textContent = "Enter your registered email first.";
    return;
  }

  try {
    if (resetBtn) {
      resetBtn.textContent = "Sending...";
      resetBtn.disabled = true;
    }
    await auth.sendPasswordResetEmail(email);
    if (resetMsg) resetMsg.textContent = "Password reset link sent. Check your inbox.";
  } catch (err) {
    console.error("Reset Password Error:", err);
    if (resetMsg) resetMsg.textContent = getError(err.code);
  } finally {
    if (resetBtn) {
      resetBtn.textContent = "Send Reset Link";
      resetBtn.disabled = false;
    }
  }
});

// =============== HELPERS ===============
function saveAndRedirect(role, email, uid) {
  const r = String(role || "").trim().toLowerCase();

  localStorage.setItem("userRole", r);
  localStorage.setItem("userEmail", email || "");
  localStorage.setItem("userId", uid || "");

  setLoginSuccess("Login successful!");

  const redirects = {
  ngo: "ngo-dashboard.html",
  volunteer: "volunteer-dashboard.html",
  citizen: "citizen-dashboard.html",
  emergency: "citizen-dashboard.html"
};
  setTimeout(() => {
    window.location.href = redirects[r] || "mainreg.html";
  }, 700);
}

function getError(code) {
  switch (code) {
    case "auth/user-not-found":
      return "No account found. Please register.";
    case "auth/wrong-password":
      return "Wrong password.";
    case "auth/invalid-credential":
      return "Wrong email or password.";
    case "auth/invalid-email":
      return "Enter a valid email.";
    case "auth/missing-email":
      return "Enter your email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Try later.";
    default:
      return `${code || ""} Login failed. Try again.`.trim();
  }
}
