<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      url: "http://127.0.0.1:8080/",
    };
  },
  methods: {
    async login() {
      const userData = {
        username: this.username,
        password: this.password
      };

      try {
        const response = await axios.post("http://localhost:8080/login", userData);
        localStorage.setItem("jwt", response.data);
        console.log(localStorage.getItem("jwt"));

        await new Promise(resolve => setTimeout(resolve, 0)); // You can keep this if it serves your purpose.

        // Redirect to /home after the page reloads
        window.location.href = '/';
      } catch (error) {
        console.error("Login failed: " + error);
      }
    },
  },
};
</script>

<style scoped>
.login {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
}

button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
