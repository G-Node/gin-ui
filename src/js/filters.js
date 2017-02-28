// Copyright (c) 2016, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

const prefixes = ["", "k", "M", "G", "T"]

export function filesize(input) {
    let num = parseInt(input)

    if (!num) {
        return input
    }
    
    for (var i = 0; i < prefixes.length && num > 1024; i++) {
        num = num / 1024
    }
    
    return num.toFixed(1) + " " + prefixes[i] + "B"
}


/**
 * reLabelCollaborator is a custom filter to map different labels
 * to the collaborator access levels from gin-repo.
 *
 * The value of a gin-repo access level should never change
 * if it is supposed to be written back to gin-repo. Therefore
 * different labels are mapped to an access level when displaying to a user.
 *
 * @param {string} lvl gin-repo access level.
 * @return {string} Label mapped to the gin-repo access level.
 */
export function reLabelCollaborator(lvl) {
    var out
    switch(lvl) {
        case "is-admin":
            out = "is-admin"
            break
        case "can-push":
            out = "can-write"
            break
        default:
            out = "can-read"

    }
    return out
}
