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
                        <input type=password class="form-control" id="old-password" placeholder="Old Password" v-model="oldPassword">
                    </div>
                </div>
                <div class="form-group">
                    <label for="new-password" class="col-sm-3 control-label">New Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="new-password" placeholder="New Password" v-model="newPassword">
                    </div>
                </div>
                <div class="form-group">
                    <label for="repeated-password" class="col-sm-3 control-label">Repeat Password</label>
                    <div class="col-sm-9">
                        <input type="password" class="form-control" id="repeated-password" placeholder="Repeat the new Password" v-model="repeatedPassword">
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-3 col-sm-9">
                        <button type="submit" class="btn btn-default" @click="save">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Alert from "../Alert.js"

    export default {
        data() {
            return {
                username: this.$route.params.username,
                oldPassword: null,
                newPassword: null,
                repeatedPassword: null
            }
        },

        mixins: [ Alert ],

        methods: {
            save() {
                const that = this
                api.accounts.updatePassword(this.username, this.oldPassword, this.newPassword, this.repeatedPassword).then(
                    function (acc) {
                        that.reset()
                        that.alertSuccess("Password successfully changed!")
                    },
                    function (error) {
                        that.reset()
                        that.alertError(error)
                    }
                )
            },

            reset() {
                this.oldPassword = null
                this.newPassword = null
                this.repeatedPassword = null
            }
        }
    }
</script>