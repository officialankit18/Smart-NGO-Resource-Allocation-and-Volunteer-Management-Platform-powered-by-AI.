// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// ==================== DYNAMIC MODAL INJECTION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Inject Emergency Modal if not present
    if (!document.getElementById('emergencyModal')) {
        const emergencyModalHTML = `
        <div class="emergency-modal" id="emergencyModal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeEmergencyModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2>🚨 Emergency Alert</h2>
                <p>This will broadcast a <strong>critical alert</strong> to all nearby NGOs and verified volunteers.</p>
                <form id="emergencyForm" onsubmit="submitEmergency(event)">
                    <div class="form-group">
                        <label>Situation Type</label>
                        <select name="emergencyType" id="emergencyType" class="form-control" required>
                            <option value="">Choose the emergency type...</option>
                            <option>🚑 Medical Emergency</option>
                            <option>🌊 Natural Disaster</option>
                            <option>🔥 Fire Alert</option>
                            <option>🚗 Major Accident</option>
                            <option>🍲 Food/Water Crisis</option>
                            <option>🛡️ Safety & Security</option>
                            <option>❓ Other Critical Need</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Precise Location</label>
                        <div class="location-input">
                            <input type="text" id="emergencyLocation" name="location" class="form-control" placeholder="Detecting your location..." required>
                            <button type="button" class="gps-btn" onclick="getEmergencyLocation()" title="Auto-detect location">
                                <i class="fas fa-location-crosshairs"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Details of Situation</label>
                        <textarea name="description" id="emergencyDesc" class="form-control" rows="3"
                            placeholder="Describe the situation, number of people affected, and urgent needs..."
                            required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Your Contact Info</label>
                        <input type="tel" name="contact" id="emergencyContact" class="form-control" placeholder="+91 00000 00000" required>
                    </div>
                    <button type="submit" class="btn-submit-emergency" id="emergencySubmitBtn">
                        <i class="fas fa-broadcast-tower"></i> Broadcast Emergency Now
                    </button>
                    <p class="form-note" id="emergencyFormNote">
                        <i class="fas fa-shield-halved"></i> <span>Encrypted location sharing with verified responders only.</span>
                    </p>
                </form>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', emergencyModalHTML);
        
        // Re-attach listeners after injection
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.addEventListener('click', function(e) { if (e.target === this) closeEmergencyModal(); });
        }
    }

    // Inject Auth Modal if not present (only basic skeleton, Index.html has more specific fields but this helps other pages)
    if (!document.getElementById('authModal')) {
        const authModalHTML = `
        <div class="auth-modal" id="authModal">
            <div class="auth-content">
                <button class="auth-close" onclick="closeAuthModal()">
                    <i class="fas fa-times"></i>
                </button>
                <img src="logoNGO.jpeg" style="height:50px; width:auto; border-radius:8px; margin-bottom:10px; object-fit:contain;">
                <h2>Welcome Back</h2>
                <p>Login to access your NGOHubX dashboard</p>
                <div id="idxAuthMsg" style="margin-bottom:10px; font-size:14px; font-weight:600;"></div>
                <form id="idxLoginForm" onsubmit="idxHandleLogin(event)">
                    <div class="auth-form-group">
                        <label>Email Address</label>
                        <input type="email" id="idxEmail" placeholder="Enter your email" required>
                    </div>
                    <div class="auth-form-group">
                        <label>Password</label>
                        <input type="password" id="idxPass" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn-login-submit" id="idxLoginBtn">Login</button>
                </form>
                <div class="auth-divider"><span>OR</span></div>
                <button class="btn-google" onclick="idxHandleGoogle()">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google">
                    Continue with Google
                </button>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', authModalHTML);
        
        const amodal = document.getElementById('authModal');
        if (amodal) {
            amodal.addEventListener('click', function(e) { if (e.target === this) closeAuthModal(); });
        }
    }
});

// ==================== HERO SLIDER - FIXED ====================
let currentSlide = 0;
let slideInterval;
let heroSlider = null;
let slides = [];
let totalSlides = 0;
let dotsContainer = null;
let dots = [];

