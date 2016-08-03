<template>
    <div>
        Users
        <ul class="list-unstyled">
            <li v-for="user in users">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a v-link="{ name: 'user', params: { }}">{{ user.first_name }}</a>
                    </div>
                    <div class="panel-body">
                        {{ user.first_name }} {{ user.last_name }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from "vue"

    export default {
        data() {
            return {
                repositories: null,
                accounts: null
            }
        }
    }
</script>
