<template>
  <div
    class="syrup"
    :style="{ '--texture-color': beverageStore.currentSyrup?.color }"
  ></div>
</template>

<script setup lang="ts">
import { useBeverageStore } from "../stores/beverageStore";

const beverageStore = useBeverageStore();
</script>
<style lang="scss" scoped>
.syrup {
  transform: translateY(400%);
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;
  background: linear-gradient(
    180deg,
    var(--texture-color) 0%,
    color-mix(in srgb, var(--texture-color) 70%, #000) 100%
  );
  opacity: 0.85;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 40%,
      rgba(0, 0, 0, 0.05) 100%
    );
  }
}
</style>
