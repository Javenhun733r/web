<template>
  <NavBar/>
  <div class="app">

    <content>
      <router-view/>

    </content>
    <footer>

    </footer>

  </div>
</template>
<script setup>

import NavBar from "@/components/Navigation.vue";
</script>



<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Raleway", sans-serif;
  font-weight: 400;
}
.app{

  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../src/components/materials/background.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center top;
  background-size: cover;
}

</style>
