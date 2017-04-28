<!--
    Copyright (c) 2017, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <h3>Commit history</h3>
        <hr>
        {{ content }}
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            content: null
        }
    },

    mounted() {
        this.update(this.$route.params)
    },

    props: {
        account: {
            required: true
        }
    },

    methods: {
        update(params) {
            this.content = null
            // we only support branch "master for now"
            const promise = window.api.repos.listCommits(params.username, params.repository, "master")
            promise.then(
                    (c) => {
                        this.content = c
                    },
                    (err) => {
                        // need to deal with errors properly ... reformat them
                        // in the data methods.
                        window.log.print("Err", `[RepoHistory]${err}`)
                    }
            )
        }
    }
}

</script>
