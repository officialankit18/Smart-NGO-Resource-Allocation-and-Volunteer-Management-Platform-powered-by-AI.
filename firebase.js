// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkXC5vYmE3QljS6wQcdW5M6rRMt2rH9g4",
  authDomain: "resource-allocation-ngo.firebaseapp.com",
  projectId: "resource-allocation-ngo",
  storageBucket: "resource-allocation-ngo.firebasestorage.app",
  messagingSenderId: "804799514382",
  appId: "1:804799514382:web:d55b5671a5c5d5d514395f",
  measurementId: "G-5SHNG9VVWT"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
window.auth = auth; window.db = db; window.storage = storage;

// ========== GLOBAL PROFILE PANEL ==========
document.addEventListener('DOMContentLoaded', () => {
    const profiles = document.querySelectorAll('.user-profile');
    if(profiles.length === 0) return;

    const panelHTML = `
      <div id="globalProfilePanel" class="global-profile-panel">
          <div class="panel-header" style="flex-direction: column; align-items: center; gap: 10px; padding: 25px 20px; position:relative;">
             <div style="position:relative; cursor:pointer;" onclick="document.getElementById('gl_dpUpload').click()" title="Click to upload new Profile Picture">
                 <img id="gl_profImg" src="https://ui-avatars.com/api/?name=U&background=EFF6FF&color=1D4ED8" style="width:75px; height:75px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-dark); transition:0.2s;">
                 <div style="position:absolute; bottom:0; right:0; background:var(--primary-dark); color:white; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; border:2px solid white; font-size:10px;"><i class="fas fa-camera"></i></div>
             </div>
             <input type="file" id="gl_dpUpload" accept="image/*" style="display:none;" onchange="window.handleGlobalDPUpload(event)">
             <h3 style="margin:0; font-size:16px; color:var(--text-dark);" id="gl_profName">Loading...</h3>
             <span style="font-size:12px; color:var(--text-muted);" id="gl_profEmail">Please wait...</span>
             <span style="font-size:11px; background:var(--primary-light); color:var(--primary-dark); padding:3px 10px; border-radius:12px; font-weight:600;" id="gl_profRole">User</span>
             <i class="fas fa-times" style="position: absolute; right: 15px; top: 15px; cursor:pointer; color:var(--text-muted);" onclick="document.getElementById('globalProfilePanel').classList.remove('active')"></i>
          </div>
          <div class="panel-body">
             <button id="gl_viewProfileBtn" onclick="window.location.href='volunteer-profile.html'" class="btn-action" style="width:100%; margin-bottom:10px; background:var(--primary-light); color:var(--primary-dark); border:none; justify-content:center;"><i class="fas fa-id-card"></i> View Full Profile</button>
             <hr style="margin: 10px 0; border:none; border-top:1px solid var(--border-color);">
             <button onclick="auth.signOut().then(() => { localStorage.clear(); window.location.href='Index.html'; })" class="btn-action" style="width:100%; justify-content:center; background:var(--emergency-red); color:#ffffff; border:none;"><i class="fas fa-sign-out-alt"></i> Logout</button>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    window.handleGlobalDPUpload = function(event) {
        const file = event.target.files[0];
        if(!file || !auth.currentUser) return;
        
        // Allow up to 10MB
        if(file.size > 10 * 1024 * 1024) return alert("File too large! Max 10MB.");
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = async function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500;
                const MAX_HEIGHT = 500;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                  if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                } else {
                  if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress significantly to fit within 1MB Firestore limit (usually ~50KB at 0.7 quality out of 500px)
                const base64 = canvas.toDataURL('image/jpeg', 0.7);

                // Update UI instantly
                const glProf = document.getElementById('gl_profImg');
                if(glProf) glProf.src = base64;
                
                const heroProf = document.getElementById('profileHeroImg');
                if(heroProf) heroProf.src = base64;

                document.querySelectorAll('.user-profile img').forEach(i => i.src = base64);

                // Save to DB
                try {
                    await db.collection("users").doc(auth.currentUser.uid).set({ profileImage: base64 }, { merge: true });
                } catch(err) { console.error("Error saving DP: ", err); alert("Error saving profile picture: " + err.message); }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Populate profile panel and topbar images from Firestore
    auth.onAuthStateChanged(async (user) => {
        if(user) {
            const emailEl = document.getElementById('gl_profEmail');
            const nameEl = document.getElementById('gl_profName');
            const imgEl = document.getElementById('gl_profImg');
            const roleEl = document.getElementById('gl_profRole');
            if(emailEl) emailEl.textContent = user.email;
            try {
                const snap = await db.collection('users').doc(user.uid).get();
                if(snap.exists) {
                    const d = snap.data();
                    const displayName = d.fullName || user.email.split('@')[0];
                    const role = d.role || 'user';
                    const profileTargets = {
                        volunteer: 'volunteer-profile.html',
                        ngo: 'ngo-dashboard.html',
                        citizen: 'citizen-dashboard.html',
                        emergency: 'citizen-dashboard.html'
                    };
                    const viewProfileBtn = document.getElementById('gl_viewProfileBtn');
                    if(nameEl) nameEl.textContent = displayName;
                    if(roleEl) roleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
                    if(viewProfileBtn) viewProfileBtn.onclick = () => { window.location.href = profileTargets[role] || 'Index.html'; };
                    
                    // Profile Image
                    const dpUrl = d.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EFF6FF&color=1D4ED8&bold=true`;
                    if(imgEl) imgEl.src = dpUrl;
                    
                    // Also update topbar profile images on this page
                    document.querySelectorAll('.user-profile img').forEach(img => {
                        img.src = dpUrl;
                    });
                    // Update topbar name displays
                    const topName = document.querySelector('.user-name');
                    if(topName && !topName.id) topName.textContent = displayName;
                } else {
                    if(nameEl) nameEl.textContent = user.email.split('@')[0];
                }
            } catch(e) { console.error(e); }
        }
    });

    profiles.forEach(p => {
        p.style.cursor = 'pointer';
        p.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('globalProfilePanel').classList.toggle('active');
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('globalProfilePanel');
        if (panel && panel.classList.contains('active') && !panel.contains(e.target) && !e.target.closest('.user-profile')) {
            panel.classList.remove('active');
        }
    });
});
