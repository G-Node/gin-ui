// Copyright (c) 2017, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

/**
 * Basic logging class.
 */
export default class Logger {
    /**
     * print switches between different log levels and prints messages accordingly.
     * Log debug only if client secret corresponds to the development system.
     *
     * @param lvl {string}          level at which the message is supposed to be logged.
     * @param message {object}      message to be logged.
     */
    print(lvl, message) {
        switch (lvl) {
        case "Debug":
            if (window.api.config.client_secret === "secret") {
                console.warn(message)
            }
            break
        case "Err":
            console.error(message)
            break
        default:
            if (window.api.config.client_secret === "secret") {
                console.warn(message)
            }
        }
    }
}
