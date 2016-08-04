<style>
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
                    <!-- navbar branding -->
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
            <div v-if="!error">
                <router-view v-bind:account.sync="account"></router-view>
            </div>
            <div v-if="error">
                <error-page v-bind:error="error"></error-page>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue       from "vue"

    import MainMenu  from "./comp/MainMenu.vue"
    import LoginMenu from "./comp/LoginMenu.vue"
    import ErrorPage from "./comp/ErrorPage.vue"

    Vue.component("main-menu", MainMenu)
    Vue.component("login-menu", LoginMenu)
    Vue.component("error-page", ErrorPage)

    const default_title = "G-Node GIN"

    export default {

        data() {
            return {
                alert: null,
                error: null,
                account: null
            }
        },

        ready() {
            this.updateTitle(this.$route)

            const promise = window.api.restore()
            promise.then(
                (account) => {
                    this.account = account
                    console.log("Info: login successfully restored")
                },
                (error) => {
                    console.log("Info: " + error.message)
                }
            )
        },

        methods: {
            updateTitle(route, target=null) {
                target = target || this

                if (route.matched) {
                    let complete_title = default_title
                    if (route.title) {
                        complete_title = complete_title + ": " + route.title
                    }
                    document.title = complete_title
                } else {
                    target.error = "Page does not exist"
                    document.title = default_title + ": " + target.error
                }
            }
        },

        watch: {
            "$route": function(route) {
                target.error = null
                this.updateTitle(route)
            }
        },

        events: {
            "alert-event": function(message) {
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
            },

            "error-event": function(error) {
                this.error = error
            }
        }
    }
</script>
