// Copyright (c) 2017, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

import md5 from "md5"

export function stateHash(client_id, user_agent) {
    var d = new Date()
    return md5(
        d.getMonth().toString().concat(
            d.getDate().toString(),
            client_id,
            user_agent
        )
    )
}

/**
 * paginationPrevious returns a number of elements of a given array,
 * starting before a given index.
 *
 * @param main_array {Array} complete array from which to return a subset from.
 * @param idx {number} starting index from last displayed array subset.
 * @param n_displayed {number} number of elements to be displayed.
 * @returns { Array, number}
 */
export function paginationPrevious(main_array, idx, n_displayed) {
    if (main_array === undefined || main_array.length <= n_displayed) {
        return { arr: main_array, index: idx}
    }

    idx = idx - n_displayed < 0 ? 0 : idx - n_displayed

    let len = idx + n_displayed > main_array.length ? main_array.length : idx + n_displayed

    return { arr: main_array.slice(idx, len), index: idx}
}
