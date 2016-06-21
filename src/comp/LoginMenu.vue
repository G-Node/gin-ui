<style>
    .dropdown-menu {
        /*padding: 1em;*/
    }
</style>

<template>
    <ul class="nav navbar-nav navbar-right">
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{ login ? userName : "Sign In"}} <span class="caret"></span></a>

            <ul class="dropdown-menu" v-if="!login" style="padding: 1em">
                <!-- login form (shown if not logged in) -->
                <li>
                    <div @keypress.enter="signIn">
                        <div class="form-group">
                            <input type="text" class="form-control" id="login" placeholder="G-Node Login" v-model="form.username">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Password" v-model="form.password">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-primary btn-block" @click="signIn">Login</button>
                        </div>
                    </div>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                    <a href="#">Get a G-Node Account</a>
                </li>
            </ul>

            <ul class="dropdown-menu" v-if="login">
                <!-- login info (shown if logged in) -->
                <li><a v-link="{ name: 'profile-settings', params: { username: login.username }}">Profile Settings</a></li>
                <li><a v-link="{ name: 'password-settings', params: { username: login.username }}">Change Password</a></li>
                <li><a v-link="{ name: 'sshkey-settings', params: { username: login.username }}">Manage SSH Keys</a></li>
                <li role="separator" class="divider"></li>
                <li><a v-link="{ path: '/' }" @click="signOut">Sign Out</a></li>
            </ul>
        </li>
    </ul>
</template>

<script type="text/ecmascript-6">
    import Alert from "./Alert.js"

    export default {

        data(){
            return {
                form: {
                    username: null,
                    password: null
                }
            }
        },

        computed: {
            userName: {
                get() {
                    const fn = this.login.firstName
                    const ln = this.login.lastName

                    if (fn && ln) {
                        return fn[0] + ". " + ln
                    }

                    return this.login.username
                }
            }
        },

        props: {
            login: { twoWay: true, required: true }
        },

        mixins: [ Alert ],

        methods: {
            signIn() {
                const promise = api.accounts.login(this.form.username, this.form.password)
                promise.then(
                    (acc) => {
                        this.form.username = this.form.password = null
                        this.login = acc
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            },

            signOut() {
                this.login = null
            }
        }
    }
</script>
