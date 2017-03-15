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
            or personal name.<br/>
            Please provide the authors as list items, each item indented and prefixed with <code>-</code>.
            <br/><br/>
            <pre>
                authors:
                  - FamilyName1, GivenName1, Affiliation1, AuthorID1 (e.g. ORCID)
                  - FamilyName2, GivenName2, Affiliation2
                  - FamilyName3, GivenName3
            </pre>
        </p>

        <h3>title</h3>
        <hr/>
        <p>
            <code>title</code> is a descriptive name of the data set to be published.
            Do not use linebreaks in the title.
            <br/><br/>
            <pre>
                title: Example Title
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
            <p>If you use a different license, please provide a url to the license specification.</p>

            <pre>
                license: CC0
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
                references: OriginalPublication, Author et al (2017) Title. Journal, DOI 10.xxx/yyyy; Relation2, Citation2, Identifier2
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
