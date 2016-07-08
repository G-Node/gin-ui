<style>
    .navbar-brand {
        padding-top: 2px;
    }

    .nav-tabs {
        margin-bottom: 1.6em;
    }
</style>

<template>
    <div>
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <!-- collapsed menu button -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <!-- navbar branding --> <!-- TODO add g-node logo here -->
                    <a class="navbar-brand-gnode" v-link="{ path: '/' }"></a>
                </div>
                <!-- left hand side navigation items -->
                <div id="navbar" class="navbar-collapse collapse">
                    <!-- left hand side navigation items -->
                    <main-menu v-bind:account="account"></main-menu>
                    <!-- right hand side navigation items -->
                    <login-menu v-bind:account.sync="account"></login-menu>
                </div>
            </div>
        </nav>

        <div class="container main-container">
            <div class="alert" role="alert" v-if="alert" :class="[alert ? 'alert-' + alert.level : '']">
                {{ alert.content }}
            </div>
            <div>
                <router-view v-bind:account.sync="account"></router-view>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue       from 'vue'
    import LoginMenu from './comp/LoginMenu.vue'
    import MainMenu  from './comp/MainMenu.vue'

    Vue.component("main-menu", MainMenu)
    Vue.component("login-menu", LoginMenu)

    export default {

        data() {
            const data = {
                alert: null,
                account: null
            }

            const promise = window.api.restore()
            promise.then(
                (account) => {
                    data.account = account
                    console.log("Info: login successfully restored")
                },
                (error) => {
                    console.log("Info: " + error.message)
                }
            )

            return data
        },

        events: {
            "alert-event": function (message) {
                const alert = Object.assign({}, message)
                if (alert.content.hasOwnProperty("message")) {
                    alert.content = alert.content.message
                } else {
                    alert.content = alert.content.toString()
                }

                this.alert = alert

                setTimeout(() => { this.alert = null }, 4000)

                if (message.level === "danger" || message.level === "warning") {
                    console.error(message.content)
                }
            }
        }
    }
</script>
