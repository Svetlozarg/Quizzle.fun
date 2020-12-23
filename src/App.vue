<template>
  <Navbar />
  <router-view />
</template>

<script>
import Navbar from "./components/Navbar";
export default {
  setup() {
    return {
      Navbar,
    };
  },
};
</script>