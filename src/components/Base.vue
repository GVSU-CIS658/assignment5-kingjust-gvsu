<template>
  <div
    class="baseBeverage"
    :style="{ '--base-color': beverageStore.currentBase?.color }"
  ></div>
</template>

<script setup lang="ts">
import { useBeverageStore } from "../stores/beverageStore";

const beverageStore = useBeverageStore();
</script>

<style scoped>
.baseBeverage {
  position: relative;
  width: 100%;
  height: 100%;
  bottom: 0;
  animation: pour-tea 2s;
  z-index: 300;
  background: linear-gradient(
    180deg,
    var(--base-color) 0%,
    color-mix(in srgb, var(--base-color) 75%, #000) 100%
  );
}

.baseBeverage:after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    170deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 30%,
    rgba(0, 0, 0, 0.05) 100%
  );
  pointer-events: none;
}
</style>
