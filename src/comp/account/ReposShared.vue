<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in repositories">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a v-link="{ name: 'repository', params: { username: repo.owner, repository: repo.name}}">{{ repo.owner }}/{{ repo.name }}</a>
                    </div>
                    <div class="panel-body">
                        {{ repo.description }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            const data = { repositories: null }

            this.update({ owner: this.owner, login: this.login }, data)

            return data
        },

        props: {
            login: { required: true },
            owner: { required: true }
        },

        methods: {
            update(accounts, target=null) {
                target = target || this

                const loginName = accounts.login.username ? accounts.login.username : null
                const promise  = api.repos.listShared(accounts.owner.username, loginName)
                promise.then(
                    (repos) => {
                        target.repositories = repos
                    },
                    (error) => {
                        console.log(error)
                        target.repositories = null
                    }
                )
            }
        },

        watch: {
            "{owner: owner, login: login}": function (accounts) {
                this.update(accounts)
            }
        }
    }
</script>