<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            README
        </div>
        <div class="panel-body">
            <article style="margin-top: 1.5em">
                {{ readme }}
            </article>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    const no_readme = "No readme file for this repository"

    export default {

        data() {
            return { readme: no_readme }
        },

        mounted() {
            this.update(this.$route.params, null)
        },

        mixins: [ Alert ],

        methods: {
            update(params, old){
                if (params != old) {
                    // fetch the repository root to look for a readme file
                    const promise_root = api.repos.getDirectorySection(params.username, params.repository, "master", "")
                    // TODO chaining promises like this is not nice (at all)!
                    // change it when there is time
                    promise_root.then(
                            (root) => {
                                var entries = root.entries
                                for (var entry of entries) {
                                    if (entry.name && entry.name.startsWith("README") && entry.id) {
                                        // fetch the contents of the readme file
                                        const promise_readme = api.repos.getTextFileContent(params.username,
                                                                                            params.repository,
                                                                                            entry.id)
                                        promise_readme.then(
                                                (text) => {
                                                    this.readme = text
                                                },
                                                (error) => {
                                                    this.readme = no_readme
                                                }
                                        )
                                        break
                                    } else {
                                        this.readme = no_readme
                                    }
                                }
                            },
                            (error) => {
                                this.readme = no_readme
                            }
                    )
                }
            }
        },

        watch: {
            "$route.params" : function(params, old) {
                this.update(params, old)
            }
        }
    }
</script>