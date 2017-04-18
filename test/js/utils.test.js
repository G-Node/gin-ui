// Copyright (c) 2017, German Neuroinformatics Node (G-Node)
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted under the terms of the BSD License. See
// LICENSE file in the root of the Project.

import { describe, it }     from "mocha"
import { assert }           from "chai"

import { pagerPrevious }    from "../../src/js/utils.js"

describe("Testing pagerPrevious", () => {
    const num_return_elem = 5
    const arr_in = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const idx = 0
    it("test previous with starting index 0", () => {
        const check = pagerPrevious(arr_in, idx, num_return_elem)
        // return index should be zero
        assert.equal(check.index, 0)
        // return array should be of length number return elements
        assert.lengthOf(check.arr, num_return_elem)
        // return array should have first value one and last value 5
        assert.equal(check.arr[0], 1)
        assert.equal(check.arr[4], 5)
    })
})
