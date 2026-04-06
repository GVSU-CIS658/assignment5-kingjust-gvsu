<template>
  <div class="snow-container">
    <div class="snowflake" v-for="n in 3" :key="n">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="1" x2="10" y2="19" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="2.2" y1="5.5" x2="17.8" y2="14.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="2.2" y1="14.5" x2="17.8" y2="5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="10" y1="4" x2="7.5" y2="2.5" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="10" y1="4" x2="12.5" y2="2.5" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="10" y1="16" x2="7.5" y2="17.5" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="10" y1="16" x2="12.5" y2="17.5" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.snow-container {
  position: absolute;
  top: -60px;
  left: 10%;
  right: 10%;
  height: 70px;
  pointer-events: none;
  z-index: 600;
}

.snowflake {
  position: absolute;
  bottom: 0;
  color: rgba(140, 190, 230, 0.85);
  filter: drop-shadow(0 0 2px rgba(140, 190, 230, 0.4));
  opacity: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  &:nth-child(1) {
    left: 18%;
    width: 14px; height: 14px;
    animation: flake-rise 3s ease-out 3.2s infinite;
  }

  &:nth-child(2) {
    left: 48%;
    width: 16px; height: 16px;
    animation: flake-rise 3.4s ease-out 3.6s infinite;
  }

  &:nth-child(3) {
    left: 74%;
    width: 12px; height: 12px;
    animation: flake-rise 2.8s ease-out 3s infinite;
  }
}

@keyframes flake-rise {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(0deg);
  }
  10% {
    opacity: 0.9;
    transform: translateY(-4px) rotate(10deg);
  }
  40% {
    opacity: 0.6;
    transform: translateY(-28px) rotate(40deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) rotate(90deg);
  }
}
</style>