function initHeroSlider() {
    heroSlider = document.getElementById('heroSlider');
    dotsContainer = document.getElementById('sliderDots');
    slides = Array.from(document.querySelectorAll('.hero-slide'));
    totalSlides = slides.length;

    if (!heroSlider || !dotsContainer || totalSlides === 0) {
        return;
    }

    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
    dots = Array.from(document.querySelectorAll('.dot'));
}

function updateSlider() {
    if (totalSlides === 0) return;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetAutoSlide();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetAutoSlide();
}

function startAutoSlide() {
    if (totalSlides <= 1) return;
    slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Initialize Slider + Touch Support
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    updateSlider();
    startAutoSlide();

    let touchStartX = 0;
    if (heroSlider) {
        heroSlider.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
        heroSlider.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        });
    }
});

// Stories Carousel
function scrollStories(direction) {
    const track = document.getElementById('storiesTrack');
    const scrollAmount = 380;
    if (direction === 'left') track.scrollLeft -= scrollAmount;
    else track.scrollLeft += scrollAmount;
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        const updateCount = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
    }, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
});

// Emergency Modal Functions
function openEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEmergencyModal() {
    const modal = document.getElementById('emergencyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function submitEmergency(e) {
    e.preventDefault();
    const btn = document.getElementById('emergencySubmitBtn');
    const type    = document.getElementById('emergencyType').value;
    const loc     = document.getElementById('emergencyLocation').value;
    const desc    = document.getElementById('emergencyDesc').value;
    const contact = document.getElementById('emergencyContact').value;
    const note    = document.getElementById('emergencyFormNote');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Alert...';
    btn.disabled = true;

    const record = {
        type, location: loc, description: desc, contact,
        status: 'active',
        reportedAt: (window.firebase && firebase.firestore) ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
        reportedBy: (window.auth && auth.currentUser) ? auth.currentUser.email : 'Anonymous'
    };

    if (!window.db) {
        btn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> SERVICE UNAVAILABLE';
        btn.style.background = '#b91c1c';
        btn.disabled = false;
        alert('Emergency service is unavailable right now. Please check your connection and try again, or contact emergency services directly.');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Broadcast Emergency Now';
            btn.style.background = '';
        }, 3000);
        return;
    }

    const savePromise = db.collection('emergencies').add(record);

    savePromise.then(() => {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> BROADCAST SUCCESSFUL';
        btn.style.background = '#059669';
        btn.style.boxShadow = '0 0 20px rgba(5, 150, 105, 0.4)';
        
        if (note) {
            note.innerHTML = '<i class="fas fa-tower-broadcast fa-fade"></i> <strong style="color:#059669">Live alert successfully dispatched to all verified responders!</strong>';
        }
        
        // Show a temporary success toast if possible, otherwise alert
        console.log("Emergency Broadcast Success");

        setTimeout(() => {
            closeEmergencyModal();
            btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Broadcast Emergency Now';
            btn.style.background = '';
            btn.style.boxShadow = '';
            btn.disabled = false;
            e.target.reset();
            if (note) {
                note.innerHTML = '<i class="fas fa-shield-halved"></i> <span>Encrypted location sharing with verified responders only.</span>';
            }
        }, 3000);
    }).catch(err => {
        console.error('Firebase Error:', err);
        btn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> FAILED TO SEND';
        btn.style.background = '#b91c1c';
        btn.disabled = false;
        alert('Critical: Failed to broadcast emergency. Please check your internet or try calling emergency services.');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Broadcast Emergency Now';
            btn.style.background = '';
        }, 3000);
    });
}

function getEmergencyLocation() {
    const input = document.getElementById('emergencyLocation');
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    input.placeholder = 'Detecting location...';
    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude: lat, longitude: lon } = pos.coords;
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                .then(r => r.json())
                .then(d => { input.value = d.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`; })
                .catch(() => { input.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`; });
        },
        () => { input.placeholder = 'GPS failed. Enter manually.'; }
    );
}

const eModal = document.getElementById('emergencyModal');
if (eModal) {
    eModal.addEventListener('click', function(e) {
        if (e.target === this) closeEmergencyModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEmergencyModal();
        closeAuthModal();
        closeDonationModal();
        closeRegModal();
    }
});
// ==================== AUTH MODAL / FIREBASE LOGIN ====================
function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function setIdxAuthMsg(msg, isError) {
    const el = document.getElementById('idxAuthMsg');
    if(el) {
        el.textContent = msg;
        el.style.color = isError ? 'var(--emergency-red)' : 'var(--primary-green)';
    }
}

