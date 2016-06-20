<template>
    <div v-if="owner">
        <h2>{{ header }}</h2>

        <hr />

        <div>
            <ul class="nav pull-right">
                <li role="presentation">
                    <button class="btn btn-default" v-link="{ name: 'repository-create', params: { username: login.username }}">New Repository</button>
                </li>
            </ul>

            <ul class="nav nav-tabs">
                <li role="presentation" :class="{ 'active': $route.name === 'own-repositories' }">
                    <a v-link="{ name: 'own-repositories', params: { username: owner.username }}">{{ headerOwn }}</a>
                </li>
                <li role="presentation" :class="{ 'active': $route.name === 'shared-repositories' }">
                    <a v-link="{ name: 'shared-repositories', params: { username: owner.username }}">{{ headerShared }}</a>
                </li>
            </ul>
        </div>

        <router-view v-bind:login="login" v-bind:owner="owner"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            const data = { owner: null }

            this.update(this.$route.params, null, data)

            return data
        },

        computed: {
            ownerName: {
                get() {
                    const fn = this.owner ? this.owner.firstName : null
                    const ln = this.owner ? this.owner.lastName : null

                    if (fn && ln) {
                        return fn[0] + ". " + ln
                    }

                    return this.owner.username
                }
            },

            header: {
                get() {
                    if (this.isOwnRepository) {
                        return "Your Data"
                    } else {
                        return this.ownerName + "'s Data"
                    }
                }
            },

            headerOwn: {
                get() {
                    if (this.isOwnRepository) {
                        return "Repositories owned by You"
                    } else {
                        return "Repositories owned by " + this.ownerName
                    }
                }
            },

            headerShared: {
                get() {
                    if (this.isOwnRepository) {
                        return "Repositories shared with You"
                    } else {
                        return "Repositories shared with " + this.ownerName
                    }
                }
            },

            isOwnRepository: {
                get() {
                    return this.login && this.owner.username === this.login.username
                }
            }
        },

        props: {
            login: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params, old, target=null) {
                target = target || this

                const sameAccount = old && old.username === params.username

                if (!sameAccount) {
                    const promise = api.accounts.get(params.username)
                    promise.then(
                        (acc) => {
                            target.owner = acc
                        },
                        (error) => {
                            this.alertError(error)
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