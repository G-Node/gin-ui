<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Change e-mail address
        </div>
        <div class="panel-body">
            <div class="form-horizontal">
                <div class="form-group" :class="{ 'has-error': reasons.email }">
                    <label for="ce" class="col-sm-3 control-label">E-mail</label>
                    <div class="col-sm-9">
                        <input class="form-control" id="ce" v-model="email" autocomplete="false"
                               placeholder="Enter new e-mail address">
                        <span class="help-block" v-if="reasons.email">{{ reasons.email }}</span>
                    </div>
                </div>
                <div class="form-group" :class="{ 'has-error': reasons.password }">
                    <label for="pw" class="col-sm-3 control-label">Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="pw" v-model="pw" autocomplete="false"
                               placeholder="Password">
                        <span class="help-block" v-if="reasons.password">{{ reasons.password }}</span>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button type="submit" class="btn btn-primary" @click="save">Change e-mail</button>
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
                email: this.account.email.email,
                pw: null,
                reasons: {}
            }
        },

        props: {
            account: { twoWay: true, required: true }
        },

        mixins: [Alert],

        methods: {
            save() {
                const promise = api.accounts.updateEmail(this.account.login, this.email, this.pw)
                promise.then(
                    () => {
                        this.account.email.email = this.email
                        this.reset()
                        this.alertSuccess("E-mail address updated! Please check your inbox for a confirmation e-mail!")
                    },
                    (error) => {
                        this.reasons = {}
                        if (error.hasOwnProperty("reasons")) {
                            this.reasons = error.reasons
                        }
                        this.alertError(error)
                    }
                )
            },
            reset() {
                this.email = this.account.email.email
                this.pw = null
                this.reasons = {}
            }
        }
    }
</script>
