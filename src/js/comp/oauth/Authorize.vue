<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

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

        mixins: [Alert]
    }
</script>
