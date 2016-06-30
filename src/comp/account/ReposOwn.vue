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
            const data =  { repositories: null }

            this.update({ owner: this.owner, account: this.account }, data)

            return data
        },

        props: {
            account: { required: true },
            owner: { required: true }
        },

        methods: {
            update(accounts, target=null) {
                target = target || this

                const login_name = accounts.account ? accounts.account.login : null
                const promise  = api.repos.listOwn(accounts.owner.login, login_name)
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
            "{owner: owner, account: account}": function (accounts) {
                this.update(accounts)
            }
        }
    }
</script>