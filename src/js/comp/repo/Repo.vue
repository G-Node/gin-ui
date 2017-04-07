<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <header>
            <h2>{{$route.params.username}}/{{$route.params.repository}} <span v-if="!repository">not found</span></h2>
            <h4 v-if="repository">{{ repository.Description }}</h4>
        </header>

        <hr />

        <div v-if="!repository">
            Please check the spelling of user and repository name if you feel you received this message in error.
        </div>

        <ul class="nav nav-tabs" v-if="repository && owner">
            <li role="presentation" :class="{ 'active': $route.name === 'repository' }">
                <router-link :to="{ name: 'repository-info',
                            params: { username: $route.params.username, repository: $route.params.repository }}">
                    Info
                </router-link>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-files' }">
                <router-link :to="{ name: 'repository-files',
                            params: { username: $route.params.username, repository: $route.params.repository, root: '/' }}">
                    Files
                </router-link>
            </li>
            <li role="presentation" v-if="is_repo_owned">
                <router-link :to="{ name: 'repository-doi',
                        params: { username: $route.params.username, repository: $route.params.repository }}">
                    DOI
                </router-link>
            </li>
            <li role="presentation" :class="{ 'active': $route.name === 'repository-settings' }"
                                    v-if="is_repo_writeable">
                <router-link :to="{ name: 'repository-settings',
                            params: { username: $route.params.username, repository: $route.params.repository }}">
                    Settings
                </router-link>
            </li>
        </ul>

        <router-view v-if="repository && owner"
                     v-bind:account="account"
                     v-bind:owner="owner"
                     v-bind:is_repo_writeable="is_repo_writeable"
                     v-bind:repository="repository">
        </router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    // TODO should params.username on this page and its child pages not actually be ownername?
    // TODO Also probably change params.repository to reponame.

    export default {
        data() {
            return {
                owner: null,
                repository: null
            }
        },

        mounted() {
            this.update(this.$route.params, null)
        },

        computed: {
            is_repo_writeable: {
                get() {
                    const name = this.account ? this.account.login : null
                    const repo = this.repository

                    var collaborator
                    if (repo.Shared.length !== undefined) {
                        collaborator = repo.Shared
                                    .filter((coll) => coll.AccessLevel === "is-admin")
                                    .map(coll => { return coll.User })
                    }

                    return name && repo && (repo.Owner === name || (collaborator && collaborator.indexOf(name) >= 0))
                }
            },

            is_repo_owned: {
                get() {
                    const name = this.account ? this.account.login : null
                    const repo = this.repository

                    return name && repo && (repo.Owner === name)
                }
            },
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            update(params, old) {
                console.log("[Repo] update repo")
                // checking if there is a token in storage is a bugfix to enable display a
                // repository when a user is not logged in.
                if ((this.account === undefined || this.account === null) && localStorage.getItem("token") !== null) {
                    console.log("[Repo] race condition with App lost, no account, cannot update")
                    return
                }

                const same_owner = old && old.username === params.username
                const same_repo  = old && old.repository === params.repository

                if (!same_owner) {
                    const promise = api.accounts.get(params.username)
                    promise.then(
                            (acc) => {
                                this.owner = acc
                            },
                            (error) => {
                                console.error(error)
                                if (error.code != 404) {
                                    this.alertError(error)
                                }
                            }
                    )
                }

                if (!same_repo || !same_owner) {
                    // If results are returned, this means the repository exists and the current user
                    // has at least pull access.
                    const promise = api.repos.getRepo(params.username, params.repository)
                    promise.then(
                            (repo) => {
                                this.repository = Object.assign({}, repo, { Shared: {} })
                                const co_promise = api.repos.getRepoCollaborators(params.username, params.repository)
                                co_promise.then(
                                        (collaborators) => {
                                            this.repository.Shared = collaborators
                                        },
                                        (error) => {
                                            this.repository = null
                                            console.error(error)
                                            if (error.code != 404) {
                                                this.alertError(error.status)
                                            }
                                        }
                                )
                            },
                            (error) => {
                                this.repository = null
                                console.error(error)
                                if (error.code != 404) {
                                    this.alertError(error.status)
                                }
                            }
                    )
                }
            }
        },

        created: function() {
            event.on("repo-update", this.update)
        },

        watch: {
            "account": function() {
                console.log("[Repo] account has changed, update")
                this.update(this.$route.params, null)
            },

            "$route.params": function (params, old) {
                console.log("[Repo] route has changed, update")
                this.update(params, old)
            }
        }
    }
</script>
