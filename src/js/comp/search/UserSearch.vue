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
        <nav v-if="users_displayed">
            <ul class="pager">
                <li class="previous"><a @click="prev">
                    Previous <span v-if="pidx !== null">({{ pidx }})</span>
                </a></li>
                <li class="next"><a @click="next">
                    Next <span v-if="nidx !== null">({{ nidx }})</span>
                </a></li>
            </ul>
        </nav>

        <ul class="list-unstyled" v-if="users_displayed">
            <li v-for="user in users_displayed">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <router-link :to="{ name: 'own-repositories', params: { username: user.login } }">
                            {{ user.first_name }} {{ user.last_name }} ({{ user.login }})
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
        </ul>

        <ul class="list-unstyled" v-if="!users_displayed">
            <li class="panel panel-default">
                <div class="panel-body">
                    No user matches your search.
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
                idx: 0,
                pidx: null,
                nidx: null
            }
        },

        props: {
            users: { required: true }
        },

        mounted() {
            this.update()
        },

        methods: {
            update() {
                this.users_displayed = null
                if (this.users !== undefined && this.users !== null && this.users.length > 0) {
                    this.users_displayed = this.users
                    this.idx = 0

                    const len = n_displayed > this.users.length ?
                            this.users.length : n_displayed
                    this.users_displayed = this.users.slice(this.idx, len)
                    this.updatePagerIndex()
                }
            },

            prev() {
                const prev = pagerPrevious(this.users, this.idx, n_displayed)
                this.users_displayed = prev.arr
                this.idx = prev.index
                this.updatePagerIndex()
            },

            next() {
                const nxt = pagerNext(this.users, this.idx, n_displayed)
                this.users_displayed = nxt.arr
                this.idx = nxt.index
                this.updatePagerIndex()
            },

            updatePagerIndex() {
                this.pidx = Math.floor(this.idx / n_displayed)
                this.nidx = Math.floor((this.users.length - this.idx) / n_displayed)
                if ((this.users.length - this.idx) === n_displayed) {
                    this.nidx = 0
                }
            }
        },

        watch: {
            "users": function() {
                this.update()
            }
        }
    }
</script>
