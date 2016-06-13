<template>
    <div>
        <header>
            <h2>{{$route.params.username}}/{{$route.params.repository}}</h2>
            <h4 v-if="repository">{{ repository.description }}</h4>
        </header>

        <hr />

        <ul class="nav nav-tabs" v-if="repository">
            <li role="presentation" :class="{ 'active': $route.name === 'repository' }">
                <a v-link="{ name: 'repository', params: { username: owner.username, repository: repository.name }}">Info</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-files' }">
                <a v-link="{ name: 'repository-files', params: { username: owner.username, repository: repository.name }}">Files</a>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-settings' }">
                <a v-link="{ name: 'repository-settings', params: { username: owner.username, repository: repository.name }}">Settings</a>
            </li>
        </ul>

        <router-view v-if="repository" v-bind:account="account" v-bind:owner="owner" v-bind:repository="repository"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            const data = {
                owner: null,
                repository: null
            }

            this.update(data)

            return data
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(obj=null) {
                const updated = obj || this
                const username = this.account ? this.account.username : null

                let promise = api.repos.get(this.$route.params.username, this.$route.params.repository, username)
                promise.then(
                    (repo) => {
                        updated.repository = repo
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )

                promise = api.accounts.get(this.$route.params.username)
                promise.then(
                    (acc) => {
                        updated.owner = acc
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            }
        }
    }
</script>