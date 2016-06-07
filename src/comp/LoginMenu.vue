<style>
    .dropdown-menu {
        /*padding: 1em;*/
    }
</style>

<template>
    <ul class="nav navbar-nav navbar-right">
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{ account ? userName() : "Sign In"}} <span class="caret"></span></a>

            <ul class="dropdown-menu" v-if="!account" style="padding: 1em">
                <!-- login form (shown if not logged in) -->
                <li>
                    <div>
                        <div class="form-group">
                            <input type="text" class="form-control" id="login" placeholder="G-Node Login" v-model="form.username">
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Password" v-model="form.password">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-primary btn-block" @click="login">Login</button>
                        </div>
                    </div>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                    <a href="#">Get a G-Node Account</a>
                </li>
            </ul>

            <ul class="dropdown-menu" v-if="account">
                <!-- account info (shown if logged in) -->
                <li><a v-link="{ name: 'profile-settings', params: { username: account.username }}">Profile Settings</a></li>
                <li><a v-link="{ name: 'password-settings', params: { username: account.username }}">Change Password</a></li>
                <li><a v-link="{ name: 'sshkey-settings', params: { username: account.username }}">Manage SSH Keys</a></li>
                <li role="separator" class="divider"></li>
                <li><a v-link="{ path: '/' }" @click="logout">Sign Out</a></li>
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

        props: {
            account: { twoWay: true, required: true }
        },

        mixins: [ Alert ],

        methods: {

            login() {
                const promise = api.accounts.login(this.form.username, this.form.password)
                promise.then(
                    (acc) => {
                        this.form.username = this.form.password = null
                        this.account = acc
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            },

            logout() {
                this.account = null
            },

            userName() {
                const fn = this.account.firstName,
                      ln = this.account.lastName

                if (fn && ln) {
                    return fn[0] + ". " + ln
                }

                return this.account.username
            }
        }
    }
</script>