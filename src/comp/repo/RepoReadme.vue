<template>
    <article style="margin-top: 1.5em">
        Show the content of the README.md here.
    </article>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                path: this.$route.path,
                params: this.$route.params,
                name: this.$route.name
            }
        }
    }
</script>