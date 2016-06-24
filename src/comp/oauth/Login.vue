<template>
    <div>
        <div v-if="error">
            <header>
                <h2>{{ error.error }}</h2>
                <h3>{{ error.message }}</h3>
            </header>

            <ul v-if="error.reasons">
                <li v-for="(k, v) in error.reasons"><strong>{{ k }}:</strong> {{ v }}</li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            let data = {
                error: null
            }

            let promise = window.api.accounts.validate(this.$route.query["access_token"])
            promise.then(
                (token) => {
                    this.token = token
                    return window.api.accounts.get(token.login)
                }
            ).then(
                (account) => {
                    this.login = account
                    this.$router.go({path: "/"})
                },
                (error) => {
                    data.error = error
                    console.log(error)
                }
            )

            return data
        },

        props: {
            login: { twoWay: true, required: true },
            token: { twoWay: true, required: true }
        }
    }
</script>