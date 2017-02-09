// Copyright (c) 2016, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

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
