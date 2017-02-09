<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

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
