<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in own_repos">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <router-link :to="{ name: 'repository-info',
                                            params: { username: repo.Owner, repository: repo.Name } }">
                            {{ repo.Owner }}/{{ repo.Name }}
                        </router-link>
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
                own_repos: null
            }
        },

        mounted() {
            this.update()
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update() {
                const getOwn = api.repos.listOwn(this.account.login)
                getOwn.then(
                        (repos) => {
                            this.own_repos = repos
                        },
                        (error) => {
                            this.own_repos = null
                            this.reportError(error)
                        }
                )
            }
        }
    }
</script>