<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in repos_shared">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        {{ repo.Owner }}/{{ repo.Name }}
                    </div>
                    <div class="panel-body">
                        Head: {{ repo.Head }} <br/>
                        Description: {{ repo.Description }} <br/>
                        Public: {{ repo.Visibility }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                repos_shared: null
            }
        },

        mounted() {
            this.update()
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update() {
                const repos_shared = api.repos.listShared()
                repos_shared.then(
                        (repos) => {
                            this.repos_shared = repos
                        },
                        (error) => {
                            this.repos_shared = null
                            this.reportError(error)
                        }
                )
            }
        }
    }
</script>