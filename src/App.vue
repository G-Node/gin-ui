<style>
    .navbar-brand {
        padding-top: 2px;
    }
</style>

<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <!-- collapsed menu button -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <!-- navbar branding --> <!-- TODO add g-node logo here -->
                    <a class="navbar-brand" href="/"><img alt="G-Node" src="/img/gnode.png" height="46"></a>
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

        <div class="container">
            <div class="alert" role="alert" v-if="alert" :class="[alert ? 'alert-' + alert.level : '']">
                {{ alert.content }}
            </div>
            <div>
                <router-view v-bind:account.sync="account"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue       from 'vue'
    import LoginMenu from './comp/LoginMenu.vue'
    import MainMenu  from './comp/MainMenu.vue'

    Vue.component("main-menu", MainMenu)
    Vue.component("login-menu", LoginMenu)

    export default {

        data() {
            return {
                alert: null,
                account: null
            }
        },

        events: {
            "alert-event": function (message) {
                const that = this
                that.alert = message
                setTimeout(function () { that.alert = null }, 2000)

                if (message.level === "danger" || message.level === "warning") {
                    console.error(message.content)
                }
            }
        }
    }
</script>
