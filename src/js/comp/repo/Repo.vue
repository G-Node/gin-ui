<template>
    <div>
        <header>
            <h2>{{$route.params.username}}/{{$route.params.repository}}</h2>
            <h4 v-if="repository">{{ repository.description }}</h4>
        </header>

        <hr />

        <ul class="nav nav-tabs" v-if="repository && owner">
            <li role="presentation" :class="{ 'active': $route.name === 'repository' }">
                <router-link :to="{ name: 'repository-info',
                            params: { username: owner.login, repository: repository.name }}">
                    Info
                </router-link>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-files' }">
                <router-link :to="{ name: 'repository-files',
                            params: { username: owner.login, repository: repository.name, root: '/' }}">
                    Files
                </router-link>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-settings' }"
                                    v-if="is_repo_writeable">
                <router-link :to="{ name: 'repository-settings',
                            params: { username: owner.login, repository: repository.name }}">
                    Settings
                </router-link>
            </li>
        </ul>

        <router-view v-if="repository && owner"
                     v-bind:account="account"
                     v-bind:owner="owner"
                     v-bind:is_repo_writeable="is_repo_writeable"
                     v-bind:repository="repository"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    export default {
        data() {
            return {
                owner: null,
                repository: null
            }
        },

        mounted() {
            this.update(this.$route.params, null)
        },

        computed: {
            is_repo_writeable: {
                get() {
                    const name = this.account ? this.account.login : null
                    const repo = this.repository

                    return name && (repo.owner === name || repo.shared.indexOf(name) >= 0)
                }
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params, old) {
                const login_name = this.account ? this.account.login : null
                const same_owner = old && old.username === params.username
                const same_repo  = old && old.repository === params.repository

                if (!same_owner) {
                    const promise = api.accounts.get(params.username)
                    promise.then(
                            (acc) => {
                                this.owner = acc
                            },
                            (error) => {
                                this.reportError(error)
                            }
                    )
                }

                if (!same_repo || !same_owner) {
                    const promise = api.repos.get(params.username, params.repository, login_name)
                    promise.then(
                            (repo) => {
                                this.repository = repo
                            },
                            (error) => {
                                this.reportError(error)
                            }
                    )
                }
            }
        },

        created: function() {
            event.on("repo-update", this.update)
        },

        watch: {
            "$route.params": function (params, old) {
                this.update(params, old)
            }
        }
    }
</script>