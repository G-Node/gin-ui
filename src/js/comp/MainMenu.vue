<template>
    <ul class="nav navbar-nav">
        <li>
            <router-link :to="{ name: 'search' }">Search</router-link>
        </li>
        <li v-if="account">
            <router-link :to="{ name: 'own-repositories', params: { username: account.login }}">Your Data</router-link>
        </li>
    </ul>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            account: { required: true }
        }
    }
</script>
