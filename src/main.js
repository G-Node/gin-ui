import Vue       from "vue"
import VueRouter from "vue-router"

import { AccountAPI, SSHKeyAPI, RepoAPI, FileAPI }   from "./data.js"

import App              from "./App.vue"
import Settings         from "./comp/account/Settings.vue"
import ProfileSettings  from "./comp/account/ProfileSettings.vue"
import PasswordSettings from "./comp/account/PasswordSettings.vue"
import SSHKeys          from "./comp/account/SSHKeys.vue"
import Repos            from "./comp/account/Repos.vue"
import ReposOwn         from "./comp/account/ReposOwn.vue"
import ReposShared      from "./comp/account/ReposShared.vue"
import PublicRepos      from "./comp/repo/PublicRepos.vue"
import Repo             from "./comp/repo/Repo.vue"
import RepoReadme       from "./comp/repo/RepoReadme.vue"
import RepoFiles        from "./comp/repo/RepoFiles.vue"
import RepoSettings     from "./comp/repo/RepoSettings.vue"
import RepoCreate       from "./comp/repo/RepoCreate.vue"

import Dummy        from "./comp/Dummy.vue"
import { filesize } from "./filters"

Vue.filter("filesize", filesize)
Vue.use(VueRouter)

const app = Vue.extend(App)

window.api = {
    accounts: new AccountAPI(),
    keys: new SSHKeyAPI(),
    repos: new RepoAPI(),
    files: new FileAPI()
}

window.router = new VueRouter({ history: true })
window.router.map({
    "/a/:username/settings": {
        component: Settings,
        name: "profile-settings",
        subRoutes: {
            "/": { component: ProfileSettings },
            "/password": { component: PasswordSettings, name: "password-settings" },
            "/sshkey": { component: SSHKeys, name: "sshkey-settings" }
        }
    },
    "/a/:username/repositories": {
        component: Repos,
        name: "own-repositories",
        subRoutes: {
            "/": { component: ReposOwn },
            "/shared": { component: ReposShared, name: "shared-repositories" }
        }
    },
    "/a/:username/repository-create": {
        component: RepoCreate,
        name: "repository-create"
    },
    "/r/public-repositories": {
        component: PublicRepos,
        name: "public-repos"
    },
    "/r/:username/:repository": {
        component: Repo,
        name: "repository",
        subRoutes: {
            "/": { component: RepoReadme },
            "/settings": { component: RepoSettings, name: "repository-settings" },
            "/files/*root": { component: RepoFiles, name: "repository-files" }
        }
    }
})

window.router.start(app, "#main")
