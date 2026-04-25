/* ================================
   Register/auth.js  (NO EMAIL VERIFICATION FLOW)
   - Creates account
   - Saves Firestore data
   - Redirects to success page
   ================================ */

if (!window.auth || !window.db) {
  console.error("Firebase not initialized. Check firebase.js load order.");
  alert("Firebase not initialized. Check console.");
}

// Redirect after successful registration
function goSuccessPage() {
  // If success.html is inside Register/ folder:
  window.location.href = "success.html";

  // If success.html is in ROOT (same folder as login.html), use this instead:
  // window.location.href = "../success.html";
}

async function createAccount(email, pass, data, role) {
  // 1) Create Auth user
  const cred = await auth.createUserWithEmailAndPassword(email, pass);

  // ✅ VERIFICATION REMOVED:
  // Do NOT send verification email
  // await cred.user.sendEmailVerification(...)

  // 2) Save Firestore (no pending/verified)
  const uid = cred.user.uid;

  data.uid = uid;
  data.role = role;
  data.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  await db.collection("users").doc(uid).set(data);
  await db.collection(role + "s").doc(uid).set(data);

  // 3) Redirect to success page
  goSuccessPage();
}

/* ===========================
   NGO REGISTER
   =========================== */
async function registerNGO(e) {
  e.preventDefault();
  const f = e.target;

  try {
    if (f.pass.value !== f.cpass.value) return alert("Passwords do not match");
    if (!f.agree.checked) return alert("Please accept the agreement");

    const focusAreas = [...f.querySelectorAll('input[name="focus"]:checked')].map(x => x.value);
    const certFile = f.querySelector('[name="cert"]')?.files?.[0] || null;

    const data = {
      ngoName: f.ngoName.value,
      year: f.year.value,
      regNo: f.regNo.value,

      pocName: f.pocName.value,
      designation: f.desig.value,
      phone: f.phone.value,
      email: f.email.value,

      state: f.state.value,
      city: f.city.value,
      pincode: f.pincode.value,

      operationalArea: f.area.value,
      focusAreas,

      certificateFileName: certFile ? certFile.name : ""
    };

    await createAccount(f.email.value, f.pass.value, data, "ngo");
  } catch (err) {
    console.error("NGO Register Error:", err);
    alert(err.code + " : " + err.message);
  }
}

/* ===========================
   VOLUNTEER REGISTER
   =========================== */
async function registerVOL(e) {
  e.preventDefault();
  const f = e.target;

  try {
    if (f.pass.value !== f.cpass.value) return alert("Passwords do not match");

    const skills = [...f.querySelectorAll('input[name="skill"]:checked')].map(s => s.value);

    const data = {
      fullName: f.name.value,
      age: f.age.value,
      gender: f.gender.value,
      phone: f.phone.value,
      email: f.email.value,

      state: f.state.value,
      city: f.city.value,
      area: f.area.value,

      availability: f.avail.value,
      prefWork: f.pref.value,
      experience: f.exp.value || "",

      skills,
      emergency: !!f.emergency.checked
    };

    await createAccount(f.email.value, f.pass.value, data, "volunteer");
  } catch (err) {
    console.error("Volunteer Register Error:", err);
    alert(err.code + " : " + err.message);
  }
}

/* ===========================
   CITIZEN REGISTER
   =========================== */
async function registerCIT(e) {
  e.preventDefault();
  const f = e.target;

  try {
    if (f.pass.value !== f.cpass.value) return alert("Passwords do not match");

    const data = {
      fullName: f.name.value,
      age: f.age.value,
      phone: f.phone.value,
      email: f.email.value,

      state: f.state.value,
      city: f.city.value,
      address: f.address.value,

      language: f.lang.value,
      emergencyContact: f.emer.value
    };

    await createAccount(f.email.value, f.pass.value, data, "citizen");
  } catch (err) {
    console.error("Citizen Register Error:", err);
    alert(err.code + " : " + err.message);
  }
}

// Expose to HTML onsubmit=""
window.registerNGO = registerNGO;
window.registerVOL = registerVOL;
window.registerCIT = registerCIT;
