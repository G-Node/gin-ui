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
            Edit Profile
        </div>
        <div class="panel-body">
            <div class="form-horizontal">
                <div class="form-group" :class="{ 'has-error': reasons.password_old }">
                    <label for="old-password" class="col-sm-3 control-label">Old Password</label>
                    <div class="col-sm-9">
                        <input type=password class="form-control" id="old-password" placeholder="Old Password" v-model="password_old">
                        <span class="help-block" v-if="reasons.password_old">{{ reasons.password_old }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.password_new }">
                    <label for="new-password" class="col-sm-3 control-label">New Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="new-password" placeholder="New Password" v-model="password_new">
                        <span class="help-block" v-if="reasons.password_new">{{ reasons.password_new }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.password_new_repeat }">
                    <label for="repeated-password" class="col-sm-3 control-label">Repeat Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="repeated-password" placeholder="Repeat the new Password" v-model="password_new_repeat">
                        <span class="help-block" v-if="reasons.password_new_repeat">{{ reasons.password_new_repeat }}</span>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button type="submit" class="btn btn-primary" @click="save">Change Password</button>
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
                password_old: null,
                password_new: null,
                password_new_repeat: null,
                reasons: {}
            }
        },

        props: {
            account: { required: true }
        },

        mixins: [Alert],

        methods: {
            save() {
                const promise = api.accounts.updatePassword(this.account.login, this.password_old, this.password_new, this.password_new_repeat)
                promise.then(
                    () => {
                        this.reset()
                        this.alertSuccess("Password successfully changed!")
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
                this.password_old = null
                this.password_new = null
                this.password_new_repeat = null
                this.reasons = {}
            }
        }
    }
</script>
