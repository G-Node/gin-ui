import { event } from "../events.js"

event.init()

function alert(level, content) {
    event.emit("alert-event", {
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
            event.emit("error-event", error)
        },

        /*
         * Sends an alert event with level "danger".
         */
        alertError(content) {
            alert("danger", content)
        },

        /*
         * Sends an alert event with level "warning".
         */
        alertWarning(content) {
            alert("warning", content)
        },

        /*
         * Sends an alert event with level "info".
         */
        alertInfo(content) {
            alert("info", content)
        },

        /*
         * Sends an alert event with level "success".
         */
        alertSuccess(content) {
            alert("success", content)
        }
    }
}
