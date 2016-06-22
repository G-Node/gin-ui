<template>
    <div>
        <div class="panel panel-default">
            <div class="panel-heading">
                Add SSH Key
            </div>
            <div class="panel-body">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label for="description" class="col-sm-3 control-label">Description</label>
                        <div class="col-sm-9">
                            <input class="form-control" id="description" placeholder="Description" v-model="form.description">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="key" class="col-sm-3 control-label">Public Key</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" id="key" placeholder="Public Key" v-model="form.key" rows="3"></textarea>
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
            let data = {
                keys: [],
                form: {
                    description: null,
                    key: null
                }
            }
            this.update(this.login.username, data)
            return data
        },

        props: {
            login: { required: true }
        },

        mixins: [ Alert ],

        methods: {
            save() {
                let promise = api.keys.create(this.login.username, this.form)
                promise.then(
                        () => {
                            this.update(this.login.username)
                            this.form.description = null
                            this.form.key = null
                        },
                        (error) => {
                            this.alertError(error)
                        }
                )
                console.log(`Add key ${this.form.description}, ${this.form.key}`)
            },

            reset () {
                this.form.description = null
                this.form.key = null
            },

            remove(key) {
                let promise = api.keys.remove(key)
                promise.then(
                    () => {
                        this.update(this.login.username)
                    },
                    (error) => {
                        this.alertError(error)
                    }
                )
                console.log(`Remove key: ${key.fingerprint}`)
            },

            update(username, target=null) {
                target = target || this
                let promise = api.keys.list(username)
                promise.then(
                    (keys) => {
                        target.keys = keys
                    },
                    (error) => {
                        target.keys = []
                        console.log(error)
                    })
            }
        }
    }
</script>