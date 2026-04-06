<template>
  <div class="page">
    <!-- Floating nav -->
    <nav class="topnav">
      <div class="topnav-inner">
        <div class="logo">
          <span class="logo-icon">&#9749;</span>
          <span class="logo-text">Brew Studio</span>
        </div>
        <div class="nav-auth" v-if="!beverageStore.user">
          <button class="btn btn-ghost" @click="withGoogle">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="14" height="14" />
            Sign in
          </button>
        </div>
        <div class="nav-auth" v-else>
          <span class="nav-user">{{ beverageStore.user.displayName || beverageStore.user.email }}</span>
          <button class="btn btn-ghost" @click="signOutUser">Sign out</button>
        </div>
      </div>
    </nav>

    <!-- Full-bleed background image section -->
    <section class="hero-bg-section">
      <div class="hero-bg">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=80"
          alt="Coffee shop ambiance"
          class="hero-img"
        />
        <div class="hero-overlay"></div>
      </div>

      <!-- Hero text -->
      <div class="hero-content">
        <h1 class="hero-title">Craft Your<br /><span class="hero-accent">Perfect Brew</span></h1>
        <p class="hero-sub">Artisan beverages, designed by you. Make your selections, and we'll bring it to life!</p>
      </div>

      <!-- Studio panel floats on top of the bg image -->
      <div class="studio-panel">
        <div class="studio-inner">

      <!-- Mug showcase -->
      <div class="showcase">
        <div class="showcase-glow"></div>
        <div class="mug-preview">
          <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
        </div>
      </div>

      <!-- Builder columns -->
      <div class="builder-inner">
        <!-- Options card -->
        <div class="card builder-card">
          <div class="card-header">
            <h2>Build Your Drink</h2>
            <p>Customize every detail</p>
          </div>

          <div class="options">
            <div class="option-group">
              <h3>Temperature</h3>
              <div class="pill-group">
                <label
                  v-for="temp in beverageStore.temps"
                  :key="temp"
                  class="pill"
                  :class="{ active: beverageStore.currentTemp === temp }"
                >
                  <input type="radio" name="temperature" :value="temp" v-model="beverageStore.currentTemp" />
                  <span class="pill-icon">{{ temp === 'Hot' ? '&#x2615;' : '&#x2744;' }}</span>
                  {{ temp }}
                </label>
              </div>
            </div>

            <div class="option-group">
              <h3>Base</h3>
              <div class="pill-group">
                <label
                  v-for="base in beverageStore.bases"
                  :key="base.id"
                  class="pill"
                  :class="{ active: beverageStore.currentBase?.id === base.id }"
                >
                  <input type="radio" name="base" :value="base" v-model="beverageStore.currentBase" />
                  <span class="color-dot" :style="{ backgroundColor: base.color }"></span>
                  {{ base.name }}
                </label>
              </div>
            </div>

            <div class="option-group">
              <h3>Syrup</h3>
              <div class="pill-group">
                <label
                  v-for="syrup in beverageStore.syrups"
                  :key="syrup.id"
                  class="pill"
                  :class="{ active: beverageStore.currentSyrup?.id === syrup.id }"
                >
                  <input type="radio" name="syrup" :value="syrup" v-model="beverageStore.currentSyrup" />
                  <span class="color-dot" :style="{ backgroundColor: syrup.color === 'transparent' ? '#e0e0e0' : syrup.color }"></span>
                  {{ syrup.name }}
                </label>
              </div>
            </div>

            <div class="option-group">
              <h3>Creamer</h3>
              <div class="pill-group">
                <label
                  v-for="creamer in beverageStore.creamers"
                  :key="creamer.id"
                  class="pill"
                  :class="{ active: beverageStore.currentCreamer?.id === creamer.id }"
                >
                  <input type="radio" name="creamer" :value="creamer" v-model="beverageStore.currentCreamer" />
                  <span class="color-dot" :style="{ backgroundColor: creamer.color === 'transparent' ? '#e0e0e0' : creamer.color }"></span>
                  {{ creamer.name }}
                </label>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="make-section">
            <input
              class="name-input"
              type="text"
              placeholder="Name your creation..."
              v-model="beverageStore.currentName"
            />
            <button
              class="btn btn-primary"
              @click="handleMakeBeverage"
              :disabled="!beverageStore.user"
            >
              <span class="btn-shine"></span>
              Save Drink
            </button>
          </div>

          <p v-if="!beverageStore.user && !message" class="status-hint">Sign in to start saving your creations</p>
          <p v-if="message" class="status-msg" :class="isError ? 'status-error' : 'status-success'">{{ message }}</p>
        </div>

        <!-- Saved beverages card -->
        <div class="card saved-card" v-if="beverageStore.user && beverageStore.beverages.length > 0">
          <div class="card-header">
            <h2>My Collection</h2>
            <p>{{ beverageStore.beverages.length }} beverage{{ beverageStore.beverages.length !== 1 ? 's' : '' }}</p>
          </div>
          <div class="saved-list">
            <label
              v-for="(beverage, index) in beverageStore.beverages"
              :key="beverage.id"
              class="saved-item"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <input
                type="radio"
                name="savedBeverage"
                :value="beverage"
                @change="beverageStore.showBeverage(beverage)"
              />
              <div class="saved-item-number">{{ index + 1 }}</div>
              <div class="saved-item-content">
                <span class="saved-name">{{ beverage.name }}</span>
                <span class="saved-detail">
                  {{ beverage.temp }} &middot; {{ beverage.base.name }} &middot; {{ beverage.creamer.name }} &middot; {{ beverage.syrup.name }}
                </span>
              </div>
              <span class="saved-arrow">&rsaquo;</span>
            </label>
          </div>
        </div>
      </div>

        </div><!-- end studio-inner -->
      </div><!-- end studio-panel -->
    </section><!-- end hero-bg-section -->

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const beverageStore = useBeverageStore();
const message = ref("");
const isError = ref(false);

