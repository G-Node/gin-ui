<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in repos_modified">
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
            <li v-if="!has_result">
                <div class="panel panel-default">
                    <div class="panel-body">
                        No available repository matches your search.
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    const ll = "[Repo Search]"
    const n_displayed = 5

    export default {
        data() {
            return {
                repos_modified: null,
                repos_displayed: null,
                repo_index: 0,
                has_result: false
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
                if (this.public_repo !== null && this.public_repo !== undefined) {
                    const user_search = api.accounts.search()
                    user_search.then(
                            (u) => {
                                var names_map = new Map()
                                for (var j = 0; j < u.length; j++) {
                                    names_map.set(u[j].login, u[j].first_name+" "+u[j].last_name)
                                }

                                this.repos_modified = []
                                this.has_result = false
                                for (var i = 0; i < this.public_repo.length; i++) {
                                    var el = Object.assign({}, this.public_repo[i],
                                            { FullName: names_map.get(this.public_repo[i].Owner) })
                                    this.repos_modified.push(el)
                                    this.has_result = true
                                }
                            }
                    )
                }
            },

            previous() {
                console.log(ll +" previous")
                console.log(this.repos_modified)

                if (this.repos_modified === undefined || this.repos_modified.length <= n_displayed) {
                    this.repos_displayed = this.repos_modified
                    return
                }

                this.repo_index = this.repo_index - n_displayed
                if (this.repo_index < 0) {
                    this.repo_index = 0
                }
                var len = this.repo_index + n_displayed > this.repos_modified.length ?
                        this.repos_modified.length :
                this.repo_index + n_displayed

                this.repos_displayed = this.repos_modified.slice(this.repo_index, len)
            },

            next() {
                console.log(ll +" next")
                console.log(this.repos_modified)
                if (this.repos_modified === undefined || this.repos_modified.length <= n_displayed) {
                    this.repos_displayed = this.repos_modified
                    return
                }

                if (this.repos_modified.length < this.repo_index + n_displayed) {
                    return
                }

                // get start index
                this.repo_index = this.repo_index + n_displayed

                // get end index
                var len = this.repo_index + n_displayed > this.repos_modified.length ?
                        this.repos_modified.length :
                this.repo_index + n_displayed

                this.repos_displayed = this.repos_modified.slice(this.repo_index, len)
            }
        },

        watch: {
            "public_repo": function() {
                this.augment()
            }
        }
    }
</script>
