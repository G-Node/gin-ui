// Copyright (c) 2016, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

import { stateHash } from "./utils.js"

export default class API {
    constructor(conf) {
        this.config   = { auth_url: conf.auth_url,
                            repo_url: conf.repo_url,
                            doi_url: conf.doi_url,
                            doi_file: conf.doi_file,
                            doid_url: conf.doid_url,
                            client_id: conf.client_id,
                            client_secret: conf.client_secret,
                            contact_email: conf.contact_email,
                            token: null }
        this.accounts = new AccountAPI(this.config)
        this.keys     = new SSHKeyAPI(this.config)
        this.repos    = new RepoAPI(this.config)
    }

    // Redirects to the gin-auth login page to request an access token and create a session.
    // A successful request will redirect back to gin-ui/oauth/login for the token validation.
    authorize() {
        const state = stateHash(this.config.client_id, navigator.userAgent)
        const url = this.config.auth_url + "/oauth/authorize?"
        const params = [
            ["response_type", "token"],
            ["client_id", this.config.client_id],
            ["redirect_uri", `${window.location.origin}/oauth/login`],
            ["scope", "account-read account-write repo-read repo-write"],
            ["state", encodeURIComponent(state)]
        ]
        const query = params.map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1])).join("&")
        window.location.href = url + query
        if (window.event !== undefined) {
            window.event.returnValue = false
        }
    }

    // Requests validation of an access token at gin-auth and sets
    // the account information corresponding to the token.
    login(token_str) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/oauth/validate/${token_str}`,
                type: "GET",
                dataType: "json",
                success: (token) => {
                    resolve(token)
                },
                error: (error) => {
                    reject(error.responseJSON)
                }
            })
        }).then(
            (token) => {
                this.config.token = token
                localStorage.setItem("token", JSON.stringify(token))
                return this.accounts.get(token.login)   
            }
        )
    }

    logout() {
        if (this.config.token) {
            const token = encodeURIComponent(this.config.token.jti)
            const redirect = encodeURIComponent(window.location.origin)
            const url = `${this.config.auth_url}/oauth/logout/${token}?redirect_uri=${redirect}`

            this.config.token = null
            localStorage.removeItem("token")

            window.location.href = url
            window.event.returnValue = false
        }
    }

    restore() {
        return new Promise((resolve, reject) => {
            let token = localStorage.getItem("token")
            if (!token) {
                reject(Error("No token in local storage"))
                return
            }
            token = JSON.parse(token)
            let expires = new Date(token.exp)
            if (expires < Date.now()) {
                reject(Error("Token was expired"))
                return
            }
            resolve(token)
        }).then((token) => {
            this.config.token = token
            return this.accounts.get(token.login)
        })
    }

    register() {
        const state = stateHash(this.config.client_id, navigator.userAgent)
        const uri = this.config.auth_url + "/oauth/registration_init?"
        const kv = [
            ["response_type", "client"],
            ["client_id", this.config.client_id],
            ["redirect_uri", `${window.location.origin}`],
            ["scope", "account-create"],
            ["state", encodeURIComponent(state)]
        ]
        const query = kv.map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1])).join("&")
        window.location.href = uri + query
        window.event.returnValue = false
    }
}

class AccountAPI {
    constructor(config) {
        this.config = config
    }

    get(username) {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${this.config.auth_url}/api/accounts/${username}`,
                dataType: "json",
                success: (acc) => resolve(acc),
                error: (error) => reject(error.responseJSON)
            }
            if (this.config.token) {
                request.headers = { Authorization: `Bearer ${this.config.token.jti}` }
            }
            $.ajax(request)
        })
    }

    search(text) {
        return new Promise((resolve, reject) => {
            const request = {
                url: `${this.config.auth_url}/api/accounts`,
                data: {q: text},
                dataType: "json",
                success: (accounts) => resolve(accounts),
                error: (error) => reject(error.responseJSON)
            }
            if (this.config.token) {
                request.headers = { Authorization: `Bearer ${this.config.token.jti}` }
            }
            $.ajax(request)
        })
    }

    update(account) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${account.login}`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: { Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(account),
                dataType: "json",
                success: (acc) => resolve(acc),
                error: (error) => reject(error.responseJSON)
            })
        })
    }
    
    updatePassword(username, password_old, password_new, password_new_repeat) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${username}/password`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: { Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify({password_old, password_new, password_new_repeat}),
                success: () => resolve("ok"),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    updateEmail(login, email, password) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${login}/email`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify({password, email}),
                success: () => resolve("ok"),
                error: (error) => reject(error.responseJSON)
            })
        })
    }
}

class SSHKeyAPI {
    constructor(config) {
        this.config = config
    }
    
    list(username) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${username}/keys`,
                headers: { Authorization: `Bearer ${this.config.token.jti}` },
                dataType: "json",
                success: (keys) => resolve(keys),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    create(username, key) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/accounts/${username}/keys`,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                headers: { Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(key),
                dataType: "json",
                success: (key) => resolve(key),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    remove(key) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.auth_url}/api/keys?fingerprint=${encodeURIComponent(key.fingerprint)}`,
                type: "DELETE",
                headers: { Authorization: `Bearer ${this.config.token.jti}` },
                dataType: "json",
                success: (key) => resolve(key),
                error: (error) => reject(error.responseJSON)
            })
        })
    }
}

