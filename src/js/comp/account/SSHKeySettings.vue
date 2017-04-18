<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                Add SSH Key
            </div>
            <div class="panel-body">
                <div class="form-horizontal">
                    <div class="form-group" :class="{ 'has-error': reasons.description }">
                        <label for="description" class="col-sm-3 control-label">Description</label>
                        <div class="col-sm-9">
                            <input class="form-control" id="description" placeholder="Description" v-model="form.description">
                            <span class="help-block" v-if="reasons.description">{{ reasons.description }}</span>
                        </div>
                    </div>
                    <div class="form-group" :class="{ 'has-error': reasons.key }">
                        <label for="key" class="col-sm-3 control-label">Public Key</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" id="key" placeholder="Public Key" v-model="form.key" rows="3"></textarea>
                            <span class="help-block" v-if="reasons.key">{{ reasons.key }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-3 col-sm-9">
                            <button type="submit" class="btn btn-default" @click="reset">Reset</button>
                            <button type="submit" class="btn btn-primary" @click="save">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default">
            <div class="panel-heading">
                Available keys
            </div>
            <ul class="list-group">
                <li v-for="k in keys" class="list-group-item">
                    <button class="btn btn-default pull-right" @click="remove(k)">Remove</button>
                    <h4 class="list-group-item-heading">{{k.description}}</h4>
                    <p class="list-group-item-text">{{k.fingerprint}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                keys: [],
                form: {
                    description: null,
                    key: null
                },
                reasons: {}
            }
        },

        mounted() {
            this.update(this.account.login)
        },

        props: {
            account: { required: true }
        },

        mixins: [Alert],

        methods: {
            save() {
                let promise = api.keys.create(this.account.login, this.form)
                promise.then(
                    () => {
                        this.update(this.account.login)
                        this.reset()
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

            reset () {
                this.form.description = null
                this.form.key = null
                this.reasons = {}
            },

            remove(key) {
                let promise = api.keys.remove(key)
                promise.then(
                    () => {
                        this.update(this.account.login)
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
            },

            update(username) {
                let promise = api.keys.list(username)
                promise.then(
                    (keys) => {
                        this.keys = keys
                    },
                    (error) => {
                        this.keys = []
                        this.alertError(error)
                    }
                )
            }
        }
    }
</script>
