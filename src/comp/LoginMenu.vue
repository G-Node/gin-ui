<style>
    .dropdown-menu {
        /*padding: 1em;*/
    }
</style>

<template>
    <ul class="nav navbar-nav navbar-right">
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{ account ? userName : "Sign In"}} <span class="caret"></span></a>

            <ul class="dropdown-menu" v-if="!account" style="padding: 1em">
                <!-- login form (shown if not logged in) -->
                <li>
                    <a href="#" @click="signIn">Sign In</a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                    <a href="#">Get a G-Node Account</a>
                </li>
            </ul>

            <ul class="dropdown-menu" v-if="account">
                <!-- login info (shown if logged in) -->
                <li><a v-link="{ name: 'profile-settings', params: { username: account.username }}">Profile Settings</a></li>
                <li><a v-link="{ name: 'password-settings', params: { username: account.username }}">Change Password</a></li>
                <li><a v-link="{ name: 'sshkey-settings', params: { username: account.username }}">Manage SSH Keys</a></li>
                <li role="separator" class="divider"></li>
                <li><a v-link="{ path: '/' }" @click="signOut">Sign Out</a></li>
            </ul>
        </li>
    </ul>
</template>

<script type="text/ecmascript-6">
    export default {

        computed: {
            userName: {
                get() {
                    const fn = this.account.firstName
                    const ln = this.account.lastName

                    if (fn && ln) {
                        return fn[0] + ". " + ln
                    }

                    return this.account.username
                }
            }
        },

        props: {
            account: { required: true }
        },

        methods: {
            signIn() {
                const url = window.config.auth.url + "/oauth/authorize?"
                const params = [
                    ["response_type", "token"],
                    ["client_id", "gin"],
                    ["redirect_uri", `${window.location.origin}/oauth/login`],
                    ["scope", "account-read account-write repo-read repo-write"],
                    ["state", "foo"]
                ]
                const query = params.map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1])).join("&")
                window.location.replace(url + query)
            },

            signOut() {
                this.account = null
            }
        }
    }
</script>
