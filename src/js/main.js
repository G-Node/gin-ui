import Vue       from "vue"
import VueRouter from "vue-router"

import API              from "./data.js"

import App              from "./App.vue"
import Index            from "./comp/Index.vue"
import OAuthLogin       from "./comp/oauth/Login.js"
import Search           from "./comp/search/Search.vue"
import RepoSearch      from "./comp/search/RepoSearch.vue"
import UserSearch       from "./comp/search/UserSearch.vue"
import Settings         from "./comp/account/Settings.vue"
import ProfileSettings  from "./comp/account/ProfileSettings.vue"
import PasswordSettings from "./comp/account/PasswordSettings.vue"
import EmailSettings    from "./comp/account/EmailSettings.vue"
import SSHKeySettings   from "./comp/account/SSHKeySettings.vue"
import AffiliationSettings from "./comp/account/AffiliationSettings.vue"
import Repos            from "./comp/account/Repos.vue"
import ReposOwn         from "./comp/account/ReposOwn.vue"
import ReposShared      from "./comp/account/ReposShared.vue"
import Repo             from "./comp/repo/Repo.vue"
import RepoReadme       from "./comp/repo/RepoReadme.vue"
import RepoFiles        from "./comp/repo/RepoFiles.vue"
import RepoSettings     from "./comp/repo/RepoSettings.vue"
import RepoCreate       from "./comp/repo/RepoCreate.vue"

import config           from "./config.json"

Vue.use(VueRouter)

window.api = new API(config.auth_url, config.repo_url)

const router = new VueRouter({
    history: "true",
    routes: [
        { path: "/", component: Index,
            name: "index" },
        { path: "/oauth/login", component: OAuthLogin,
            name: "oauth-login" },
        { path: "/account/settings", component: Settings,
            children: [
                { path: "/profile", component: ProfileSettings,
                    name: "profile-settings", title: "Profile Settings" },
                { path: "/password", component: PasswordSettings,
                    name: "password-settings", title: "Password Settings" },
                { path: "/email", component: EmailSettings,
                    name: "email-settings", title: "E-Mail Settings" },
                { path: "/sshkey", component: SSHKeySettings,
                    name: "sshkey-settings", title: "SSH Key Settings" },
                { path: "/affiliation", component: AffiliationSettings,
                    name: "affiliation-settings", title: "Affiliation Settings" }
            ]
        },
        { path: "/account/repository-create", component: RepoCreate,
            name: "repository-create", title: "Create new repository" },
        { path: "/search", component: Search,
            name: "search", title: "Public Data",
            children: [
                { path: "repos", component: RepoSearch,
                    name: "search-repos", title: "Search Repositories" },
                { path: "users", component: UserSearch,
                    name: "search-users", title: "Search Users" }
            ]
        },
        { path: "/:username/repositories", component: Repos,
            name: "repositories", title: "Repositories",
            children: [
                { path: "own", component: ReposOwn,
                    name: "own-repositories", title: "Own Repositories" },
                { path: "shared", component: ReposShared,
                    name: "shared-repositories", title: "Shared Repositories" }
            ]
        },
        { path: "/:username/:repository", component: Repo,
            name: "repository", title: "Repository Overview",
            children: [
                { path: "info", component: RepoReadme,
                    name: "repository-info", title: "Repository info"},
                { path: "settings", component: RepoSettings,
                    name: "repository-settings", title: "Repository Settings" }
            ]
        }
    ]
})

new Vue(
    Vue.util.extend({router}, App)
).$mount("#main")
