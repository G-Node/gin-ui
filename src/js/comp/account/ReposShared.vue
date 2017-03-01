<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <ul class="list-unstyled" v-if="repos_modified">
            <li v-for="repo in repos_modified">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <router-link :to="{ name: 'repository-info',
                                            params: { username: repo.Owner, repository: repo.Name } }">
                            {{ repo.Owner }}/{{ repo.Name }}
                        </router-link>
                    </div>
                    <div class="panel-body">
                        Owner {{ repo.FullName }}<br/>
                        {{ repo.Public | privacyLabel }}
                        <br/><br/>
                        {{ repo.Description }}
                        <span v-if="!repo.Description">No description for this repository.</span>
                    </div>
                </div>
            </li>
        </ul>
        <ul class="list-unstyled" v-if="!repos_modified">
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
                repos_modified: null
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
                var repo_list = []

                const repos_shared = api.repos.listShared()
                repos_shared.then(
                        (repos) => {
                            if (this.account.login !== params.username) {
                                let repo_filter = Array.from(repos)
                                                       .filter((r) => { return r.Owner === params.username})
                                if (repo_filter.length > 0) {
                                    repo_list = repo_filter
                                }
                            } else {
                                repo_list = repos
                            }

                            const user_search = api.accounts.search()
                            user_search.then(
                                    (u) => {
                                        var names_map = new Map()
                                        for (var j = 0; j < u.length; j++) {
                                            names_map.set(u[j].login, u[j].first_name+" "+u[j].last_name)
                                        }

                                        this.repos_modified = []
                                        for (var i = 0; i < repo_list.length; i++) {
                                            var el = Object.assign({}, repo_list[i],
                                                    { FullName: names_map.get(repo_list[i].Owner) })
                                            this.repos_modified.push(el)
                                        }
                                    }
                            )
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
