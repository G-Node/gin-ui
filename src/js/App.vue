<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<style>
    .nav-tabs {
        margin-bottom: 1.6em;
    }
</style>

<template>
    <div id="main">
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <!-- collapsed menu button -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <!-- navbar branding -->
                    <router-link class="navbar-brand-gnode" :to="{ name: 'index' }"></router-link>
                </div>
                <!-- left hand side navigation items -->
                <div id="navbar" class="navbar-collapse collapse">
                    <!-- left hand side navigation items -->
                    <main-menu v-bind:account="account"></main-menu>
                    <!-- right hand side navigation items -->
                    <login-menu v-bind:account="account"></login-menu>
                </div>
            </div>
        </nav>

        <div class="container main-container">
            <div class="alert" role="alert" v-if="alert" :class="[alert ? 'alert-' + alert.level : '']">
                {{ alert.content }}
            </div>
            <div v-if="!error">
                <router-view v-bind:account="account"></router-view>
            </div>
            <div v-if="error">
                <error-page v-bind:error="error"></error-page>
            </div>
        </div>

        <footer>
            <hr>
            <div class="container">
                © G-Node{{ date_range }}
            </div>
        </footer>
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "./events.js"

    import MainMenu  from "./comp/MainMenu.vue"
    import LoginMenu from "./comp/LoginMenu.vue"
    import ErrorPage from "./comp/ErrorPage.vue"

    // Project wide constants
    const default_title = "G-Node GIN"
    const copyright_first_year = "2016"
    const message_delay = 4000

    event.init()

    export default {

        data() {
            return {
                alert: null,
                error: null,
                account: null
            }
        },

        components: {
            MainMenu,
            LoginMenu,
            ErrorPage
        },

        computed: {
            date_range: function () {
                var d = new Date()
                var y = copyright_first_year
                if (d.getFullYear() > parseInt(y)) {
                    y = y +"-"+ d.getFullYear().toString()
                }
                return ", "+ y
            }
        },

        mounted() {
            this.updateTitle(this.$route)
            this.updateAccount()
        },

        methods: {
            updateTitle(route) {
                this.error = null

                if (route.matched) {
                    let complete_title = default_title
                    if (route.title) {
                        complete_title = complete_title + ": " + route.title
                    }
                    document.title = complete_title
                } else {
                    this.error = "Page does not exist"
                    document.title = default_title + ": " + this.error
                }
            },

            updateAccount() {
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

            alertEvent(message) {
                const alert = Object.assign({}, message)
                if (alert.content.hasOwnProperty("message")) {
                    alert.content = alert.content.message
                } else {
                    alert.content = alert.content.toString()
                }

                this.alert = alert

                setTimeout(() => { this.alert = null }, message_delay)

                if (message.level === "danger" || message.level === "warning") {
                    console.error(message.content)
                }
            },

            errorEvent(error) {
                this.error = error
            }
        },

        created: function() {
            event.on("account-update", this.updateAccount)
            event.on("alert-event", this.alertEvent)
            event.on("error-event", this.errorEvent)
        },

        watch: {
            "$route": function(route) {
                this.updateTitle(route)
            }
        }
    }
</script>
