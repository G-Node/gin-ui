<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div v-if="!can_doi" class="bs-callout bs-callout-danger">
            <p>Your repository does not fullfill all requirements to request a DOI. Yet... </p>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                Create DOI from your current repository
            </div>
            <div class="panel-body">
                <!-- create DOI -->
                <div v-if="can_doi" class="form-group">
                    <div class="bs-callout bs-callout-success">
                        <p>Your repository fullfills the requirements to request a DOI!
                            But before you start the process, please make sure</p>
                        <ul>
                            <li>
                                that your repository actually contains all the information you
                                want to submit. After you have started the process, you cannot add
                                files ex post.
                            </li>
                            <li>
                                that the information in your <code>{{ doi_file }}</code> file contains all
                                information required to successfully submit your data to a DOI agency.
                                If you are unsure, you can read up on the details <a href="#">here</a> before proceeding.
                                <span class="label label-warning">Under construction</span>
                            </li>
                        </ul>
                    </div>

                    <div class="row">
                        <div class="col-sm-9"></div>
                        <div class="col-sm-3">
                            <button type="submit" class="btn btn-success" @click="request">Request DOI</button>
                        </div>
                    </div>
                </div>

                <!-- handle unmet requirements -->
                <div v-if="!can_doi">
                    <!-- handle private repository -->
                    <div v-if="message == 'one'">
                        Your repository is <strong>private</strong>.
                        <hr>
                        <p>A DOI can only be requested for a <strong>public</strong> repository</p>
                        <p>Please change the repository visibility to public under the Settings tab before proceeding.</p>
                    </div>

                    <!-- handle missing doi_file -->
                    <div v-if="message == 'two'">
                        Your repository is missing the DOI request file.
                        <hr>
                        <p>In order to request a DOI, the root of your repository must contain a file
                            named <code>{{ doi_file }}</code>.<br/>This file has to contain information about
                            yourself and your project.
                        </p>
                        <p>Please add this file to the root of your repository before proceeding.</p>

                        <hr>

                        <p>You can find a description about the content of this request file <a href="#">here</a>.
                            <span class="label label-warning">Under construction</span></p>
                        <p>You can download an example file <a href="#">here</a>.
                            <span class="label label-warning">Under construction</span></p>
                    </div>
                </div>
            </div>
            <div class="panel-heading">
                What is a DOI and why would I want one?
            </div>
            <div class="panel-body">
                DOI's are ... <span class="label label-warning">Under construction</span>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-3"><span class="label label-info">Page under development</span></div>
            <div class="col-sm-9"></div>
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
                                if (!this.can_doi) {
                                    this.message = "two"
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
