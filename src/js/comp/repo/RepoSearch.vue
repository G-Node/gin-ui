<template>
    <div class="form-inline row">
        <div class="form-group col-sm-9 col-sm-offset-1">
            <label class="sr-only" for="search">Search</label>
            <input type="text" class="form-control" id="search" placeholder="Search Text" v-model="search_text" style="width: 100%" @keypress.enter="search" debounce="300">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            repositories: null,
            accounts: null
        },

        data() {
            return {
                search_text: null,
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
                    (accounts) => {
                        this.accounts = accounts
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
