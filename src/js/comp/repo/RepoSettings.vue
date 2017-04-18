<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div class="form">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Edit Repository Settings
                </div>
                <div class="panel-body">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label for="description" class="col-sm-2 control-label">Description</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="description"
                                       placeholder="Repository Description" v-model="form.description">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-10 col-sm-offset-2 checkbox">
                                <label for="public">
                                    <input type="checkbox" id="public" v-model="form.is_public"> Make Repository Public
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-10">
                                <button type="submit" class="btn btn-default" @click="resetSettings">Reset</button>
                                <button type="submit" class="btn btn-primary" @click="saveSettings">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Manage Repository Collaborators
                </div>
                <div class="panel-body">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-2 control-label">Collaborators</label>
                            <div class="col-sm-10">
                                <div class="panel panel-default" style="margin-bottom: 0">
                                    <table class="table panel-body">
                                        <tbody>
                                        <tr v-for="text in form.shared">
                                            <td>{{ text.User }}</td>
                                            <td class="text-right">
                                                <span v-for="level in permissions">
                                                    <button v-if="(permissions.indexOf(text.AccessLevel) > -1 &&
                                                            permissions.indexOf(level) <= permissions.indexOf(text.AccessLevel))"
                                                            @click="updateCollaborator(text.User, level)"
                                                            class="btn btn-success btn-xs">{{ level | reLabelCollaborator }}</button>
                                                    <button v-else
                                                            @click="updateCollaborator(text.User, level)"
                                                            class="btn btn-xs">{{ level | reLabelCollaborator }}</button>
                                                </span>
                                            </td>
                                            <td class="text-right">
                                                <button class="btn btn-danger btn-xs" @click="removeShare(text.User)">remove</button>
                                            </td>
                                        </tr>
                                        <tr v-if="form.shared.length === undefined || form.shared.length === 0">
                                            <td>This Repository has no Collaborators</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="select" class="col-sm-2 control-label">Add Collaborator</label>
                            <div class="col-sm-8">
                                <div id="collabdd" class="dropdown">
                                    <input type="text" class="form-control" id="select" data-toggle="dropdown"
                                           aria-haspopup="true" aria-expanded="true" v-model="select.text"
                                           @keypress.enter="addShare(select.text)" @keyup.up="selectionUp()"
                                           @keyup.down="selectionDown()">
                                    <ul v-if="select.all.length > 0" class="dropdown-menu open"
                                        aria-labelledby="select" style="width: 100%">
                                        <li v-for="acc in select.all" :class="{active: acc.active}">
                                            <a @click="selectShare(acc.login)">
                                                {{ acc.login }} <small class="supplemental-text">{{ acc.label }}</small>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <button class="btn btn-primary btn-block" @click="addShare(select.text)">Add</button>
                            </div>
                        </div>
                    </div>

                    <hr>
                    <div class="row">
                        <div class="col-sm-3 card card-block"></div>
                        <div class="col-sm-3 card card-block">
                            <p class="card-text">
                                <span class="label label-success">can-read</span> <br/> <br/>
                                Collaborator has read only access to a repository.
                            </p>
                        </div>
                        <div class="col-sm-3 card card-block">
                            <p class="card-text">
                                <span class="label label-success">can-write</span> <br/> <br/>
                                Collaborator can add, edit and remove files.
                            </p>
                        </div>
                        <div class="col-sm-3 card card-block">
                            <p class="card-text">
                                <span class="label label-success">is-admin</span> <br/> <br/>
                                As write, collaborator can also change repository settings
                                and add further collaborators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    // Timeout in ms before the search for collaborators is updated.
    const search_collaborators_timeout = 250
    // Minimal search content length before search for collaborators is updated.
    const search_collaborators_minlength = 3

    event.init()

    function accountLabel(acc) {
        let parts = []
        if (acc.first_name)
            parts = parts.concat(acc.first_name)
        if (acc.middle_name)
            parts = parts.concat(acc.middle_name)
        if (acc.last_name)
            parts = parts.concat(acc.last_name)
        if (acc.email)
            parts = parts.concat(`(${acc.email.email})`)
        return parts.length > 0 ? parts.join(" ") : acc.login
    }

    function sortCollaborators(a,b) {
        return a.User.localeCompare(b.User)
    }

    var searchBuffer

    export default {
        data() {
            return {
                permissions: ["can-pull", "can-push", "is-admin"],
                default_permission: "can-pull",
                form: {
                    description: null,
                    is_public: null,
                    shared: []
                },
                select: {
                    match: null,
                    text: null,
                    all: []
                }
            }
        },

        mounted() {
            // When tampering with the route w/o proper access,
            // the hand shall be rudely removed from the cookie jar.
            if (!this.is_repo_writeable) {
                console.error("No access, be gone!")
                this.$router.push({path: "/not-found"})
            }
            this.update()
        },

        props: {
            repository: { required: true },
            is_repo_writeable: { required: true }
        },

        mixins: [Alert],

        methods: {
            update() {
                this.form.description = this.repository.Description
                this.form.is_public = this.repository.Public
                this.form.shared = this.repository.Shared

                // Required against race condition in Repo.vue when fetching
                // collaborators via promise.
                if (this.form.shared.length !== undefined) {
                    this.form.shared.sort(sortCollaborators)
                }
            },

            updateCollaborator(login_name, permission) {
                const put_promise = api.repos.putCollaborator(this.$route.params.username,
                        this.$route.params.repository,
                        login_name,
                        { Permission: permission })
                put_promise.then(
                        () => {
                            event.emit("repo-update", { username: this.$route.params.username, repository: this.repository.Name })
                            for (var i = 0; i < this.form.shared.length; i++) {
                                if (this.form.shared[i].User === login_name) {
                                    this.form.shared[i].AccessLevel = permission
                                    break
                                }
                            }
                            this.alertSuccess("Collaborator updated")
                        },
                        (error) => {
                            this.alertError(error)
                        }
                )
            },

            removeShare(login_name) {
                const promise = api.repos.removeCollaborator(this.$route.params.username,
                        this.$route.params.repository,
                        login_name)
                promise.then(
                        () => {
                            this.form.shared = this.form.shared.filter((n) => n.User !== login_name)
                            event.emit("repo-update", { username: this.$route.params.username, repository: this.repository.Name })
                            this.alertSuccess("Collaborator removed")
                        },
                        (error) => {
                            this.alertError(error)
                        }
                )
            },

            addShare(login_name) {
                const selected = this.select.all.find(acc => acc.active)
                if (selected) {
                    selected.active = false
                    this.select.text = selected.login
                } else if (this.select.match === login_name) {
                    // Check if the account is actually available at gin-auth.
                    const promise = api.accounts.get(login_name)
                    promise.then(
                        (acc) => {
                            // Put gin-auth account login as collaborator to gin-repo with default access level.
                            const put_promise = api.repos.putCollaborator(this.$route.params.username,
                                                                            this.$route.params.repository,
                                                                            login_name,
                                                                            { Permission: this.default_permission })
                            put_promise.then(
                                    () => {
                                        event.emit("repo-update", { username: this.$route.params.username, repository: this.repository.Name })
                                        this.form.shared.push({User: login_name, AccessLevel: this.default_permission})
                                        this.form.shared.sort(sortCollaborators)
                                        this.alertSuccess("Collaborator added")
                                    },
                                    (error) => {
                                        this.alertError(error)
                                    }
                            )
                        },
                        (error) => {
                            this.alertError(error)
                        }
                    )
                    this.select.match = null
                    this.select.text = null
                    this.select.all = []
                }
            },

            selectShare(login_name) {
                this.select.text = login_name
            },

            selectionUp() {
                if (this.select.all.length > 0) {
                    let idx = this.select.all.findIndex(acc => acc.active)
                    if (idx < 1) {
                        this.select.all[0].active = false
                        idx = this.select.all.length
                    } else {
                        this.select.all[idx].active = false
                    }
                    this.select.all[idx - 1].active = true
                }
            },

            selectionDown() {
                if (this.select.all.length > 0) {
                    let idx = this.select.all.findIndex(acc => acc.active)
                    if (idx >= 0) {
                        this.select.all[idx].active = false
                    }
                    const idx_next = (idx + 1) % this.select.all.length
                    this.select.all[idx_next].active = true
                }
            },

            search(text) {
                if (text && text.length >= search_collaborators_minlength) {
                    console.log(`[ReposSettings] update search: ${text}`)
                    // TODO currently every new character entered leads to a request to the auth server.
                    // Check if this could be done more efficiently to reduce either the number of
                    // requests all together or at least the amount of transferred data using an
                    // eTag for the account information.
                    const promise = api.accounts.search(encodeURIComponent(text))
                    promise.then(
                        (accounts) => {
                            const shared = this.form.shared.map(collab => { return collab.User })
                            const owner_login = this.repository.Owner

                            accounts = accounts
                                    .filter(acc => !shared.includes(acc.login) && owner_login != acc.login)
                                    .map(acc => { return Object.assign({},
                                            { label: accountLabel(acc), login: acc.login, active: false })})

                            const idx = accounts.findIndex(acc => acc.login === text)
                            if (idx >= 0) {
                                this.select.match = text
                            } else {
                                this.select.match = null
                            }
                            this.select.all = accounts

                            // Make sure collaborator suggestion dropdown is always displayed on reload,
                            // even if a user toggled dropdown display before.
                            $('#collabdd.dropdown').toggleClass('open', true)
                        },
                        (error) => {
                            this.alertError(error)
                        }
                    )
                } else {
                    this.select.match = null
                    this.select.all = []
                }
            },

            saveSettings() {
                if (this.repository.Description !== this.form.description ||
                        this.repository.Public !== this.form.is_public) {
                    var data = {}
                    if (this.repository.Description !== this.form.description) {
                        data["description"] = this.form.description
                    }
                    if (this.repository.Public !== this.form.is_public ) {
                        data["public"] = this.form.is_public
                    }

                    const promise = api.repos.update(this.repository.Owner, this.repository.Name, data)
                    promise.then(
                            (patch) => {
                                this.form.description = patch.Description
                                this.form.is_public = patch.Public
                                event.emit("repo-update", { username: this.$route.params.username, repository: this.repository.Name })
                                this.alertSuccess("Repository settings successfully updated")
                            },
                            (error) => {
                                this.alertError(error)
                            }
                    )
                }
            },

            resetSettings() {
                this.form.description = this.repository.Description
                this.form.is_public = this.repository.Public
            }
        },

        watch: {
            "select.text": function (search, old) {
                if (search !== old) {
                    clearTimeout(searchBuffer)
                    searchBuffer = setTimeout(() => {this.search(search)}, search_collaborators_timeout)
                }
            },

            // Required against race condition in Repo.vue when fetching
            // collaborators via promise.
            "repository.Shared": function (shared, old) {
                console.log("[RepoSettings] repository collaborators has changed")
                if (shared !== old) {
                    this.update()
                }
            }
        }
    }
</script>
