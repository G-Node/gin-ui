<template>
    <!-- empty template required to suppress vue warning -->
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    export default {
        mounted() {
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
        },

        mixins: [ Alert ],

        props: {
            account: { required: true }
        }
    }
</script>
