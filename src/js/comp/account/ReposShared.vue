<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in repositories">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <router-link :to="{ name: 'repository-info', params: { username: repo.owner, repository: repo.name}}">
                            {{ repo.owner }}/{{ repo.name }}
                        </router-link>
                    </div>
                    <div class="panel-body">
                        {{ repo.description }}
                    </div>
                </div>
            </li>
        </ul>
        <hr/>
        <ul class="list-unstyled">
            <li v-for="repo in repos_shared">
                <div class="panel panel-default">
                    <div class="panel-heading">
                            {{ repo.Owner }}/{{ repo.Name }}
                    </div>
                    <div class="panel-body">
                        Head: {{ repo.Head }} <br/>
                        Description: {{ repo.Description }} <br/>
                        Public: {{ repo.Visibility }}
                    </div>
                </div>
            </li>
        </ul>

    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                repositories: null,
                repos_shared: null
            }
        },

        mounted() {
            this.update({ owner: this.owner, account: this.account })
        },

        props: {
            account: { required: true },
            owner: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(accounts) {
                const login_name = accounts.account ? accounts.account.login : null
                const promise  = api.repos.listSharedOld(accounts.owner.login, login_name)
                promise.then(
                    (repos) => {
                        this.repositories = repos
                    },
                    (error) => {
                        this.repositories = null
                        this.reportError(error)
                    }
                )

                const repos_shared = api.repos.listShared()
                repos_shared.then(
                        (repos) => {
                            this.repos_shared = repos
                        },
                        (error) => {
                            this.repos_shared = null
                            this.reportError(error)
                        }
                )
            }
        }
    }
</script>