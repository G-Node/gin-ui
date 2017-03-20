<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="user in users">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <router-link :to="{ name: 'own-repositories', params: { username: user.login } }">
                            {{ user.first_name }} {{ user.last_name }}
                        </router-link>
                    </div>
                    <div class="panel-body">
                            <div v-if="user.affiliation">
                                Institution: {{ user.affiliation.institute }}<br />
                                Department: {{ user.affiliation.department }} <br/>
                                City: {{ user.affiliation.city }} <br />
                                Country: {{ user.affiliation.country }}
                            </div>
                            <div v-if="!user.affiliation">
                                No available affiliation.
                            </div>
                    </div>
                </div>
            </li>
            <li v-if="users.length < 1">
                <div class="panel panel-default">
                    <div class="panel-body">
                        No user fits your search.
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            users: {required: true}
        }
    }
</script>
