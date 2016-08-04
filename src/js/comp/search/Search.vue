<template>
    <div>
        <h2>Search</h2>
        <hr />
        <div class="form-inline row">
            <div class="form-group col-sm-9 col-sm-offset-1">
                <label class="sr-only" for="search">Search</label>
                <input type="text" class="form-control" id="search" placeholder="Search Text" v-model="search_text" style="width: 100%" @keypress.enter="search" debounce="300">
            </div>
        </div>
        <hr />

        <div>
            <div v-if="search_text">
                <ul class="nav nav-tabs">
                    <li role="presentation" :class="{ 'active': $route.name === 'search-repos' }">
                        <a v-link="{ name: 'search-repos' }">Repositories ({{ repositories.length }})</a>
                    </li>
                    <li role="presentation" :class="{ 'active': $route.name === 'search-users' }">
                        <a v-link="{ name: 'search-users' }">Users ({{ users.length }})</a>
                    </li>
                </ul>

                <router-view v-bind:repositories.sync="repositories" v-bind:users.sync="users"></router-view>
            </div>
            <div v-if="!search_text">
                Search for public repositories or users
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import Alert from "../Alert.js"

    export default {
        props: {
            search_text: null
        },

        data() {
            return {
                repositories: null,
                users: null
            }
        },

        ready() {
            this.search()
        },

        methods: {
            search() {
                const repo_search = api.repos.listPublic(this.search_text)
                const user_search = api.accounts.search(this.search_text)

                repo_search.then(
                        (repos) => {
                            this.repositories = repos
                        }
                )

                user_search.then(
                        (users) => {
                            this.users = users
                        }
                )


                Promise.all([repo_search, user_search]).then(
                        () => {
                            if (this.search_text) {
                                var tab
                                if ((this.repositories.length == 0) && (this.users.length > 0)) {
                                    tab = "search-users"
                                } else {
                                    tab = "search-repos"
                                }
                                this.$route.router.go({
                                    name: tab
                                })
                            }
                        },
                        (error) => {
                            this.reportError(error)
                        }
                )
            }
        },

        mixins: [Alert],

        watch: {
            "search_text": function() {
                this.search()
            }
        }
    }
</script>
