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
