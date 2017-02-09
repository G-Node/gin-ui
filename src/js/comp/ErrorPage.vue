<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <h1>{{ error_heading }}</h1>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            error: { required: true }
        },

        computed: {
            error_heading: {
                get() {
                    if (this.error.hasOwnProperty("message")) {
                        return this.error.message
                    } else {
                        return this.error
                    }
                }
            }
        }
    }
</script>
