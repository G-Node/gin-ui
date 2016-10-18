<template>
    <div>
        <ul class="list-unstyled" v-if="repos">
            <li v-for="repo in repos">
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
        <ul class="list-unstyled" v-if="!repos">
            <li class="panel panel-default">
                <div class="panel-body">
                    There are no available repositories
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    // TODO merge this file with ReposOwn and adjust routes in main accordingly.

    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                repos: null
            }
        },

        mounted() {
            this.update(this.$route.params)
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params) {
                this.sharedRepos(params)
            },

            // If the logged in user is the owner of the current repository list,
            // display all repositories shared with the user.
            //
            // If the logged in user is not the owner of the current repository list
            // filter only those repositories the user shares with this owner
            // TODO in the second case: should the repositories displayed actually be all
            // the logged in user repositories that are shared with the owner of the current
            // repository list?
            sharedRepos(params) {
                this.repos = null

                const repos_shared = api.repos.listShared()
                repos_shared.then(
                        (repos) => {
                            if (this.account.login === params.username) {
                                let repo_filter = Array.from(repos)
                                                       .filter((r) => { return r.Owner === params.username})
                                if (repo_filter.length > 0) {
                                    this.repos = repo_filter
                                }
                            } else {
                                this.repos = repos
                            }
                        },
                        (error) => {
                            console.error(error)
                        })
            }
        },

        watch: {
            "$route.params": function(params) {
                this.update(params)
            }
        }
    }
</script>