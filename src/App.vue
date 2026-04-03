<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />

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

// Listen for auth state changes and update store
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
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
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
