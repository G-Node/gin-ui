<template>
    <div>
        <header>
            <h2>{{$route.params.username}}/{{$route.params.repository}}</h2>
            <h4 v-if="repository">{{ repository.description }}</h4>
        </header>

        <hr />

        <ul class="nav nav-tabs" v-if="repository">
            <li role="presentation" :class="{ 'active': $route.name === 'repository' }">
                <a v-link="{ name: 'repository', params: { username: owner.username, repository: repository.name }}">Info</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-files' }">
                <a v-link="{ name: 'repository-files', params: { username: owner.username, repository: repository.name }}">Files</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-settings' }" v-if="isRepositoryWriteable">
                <a v-link="{ name: 'repository-settings', params: { username: owner.username, repository: repository.name }}">Settings</a>
            </li>
        </ul>


        <router-view v-if="repository" v-bind:login="login" v-bind:owner="owner" v-bind:is-repository-writeable="isRepositoryWriteable" v-bind:repository.sync="repository"></router-view>
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
            isRepositoryWriteable: {
                get() {
                    const name = this.login ? this.login.username : null
                    const repo = this.repository

                    return !!(name && (repo.owner === name || repo.shared.indexOf(name) >= 0));
                }
            }
        },

        props: {
            login: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params, old, target=null) {
                target = target || this

                const login = this.login ? this.login.username : null
                const sameOwner = old && old.username === params.username
                const sameRepo  = old && old.repository === params.repository

                if (!sameOwner) {
                    console.log("updating owner")

                    const promise = api.accounts.get(params.username)
                    promise.then(
                            (acc) => {
                                target.owner = acc
                            },
                            (error) => {
                                this.alertError(error)
                            }
                    )
                }

                if (!sameRepo || !sameOwner) {
                    console.log("updating repo")

                    const promise = api.repos.get(params.username, params.repository, login)
                    promise.then(
                            (repo) => {
                                target.repository = repo
                            },
                            (error) => {
                                this.alertError(error)
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