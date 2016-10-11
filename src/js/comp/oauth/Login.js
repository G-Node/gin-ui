import Alert from "../Alert.js"

export default {
    mounted() {
        let promise = window.api.login(this.$route.query["access_token"])
        promise.then(
            (account) => {
                this.account = account
                this.$router.go({path: "/"})
            },
            (error) => {
                this.reportError(error)
                console.log(error)
            }
        )
    },

    mixins: [ Alert ],

    props: {
        account: { twoWay: true, required: true }
    }
}