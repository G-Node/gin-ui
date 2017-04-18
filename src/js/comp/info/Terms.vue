<!--
    Copyright (c) 2017, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div class="container">
        <!-- If a static file has been provided, display content from this file instead of the default gin content -->
        <div v-if="content" v-html="content"></div>

        <!-- default gin content -->
        <div v-if="!content">
            <h2>Terms of Use</h2>
            <hr>

            <p>Usage of G-Node services and infrastructure is permitted solely for the purpose of scientific work.
                In particular, no data other than research data are permitted to be uploaded and stored.
                Using G-Node services and infrastructure for any other purpose than conducting, enabling, supporting,
                training in, or publishing research is not permitted. G-Node attempts to continuously provide secure,
                reliable services for storing, managing and sharing of research data. However,
                all services are provided "as is", and G-Node assumes no liability for any loss, damage,
                or injury related to their use. In particular, G-Node cannot be held liable for any loss of data.
                G-Node does not guarantee the availability of any service at any time.</p>

            <p>A user who uploads or registers data using the G-Node services must be the creator or owner of the data
                or otherwise have sufficient rights to control the data. Using G-Node services to make data available
                to others requires having the rights to make the data available in the way provided by the
                respective service, and in particular must not infringe intellectual property rights
                or confidentiality agreements. A user who makes data available using G-Node services
                is responsible for the content.</p>

            <p>Using, or attempting to use, G-Node services and infrastructure for any purpose
                other than research and education, in any unlawful manner, or in any manner
                that would impair or compromise the security or functionality of the services,
                is prohibited and may result in immediate revocation of user permissions and
                permanent ban from further usage.</p>
            <br/>

            <h2>Privacy Policy</h2>
            <hr>

            <p>User registration and access control requires storing some information about the individual user,
                such as name, affiliation, email address, etc. These data are used exclusively to provide our services
                or to produce aggregate statistics for monitoring purposes. All data are stored exclusively
                on internal servers of the Ludwig-Maximilians-Universität München (lmu.de)
                or the Leibniz-Rechenzentrum (lrz.de).</p>
            <p>The Terms of Use may be changed at any time without specific notification of the users.
                Users should check regularly for updates. The current version of the Terms of Use will
                always be available at <a href="http://www.g-node.org/gin_terms">http://www.g-node.org/gin_terms</a>.
                <br/><br/>
                In case of questions, please contact us at <a href="mailto:info@g-node.org">info@g-node.org</a>.</p>

            <hr/>
            <p><em>Terms of usage have been last updated on February 27<sup>th</sup>, 2017</em></p>
        </div>
    </div>
</template>

<script>
    const ll = "[Info/Terms]"

    export default {
        data() {
            return {
                content: ""
            }
        },

        mounted() {
            console.log(`${ll} mounting...`)

            const stat_cont = window.api.config.static_content
            const cont_url = window.api.config.static_content.terms_use

            if (stat_cont !== undefined && stat_cont !== null && cont_url !== undefined && cont_url !== "") {
                console.log(`${ll} get static file content from ${cont_url}`)
                let f = window.api.getStaticFile(cont_url)
                f.then(
                        (c) => {
                            this.content = c
                        },
                        (error) => {
                            console.log(`${ll} error fetching static content`)
                            console.log(error)
                        }
                )
            }
        }
    }
</script>
