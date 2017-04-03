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
 * pagerPrevious returns a number of elements of a given array,
 * starting before a given index.
 *
 * @param arr_in {Array} Array from which to return a subset from.
 * @param idx {number} Starting index within the array.
 * @param n_ret {number} Number of elements to be returned.
 * @returns {*} Returns subset array and the new staring index.
 */
export function pagerPrevious(arr_in, idx, n_ret) {
    if (arr_in === undefined || arr_in.length <= n_ret) {
        return { arr: arr_in, index: idx }
    }

    idx = idx - n_ret < 0 ? 0 : idx - n_ret

    let len = idx + n_ret > arr_in.length ? arr_in.length : idx + n_ret

    return { arr: arr_in.slice(idx, len), index: idx }
}

/**
 * pagerNext returns a number of elements of a given array,
 * starting after a given index.
 *
 * @param arr_in {Array} Array from which to return a subset from.
 * @param idx {number} Starting index within the array.
 * @param n_ret Number of elements to be returned.
 * @returns {*} Returns subset array and the new staring index.
 */
export function pagerNext(arr_in, idx, n_ret) {
    if (arr_in === undefined || arr_in.length <= n_ret) {
        return { arr: arr_in, index: idx }
    }

    if (arr_in.length < idx + n_ret) {
        return { arr: arr_in.slice(idx, arr_in.length), index: idx }
    }

    idx = idx + n_ret

    let len = idx + n_ret > arr_in.length ? arr_in.length : idx + n_ret

    return { arr: arr_in.slice(idx, len), index: idx }
}
