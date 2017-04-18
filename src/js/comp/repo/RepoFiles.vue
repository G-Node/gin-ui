<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<style>
    th {
        width: 2em
    }
</style>

<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <span>
                <router-link :to="{ name: 'repository-files',
                    params: {
                        root: '/',
                        username: $route.params.username,
                        repository: $route.params.repository}}">
                    root
                </router-link>
            </span>
            <span v-for="(p, n) in path_components">
                /
                <router-link :to="{ name: 'repository-files',
                    params: {
                        root: p,
                        username: $route.params.username,
                        repository: $route.params.repository}}">
                    {{ n }}
                </router-link>
            </span>
        </div>

        <table v-if="content_tree || content_files" class="table">
            <tbody>
                <tr v-for="item in content_tree">
                    <th scope="row"><span class="glyphicon glyphicon-folder-open"></span></th>
                    <td>
                        <router-link :to="{ name: 'repository-files',
                            params: {
                                username: $route.params.username,
                                repository: $route.params.repository,
                                root: path + '/' + item.name}}">
                            {{ item.name }}
                        </router-link>
                    </td>
                    <td>{{ item.type | fileSysLabel }}</td>
                    <td>{{ item.id }}</td>
                </tr>

                <tr v-for="item in content_files">
                    <th scope="row"><span class="glyphicon glyphicon-file"></span></th>
                    <td>{{ item.name }}</td>
                    <td>{{ item.type | fileSysLabel }}</td>
                    <td>{{ item.id }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    function cleanPath(path) {
        if (path === "root" || path === "" || path === null || path === undefined) {
            path = ""
        } else {
            if (path.startsWith("/")) {
                path = path.substr(1)
            }
            if (path.endsWith("/")) {
                path = path.substr(0, path.length - 1)
            }
        }
        return path
    }

    export default {
        data() {
            return {
                path: null,
                content_tree: [],
                content_files: []
            }
        },

        mounted() {
            this.update(this.$route.params, null)
        },

        computed: {
            path_components: {
                get() {
                    const parts = this.path ? this.path.split("/") : []
                    const comp  = {}

                    for (let i = 0; i < parts.length; i++) {
                        comp[parts[i]] = parts.slice(0, i + 1).join("/")
                    }

                    return comp
                }
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [Alert],

        methods: {
            update(params, old) {
                // not sure if this check is a good thing to do
                if (params !== old) {
                    this.path = cleanPath(params.root)

                    const promise = window.api.repos.getDirectorySection(params.username, params.repository,
                                                                        "master", this.path)
                    promise.then(
                            (dir) => {
                                let content = dir.entries
                                let c_t = []
                                let c_f = []
                                for (let item of content) {
                                    if (item.type) {
                                        if (item.type === "tree") {
                                            c_t = c_t.concat(item)
                                        } else {
                                            c_f = c_f.concat(item)
                                        }
                                    }
                                }
                                this.content_tree = c_t
                                this.content_files = c_f
                            }).catch((error) => {
                                if (error.code === 404) {
                                    this.alertWarning("Repository contains no files")
                                } else {
                                    this.reportError(error)
                                }
                            })
                }
            }
        },

        watch: {
            "$route.params" : function (params, old) {
                this.update(params, old)
            }
        }
    }
</script>
