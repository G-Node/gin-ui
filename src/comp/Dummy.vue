<template>
    <div>
        <h2>{{ path }}</h2>
        <ul>
            <li v-for="(k, v) in params"><strong>{{ k }}:</strong> {{ v }}</li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                path: this.$route.path,
                params: this.$route.params
            }
        }
    }
</script>