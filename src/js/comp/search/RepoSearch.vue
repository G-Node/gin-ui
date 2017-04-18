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
                <li class="previous"><a @click="prev">
                    Previous <span v-if="pidx !== null">({{ pidx }})</span>
                </a></li>
                <li class="next"><a @click="next">
                    Next <span v-if="nidx !== null">({{ nidx }})</span>
                </a></li>
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
                    </div>
                    <div class="panel-body">
                        Owner {{ repo.FullName }}
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
                    No available repository matches your search.
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import {
            pagerPrevious,
            pagerNext,
            addRepoUserFullName
    } from "../../utils.js"

    const n_displayed = 5

    export default {
        data() {
            return {
                repos_modified: null,
                repos_displayed: null,
                idx: 0,
                pidx: null,
                nidx: null
            }
        },

        props: {
            public_repo: {required: true}
        },

        mounted() {
            this.augment()
        },

        methods: {
            augment() {
                this.repos_modified = null
                this.repos_displayed = null

                if (this.public_repo !== null && this.public_repo !== undefined && this.public_repo.length > 0) {
                    const promise = window.api.accounts.search()
                    promise.then(
                            (u) => {
                                this.repos_modified = addRepoUserFullName(u, this.public_repo)

                                this.idx = 0
                                const len = n_displayed > this.repos_modified.length ?
                                        this.repos_modified.length : n_displayed
                                this.repos_displayed = this.repos_modified.slice(this.idx, len)
                                this.updatePagerIndex()
                            }
                    )
                }
            },

            prev() {
                const prev = pagerPrevious(this.repos_modified, this.idx, n_displayed)
                this.repos_displayed = prev.arr
                this.idx = prev.index
                this.updatePagerIndex()
            },

            next() {
                const nxt = pagerNext(this.repos_modified, this.idx, n_displayed)
                this.repos_displayed = nxt.arr
                this.idx = nxt.index
                this.updatePagerIndex()
            },

            updatePagerIndex() {
                this.pidx = Math.floor(this.idx / n_displayed)
                this.nidx = Math.floor((this.repos_modified.length - this.idx) / n_displayed)
                if ((this.repos_modified.length - this.idx) === n_displayed) {
                    this.nidx = 0
                }
            }
        },

        watch: {
            "public_repo": function() {
                this.augment()
            }
        }
    }
</script>
