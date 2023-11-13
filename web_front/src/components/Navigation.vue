<template>
  <nav>
    <div class="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/main_page" v-if="isAuth">Main Page</router-link>
        <div v-if="isAuth">
          <font-awesome-icon icon="fa-solid fa-user" />
          <font-awesome-icon @click="logout()" icon="fa-solid fa-xmark" />
        </div>
        <div class="button-group" v-else>
          <router-link to="/login">Login</router-link>
          <router-link to="/signup">Register</router-link>
        </div>

    </div>
  </nav>
</template>

<script>
export default {
  name: "Nav-bar",
  data() {
    return {
      isAuth: false,
      jwt: ""
    };
  },
  mounted(){
    const jwt = localStorage.getItem("jwt")
    this.isAuth = jwt!==null;
    this.jwt = jwt;

  },
  methods:{
    logout(){
      this.isAuth = false;
      localStorage.removeItem("jwt")
    }
  }
};

</script>

<style scoped>
.navbar {
  background-color: #333;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.button-group {
  display: flex;
  gap: 10px;
}

.navbar a {
  text-decoration: none;
  color: #fff;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>
