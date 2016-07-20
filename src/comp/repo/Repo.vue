<template>
    <div>
        <header>
            <h2>{{$route.params.username}}/{{$route.params.repository}}</h2>
            <h4 v-if="repository">{{ repository.description }}</h4>
        </header>

        <hr />

        <ul class="nav nav-tabs" v-if="repository && owner">
            <li role="presentation" :class="{ 'active': $route.name === 'repository' }">
                <a v-link="{ name: 'repository', params: { username: owner.login, repository: repository.name }}">Info</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-files' }">
                <a v-link="{ name: 'repository-files', params: { username: owner.login, repository: repository.name }}">Files</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-settings' }" v-if="is_repo_writeable">
                <a v-link="{ name: 'repository-settings', params: { username: owner.login, repository: repository.name }}">Settings</a>
            </li>
        </ul>


        <router-view v-if="repository && owner" v-bind:account="account" v-bind:owner="owner" v-bind:is_repo_writeable="is_repo_writeable" v-bind:repository.sync="repository"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            const data = {
                owner: null,
                repository: null
            }

            this.update(this.$route.params, null, data)

            return data
        },

        computed: {
            is_repo_writeable: {
                get() {
                    const name = this.account ? this.account.login : null
                    const repo = this.repository

                    return !!(name && (repo.owner === name || repo.shared.indexOf(name) >= 0));
                }
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params, old, target=null) {
                target = target || this

                const login_name = this.account ? this.account.login : null
                const same_owner = old && old.username === params.username
                const same_repo  = old && old.repository === params.repository

                if (!same_owner) {
                    const promise = api.accounts.get(params.username)
                    promise.then(
                            (acc) => {
                                target.owner = acc
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
                                target.repository = repo
                            },
                            (error) => {
                                this.reportError(error)
                            }
                    )
                }
            }
        },

        watch: {
            "$route.params": function (params, old) {
                this.update(params, old)
            }
        }
    }
</script>