class RepoAPI {
    constructor(config) {
        this.config = config
    }

    filterRepos(search_text=null, repos) {
        const search_lower = search_text ? search_text.toLowerCase() : ""
        return new Promise((resolve) => {
            const curr_data = Array.from(repos)
                .filter((repo) => {
                    const all = (repo.Name + repo.Description + repo.Owner).toLowerCase()
                    return all.search(search_lower) >= 0
                })
            resolve(curr_data)
        })
    }

    listPublic() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.repo_url}/repos/public`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject(error.responseJSON)
            })
        })
    }

    listShared() {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/repos/shared`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject(error.responseJSON)
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    listUserRepos(username) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${username}/repos`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject(error.responseJSON)
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getRepo(repo_owner, repo_name, branch_name) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                    status: error.statusText,
                    message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getRepoCollaborators(repo_owner, repo_name) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/collaborators`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                    status: error.statusText,
                    message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getBranch(repo_owner, repo_name, branch_name) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/branches/${branch_name}`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                                            status: error.statusText,
                                            message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getDirectorySection(repo_owner, repo_name, branch_name, path) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/browse/${branch_name}/${path}`,
                type: "GET",
                dataType: "json",
                success: (json) => resolve(json),
                error: (error) => reject({ code: error.status,
                                            status: error.statusText,
                                            message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    getTextFileContent(repo_owner, repo_name, object_id) {
        return new Promise((resolve, reject) => {
            let req = {
                url: `${this.config.repo_url}/users/${repo_owner}/repos/${repo_name}/objects/${object_id}`,
                type: "GET",
                dataType: "text",
                success: (text) => resolve(text),
                error: (error) => reject({ code: error.status,
                                            status: error.statusText,
                                            message: error.responseText })
            }

            if (this.config.token) {
                req["headers"] = { Authorization: `Bearer ${this.config.token.jti}` }
            }

            $.ajax(req)
        })
    }

    create(account_login, repo_form) {
        return new Promise((resolve, reject) => {
            let name = repo_form.name || ""
            if (!name.match(/^[a-zA-Z0-9_\-]*$/)) {
                reject(Error("Use only alphanumeric characters without whitespaces as repository name."))
                return
            }

            if (name.length < 2 || name.length > 20) {
                reject(Error("Repository name must be between 2 and 20 characters long"))
                return
            }

            $.ajax({
                url: `${this.config.repo_url}/users/${account_login}/repos`,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(repo_form),
                dataType: "json",
                success: (repo) => resolve(repo),
                error: (error) => reject(error.statusText ? Error(error.statusText) : Error("An internal error occurred"))
            })
        })
    }

    update(owner, repo_name, patch) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.repo_url}/users/${owner}/repos/${repo_name}/settings`,
                type: "PATCH",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(patch),
                dataType: "json",
                success: (patch) => resolve(patch),
                error: (error) => reject(error.statusText ? Error(error.statusText) : Error("An internal error occurred"))
            })
        })
    }

    putCollaborator(owner, repo_name, collaborator, access_level) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.repo_url}/users/${owner}/repos/${repo_name}/collaborators/${collaborator}`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                data: JSON.stringify(access_level),
                dataType: "json",
                success: () => resolve(),
                error: (error) => reject(error.statusText ? Error(error.statusText) : Error("An internal error occurred"))
            })
        })
    }

    removeCollaborator(owner, repo_name, collaborator) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${this.config.repo_url}/users/${owner}/repos/${repo_name}/collaborators/${collaborator}`,
                type: "DELETE",
                contentType: "application/json; charset=utf-8",
                headers: {Authorization: `Bearer ${this.config.token.jti}`},
                success: () => resolve(),
                error: (error) => reject(error.statusText ? Error(error.statusText) : Error("An internal error occurred"))
            })
        })
    }

    requestDOI(owner, repo, branch) {
        const uri = this.config.doi_url + "?"
        const kv = [
            ["repo", branch+":"+owner+"/"+repo]
        ]
        const query = kv.map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1])).join("&")

        window.location.href = uri + query
        window.event.returnValue = false
    }
}
