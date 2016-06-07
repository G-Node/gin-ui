<template>
    <div v-if="owner">
        <h2>{{ header() }}</h2>

        <hr />

        <ul class="nav nav-tabs">
            <li role="presentation" :class="{ 'active': isTabOwnActive() }">
                <a v-link="{ name: 'own-repositories', params: { username: owner.username }}">{{ headerOwn() }}</a>
            </li>
            <li role="presentation" :class="{ 'active': isTabSharedActive() }">
                <a v-link="{ name: 'shared-repositories', params: { username: owner.username }}">{{ headerShared() }}</a>
            </li>
        </ul>

        <router-view v-bind:account="account" v-bind:owner="owner"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            const d = {
                owner: null,
                path: this.$route.path,
                params: this.$route.params
            }

            api.accounts.get(this.$route.params.username).then(
                    (acc) => {
                        d.owner = acc
                    },
                    (error) => {
                        this.alertError(error)
                    },
            )

            return d
        },

        props: {
            account: { twoWay: false, required: true }
        },

        mixins: [ Alert ],

        methods: {
            ownerName() {
                const fn = this.owner ? this.owner.firstName : null,
                        ln = this.owner ? this.owner.lastName : null

                if (fn && ln) {
                    return fn[0] + ". " + ln
                }

                return this.owner.username
            },

            header() {
                if (this.isOwnRepository()) {
                    return "Your Data"
                } else {
                    return this.ownerName() + "'s Data"
                }
            },

            headerOwn() {
                if (this.isOwnRepository()) {
                    return "Repositories owned by You"
                } else {
                    return "Repositories owned by " + this.ownerName()
                }
            },

            headerShared() {
                if (this.isOwnRepository()) {
                    return "Repositories shared with You"
                } else {
                    return "Repositories shared with " + this.ownerName()
                }
            },

            isOwnRepository() {
                return (this.account && this.owner.username === this.account.username)
            },

            isTabOwnActive() {
                return !this.isTabSharedActive()
            },

            isTabSharedActive() {
                return this.$route.path.split("/").pop() === "shared"
            }
        }
    }
</script>