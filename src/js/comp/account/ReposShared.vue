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

                        <strong v-if="repo.Public"><span class="label label-success pull-right">public</span></strong>
                        <strong v-if="!repo.Public"><span class="label label-danger pull-right">private</span></strong>
                    </div>
                    <div class="panel-body">
                        Owner {{ repo.FullName }}<br/><br/>
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
    import Alert from "../Alert.js"

    const ll = "[ReposOwn]"

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
                console.log(ll +" update")
                this.repos_modified = null

                const repos_shared = api.repos.listShared()
                repos_shared.then(
                        (repos) => {
                            if (repos !== undefined && repos !== null && repos.length > 0) {
                                var repo_list = repos

                                // A logged in user can pre-filter repositories shared
                                // by another repository owner via the route.
                                if (this.account.login !== params.username) {
                                    console.log(ll +" pre filter for owner "+ params.username)
                                    let repo_filter = Array.from(repos)
                                            .filter((r) => { return r.Owner === params.username })
                                    if (repo_filter.length > 0) {
                                        repo_list = repo_filter
                                    } else {
                                        return
                                    }
                                }

                                // Update repository list with full name of the repository owners.
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
                                        },
                                        (error) => {
                                            console.log(ll +" error fetching user for shared repos")
                                            console.log(error)
                                        })
                            }
                        },
                        (error) => {
                            console.log(ll +" error fetching shared repos")
                            console.log(error)
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
