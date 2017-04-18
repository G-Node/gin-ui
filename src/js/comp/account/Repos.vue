<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div v-if="owner">
            <h2>{{ header }}</h2>

            <hr />

            <span>
                <ul class="nav pull-right" v-if="account_is_owner">
                    <li role="presentation">
                        <router-link :to="{ name: 'repository-create'}" class="btn btn-default">
                            New Repository
                        </router-link>
                    </li>
                </ul>

                <ul class="nav nav-tabs">
                    <li role="presentation" :class="{ 'active': $route.name === 'own-repositories' }">
                        <router-link :to="{ name: 'own-repositories', params: { username: owner.login }}">
                            {{ heading_own }}
                        </router-link>
                    </li>
                    <li role="presentation" :class="{ 'active': $route.name === 'shared-repositories' }">
                        <router-link :to="{ name: 'shared-repositories', params: { username: owner.login }}">
                            {{ heading_shared }}
                        </router-link>
                    </li>
                </ul>
            </span>

            <router-view v-bind:account="account"></router-view>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                owner: null
            }
        },

        mounted() {
            this.update(this.$route.params, null)
        },

        computed: {
            owner_name: {
                get() {
                    const fn = this.owner ? this.owner.first_name : null
                    const ln = this.owner ? this.owner.last_name : null

                    if (fn && ln) {
                        return `${fn[0]}. ${ln}`
                    }

                    return this.owner.login
                }
            },

            header: {
                get() {
                    if (this.account_is_owner) {
                        return "Your Data"
                    } else {
                        return `${this.owner_name}'s Data`
                    }
                }
            },

            heading_own: {
                get() {
                    if (this.account_is_owner) {
                        return "Repositories owned by You"
                    } else {
                        return `Repositories owned by ${this.owner_name}`
                    }
                }
            },

            heading_shared: {
                get() {
                    if (this.account_is_owner) {
                        return "Repositories shared with You"
                    } else {
                        return `Repositories shared by ${this.owner_name}`
                    }
                }
            },

            account_is_owner: {
                get() {
                    return this.account && this.owner.login === this.account.login
                }
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params, old) {
                const is_same_account = old && old.username === params.username

                if (!is_same_account) {
                    const promise = api.accounts.get(params.username)
                    promise.then(
                            (acc) => {
                                this.owner = acc
                            },
                            (error) => {
                                this.reportError(error)
                            })
                }
            }
        },

        watch: {
            "$route.params": function (params, old) {
                this.update(params, old)
            }
        }
    }
</script>
