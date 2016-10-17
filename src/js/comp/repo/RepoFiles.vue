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

        <table v-if="dir" class="table">
            <tbody>
                <tr v-for="dir in dir_list">
                    <th scope="row"><span class="glyphicon glyphicon-folder-open"></span></th>

                    <td>
                        <router-link :to="{ name: 'repository-files',
                            params: {
                                username: $route.params.username,
                                repository: $route.params.repository,
                                root: path + '/' + dir.name }}">
                            {{ dir.name }}
                        </router-link>
                    </td>
                    <td class="text-right">{{ dir.size }}</td>
                </tr>

                <tr v-for="file in file_list">
                    <th scope="row"><span class="glyphicon glyphicon-file"></span></th>

                    <td>{{ file.name }}</td>
                    <td class="text-right">{{ file.size | filesize }}</td>
                </tr>
            </tbody>
        </table>

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
                    <td>{{ item.type }}</td>
                    <td>{{ item.id }}</td>
                </tr>

                <tr v-for="item in content_files">
                    <th scope="row"><span class="glyphicon glyphicon-file"></span></th>
                    <td>{{ item.name }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.id }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/ecmascript-6">
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
                dir: null,
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
            },

            dir_list: {
                get() {
                    let dirs = []

                    if (this.dir) {
                        const all = this.dir.files
                        for (let name of Object.keys(this.dir.files)) {
                            let file = all[name]
                            if (file.type === "dir") {
                                dirs = dirs.concat(file)
                            }
                        }
                    }

                    return dirs
                }
            },

            file_list: {
                get() {
                    let files = []

                    if (this.dir) {
                        const all = this.dir.files
                        for (let name of Object.keys(this.dir.files)) {
                            let file = all[name]
                            if (file.type === "file") {
                                files = files.concat(file)
                            }
                        }
                    }

                    return files
                }
            }
        },

        props: {
            account: { required: true }
        },

        methods: {
            update(params, old) {
                /*
                this.path = cleanPath(params.root)

                const login_name = this.account ? this.account.login : null
                const promise = window.api.files.getDir(params.username, params.repository, this.path, login_name)
                promise.then(
                    (dir) => {
                        this.dir = dir
                    },
                    (error) => {
                        console.log(error)
                        this.dir = null
                    }
                )
                */
                // not sure if this check is a good thing to do
                if (params !== old) {
                    this.path = cleanPath(params.root)

                    const promise_dir = api.repos.getDirectorySection(params.username, params.repository,
                                                                        "master", this.path)
                    promise_dir.then(
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
                            },
                            (error) => {
                                this.reportError(error)
                            }
                    )
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