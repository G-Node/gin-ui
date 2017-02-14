<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <!-- empty template required to suppress vue warning -->
</template>

<script type="text/ecmascript-6">
    import { stateHash }  from "../../utils.js"
    import { event }      from "../../events.js"
    import Alert          from "../Alert.js"

    event.init()

    export default {
        mounted() {
            if (this.$route.query["state"] !== stateHash(window.api.config.client_id, navigator.userAgent)) {
                // TODO probably not the best way to handle session cookies but ok for now.
                // Force second login by removing gin-auth session cookie.
                this.$cookies.remove("session", "/")
                this.alertError("We encountered an error during login. Please repeat login procedure.")
                this.$router.push({path: "/"})
            } else {
                let promise = window.api.login(this.$route.query["access_token"])
                promise.then(
                        (account) => {
                            event.emit("account-update")
                            this.$router.push({path: "/"})
                        },
                        (error) => {
                            this.reportError(error)
                        }
                )
            }
        },

        mixins: [ Alert ],

        props: {
            account: { required: true }
        }
    }
</script>
