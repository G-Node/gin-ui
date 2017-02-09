// Copyright (c) 2016, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

import Vue from "vue"

const event = {
    bus: null,

    init() {
        if (!this.bus) {
            this.bus = new Vue()
        }
        return this
    },

    emit(name, ...args) {
        this.bus.$emit(name, ...args)
        return this
    },

    on() {
        if (arguments.length === 2) {
            this.bus.$on(arguments[0], arguments[1])
        } else {
            Object.keys(arguments[0]).forEach(key => {
                this.bus.$on(key, arguments[0][key])
            })
        }
        return this
    }
}

export { event }
