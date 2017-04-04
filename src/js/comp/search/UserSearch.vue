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
        <nav v-if="has_result">
            <ul class="pager">
                <li class="previous"><a @click="prev">Previous</a></li>
                <li class="next"><a @click="next">Next</a></li>
            </ul>
        </nav>

        <ul class="list-unstyled">
            <li v-for="user in users_displayed">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <router-link :to="{ name: 'own-repositories', params: { username: user.login } }">
                            {{ user.first_name }} {{ user.last_name }}
                        </router-link>
                    </div>
                    <div class="panel-body">
                            <div v-if="user.affiliation">
                                Institution: {{ user.affiliation.institute }}<br />
                                Department: {{ user.affiliation.department }} <br/>
                                City: {{ user.affiliation.city }} <br />
                                Country: {{ user.affiliation.country }}
                            </div>
                            <div v-if="!user.affiliation">
                                No available affiliation.
                            </div>
                    </div>
                </div>
            </li>
            <li v-if="users.length < 1">
                <div class="panel panel-default">
                    <div class="panel-body">
                        No user matches your search.
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import { pagerPrevious, pagerNext } from "../../utils.js"

    const n_displayed = 5

    export default {
        data() {
            return {
                users_displayed: null,
                has_result: false,
                idx: 0
            }
        },

        props: {
            users: {required: true}
        },

        mounted() {
            this.update()
        },

        methods: {
            update() {
                this.has_result = false
                this.users_displayed = []
                if (this.users !== undefined && this.users !== null && this.users.length > 0) {
                    this.has_result = true
                    this.users_displayed = this.users
                    this.idx = 0

                    var len = n_displayed > this.users.length ?
                            this.users.length : n_displayed
                    this.users_displayed = this.users.slice(this.idx, len)
                }
            },

            prev() {
                let prev = pagerPrevious(this.users, this.idx, n_displayed)
                this.users_displayed = prev.arr
                this.idx = prev.index
            },

            next() {
                let nxt = pagerNext(this.users, this.idx, n_displayed)
                this.users_displayed = nxt.arr
                this.idx = nxt.index
            }
        },

        watch: {
            "users": function() {
                this.update()
            }
        }
    }
</script>
