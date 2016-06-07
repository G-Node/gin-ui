import Vue       from "vue"
import VueRouter from "vue-router"

import { AccountAPI, RepoAPI }   from './data.js'

import App              from "./App.vue"
import Settings         from "./comp/account/Settings.vue"
import ProfileSettings  from "./comp/account/ProfileSettings.vue"
import PasswordSettings from "./comp/account/PasswordSettings.vue"
import PublicRepos      from "./comp/repo/PublicRepos.vue"
import AccountRepos     from "./comp/repo/AccountRepos.vue"
import ReposOwn         from "./comp/repo/ReposOwn.vue"
import ReposShared      from "./comp/repo/ReposShared.vue"

import Dummy     from "./comp/Dummy.vue"

Vue.use(VueRouter)

const app = Vue.extend(App)

window.api = {
    accounts: new AccountAPI(),
    repos: new RepoAPI()
}

window.router = new VueRouter({ history: true })
router.map({
    "/repositories": { component: PublicRepos, name: "public-repos" },
    "/:username/settings": {
        component: Settings,
        name: "settings",
        subRoutes: {
            "/profile": { component: ProfileSettings, name: "profile-settings" },
            "/password": { component: PasswordSettings, name: "password-settings" }
        }
    },
    "/:username/repositories": {
        component: AccountRepos,
        name: "account-page",
        subRoutes: {
            "/own": { component: ReposOwn, name: "own-repositories" },
            "/shared": { component: ReposShared, name: "shared-repositories" }
        }
    },
    "/:username/:repository": {
        component: Dummy,
        name: "repository",
        subRoutes: {
            "/settings": { component: Dummy, name: "repository-settings" },
            "/files/*": { component: Dummy, name: "repository-files" }
        }
    }
})

router.start(app, "#main")
