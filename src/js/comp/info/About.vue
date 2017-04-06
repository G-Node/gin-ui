<!--
    Copyright (c) 2017, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div class="container">
        <div class="container">
            <!-- If a static file has been provided, display content from this file instead of the default gin content -->
            <div v-if="content" v-html="content"></div>

            <!-- default gin content -->
            <div v-if="!content">
                <h2>About GIN</h2>
                <p>Management of scientific data, including consistent organization, annotation and storage of data,
                    is a challenging task. Accessing and managing data from multiple workplaces while keeping it in
                    sync, backed up, and easily accessible from within or outside the lab is even more demanding.<br/><br/>
                    To minimize the time and effort scientists have to spend on these tasks,
                    we here present the GIN (G-Node Infrastructure) services <a href="#ref">[1]</a>,
                    a free data management system designed for comprehensive and reproducible management of scientific data.
                    <br/><br/>
                    It keeps track of changes to the contents and organization of the files and provides secure remote access
                    to the data. More specifically, once a directory has been put under GIN control, the contents will be synced
                    to a dedicated GIN server. With proper authorization, data can be accessed and changed from remote clients,
                    making it easy to work from multiple workplaces while keeping all data at hand and in sync.<br/><br/>
                    Data can be managed from web and file browsers as well as through a command line interface,
                    which enables integrating data management and access into the data acquisition and analysis procedures.
                    <br/><br/>
                    The system handles any kinds of directory structures and file types, and tracks all changes, using Git
                    <a href="#ref">[2]</a> tracking mechanisms. This supports reproducible data workflows and in particular
                    keeps previous versions accessible when datasets are updated. The service furthermore makes it straightforward
                    to share any data within a lab or with off-site collaborators and to work on it in parallel.
                </p>
                <br />
                <h3>Support</h3>
                Supported by BMBF (Grant 01GQ1302)
                <hr/>
                <p>
                <h3 id="ref">References</h3>
                [1] <a href="https://gin.g-node.org/">https://gin.g-node.org/</a><br />
                [2] <a href="https://git-scm.com/">https://git-scm.com/</a><br />
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    const ll = "[Info/About]"

    export default {
        data() {
            return {
                content: ""
            }
        },

        mounted() {
            console.log(ll + " mounting...")

            const stat_cont = window.api.config.static_content
            const cont_url = window.api.config.static_content.about

            if (stat_cont !== undefined && stat_cont !== null && cont_url !== undefined && cont_url !== "") {
                console.log(ll + " get static file content from "+ cont_url)
                let f = window.api.getStaticFile(cont_url)
                f.then(
                        (c) => {
                            this.content = c
                        },
                        (error) => {
                            console.log(ll + " error fetching static content")
                            console.log(error)
                        }
                )
            }
        }
    }
</script>
