<template>
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
                            <input type="text" class="form-control" id="description" placeholder="Repository Description" v-model="form.description">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-10 col-sm-offset-2 checkbox">
                            <label for="public">
                                <input type="checkbox" id="public" v-model="form.public"> Make Repository Public
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Collaborators</label>
                        <div class="col-sm-10">
                            <div class="panel panel-default" style="margin-bottom: 0">
                                <table class="table panel-body">
                                    <tbody>
                                        <tr v-for="name in form.shared">
                                            <td>{{ name }}</td>
                                            <td class="text-right"><button class="btn btn-danger btn-xs" @click="removeShare(name)">remove</button></td>
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
                        <div class="col-sm-9">
                            <div class="dropdown">
                                <input type="text" class="form-control" id="select" name="select" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" v-model="share.selected" debounce="100">
                                <ul v-if="share.available.length > 0" class="dropdown-menu" aria-labelledby="select">
                                    <li ><a v-for="name in share.available" @click="selectShare(name)">{{ name }}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-sm-1">
                            <button class="btn btn-primary btn-block" @click="addShare(share.selected)">Add</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-default" @click="reset">Reset</button>
                            <button type="submit" class="btn btn-primary" @click="save">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                form: {
                    description: this.repository.description,
                    public: this.repository.public,
                    shared: this.repository.shared
                },
                share: {
                    selected: null,
                    available: []
                }
            }
        },

        props: {
            repository: { twoWay: true, required: true },
            isRepositoryWriteable: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            removeShare(loginName) {
                this.form.shared = this.form.shared.filter((n) => n !== loginName)
            },

            addShare(loginName) {
                const promise = api.accounts.get(loginName)
                promise.then(
                    (acc) => {
                        this.form.shared = this.form.shared.concat(acc.username)
                        this.form.shared.sort()
                        this.share.selected = null
                        this.share.available = []
                    },
                    (error) => {
                        this.share.selected = null
                        this.share.available = []
                        this.alertError(error)
                    }
                )
            },

            selectShare(loginName) {
                this.share.selected = loginName
            },

            searchLogin(search) {
                const promise = api.accounts.search(search)
                promise.then(
                    (accounts) => {
                        this.share.available = accounts
                                .map((acc) => acc.username)
                                .filter((n) => !this.form.shared.includes(n) && this.repository.owner != n)
                    }
                )
            },

            save() {
                const repo = Object.assign({}, this.repository, this.form)
                const promise = api.repos.update(repo)
                promise.then(
                    (repo) => {
                        this.repository = repo
                        this.alertSuccess("Repository settings successfully updated")
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            },

            reset() {
                this.from = {
                    description: this.repository.description,
                    public: this.repository.public,
                    shared: this.repository.shared
                }
                this.share = {
                    selected: null,
                    available: []
                }
            }
        },

        watch: {
            "share.selected": function (val) {
                this.searchLogin(val)
            }
        }
    }
</script>