onAuthStateChanged(auth, (user) => {
  beverageStore.setUser(user);
});

async function withGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    message.value = error.message || "Sign in failed.";
    isError.value = true;
  }
}

async function signOutUser() {
  await signOut(auth);
  message.value = "";
}

async function handleMakeBeverage() {
  const result = await beverageStore.makeBeverage();
  message.value = result;
  isError.value = !result.includes("successfully");
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');

:root {
  --color-cream: #faf6f1;
  --color-espresso: #1a0e0a;
  --color-mocha: #3c2415;
  --color-caramel: #c8915a;
  --color-latte: #e8d5c0;
  --color-steam: rgba(255, 255, 255, 0.06);
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 12px;
  --radius-pill: 100px;
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-elevated: 0 24px 80px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--color-cream);
  color: var(--color-espresso);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.page {
  width: 100%;
}

/* ── Top Navigation ── */
.topnav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(26, 14, 10, 0.85);
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.topnav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-user {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* ── Hero Background Section ── */
.hero-bg-section {
  position: relative;
  overflow: hidden;
  background: var(--color-espresso);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 480px;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  filter: brightness(0.35) saturate(1.2);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(26, 14, 10, 0.15) 0%,
    rgba(26, 14, 10, 0.3) 50%,
    var(--color-espresso) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 120px 24px 60px;
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(42px, 7vw, 72px);
  font-weight: 900;
  color: #fff;
  line-height: 1.05;
  letter-spacing: -1.5px;
  text-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
}

.hero-accent {
  background: linear-gradient(135deg, var(--color-caramel), #e8c591);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  margin-top: 20px;
  font-size: clamp(15px, 2vw, 18px);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-weight: 400;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.3);
}

/* ── Studio Panel ── */
.studio-panel {
  position: relative;
  z-index: 2;
  padding: 0 24px 80px;
}

.studio-inner {
  max-width: 1100px;
  margin: 0 auto;
  background: var(--color-cream);
  border: 1px solid rgba(200, 180, 160, 0.4);
  border-radius: var(--radius-lg);
  padding: 0 32px 48px;
  box-shadow: var(--shadow-elevated);
}

/* ── Mug Showcase ── */
.showcase {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 48px;
  padding-bottom: 24px;
}

.showcase-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 145, 90, 0.18) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
  pointer-events: none;
}

