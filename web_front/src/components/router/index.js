import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/components/Pages/LoginPage.vue";
import GuestPage from "@/components/Pages/GuestPage.vue";
import SignUpPage from "@/components/Pages/SignUpPage.vue";
import MainPage from "@/components/Pages/MainPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Guest page",
            component: GuestPage,
        },

        {
            path: "/login",
            name: "Login page",
            component: LoginPage,
        },
        {
            path: "/signup",
            name: "Sign up page",
            component: SignUpPage,
        },
        {
            path: "/main_page",
            name: "Main page",
            component: MainPage,
        },
    ],
});

export default router;