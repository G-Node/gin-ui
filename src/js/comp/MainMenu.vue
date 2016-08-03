<template>
    <ul class="nav navbar-nav">
        <li><a v-link="{ name: 'search' }">Search</a></li>
        <li v-if="account"><a v-link="{ name: 'own-repositories', params: { username: account.login }}">Your Data</a></li>
    </ul>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            account: { twoWay: false, required: true }
        }
    }
</script>
