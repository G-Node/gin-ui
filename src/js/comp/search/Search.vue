<template>
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
        <ul class="nav nav-tabs">
            <li role="presentation" :class="{ 'active': $route.name === 'search-repos' }">
                <a v-link="{ name: 'search-repos' }">Repositories</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'search-users' }">
                <a v-link="{ name: 'search-users' }">Users</a>
            </li>
        </ul>

        <router-view v-bind:repositories.sync="repositories" v-bind:users.sync="users"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
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
                    },
                    (error) => {
                        this.reportError(error)
                    }
                )

                user_search.then(
                    (users) => {
                        this.users = users
                    },
                    (error) => {
                        this.reportError(error)
                    }
                )
            }
        },

        watch: {
            "search_text": function() {
                this.search()
            }
        }
    }
</script>
