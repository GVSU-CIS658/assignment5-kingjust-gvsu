<template>
  <div class="steam-container">
    <div class="steam-wisp" v-for="n in 3" :key="n"></div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.steam-container {
  position: absolute;
  top: -60px;
  left: 10%;
  right: 10%;
  height: 70px;
  pointer-events: none;
  z-index: 600;
}

.steam-wisp {
  position: absolute;
  bottom: 0;
  border-radius: 40%;
  background: rgba(120, 100, 85, 0.4);
  filter: blur(4px);
  opacity: 0;

  &:nth-child(1) {
    left: 18%;
    height: 50px;
    width: 8px;
    animation: wisp-rise 3s ease-out 3.2s infinite;
  }

  &:nth-child(2) {
    left: 48%;
    height: 58px;
    width: 7px;
    animation: wisp-rise 3.4s ease-out 3.6s infinite;
  }

  &:nth-child(3) {
    left: 74%;
    height: 46px;
    width: 8px;
    animation: wisp-rise 2.8s ease-out 3s infinite;
  }
}

@keyframes wisp-rise {
  0% {
    opacity: 0;
    transform: translateY(0) scaleX(1) scaleY(0.8);
  }
  10% {
    opacity: 0.7;
    transform: translateY(-4px) scaleX(1) scaleY(1);
  }
  40% {
    opacity: 0.5;
    transform: translateY(-28px) scaleX(1.3) scaleY(1.1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scaleX(1.5) scaleY(1.2);
  }
}
</style>
