<template>
    <div class="row">
        <div class="col-md-3">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Personal Settings
                </div>
                <div class="panel-body">
                    <ul class="nav nav-pills  nav-stacked">
                        <li role="presentation"><a v-link="{ name: 'profile-settings', params: { username: login.username }}">Profile</a></li>
                        <li role="presentation"><a v-link="{ name: 'password-settings', params: { username: login.username }}">Password</a></li>
                        <li role="presentation"><a v-link="{ name: 'sshkey-settings', params: { username: login.username }}">SSH Keys</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-md-9">
            <router-view v-bind:login.sync="login"></router-view>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            login: { twoWay: true, required: true }
        }
    }
</script>