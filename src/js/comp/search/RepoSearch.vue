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
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                repos_modified: null
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
                                for (var i = 0; i < this.public_repo.length; i++) {
                                    var el = Object.assign({}, this.public_repo[i],
                                            { FullName: names_map.get(this.public_repo[i].Owner) })
                                    this.repos_modified.push(el)
                                }
                            }
                    )
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
