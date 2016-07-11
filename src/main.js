import Vue       from "vue"
import VueRouter from "vue-router"

import API              from "./data.js"

import App              from "./App.vue"
import OAuthLogin       from "./comp/oauth/Login.vue"
import Settings         from "./comp/account/Settings.vue"
import ProfileSettings  from "./comp/account/ProfileSettings.vue"
import PasswordSettings from "./comp/account/PasswordSettings.vue"
import SSHKeySettings   from "./comp/account/SSHKeySettings.vue"
import AffiliationSettings from "./comp/account/AffiliationSettings.vue"
import Repos            from "./comp/account/Repos.vue"
import ReposOwn         from "./comp/account/ReposOwn.vue"
import ReposShared      from "./comp/account/ReposShared.vue"
import PublicRepos      from "./comp/repo/PublicRepos.vue"
import Repo             from "./comp/repo/Repo.vue"
import RepoReadme       from "./comp/repo/RepoReadme.vue"
import RepoFiles        from "./comp/repo/RepoFiles.vue"
import RepoSettings     from "./comp/repo/RepoSettings.vue"
import RepoCreate       from "./comp/repo/RepoCreate.vue"

import config           from "./config.json"
import { filesize }     from "./filters"


Vue.filter("filesize", filesize)
Vue.use(VueRouter)

const app = Vue.extend(App)

window.api = new API(config.auth_url, config.repo_url)
window.router = new VueRouter({ history: true })
window.router.map({
    "/oauth/login": {
        component: OAuthLogin,
        name: "oauth-login"
    },
    "/a/:username/settings": {
        component: Settings,
        name: "profile-settings",
        subRoutes: {
            "/": { component: ProfileSettings },
            "/password": { component: PasswordSettings, name: "password-settings" },
            "/sshkey": { component: SSHKeySettings, name: "sshkey-settings" },
            "/affiliation": { component: AffiliationSettings, name: "affiliation-settings" }
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
