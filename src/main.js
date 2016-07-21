import Vue       from "vue"
import VueRouter from "vue-router"

import API              from "./data.js"

import App              from "./App.vue"
import Index            from "./comp/Index.vue"
import OAuthLogin       from "./comp/oauth/Login.js"
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
    "/": {
        component: Index,
        name: "index"
    },
    "/oauth/login": {
        component: OAuthLogin,
        name: "oauth-login"
    },
    "/account/settings": {
        component: Settings,
        name: "profile-settings",
        title: "Profile Settings",
        subRoutes: {
            "/": {
                component: ProfileSettings
            },
            "/password": {
                component: PasswordSettings,
                name: "password-settings",
                title: "Password Settings"
            },
            "/sshkey": {
                component: SSHKeySettings,
                name: "sshkey-settings",
                title: "SSH Key Settings"
            },
            "/affiliation": {
                component: AffiliationSettings,
                name: "affiliation-settings",
                title: "Affiliation Settings"
            }
        }
    },
    "/account/repository-create": {
        component: RepoCreate,
        name: "repository-create",
        title: "Create New Repository"
    },
    "/public-repositories": {
        component: PublicRepos,
        name: "public-repos",
        title: "Public Data"
    },
    "/:username/repositories": {
        component: Repos,
        name: "own-repositories",
        title: "Own Repositories",
        subRoutes: {
            "/": {
                component: ReposOwn
            },
            "/shared": {
                component: ReposShared,
                name: "shared-repositories",
                title: "Shared Repositories"
            }
        }
    },
    "/:username/:repository": {
        component: Repo,
        name: "repository",
        title: "Repository Overview",
        subRoutes: {
            "/": {
                component: RepoReadme
            },
            "/settings": {
                component: RepoSettings,
                name: "repository-settings",
                title: "Repository Settings"
            },
            "/files/*root": {
                component: RepoFiles,
                name: "repository-files",
                title: "Browse Repository Files"
            }
        }
    }
})

window.router.start(app, "#main")
