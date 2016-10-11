<style>
    th {
        width: 2em
    }
</style>

<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <span>
                <router-link :to="{ name: 'repository-files', params: { root: ':root' }}">root</router-link>
            </span>
            <span v-for="(n, p) in path_components">
                / <router-link :to="{ name: 'repository-files', params: { root: p }}">{{ n }}</router-link>
            </span>
        </div>

        <table v-if="dir" class="table">
            <tbody>
                <tr v-for="file in dir_list">
                    <th scope="row"><span class="glyphicon glyphicon-folder-open"></span></th>

                    <td>
                        <router-link :to="{ name: 'repository-files', params: { root: path + '/' + file.name }}">
                            {{ file.name }}
                        </router-link>
                    </td>
                    <td class="text-right">{{ file.size }}</td>
                </tr>
                <tr v-for="file in file_list">
                    <th scope="row"><span class="glyphicon glyphicon-file"></span></th>

                    <td>{{ file.name }}</td>
                    <td class="text-right">{{ file.size | filesize }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/ecmascript-6">
    function cleanPath(path) {
        if (path === ":root") {
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
                dir: null
            }
        },

        ready() {
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
            }
        },

        watch: {
            "$route.params" : function (params, old) {
                this.update(params, old)
            }
        }
    }
</script>