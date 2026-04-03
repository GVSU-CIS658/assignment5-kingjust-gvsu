<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />

    <!-- Auth section -->
    <div style="margin-top: 20px; text-align: center;" v-if="!beverageStore.user">
      <button @click="withGoogle" style="display: inline-flex; align-items: center; gap: 8px;">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" height="18" />
        Sign in with Google
      </button>
    </div>
    <div style="margin-top: 20px; text-align: center;" v-else>
      <p>{{ beverageStore.user.displayName || beverageStore.user.email }}</p>
      <button @click="signOutUser">Sign out</button>
    </div>
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
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <input type="text" placeholder="Beverage Name" v-model="beverageStore.currentName" />
    <button @click="handleMakeBeverage" :disabled="!beverageStore.user">🍺 Make Beverage</button>
    <p v-if="message">{{ message }}</p>

    <!-- Display user's beverages -->
    <div v-if="beverageStore.user && beverageStore.beverages.length > 0">
      <h3>Your Beverages</h3>
      <ul>
        <li v-for="bev in beverageStore.beverages" :key="bev.id">
          {{ bev.name }} - {{ bev.temp }} | {{ bev.base.name }} | {{ bev.syrup.name }} | {{ bev.creamer.name }}
        </li>
      </ul>
    </div>
  </div>
  <div id="beverage-container" style="margin-top: 20px"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const beverageStore = useBeverageStore();
const message = ref("");

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
  }
}

async function signOutUser() {
  await signOut(auth);
  message.value = "";
}

async function handleMakeBeverage() {
  message.value = await beverageStore.makeBeverage();
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
</style>
