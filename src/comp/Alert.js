function alert(comp, level, content) {
    comp.$dispatch("alert-event", {
        level: level,
        content: content
    })
}

export default {
    methods: {
        alertError(content) {
            alert(this, "danger", content)
        },

        alertWarning(content) {
            alert(this, "warning", content)
        },

        alertInfo(content) {
            alert(this, "info", content)
        },

        alertSuccess(content) {
            alert(this, "success", content)
        }
    }
}