.mug-preview {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 80px;
  z-index: 2;

  /* Surface shadow beneath the mug */
  &:after {
    content: "";
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.12) 0%, transparent 70%);
    filter: blur(4px);
  }
}

/* ── Builder Columns ── */
.builder-inner {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* ── Cards ── */
.card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.card-header {
  margin-bottom: 28px;

  h2 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 800;
    color: var(--color-espresso);
    letter-spacing: -0.5px;
  }

  p {
    font-size: 13px;
    color: #9a9a9f;
    margin-top: 4px;
    font-weight: 500;
  }
}

.builder-card {
  flex: 1;
  min-width: 0;
}

.saved-card {
  width: 320px;
  flex-shrink: 0;
}

/* ── Options ── */
.options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.option-group {
  h3 {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--color-caramel);
    margin-bottom: 10px;
  }
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-cream);
  color: var(--color-mocha);
  border: 1.5px solid rgba(0, 0, 0, 0.06);
  user-select: none;

  input[type="radio"] {
    display: none;
  }

  &:hover {
    background: var(--color-latte);
    border-color: rgba(200, 145, 90, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &.active {
    background: var(--color-mocha);
    color: #fff;
    border-color: var(--color-mocha);
    box-shadow: 0 4px 16px rgba(60, 36, 21, 0.3);
    transform: translateY(-1px);

    .color-dot {
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
    }
  }
}

.pill-icon {
  font-size: 14px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent);
  margin: 28px 0;
}

/* ── Make Section ── */
.make-section {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.name-input {
  flex: 1;
  padding: 14px 20px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: inherit;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  background: var(--color-cream);
  color: var(--color-espresso);

  &::placeholder {
    color: #b0a99f;
  }

  &:focus {
    border-color: var(--color-caramel);
    box-shadow: 0 0 0 4px rgba(200, 145, 90, 0.12);
    background: #fff;
  }
}

.btn {
  font-family: inherit;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
}

.btn-primary {
  position: relative;
  overflow: hidden;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-mocha), #5a3520);
  color: #fff;
  white-space: nowrap;
  letter-spacing: 0.3px;

  .btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #4d2e18, #6b3f25);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(60, 36, 21, 0.35);

    .btn-shine {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #d2d0cd;
    color: #fff;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.status-hint {
  text-align: center;
  font-size: 13px;
  color: #b0a99f;
  margin-top: 16px;
  font-weight: 500;
}

.status-msg {
  font-size: 13px;
  margin-top: 16px;
  text-align: center;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
}

.status-error {
  color: #c0392b;
  background: #fdecea;
}

.status-success {
  color: #1e7e34;
  background: #e8f5e9;
}

/* ── Saved Beverages ── */
.saved-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.saved-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.25s ease;
  animation: fadeSlideIn 0.4s ease both;

  input[type="radio"] {
    display: none;
  }

  &:hover {
    background: var(--color-cream);
    transform: translateX(4px);

    .saved-arrow {
      opacity: 1;
      color: var(--color-caramel);
    }
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.saved-item-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-caramel);
  flex-shrink: 0;
  border: 1.5px solid rgba(200, 145, 90, 0.2);
}

.saved-item-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.saved-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-espresso);
}

.saved-detail {
  font-size: 11px;
  color: #9a9a9f;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.saved-arrow {
  font-size: 24px;
  font-weight: 300;
  color: #ccc;
  opacity: 0;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .builder-inner {
    flex-direction: column;
  }

  .saved-card {
    width: 100%;
  }

  .hero-content {
    padding: 100px 16px 40px;
  }

  .hero-title {
    font-size: 36px;
  }

  .topnav-inner {
    padding: 0 16px;
  }

  .studio-inner {
    padding: 0 16px 32px;
    border-radius: var(--radius-md);
  }

  .studio-panel {
    padding: 0 12px 60px;
  }

  .card {
    padding: 24px 20px;
  }
}

ul {
  list-style: none;
}
</style>
