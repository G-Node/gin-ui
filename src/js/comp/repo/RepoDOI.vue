<!--
    Copyright (c) 2017, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div v-if="!can_doi" class="bs-callout bs-callout-danger">
            <p>This repository does not fullfill all requirements to request a DOI. Yet... </p>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                Create DOI from your current repository
            </div>
            <div class="panel-body">
                <!-- create DOI -->
                <div v-if="can_doi" class="form-group">
                    <div class="bs-callout bs-callout-success">
                        <p>This repository fullfills the requirements to request a DOI!
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

                                If you are unsure, you can read up on the details
                                <router-link :to="{ name: 'doi' }">here</router-link> before proceeding.
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
                        This repository is <strong>private</strong>.
                        <hr>
                        <p>A DOI can only be requested for a <strong>public</strong> repository.</p>
                        <p>Please change the repository visibility to public at the Settings tab before proceeding.</p>
                    </div>

                    <!-- handle missing doi_file -->
                    <div v-if="message == 'two'">
                        Your repository is missing the DOI request file.
                        <hr>
                        <p>In order to request a DOI, the root of your repository must contain a file
                            named <code>{{ doi_file }}</code>. Please add this file to the
                            root of your repository before proceeding.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                How to get a DOI
            </div>
            <div class="panel-body">
                <ul>
                    <li>Make the repository <strong>public</strong>.</li>
                    <li>Provide a valid DOI request file called <code>{{ doi_file }}</code>
                        at the root of the repository.</li>
                    <li>Hit "Submit" and follow the instructions on gin-doi.</li>
                </ul>
                <ul>
                    <li>Here you can find a <router-link :to="{ name: 'doi' }">
                        detailed description about the DOI request file</router-link>.</li>
                    <li>You can also download an <a :href="doi_example">example DOI request file</a>.</li>
                </ul>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                What is a DOI and why would I want one?
            </div>
            <div class="panel-body">
                <p>A <a href="https://www.doi.org/">DOI (Digital Object Identifier)</a> <strong>permanently</strong> identifies a resource.</p>
                <p>For your research this means:</p>
                <ul>
                    <li>Make any of your data sets <strong>citable</strong>. You will get a permanent link
                    to the data set you provide. If you use the gin-doi service, your data will be hosted for free.</li>
                    <li>You can also make your scripts, software, laboratory protocols citable
                    by giving them a DOI and gaining credit for your work that cannot be normally published.</li>
                </ul>
                <p>Note that you cannot change or remove a resource once a DOI has been assigned to it.</p>
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
                message: null
            }
        },

        mounted() {
            // Someone has been meddling with the route without proper access, naughty!
            if (this.account.login !== this.owner.login) {
                console.error("DOIs only for owners, naughty!")
                this.$router.push({path: "/not-found"})
            }
            this.update(this.$route.params)
        },

        computed: {
            doi_file: function() {
                return window.api.config.doi_file
            },
            doi_example: function() {
                return window.api.config.doi_example
            }
        },

        props: {
            repository: { required: true },
            account: { required: true },
            owner: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            request() {
                console.log("[RepoDOI] create DOI")
                // TODO Currently only the master branch is handled.
                // TODO Once different branches are supported, this has to be changed as well.
                window.api.repos.requestDOI(this.$route.params.username,
                        this.$route.params.repository,
                        "master")
            },

            update(params) {
                this.can_doi = false
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
