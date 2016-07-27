function alert(comp, level, content) {
    comp.$dispatch("alert-event", {
        level: level,
        content: content
    })
}

export default {
    methods: {
        /*
         * Sends an error event.
         */
        reportError(error) {
            this.$dispatch("error-event", error)
        },

        /*
         * Sends an alert event with level "danger".
         */
        alertError(content) {
            alert(this, "danger", content)
        },

        /*
         * Sends an alert event with level "warning".
         */
        alertWarning(content) {
            alert(this, "warning", content)
        },

        /*
         * Sends an alert event with level "info".
         */
        alertInfo(content) {
            alert(this, "info", content)
        },

        /*
         * Sends an alert event with level "success".
         */
        alertSuccess(content) {
            alert(this, "success", content)
        }
    }
}
