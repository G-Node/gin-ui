<template>
    <div>
        <h2>Search</h2>
        <hr />
        <div class="form-inline row">
            <div class="form-group col-sm-9 col-sm-offset-1">
                <label class="sr-only" for="search">Search</label>
                <input type="text" class="form-control" id="search"
                       placeholder="Search Text" v-model="search_text"
                       style="width: 100%">
            </div>
        </div>
        <hr />

        <div>
            <div v-if="search_text">
                <ul class="nav nav-tabs">
                    <li role="presentation" :class="{ 'active': $route.name === 'search-repos' }">
                        <router-link :to="{ name: 'search-repos' }">
                            Repositories ({{ repositories.length }})
                        </router-link>
                    </li>
                    <li role="presentation" :class="{ 'active': $route.name === 'search-users' }">
                        <router-link :to="{ name: 'search-users' }">
                            Users ({{ users.length }})
                        </router-link>
                    </li>
                </ul>

                <router-view v-bind:repositories="repositories" v-bind:users="users"></router-view>
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
        data() {
            return {
                repositories: null,
                users: null,
                search_text: null
            }
        },

        mounted() {
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
                                var tab = "search-repos"
                                if ((this.repositories.length == 0) && (this.users.length > 0)) {
                                    tab = "search-users"
                                }
                                this.$router.push({
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
            search_text: function() {
                this.search()
            }
        }
    }
</script>
