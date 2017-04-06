<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <!-- pagination -->
        <nav v-if="repos_modified">
            <ul class="pager">
                <li class="previous"><a @click="prev">Previous</a></li>
                <li class="next"><a @click="next">Next</a></li>
            </ul>
        </nav>

        <ul class="list-unstyled" v-if="repos_modified">
            <li v-for="repo in repos_displayed">
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
    import {
            pagerPrevious,
            pagerNext,
            addRepoUserFullName
    } from "../../utils.js"

    const ll = "[ReposShared]"
    const n_displayed = 5

    export default {
        data() {
            return {
                repos_modified: null,
                repos_displayed: null,
                idx: 0
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
                this.repos_displayed = null

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
                                            this.repos_modified = addRepoUserFullName(u, repo_list)

                                            this.idx = 0
                                            var len = n_displayed > this.repos_modified.length ?
                                                    this.repos_modified.length : n_displayed
                                            this.repos_displayed = this.repos_modified.slice(this.idx, len)
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
            },

            prev() {
                let prev = pagerPrevious(this.repos_modified, this.idx, n_displayed)
                this.repos_displayed = prev.arr
                this.idx = prev.index
            },

            next() {
                let nxt = pagerNext(this.repos_modified, this.idx, n_displayed)
                this.repos_displayed = nxt.arr
                this.idx = nxt.index
            }
        },

        watch: {
            "$route.params": function(params) {
                this.update(params)
            }
        }
    }
</script>
