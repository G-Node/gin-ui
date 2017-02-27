<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Edit Affiliation
        </div>
        <div class="panel-body">
            <div class="form-horizontal">
                <div class="form-group" :class="{ 'has-error': reasons.institute }">
                    <label for="institute" class="col-sm-3 control-label">Institution</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="institute" placeholder="Institution" v-model="form.institute">
                        <span class="help-block" v-if="reasons.institute">{{ reasons.institute }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.department }">
                    <label for="first-name" class="col-sm-3 control-label">Department</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="first-name" placeholder="Department" v-model="form.department">
                        <span class="help-block" v-if="reasons.department">{{ reasons.department }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.city }">
                    <label for="first-name" class="col-sm-3 control-label">City</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="middle-name" placeholder="City" v-model="form.city">
                        <span class="help-block" v-if="reasons.city">{{ reasons.city }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.country }">
                    <label for="last-name" class="col-sm-3 control-label">Country</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="last-name" placeholder="Country" v-model="form.country">
                        <span class="help-block" v-if="reasons.country">{{ reasons.country }}</span>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-9 col-sm-offset-3 checkbox">
                        <label for="public">
                            <input type="checkbox" id="public" v-model="form.is_public"> Make Affiliation Public
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
    import { event } from "../../events.js"
    import Alert from "../Alert.js"

    event.init()

    export default {
        data() {
            return {
                form: {
                    institute: this.account.affiliation.institute,
                    department: this.account.affiliation.department,
                    city: this.account.affiliation.city,
                    country: this.account.affiliation.country,
                    is_public: this.account.affiliation.is_public
                },
                reasons: {}
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            save() {
                const account_copy = Object.assign({}, this.account)
                account_copy.affiliation = Object.assign({}, this.form)
                api.accounts.update(account_copy).then(
                    () => {
                        event.emit("account-update")
                        this.alertSuccess("Affiliation successfully updated!")
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
                    institute: this.account.affiliation.institute,
                    department: this.account.affiliation.department,
                    city: this.account.affiliation.city,
                    country: this.account.affiliation.country,
                    is_public: this.account.affiliation.is_public
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
