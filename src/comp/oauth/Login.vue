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

            let promise = window.api.login(this.$route.query["access_token"])
            promise.then(
                (account) => {
                    this.account = account
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
            account: { twoWay: true, required: true }
        }
    }
</script>