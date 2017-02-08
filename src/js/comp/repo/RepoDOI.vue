<template>
    <div>
        Create DOI with the data of your current repository.
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    export default {
        data() {
            return {
                can_doi: null,
                doi_file: null,
            }
        },

        props: {
            repository: { required: true },
            account: { required: true},
        },

        mixins: [ Alert ],

        methods: {
            update(params) {
                this.can_doi = false
                this.doi_file = "README.md"

                var acc = (this.account !== undefined && this.account !== null)
                var rep = this.repository.Public

                if (acc && rep) {
                    console.log("[RepoDOI] basic checks passed, fetch repo root")
                    const promise_root = api.repos.getDirectorySection(
                            params.username,
                            params.repository,
                            "master", "")
                    promise_root.then(
                            (root) => {
                                console.log("[RepoDOI] repo fetched, find required file")
                                var entries = root.entries
                                for (var entry of entries) {
                                    if (entry.name && entry.name === this.doi_file) {
                                        console.log("[RepoDOI] required file present")
                                        this.can_doi = true
                                        break
                                    }
                                }
                            },
                            (error) => {
                                console.log("[RepoDOI] error while trying to fetch repo")
                                console.log(error)
                            }
                    )
                }
            }
        },

        // Required due to race condition with App.vue, where "account" is reloaded,
        // when the route is changed directly.
        watch: {
            "account": function () {
                console.log("[RepoDOI] account has changed, update")
                this.update(this.$route.params)
            },

            "$route.params": function () {
                console.log("[RepoDOI] route has changed, update")
                this.update(this.$route.params)
            }
        }
    }
</script>
