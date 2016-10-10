import Vue       from "vue"
import VueRouter from "vue-router"

import API              from "./data.js"

import App              from "./App.vue"
import Index            from "./comp/Index.vue"

import config           from "./config.json"

Vue.use(VueRouter)

window.api = new API(config.auth_url, config.repo_url)

var router = new VueRouter({
    history: "true",
    routes: [
        { path: "/", component: Index, name: "index" }
    ]
})

new Vue({
    el: "#main",
    router,
    render(h) {
        return h(App)
    }
})
