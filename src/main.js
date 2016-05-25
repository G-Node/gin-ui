import Vue       from "vue"
import VueRouter from "vue-router"

import { AccountAPI }   from './data.js'

import App              from "./App.vue"
import Settings         from "./comp/account/Settings.vue"
import ProfileSettings  from "./comp/account/ProfileSettings.vue"
import PasswordSettings from "./comp/account/PasswordSettings.vue"

import Dummy     from "./comp/Dummy.vue"

Vue.use(VueRouter)

const app = Vue.extend(App)

window.api = {
    accounts: new AccountAPI()
}

window.router = new VueRouter({ history: true })
router.map({
    "/repositories": { component: Dummy },
    "/:username/settings": {
        component: Settings,
        name: "settings",
        subRoutes: {
            "/profile": { component: ProfileSettings, name: "profile-settings" },
            "/password": { component: PasswordSettings, name: "password-settings" }
        }
    },
    "/:username/:repository": {
        component: Dummy,
        subRoutes: {
            "/settings": { component: Dummy },
            "/files/*": { component: Dummy }
        }
    },
    "/:username": { component: Dummy }
})

router.start(app, "#main")
