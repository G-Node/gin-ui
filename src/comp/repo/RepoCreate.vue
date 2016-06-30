<template>
    <div class="panel panel-default" v-if="account">
        <div class="panel-heading">
            New Repository
        </div>
        <div class="panel-body">
            <div class="form-horizontal" @keypress.enter="save">
                <div class="form-group">
                    <label for="name" class="col-sm-2 control-label">Name</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="name" placeholder="Repository Name (only alphanumeric characters and '-' or '_')" v-model="form.name">
                    </div>
                </div>

                <div class="form-group">
                    <label for="name" class="col-sm-2 control-label">Description</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="description" placeholder="Repository Description" v-model="form.description">
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-10 col-sm-offset-2 checkbox">
                        <label for="public">
                            <input type="checkbox" id="public" v-model="form.public"> Make Repository Public
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-default" @click="reset">Reset</button>
                        <button type="submit" class="btn btn-primary" @click="save">Create</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                form: {
                    name: null,
                    description: null,
                    public: false
                }
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            save() {
                let promise = api.repos.create(this.account.login, this.form)
                promise.then(
                    (repo) => {
                        this.alertSuccess("Repository successfully created")
                        this.$router.go({name: "own-repositories", params: { "username": this.account.login }})
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            },

            reset() {
                this.form.name = null
                this.form.description = null
                this.form.public = false
            }
        }
    }
</script>