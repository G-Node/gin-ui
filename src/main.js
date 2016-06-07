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
    "/public-repositories": { component: PublicRepos, name: "public-repos" },
    "/a/:username/settings": {
        component: Settings,
        name: "profile-settings",
        subRoutes: {
            "/": { component: ProfileSettings },
            "/password": { component: PasswordSettings, name: "password-settings" },
            "/sshkey": { component: Dummy, name: "sshkey-settings" }
        }
    },
    "/a/:username/repositories": {
        component: AccountRepos,
        name: "own-repositories",
        subRoutes: {
            "/": { component: ReposOwn },
            "/shared": { component: ReposShared, name: "shared-repositories" }
        }
    },
    "/r/:username/:repository": {
        component: Dummy,
        name: "repository",
        subRoutes: {
            "/": { component: Dummy },
            "/settings": { component: Dummy, name: "repository-settings" },
            "/files/*file": { component: Dummy, name: "repository-files" }
        }
    }
})

router.start(app, "#main")
