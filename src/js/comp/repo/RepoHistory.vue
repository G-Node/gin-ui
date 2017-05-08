<!--
    Copyright (c) 2017, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <div class="plainbox bg-info mar-pad-05" v-if="!content">
            <div class="pad-1">There is no available history for this repository</div>
        </div>

        <p v-if="content" class="text-right">File changes Legend:<br>A ... added, M ... modified, D ... deleted</p>

        <table v-if="content" class="table">
            <thead>
                <tr>
                    <th>Committer</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>File changes</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="k in content">
                    <td>{{ k.committer }}</td>
                    <td>{{ k.author }}</td>
                    <td>{{ k.daterel }}</td>
                    <td>{{ k.subject }}</td>
                    <td>
                        <ul v-for="c in k.changes" class="list-unstyled">
                            <li>{{ c }}</li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
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
