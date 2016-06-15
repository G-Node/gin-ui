<template>
    <ul class="nav navbar-nav">
        <li><a v-link="{ name: 'public-repos' }">Public Data</a></li>
        <li v-if="login"><a v-link="{ name: 'own-repositories', params: { username: login.username }}">Your Data</a></li>
    </ul>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            login: { twoWay: false, required: true }
        }
    }
</script>