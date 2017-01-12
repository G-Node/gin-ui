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
                                <button type="submit" class="btn btn-default" @click="reset">Reset</button>
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
                                            <td>{{ text }}</td>
                                            <td class="text-right">
                                                <button class="btn btn-danger btn-xs" @click="removeShare(text)">remove</button>
                                            </td>
                                        </tr>
                                        <tr v-if="form.shared.length === 0">
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
                                <div class="dropdown">
                                    <input type="text" class="form-control" id="select" data-toggle="dropdown"
                                           aria-haspopup="true" aria-expanded="true" v-model="select.text"
                                           @keypress.enter="addShare(select.text)" @keyup.up="selectionUp()"
                                           @keyup.down="selectionDown()">
                                    <ul v-if="select.all.length > 0" class="dropdown-menu"
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
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

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

    export default {
        data() {
            return {
                form: {
                    description: this.repository.Description,
                    is_public: this.repository.Public,
                    shared: this.repository.Shared
                },
                select: {
                    match: null,
                    text: null,
                    all: []
                }
            }
        },

        props: {
            repository: { required: true },
            is_repo_writeable: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            removeShare(login_name) {
                const promise = api.repos.removeCollaborator(this.$route.params.username,
                        this.$route.params.repository,
                        login_name)
                promise.then(
                        () => {
                            this.form.shared = this.form.shared.filter((n) => n !== login_name)
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
                    // Check if the account is actually available at gin-auth
                    const promise = api.accounts.get(login_name)
                    promise.then(
                        (acc) => {
                            // Add account login as collaborator at gin-repo
                            // This will add the collaborator with the default access level "can-push"
                            // TODO handle different access levels
                            const put_promise = api.repos.putCollaborator(this.$route.params.username,
                                                                            this.$route.params.repository,
                                                                            login_name,
                                                                            { Permission: "can-pull" })
                            put_promise.then(
                                    () => {
                                        console.log("proper put")
                                        this.form.shared = this.form.shared.concat(acc.login)
                                        this.form.shared.sort()
                                        this.select.match = null
                                        this.select.text = null
                                        this.select.all = []

                                        event.emit("repo-update", { username: this.$route.params.username, repository: this.repository.Name })
                                        this.alertSuccess("Collaborator added")
                                    },
                                    (error) => {
                                        this.select.match = null
                                        this.select.text = null
                                        this.select.all = []

                                        // TODO this is a hack; this promise always defaults to error,
                                        // even if the REST call returns status OK, but don't see
                                        // the reason at the moment.
                                        if (String(error).includes("OK")) {
                                            console.log("hack put")
                                            this.form.shared = this.form.shared.concat(acc.login)
                                            this.form.shared.sort()
                                            event.emit("repo-update", { username: this.$route.params.username, repository: this.repository.Name })
                                            this.alertSuccess("Collaborator added")
                                        } else {
                                            this.alertError(error)
                                        }
                                    }
                            )
                        },
                        (error) => {
                            this.select.match = null
                            this.select.text = null
                            this.select.all = []
                            this.alertError(error)
                        }
                    )
                }
            },

            selectShare(login_name) {
                this.select.text = login_name
            },

            selectionUp() {
                let idx = this.select.all.findIndex(acc => acc.active)
                if (idx < 1) {
                    this.select.all[0].active = false
                    idx = this.select.all.length
                } else {
                    this.select.all[idx].active = false
                }
                this.select.all[idx - 1].active = true
            },

            selectionDown() {
                let idx = this.select.all.findIndex(acc => acc.active)
                if (idx >= 0) {
                    this.select.all[idx].active = false
                }
                const idx_next = (idx + 1) % this.select.all.length
                this.select.all[idx_next].active = true
            },

            search(text) {
                if (text && text.length > 0) {
                    const promise = api.accounts.search(encodeURIComponent(text))
                    promise.then(
                        (accounts) => {
                            const shared = this.form.shared
                            const owner_login = this.repository.Owner
                            accounts = accounts
                                    .filter(acc => !shared.includes(acc.login) && owner_login != acc.login)
                                    .map(acc => { return { label: accountLabel(acc), login: acc.login, active: false}})
                            const idx = accounts.findIndex(acc => acc.login === text)
                            if (idx >= 0) {
                                accounts.splice(idx, 1)
                                this.select.match = text
                            } else {
                                this.select.match = null
                            }
                            this.select.all = accounts
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

            reset() {
                // TODO shared should actually be removed from this reset,
                // but it is currently still too entangled in the code above.
                this.form = {
                    description: this.repository.Description,
                    is_public: this.repository.Public,
                    shared: this.repository.Shared
                }
                this.select = {
                    match: null,
                    text: null,
                    all: []
                }
            }
        },

        watch: {
            "select.text": function (search, old) {
                if (search !== old) {
                    this.search(search)
                }
            }
        }
    }
</script>
