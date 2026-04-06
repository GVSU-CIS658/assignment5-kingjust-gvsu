<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1>Brew Studio</h1>
      <p class="subtitle">Craft your perfect beverage</p>
    </header>

    <!-- Mug preview -->
    <div class="mug-preview">
      <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    </div>

    <!-- Content layout -->
    <div class="content-layout">

    <!-- Main card -->
    <div class="card main-card">
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
              <input
                type="radio"
                name="temperature"
                :value="temp"
                v-model="beverageStore.currentTemp"
              />
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
              <input
                type="radio"
                name="base"
                :value="base"
                v-model="beverageStore.currentBase"
              />
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
              <input
                type="radio"
                name="syrup"
                :value="syrup"
                v-model="beverageStore.currentSyrup"
              />
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
              <input
                type="radio"
                name="creamer"
                :value="creamer"
                v-model="beverageStore.currentCreamer"
              />
              <span class="color-dot" :style="{ backgroundColor: creamer.color === 'transparent' ? '#e0e0e0' : creamer.color }"></span>
              {{ creamer.name }}
            </label>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Auth section -->
      <div class="auth-section" v-if="!beverageStore.user">
        <button class="btn btn-google" @click="withGoogle">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="16" height="16" />
          Sign in with Google
        </button>
      </div>
      <div class="auth-section auth-signed-in" v-else>
        <span class="user-info">Signed in as <strong>{{ beverageStore.user.displayName || beverageStore.user.email }}</strong></span>
        <button class="btn btn-link" @click="signOutUser">Sign out</button>
      </div>

      <!-- Make beverage -->
      <div class="make-section">
        <input
          class="name-input"
          type="text"
          placeholder="Name your beverage..."
          v-model="beverageStore.currentName"
        />
        <button
          class="btn btn-primary"
          @click="handleMakeBeverage"
          :disabled="!beverageStore.user"
        >
          Make Beverage
        </button>
      </div>

      <!-- Status message -->
      <p v-if="!beverageStore.user && !message" class="status-hint">Please sign in to save your beverage.</p>
      <p v-if="message" class="status-msg" :class="isError ? 'status-error' : 'status-success'">{{ message }}</p>

    </div>

    <!-- Saved beverages -->
    <div class="card saved-card" v-if="beverageStore.user && beverageStore.beverages.length > 0">
      <h3>Your Beverages</h3>
      <div class="saved-list">
        <label
          v-for="beverage in beverageStore.beverages"
          :key="beverage.id"
          class="saved-item"
        >
          <input
            type="radio"
            name="savedBeverage"
            :value="beverage"
            @change="beverageStore.showBeverage(beverage)"
          />
          <div class="saved-item-content">
            <span class="saved-name">{{ beverage.name }}</span>
            <span class="saved-detail">{{ beverage.temp }} &middot; {{ beverage.base.name }} &middot; {{ beverage.creamer.name }} &middot; {{ beverage.syrup.name }}</span>
          </div>
        </label>
      </div>
    </div>

    </div><!-- end content-layout -->
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #3a1c0f 0%, #6e4228 40%, #956f5a 100%);
  color: #1d1d1f;
  -webkit-font-smoothing: antialiased;
  padding: 40px 16px;
}

.app-container {
  width: 100%;
  max-width: 860px;
}

.app-header {
  text-align: center;
  margin-bottom: 24px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-top: 4px;
    font-weight: 400;
  }
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.07),
    0 12px 40px rgba(0, 0, 0, 0.15);
}

.mug-preview {
  display: flex;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 0;
  margin-bottom: 16px;
  position: relative;
  overflow: visible;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-group {
  h3 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #86868b;
    margin-bottom: 8px;
  }
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f5f5f7;
  color: #1d1d1f;
  border: 1.5px solid transparent;
  user-select: none;

  input[type="radio"] {
    display: none;
  }

  &:hover {
    background: #e8e8ed;
  }

  &.active {
    background: #1d1d1f;
    color: #fff;
    border-color: #1d1d1f;

    .color-dot {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

ul {
  list-style: none;
}
.divider {
  height: 1px;
  background: #e5e5ea;
  margin: 20px 0;
}

.auth-section {
  margin-bottom: 16px;
  text-align: center;
}

.auth-signed-in {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
}

.user-info {
  font-size: 13px;
  color: #6e6e73;

  strong {
    color: #1d1d1f;
  }
}

.btn {
  font-family: inherit;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-google {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  background: #fff;
  color: #1d1d1f;
  border: 1.5px solid #e5e5ea;
  font-size: 14px;

  &:hover {
    background: #f5f5f7;
    border-color: #d2d2d7;
  }

  &:active {
    transform: scale(0.98);
  }
}

.btn-link {
  background: none;
  color: #0071e3;
  padding: 4px 0;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
}

.btn-primary {
  padding: 12px 20px;
  border-radius: 12px;
  background: #1d1d1f;
  color: #fff;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #333336;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background: #d2d2d7;
    color: #fff;
    cursor: not-allowed;
  }
}

.make-section {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.name-input {
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid #e5e5ea;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
  background: #fff;

  &::placeholder {
    color: #aeaeb2;
  }

  &:focus {
    border-color: #0071e3;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.12);
  }
}

.status-hint {
  text-align: center;
  font-size: 13px;
  color: #86868b;
  margin-top: 12px;
}

.status-msg {
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
  font-weight: 500;
}

.status-error {
  color: #ff3b30;
}

.status-success {
  color: #34c759;
}

.content-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.main-card {
  flex: 1;
  min-width: 0;
}

.saved-card {
  width: 280px;
  flex-shrink: 0;
  margin-top: 0;

  h3 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #86868b;
    margin-bottom: 12px;
  }
}

@media (max-width: 700px) {
  .content-layout {
    flex-direction: column;
  }

  .main-card,
  .saved-card {
    width: 100%;
  }
}

.saved-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.saved-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s ease;

  input[type="radio"] {
    display: none;
  }

  &:hover {
    background: #f5f5f7;
  }
}

.saved-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.saved-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.saved-detail {
  font-size: 12px;
  color: #86868b;
}
</style>
