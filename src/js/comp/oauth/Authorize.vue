<!-- This page is required for initiating a login at gin-auth after account activation. -->
<template>
    <!-- empty template required to suppress vue warning -->
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        mounted() {
            window.api.authorize()
        },

        mixins: [ Alert ]
    }
</script>
