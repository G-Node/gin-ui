<template>
    <div>
        <h3>Create DOI with the data of your current repository</h3>

        <!-- create DOI -->
        <div v-if="can_doi" class="form-group">
            <button type="submit" class="btn btn-primary" @click="request">Request DOI</button>
        </div>

        <!-- handle unmet requirements -->
        <div v-if="!can_doi">
            <p>Currently you cannot create a DOI from your repository!</p>
            <div v-if="message == 'one'">
                <p>Your repository is private, you can only publish your data,
                    if your repository is public.
                </p>
            </div>
            <div v-if="message == 'two'">
                <p>In order to request a DOI, the root of your repository must contain a file
                    named "{{ doi_file }}".<br/>This file has to contain information about
                    yourself and your project.
                </p>
                <p>Please add this file to your repository before continuing.</p>
                <p>You can find a description about the content of this request file <a href="#">here</a>.</p>
                <p>You can download an example file <a href="#">here</a>.</p>
            </div>
        </div>
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
                message: null
            }
        },

        mounted() {
            this.update(this.$route.params)
        },

        props: {
            repository: { required: true },
            account: { required: true}
        },

        mixins: [ Alert ],

        methods: {
            request() {
                console.log("[RepoDOI] create DOI")
                // TODO Currently only the master branch is handled.
                // TODO Once different branches are supported, this has to be changed as well.
                window.api.repos.requestDOI(this.account.login,
                                            this.$route.params.username,
                                            this.$route.params.repository,
                                            "master")
            },

            update(params) {
                this.can_doi = false
                this.doi_file = window.api.config.doi_file
                this.message = "one"

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
                                this.message = "two"
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
