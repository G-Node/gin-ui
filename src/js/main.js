// Copyright (c) 2016, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

// Be advised: here be ugly dragons, if someone can read this,
// save me from js and vue 2.0!

import Vue                  from "vue"
import VueRouter            from "vue-router"
import VueCookies           from "vue-cookies"

import API                  from "./data.js"
import App                  from "./App.vue"
import Index                from "./comp/Index.vue"
import NotFound             from "./comp/NotFound.vue"

import Authorize            from "./comp/oauth/Authorize.vue"
import OAuthLogin           from "./comp/oauth/Login.vue"

import Search               from "./comp/search/Search.vue"
import RepoSearch           from "./comp/search/RepoSearch.vue"
import UserSearch           from "./comp/search/UserSearch.vue"

import Settings             from "./comp/account/Settings.vue"
import ProfileSettings      from "./comp/account/ProfileSettings.vue"
import PasswordSettings     from "./comp/account/PasswordSettings.vue"
import EmailSettings        from "./comp/account/EmailSettings.vue"
import SSHKeySettings       from "./comp/account/SSHKeySettings.vue"
import AffiliationSettings  from "./comp/account/AffiliationSettings.vue"

import Repos                from "./comp/account/Repos.vue"
import ReposOwn             from "./comp/account/ReposOwn.vue"
import ReposShared          from "./comp/account/ReposShared.vue"
import Repo                 from "./comp/repo/Repo.vue"
import RepoReadme           from "./comp/repo/RepoReadme.vue"
import RepoFiles            from "./comp/repo/RepoFiles.vue"
import RepoDOI              from "./comp/repo/RepoDOI.vue"
import RepoSettings         from "./comp/repo/RepoSettings.vue"
import RepoCreate           from "./comp/repo/RepoCreate.vue"

import Terms                from "./comp/info/Terms.vue"
import About                from "./comp/info/About.vue"
import Contact              from "./comp/info/Contact.vue"
import Imprint              from "./comp/info/Imprint.vue"
import DOI                  from "./comp/info/DOI.vue"

import config               from "./config.json"

import { filesize }                 from "./filters"
import { privacyLabel }             from "./filters"
import { reLabelCollaborator }      from "./filters"
import { fileSysLabel }             from "./filters"

Vue.filter("filesize", filesize)
Vue.filter("privacyLabel", privacyLabel)
Vue.filter("reLabelCollaborator", reLabelCollaborator)
Vue.filter("fileSysLabel", fileSysLabel)

Vue.use(VueRouter)
Vue.use(VueCookies)

window.api = new API(config)

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/", component: Index, name: "index", meta: { title: "G-Node Infrastructure Services" } },

        { path: "/oauth/login", component: OAuthLogin, name: "oauth-login" },
        { path: "/oauth/authorize", component: Authorize, name: "oauth-authorize" },

        { path: "/terms", component: Terms, name: "terms", meta: { title: "Terms of Use" } },

        { path: "/info/about", component: About, name: "about", meta: { title: "About" } },
        { path: "/info/contact", component: Contact, name: "contact", meta: { title: "Contact" } },
        { path: "/info/imprint", component: Imprint, name: "imprint", meta: { title: "Imprint" } },
        { path: "/info/doi", component: DOI, name: "doi", meta: { title: "DOI file about" } },

        { path: "/account/settings",
            component: Settings,
            children: [
                { path: "profile",
                    component: ProfileSettings,
                    name: "profile-settings",
                    meta: { title: "Profile Settings" } },
                { path: "password",
                    component: PasswordSettings,
                    name: "password-settings",
                    meta: { title: "Password Settings" } },
                { path: "email",
                    component: EmailSettings,
                    name: "email-settings",
                    meta: { title: "E-Mail Settings" } },
                { path: "sshkey",
                    component: SSHKeySettings,
                    name: "sshkey-settings",
                    meta: { title: "SSH Key Settings" } },
                { path: "affiliation",
                    component: AffiliationSettings,
                    name: "affiliation-settings",
                    meta: { title: "Affiliation Settings" } }
            ]
        },

        { path: "/search",
            component: Search,
            name: "search",
            meta: { title: "Public Data" },
            children: [
                { path: "repos",
                    component: RepoSearch,
                    name: "search-repos",
                    meta: { title: "Search Repositories" } },
                { path: "users",
                    component: UserSearch,
                    name: "search-users",
                    meta: { title: "Search Users" } }
            ]
        },

        { path: "/account/repository-create",
            component: RepoCreate,
            name: "repository-create",
            meta: { title: "Create new repository" } },
        { path: "/:username/repositories",
            component: Repos,
            name: "repositories",
            meta: { title: "Repositories" },
            children: [
                { path: "own",
                    component: ReposOwn,
                    name: "own-repositories",
                    meta: { title: "Own Repositories" } },
                { path: "shared",
                    component: ReposShared,
                    name: "shared-repositories",
                    meta: { title: "Shared Repositories" } }
            ]
        },
        { path: "/:username/:repository",
            component: Repo,
            name: "repository",
            meta: { title: "Repository Overview" },
            children: [
                { path: "info",
                    component: RepoReadme,
                    name: "repository-info",
                    meta: { title: "Repository info"} },
                { path: "settings",
                    component: RepoSettings,
                    name: "repository-settings",
                    meta: { title: "Repository Settings" } },
                { path: "files/:root",
                    component: RepoFiles,
                    name: "repository-files",
                    meta: { title: "Browse Repository Files" } },
                { path: "doi",
                    component: RepoDOI,
                    name: "repository-doi",
                    meta: { }
                }
            ]
        },
        { path: "*", component: NotFound, name: "not-found", meta: { title: "Page not found" } }
    ]
})

new Vue(
    Vue.util.extend({router}, App)
).$mount("#main")
