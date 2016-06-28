<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Edit Profile
        </div>
        <div class="panel-body">
            <div class="form-horizontal">
                <div class="form-group">
                    <label for="title" class="col-sm-3 control-label">Title</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="title" placeholder="Title" v-model="form.title">
                    </div>
                </div>
                <div class="form-group">
                    <label for="first-name" class="col-sm-3 control-label">First Name</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="first-name" placeholder="First Name" v-model="form.first_name">
                    </div>
                </div>
                <div class="form-group">
                    <label for="last-name" class="col-sm-3 control-label">Last Name</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="last-name" placeholder="Last Name" v-model="form.last_name">
                    </div>
                </div>
                <div class="form-group">
                    <label for="email" class="col-sm-3 control-label">Email</label>
                    <div class="col-sm-9">
                        <input type="email" class="form-control" id="email" placeholder="Email Address" v-model="form.email">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button type="submit" class="btn btn-default" @click="reset">Reset</button>
                        <button type="submit" class="btn btn-primary" @click="save">Save</button>
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
                    title: this.account.title,
                    first_name: this.account.first_name,
                    last_name: this.account.last_name,
                    email: this.account.email
                }
            }
        },

        props: {
            account: { twoWay: true, required: true }
        },

        mixins: [ Alert ],

        methods: {
            save() {
                const copy = Object.assign({}, this.account, this.form)
                api.accounts.update(copy).then(
                    (acc) => {
                        this.account = acc
                        this.alertSuccess("Profile successfully updated!")
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            },

            reset() {
                this.form = {
                    title: this.account.title,
                    first_name: this.account.first_name,
                    last_name: this.account.last_name,
                    email: this.account.email
                }
            }
        },

        watch: {
            "account": function () {
                this.form = {
                    title: this.account.title,
                    first_name: this.account.first_name,
                    last_name: this.account.last_name,
                    email: this.account.email
                }
            }
        }
    }
</script>