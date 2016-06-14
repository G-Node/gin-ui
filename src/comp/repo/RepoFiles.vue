<template>
    <div class="panel panel-default" style="margin-top: 1em">
        <div class="panel-heading">
            <span>
                <a v-link="{ name: 'repository-files', params: { root: ':root' }}">root</a>
            </span>
            <span v-for="(n, p) in pathComp">
                / <a v-link="{ name: 'repository-files', params: { root: p }}">{{ n }}</a>
            </span>
        </div>

        <div class="panel-body" style="padding: 0">
            <table v-if="dir" class="table table-striped">
                <colgroup>
                    <col style="width: 2em">
                    <col>
                    <col>
                </colgroup>
                <tbody>
                    <tr v-for="file in dirList">
                        <th scope="row"><span class="glyphicon glyphicon-folder-open"></span></th>
                        <td><a v-link="{ name: 'repository-files', params: { root: path + '/' + file.name }}">{{ file.name }}</a></td>
                        <td class="text-right">{{ file.size }}</td>
                    </tr>
                    <tr v-for="file in fileList">
                        <th scope="row"><span class="glyphicon glyphicon-file"></span></th>
                        <td>{{ file.name }}</td>
                        <td class="text-right">{{ file.size | filesize }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
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
            const data = {
                path: null,
                dir: null
            }

            this.update(this.$route.params, null, data)

            return data
        },

        computed: {
            pathComp: {
                get() {
                    const parts = this.path ? this.path.split("/") : []
                    const comp  = {}

                    for (let i = 0; i < parts.length; i++) {
                        comp[parts[i]] = parts.slice(0, i + 1).join("/")
                    }

                    return comp
                }
            },

            dirList: {
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

            fileList: {
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
            update(params, old, target=null) {
                target = target || this
                target.path = cleanPath(params.root)

                const login = this.account ? this.account.username : null
                const promise = api.files.getDir(params.username, params.repository, target.path, login)
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