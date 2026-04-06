<template>
  <div
    class="froth"
    :style="{ '--creamer-color': beverageStore.currentCreamer?.color }"
  >
  </div>
</template>

<script setup lang="ts">
import { useBeverageStore } from "../stores/beverageStore";

const beverageStore = useBeverageStore();
</script>
<style lang="scss" scoped>
.froth {
  transform: translateY(400%);
  position: relative;
  height: 20%;
  width: 100%;
  animation: pour-tea 2s 2s forwards;
  z-index: 4;
  background: linear-gradient(
    180deg,
    var(--creamer-color) 0%,
    color-mix(in srgb, var(--creamer-color) 85%, #a08060) 100%
  );

  /* Soft foam top edge */
  &:before {
    content: "";
    position: absolute;
    top: -6px;
    left: -2px;
    right: -2px;
    height: 14px;
    background: var(--creamer-color);
    border-radius: 50% 50% 40% 40%;
    filter: blur(2px);
    opacity: 0.7;
  }

  /* Light reflection on foam surface */
  &:after {
    content: "";
    position: absolute;
    top: 2px;
    left: 15%;
    width: 35%;
    height: 40%;
    background: linear-gradient(
      160deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    border-radius: 50%;
    filter: blur(2px);
  }
}
</style>