function idxRedirectUser(role, email, uid) {
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userUid", uid);
    
    if (role === "admin") window.location.href = "admin-dashboard.html";
    else if (role === "ngo") window.location.href = "ngo-dashboard.html";
    else if (role === "volunteer") window.location.href = "volunteer-dashboard.html";
    else window.location.href = "citizen-dashboard.html";
}

async function idxHandleLogin(e) {
    e.preventDefault();
    setIdxAuthMsg('', false);
    
    const email = document.getElementById('idxEmail').value.trim();
    const pass = document.getElementById('idxPass').value;
    const btn = document.getElementById('idxLoginBtn');
    
    if(!email || !pass) return setIdxAuthMsg("Please fill all fields", true);
    if (!window.auth || !window.db) return setIdxAuthMsg("Login service is unavailable on this page right now.", true);
    
    btn.textContent = "Logging in...";
    btn.disabled = true;
    
    try {
        const result = await auth.signInWithEmailAndPassword(email, pass);
        const user = result.user;
        const doc = await db.collection("users").doc(user.uid).get();
        
        if (!doc.exists) {
            await auth.signOut();
            setIdxAuthMsg("Account not found. Please register.", true);
            btn.textContent = "Login";
            btn.disabled = false;
            return;
        }
        
        const data = doc.data();
        if (!data.role) {
            await auth.signOut();
            setIdxAuthMsg("Role not found. Contact support.", true);
            btn.textContent = "Login";
            btn.disabled = false;
            return;
        }
        
        setIdxAuthMsg("Login successful! Redirecting...", false);
        setTimeout(() => idxRedirectUser(data.role, user.email, user.uid), 800);
        
    } catch (err) {
        console.error(err);
        setIdxAuthMsg(err.message, true);
        btn.textContent = "Login";
        btn.disabled = false;
    }
}

async function idxHandleGoogle() {
    setIdxAuthMsg('', false);
    if (!window.auth || !window.db || !window.firebase) {
        setIdxAuthMsg("Google login is unavailable on this page right now.", true);
        return;
    }
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const doc = await db.collection("users").doc(user.uid).get();
        if (doc.exists && doc.data().role) {
            setIdxAuthMsg("Login successful! Redirecting...", false);
            idxRedirectUser(doc.data().role, user.email, user.uid);
        } else {
            // New google user without role -> push to citizen registration by default or ask
            setIdxAuthMsg("New account! Please define your role by registering.", true);
            await auth.signOut();
        }
    } catch(err) {
        console.error(err);
        setIdxAuthMsg(err.message, true);
    }
}

// Close on outside click
const aModal = document.getElementById('authModal');
if (aModal) {
    aModal.addEventListener('click', function(e) {
        if (e.target === this) closeAuthModal();
    });
}

// ==================== DONATION MODAL ====================
function openDonationModal(e) {
    if(e) e.preventDefault();
    const modal = document.getElementById('donationModal');
    if(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
function closeDonationModal() {
    const modal = document.getElementById('donationModal');
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
// Close on outside click
const dModal = document.getElementById('donationModal');
if (dModal) {
    dModal.addEventListener('click', function(e) {
        if(e.target === this) closeDonationModal();
    });
}

// ==================== REGISTRATION MODALS ====================
function openRegModal(type, e) {
    if(e) e.preventDefault();
    const regNGO = document.getElementById('regNGO');
    const regVOL = document.getElementById('regVOL');
    const regCIT = document.getElementById('regCIT');
    if (!regNGO || !regVOL || !regCIT) return;

    regNGO.style.display = 'none';
    regVOL.style.display = 'none';
    regCIT.style.display = 'none';
    if(type === 'ngo') regNGO.style.display = 'block';
    else if(type === 'volunteer') regVOL.style.display = 'block';
    else if(type === 'citizen') regCIT.style.display = 'block';
    
    const modal = document.getElementById('regModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
function closeRegModal() {
    const modal = document.getElementById('regModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
const rModal = document.getElementById('regModal');
if (rModal) {
    rModal.addEventListener('click', function(e) {
        if (e.target === this) closeRegModal();
    });
}
