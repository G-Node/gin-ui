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
    import { pagerPrevious, pagerNext } from "../../utils.js"

    const ll = "[Repo Search]"
    const n_displayed = 5

    export default {
        data() {
            return {
                repos_modified: null,
                repos_displayed: null,
                idx: 0
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
                console.log(ll +" augment search")
                this.repos_modified = null
                this.repos_displayed = null

                if (this.public_repo !== null && this.public_repo !== undefined && this.public_repo.length > 0) {
                    const user_search = api.accounts.search()
                    user_search.then(
                            (u) => {
                                var names_map = new Map()
                                for (var j = 0; j < u.length; j++) {
                                    names_map.set(u[j].login, u[j].first_name+" "+u[j].last_name)
                                }

                                this.repos_modified = []
                                for (var i = 0; i < this.public_repo.length; i++) {
                                    var el = Object.assign({}, this.public_repo[i],
                                            { FullName: names_map.get(this.public_repo[i].Owner) })
                                    this.repos_modified.push(el)
                                }

                                this.idx = 0
                                var len = n_displayed > this.repos_modified.length ?
                                        this.repos_modified.length : n_displayed
                                this.repos_displayed = this.repos_modified.slice(this.idx, len)
                            }
                    )
                }
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
            "public_repo": function() {
                this.augment()
            }
        }
    }
</script>
