<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Edit Profile
        </div>
        <div class="panel-body">
            <div class="form-horizontal">
                <div class="form-group" :class="{ 'has-error': reasons.title }">
                    <label for="title" class="col-sm-3 control-label">Title</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="title" placeholder="Title" v-model="form.title">
                        <span class="help-block" v-if="reasons.title">{{ reasons.title }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.first_name }">
                    <label for="first-name" class="col-sm-3 control-label">First Name</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="first-name" placeholder="First Name" v-model="form.first_name">
                        <span class="help-block" v-if="reasons.first_name">{{ reasons.first_name }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.middle_name }">
                    <label for="first-name" class="col-sm-3 control-label">Middle Name</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="middle-name" placeholder="Middle Name" v-model="form.middle_name">
                        <span class="help-block" v-if="reasons.middle_name">{{ reasons.middle_name }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.last_name }">
                    <label for="last-name" class="col-sm-3 control-label">Last Name</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="last-name" placeholder="Last Name" v-model="form.last_name">
                        <span class="help-block" v-if="reasons.last_name">{{ reasons.last_name }}</span>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-9 col-sm-offset-3 checkbox">
                        <label for="public">
                            <input type="checkbox" id="public" v-model="form.email.is_public"> Make Email Public
                        </label>
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
                    middle_name: this.account.middle_name,
                    last_name: this.account.last_name
                },
                reasons: {}
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
                        if (error.hasOwnProperty("reasons")) {
                            this.reasons = error.reasons
                        } else {
                            this.reasons = {}
                        }
                        this.alertError(error)
                    }
                )
            },

            reset() {
                this.form = {
                    title: this.account.title,
                    first_name: this.account.first_name,
                    middle_name: this.account.middle_name,
                    last_name: this.account.last_name
                }
                this.reasons = {}
            }
        },

        watch: {
            "account": function (acc, old) {
                this.reset()
            }
        }
    }
</script>