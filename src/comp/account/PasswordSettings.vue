<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Edit Profile
        </div>
        <div class="panel-body">
            <div class="form-horizontal">
                <div class="form-group">
                    <label for="old-password" class="col-sm-3 control-label">Old Password</label>
                    <div class="col-sm-9">
                        <input type=password class="form-control" id="old-password" placeholder="Old Password" v-model="old_password">
                    </div>
                </div>
                <div class="form-group">
                    <label for="new-password" class="col-sm-3 control-label">New Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="new-password" placeholder="New Password" v-model="new_password">
                    </div>
                </div>
                <div class="form-group">
                    <label for="repeated-password" class="col-sm-3 control-label">Repeat Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="repeated-password" placeholder="Repeat the new Password" v-model="repeated_password">
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
                username: this.$route.params.login,
                old_password: null,
                new_password: null,
                repeated_password: null
            }
        },

        mixins: [ Alert ],

        methods: {
            save() {
                const promise = api.accounts.updatePassword(this.login, this.old_password, this.new_password, this.repeated_password)
                promise.then(
                    () => {
                        this.reset()
                        this.alertSuccess("Password successfully changed!")
                    },
                    (error) => {
                        this.reset()
                        this.alertError(error)
                    }
                )
            },

            reset() {
                this.old_password = null
                this.new_password = null
                this.repeated_password = null
            }
        }
    }
</script>