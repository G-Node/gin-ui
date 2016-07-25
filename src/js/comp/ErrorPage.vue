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
