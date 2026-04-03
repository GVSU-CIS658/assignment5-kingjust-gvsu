<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <h1>Brew Studio</h1>
      <p class="subtitle">Craft your perfect beverage</p>
    </header>

    <!-- Mug preview (outside card for transparent background) -->
    <div class="mug-preview">
      <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    </div>

    <!-- Main card -->
    <div class="card">
      <ul>
        <li>
          <template v-for="temp in beverageStore.temps" :key="temp">
            <label>
              <input
                type="radio"
                name="temperature"
                :id="`r${temp}`"
                :value="temp"
                v-model="beverageStore.currentTemp"
              />
              {{ temp }}
            </label>
          </template>
        </li>
        <li>
          <template v-for="base in beverageStore.bases" :key="base.id">
            <label>
              <input
                type="radio"
                name="base"
                :id="`r${base.id}`"
                :value="base"
                v-model="beverageStore.currentBase"
              />
              {{ base.name }}
            </label>
          </template>
        </li>
        <li>
          <template v-for="creamer in beverageStore.creamers" :key="creamer.id">
            <label>
              <input
                type="radio"
                name="creamer"
                :id="`r${creamer.id}`"
                :value="creamer"
                v-model="beverageStore.currentCreamer"
              />
              {{ creamer.name }}
            </label>
          </template>
        </li>
        <li>
          <template v-for="syrup in beverageStore.syrups" :key="syrup.id">
            <label>
              <input
                type="radio"
                name="syrup"
                :id="`r${syrup.id}`"
                :value="syrup"
                v-model="beverageStore.currentSyrup"
              />
              {{ syrup.name }}
            </label>
          </template>
        </li>
      </ul>

      <!-- Auth section -->
      <div v-if="!beverageStore.user">
        <button @click="withGoogle" style="display: inline-flex; align-items: center; gap: 8px;">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
          Sign in with Google
        </button>
      </div>
      <div v-else style="display: flex; align-items: center; gap: 8px;">
        <p>Signed in as {{ beverageStore.user.displayName || beverageStore.user.email }}</p>
        <button @click="signOutUser">Sign out</button>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
        <input type="text" placeholder="Beverage Name" v-model="beverageStore.currentName" />
        <button @click="handleMakeBeverage" :disabled="!beverageStore.user">&#127861; Make Beverage</button>
      </div>
      <p v-if="!beverageStore.user && !message">Please sign in to save your beverage.</p>
      <p v-if="message" :class="isError ? 'error' : 'success'">{{ message }}</p>

      <!-- Saved beverages list -->
      <div id="beverage-container" v-if="beverageStore.user">
        <template v-for="beverage in beverageStore.beverages" :key="beverage.id">
          <label>
            <input
              type="radio"
              name="savedBeverage"
              :value="beverage"
              @change="beverageStore.showBeverage(beverage)"
            />
            {{ beverage.name }}
          </label>
        </template>
      </div>
    </div>
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
  max-width: 420px;
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

ul {
  list-style: none;
}
.error {
  color: #f32525da;
  font-size: 0.9em;
  margin: 0.25em 0;
}
.success {
  color: #25f325da;
  font-size: 0.9em;
  margin: 0.25em 0;
}
</style>
