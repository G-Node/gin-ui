<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="user in users">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a v-link="{ name: 'own-repositories', params: { username: user.login } }">{{ user.first_name }} {{ user.last_name }}</a>
                    </div>
                    <div class="panel-body">
                            {{ user.affiliation.institute }}
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
