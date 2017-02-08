<template>
    <div>
        Create DOI with the data of your current repository.
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    export default {
        props: {
            repository: { required: true },
            account: { required: true},
        },

        mixins: [ Alert ],

        // Required due to race condition with App.vue, where "account" is reloaded,
        // when the route is changed directly.
        watch: {
            "account": function () {
                console.log("[RepoDOI] account has changed, update")
            },

            "$route.params": function () {
                console.log("[RepoDOI] route has changed, update")
            }
        }
    }
</script>
