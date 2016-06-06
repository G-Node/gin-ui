<template>
    <ul class="nav navbar-nav">
        <li><a v-link="{ name: 'public-repos' }">Public Data</a></li>
        <li v-if="account"><a v-link="{ path: '/greeter/adrian' }">Your Data</a></li>
    </ul>
</template>

<script>
    export default {
        props: {
            account: { twoWay: false, required: true }
        }
    }
</script>