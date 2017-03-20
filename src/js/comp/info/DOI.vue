<!--
    Copyright (c) 2017, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div class="container main-container">
        <h2>The DOI request file</h2>
        <hr/>

        <p>To request a DOI for a repository, you need to provide a file in the machine readable
            <a href="https://en.wikipedia.org/wiki/YAML">YAML</a> format in the root of the repository.</p>
        <p>This file has to be named <code>{{ doi_file }}</code> and has to contain the following entries:</p>

        <ul>
            <li>authors</li>
            <li>title</li>
            <li>description</li>
            <li>keywords</li>
            <li>license</li>
            <li>references</li>
        </ul>
        <p>You can find an example file <a :href="doi_example">here</a>.</p>
        <p>
            You can check on <a href="http://www.yamllint.com">yamllint.com</a> if your file
            is a formally correct YAML file before you upload it to a repository.
        </p>

        <h2>Keyword description</h2>
        <hr/>
        <p>Note that the keys (authors, title, description, etc.) need to be lower case, followed by a colon
            and the corresponding content.<br/></p>

        <h3>authors</h3>
        <hr/>
        <p>
            <code>authors</code> are the main researchers involved working on the data,
            or the authors of the publication in priority order. It may be a corporate/institutional
            or personal name. <code>affiliation</code> and <code>id</code> are optional fields.<br/>
            Please provide the authors as list items, each item indented and prefixed with <code>-</code>,
            each of the author keywords indented as described below.
            <br/><br/>
            <pre>
                authors:
                  -
                    firstname: "GivenName1"
                    lastname: "FamilyName1"
                    affiliation: "Affiliation1"
                    id: "AuthorID1 (e.g. ORCID)"
                  -
                    firstname: "GivenName2"
                    lastname: "FamilyName2"
                    affiliation: "Affiliation2"
                  -
                    firstname: "GivenName3"
                    lastname: "FamilyName3"
            </pre>
        </p>

        <h3>title</h3>
        <hr/>
        <p>
            <code>title</code> is a descriptive name of the data set to be published.
            Do not use linebreaks in the title.
            <br/><br/>
            <pre>
                title: "Example Title"
            </pre>
        </p>

        <h3>description</h3>
        <hr/>
        <p>
            <code>description</code> contains extended information about your dataset.
            <br/><br/>
            <pre>
                description: |
                  Example description
                  that can contain linebreaks
                  but has to maintain indentation.
            </pre>
        </p>

        <h3>keywords</h3>
        <hr/>
        <p>
            <code>keywords</code> is a list of terms the dataset is associated with.
            Use as many as appropriate to characterize the dataset
            <br/><br/>
            <pre>
                keywords:
                  - Neuroscience
                  - Electrophysiology
            </pre>
        </p>

        <h3>license</h3>
        <hr/>
        <p>
            <code>license</code> is the license under which the dataset will be published.
            Examples of open licenses are
            <ul>
                <li>CC0 (<a href="http://creativecommons.org/publicdomain/zero/1.0/">
                    http://creativecommons.org/publicdomain/zero/1.0/</a>)</li>
                <li>CC-BY (<a href="http://creativecommons.org/licenses/by/4.0/">
                    http://creativecommons.org/licenses/by/4.0/</a>)</li>
            </ul>
            <p>Please provide both a license <code>name</code> and a <code>url</code> to the license,
                both indented as shown in the example below.</p>

            <pre>
                license:
                  name: "CC0"
                  url: "http://creativecommons.org/publicdomain/zero/1.0"
            </pre>
        </p>

        <h3>references</h3>
        <hr/>
        <p>
            <code>references</code> are additional references associated with the data set,
            such as a research article that is based on the data. Please provide also the kind of
            relation to the dataset and, if possible, a digital identifier.
            <br/><br/>
        <pre>
                references:
                  -
                    doi: "10.xxx/yyyy"
                    reftype: "IsPartOf"
                    name: "PublicationName"
                  -
                    doi: "10.xxx/zzzz"
                    reftype: "IsSupplementTo"
                    name: "PublicationName"
            </pre>
        </p>

        <h3>funding</h3>
        <hr/>
        <p>
            <code>funding</code> is a list of items to indicate
            any funding received to produce the referenced dataset.
            <br/><br/>
            <pre>
                funding:
                  - "DFG, DFG.12345"
                  - "EU, EU.12345"
            </pre>
        </p>
    </div>
</template>

<script>
    export default {
        computed: {
            doi_file: function () {
                return window.api.config.doi_file
            },
            doi_example: function() {
                return window.api.config.doi_example
            }
        },
    }
</script>
