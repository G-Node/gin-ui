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
                            params: { username: $route.params.username, repository: $route.params.repository }}">
                    Info
                </router-link>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-files' }">
                <router-link :to="{ name: 'repository-files',
                            params: { username: $route.params.username, repository: $route.params.repository, root: '/' }}">
                    Files
                </router-link>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-settings' }"
                                    v-if="is_repo_writeable">
                <router-link :to="{ name: 'repository-settings',
                            params: { username: $route.params.username, repository: $route.params.repository }}">
                    Settings
                </router-link>
            </li>
        </ul>

        <router-view v-if="repository && owner"
                     v-bind:account="account"
                     v-bind:owner="owner"
                     v-bind:is_repo_writeable="is_repo_writeable"
                     v-bind:repository="repository">
        </router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

// TODO should params.username on this page and its child pages not actually be ownername?
// TODO also probably better change params.repository to reponame

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

                    return name && repo && (repo.owner === name || repo.shared.indexOf(name) >= 0)
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
                                console.log("I have fetched an account")
                                this.owner = acc
                            },
                            (error) => {
                                console.log("I failed miserably")
                                this.reportError(error)
                            }
                    )
                }

                if (!same_repo || !same_owner) {
                    // always use one of the fake repositories for now until the repo service is fully integrated
                    // and this whole page can be refactored
                    //const promise = api.repos.get(params.username, params.repository, login_name)
                    const promise = api.repos.get("alice", "alice-public-data", login_name)
                    promise.then(
                            (repo) => {
                                this.repository = repo
                            },
                            (error) => {
                                this.reportError(error)                            }
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