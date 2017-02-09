<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div class="row" v-if="account">
            <div class="col-md-3">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        Personal Settings
                    </div>
                    <div class="panel-body">
                        <ul class="nav nav-pills  nav-stacked">
                            <li role="presentation">
                                <router-link :to="{ name: 'profile-settings'}">Profile</router-link>
                            </li>
                            <li role="presentation">
                                <router-link :to="{ name: 'affiliation-settings'}">Affiliation</router-link>
                            </li>
                            <li role="presentation">
                                <router-link :to="{ name: 'password-settings'}">Password</router-link>
                            </li>
                            <li role="presentation">
                                <router-link :to="{ name: 'email-settings' }">E-mail</router-link>
                            </li>
                            <li role="presentation">
                                <router-link :to="{ name: 'sshkey-settings'}">SSH Keys</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <router-view v-bind:account="account"></router-view>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            account: { required: true }
        }
    }
</script>
