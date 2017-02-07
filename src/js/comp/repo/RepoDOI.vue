<template>
    <div>
        Create DOI from your current repository status.
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    export default {
        props: {
            repository: { required: true },
        },

        mixins: [ Alert ],

    }
</script>
