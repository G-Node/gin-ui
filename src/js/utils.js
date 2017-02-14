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
