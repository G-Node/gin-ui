<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<style>
    .dropdown-menu {
        /*padding: 1em;*/
    }
</style>

<template>
    <ul class="nav navbar-nav navbar-right">
        <li>
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
               aria-haspopup="true" aria-expanded="false">
                {{ account ? display_name : "Sign in"}} <span class="caret"></span>
            </a>

            <ul class="dropdown-menu" v-if="!account" style="padding: 1em">
                <!-- login form (shown if not logged in) -->
                <li>
                    <a href="#" @click="signIn">Sign in</a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                    <a href="#" @click="register">Get an account</a>
                </li>
            </ul>

            <ul class="dropdown-menu" v-if="account">
                <!-- login info (shown if logged in) -->
                <li>
                    <router-link :to="{ name: 'profile-settings'}">Profile Settings</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'affiliation-settings'}">Affiliation Settings</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'password-settings'}">Change Password</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'email-settings' }">Change E-mail</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'sshkey-settings'}">Manage SSH Keys</router-link>
                </li>
                <li role="separator" class="divider"></li>
                <li><a href="#" @click="signOut">Sign out</a></li>
            </ul>
        </li>
    </ul>
</template>

<script type="text/ecmascript-6">
    export default {

        computed: {
            display_name: {
                get() {
                    const fn = this.account.first_name
                    const ln = this.account.last_name

                    if (fn && ln) {
                        return `${fn[0]}. ${ln}`
                    }

                    return this.account.login
                }
            }
        },

        props: {
            account: { required: true }
        },

        methods: {
            signIn() {
                window.api.authorize()
            },

            signOut() {
                window.api.logout()
            },

            register() {
                window.api.register()
            }
        }
    }
</script>
