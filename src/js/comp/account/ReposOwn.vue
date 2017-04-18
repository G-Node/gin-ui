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
        <nav v-if="repos">
            <ul class="pager">
                <li class="previous"><a @click="prev">
                    Previous <span v-if="pidx !== null">({{ pidx }})</span>
                </a></li>
                <li class="next"><a @click="next">
                    Next <span v-if="nidx !== null">({{ nidx }})</span>
                </a></li>
            </ul>
        </nav>

        <ul class="list-unstyled" v-if="repos">
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
                        {{ repo.Description }}
                        <span v-if="!repo.Description">No description for this repository.</span>
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
    import Alert from "../Alert.js"
    import { pagerPrevious, pagerNext } from "../../utils.js"

    const ll = "[ReposOwn]"
    const n_displayed = 6

    export default {
        data() {
            return {
                repos: null,
                repos_displayed: null,
                idx: 0,
                pidx: null,
                nidx: null
            }
        },

        mounted() {
            this.update(this.$route.params)
        },

        props: {
            account: { required: true }
        },

        mixins: [Alert],

        methods: {
            update(params) {
                console.log(`${ll} update`)
                this.repos = null
                this.repos_displayed = null

                const promise = window.api.repos.listUserRepos(params.username)
                promise.then(
                        (repos) => {
                            if (repos !== undefined && repos !== null && repos.length > 0) {
                                this.repos = repos
                                this.idx = 0

                                var len = n_displayed > repos.length ? repos.length : n_displayed
                                this.repos_displayed = repos.slice(this.idx, len)
                                this.updatePagerIndex()
                            }
                        },
                        (error) => {
                            console.log(`${ll} error fetching owner repo list`)
                            console.log(error)
                            this.reportError(error)
                        }
                )
            },

            prev() {
                let prev = pagerPrevious(this.repos, this.idx, n_displayed)
                this.repos_displayed = prev.arr
                this.idx = prev.index
                this.updatePagerIndex()
            },

            next() {
                let nxt = pagerNext(this.repos, this.idx, n_displayed)
                this.repos_displayed = nxt.arr
                this.idx = nxt.index
                this.updatePagerIndex()
            },

            updatePagerIndex() {
                this.pidx = Math.floor(this.idx / n_displayed)
                this.nidx = Math.floor((this.repos.length - this.idx) / n_displayed)
                if ((this.repos.length - this.idx) === n_displayed) {
                    this.nidx = 0
                }
            }
        },

        watch: {
            "$route.params": function(params) {
                this.update(params)
            }
        }
    }
</script>
