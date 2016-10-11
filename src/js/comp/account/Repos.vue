<template>
    <div>
        <div v-if="owner">
            <h2>{{ header }}</h2>

            <hr />

            <div>
                <ul class="nav pull-right" v-if="account_is_owner">
                    <li role="presentation">
                        <button class="btn btn-default" v-link="{ name: 'repository-create'}">New Repository</button>
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
            </div>

            <router-view v-bind:account="account" v-bind:owner="owner"></router-view>
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
                        return fn[0] + ". " + ln
                    }

                    return this.owner.login
                }
            },

            header: {
                get() {
                    if (this.account_is_owner) {
                        return "Your Data"
                    } else {
                        return this.owner_name + "'s Data"
                    }
                }
            },

            heading_own: {
                get() {
                    if (this.account_is_owner) {
                        return "Repositories owned by You"
                    } else {
                        return "Repositories owned by " + this.owner_name
                    }
                }
            },

            heading_shared: {
                get() {
                    if (this.account_is_owner) {
                        return "Repositories shared with You"
                    } else {
                        return "Repositories shared with " + this.owner_name
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
                        },
                    )
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