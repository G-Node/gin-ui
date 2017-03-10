<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <h1>Welcome to the G-Node Neuroscience Data Infrastructure services</h1>
        <hr />

        <div class="panel-group" id="accordion">
            <div class="panel panel-default">
                <div class="panel-heading panel-heading-accordion">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">
                            A service for management and sharing of research data in neuroscience
                            <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse1" class="panel-collapse collapse in">
                    <div class="panel-body">
                        <ul>
                            <li>Versioned storage, backup, access and sharing of research data,
                                integrated into your lab data management routines.</li>
                            <li>Access your data from anywhere.</li>
                            <li>Collaborate with colleagues using fine-grained access control.</li>
                            <li>Publish datasets using persistent identifiers (DOI).</li>
                            <li>Use the G-Node servers, or install locally in your lab.</li>
                        </ul>
                    </div>
                </div>
                <div class="panel-heading panel-heading-accordion">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">
                            Features <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse2" class="panel-collapse collapse">
                    <div class="panel-body">
                    <ul class="list-unstyled">
                        <li><p class="text-primary"><br/><strong>Manage your data from anywhere</strong></p>
                            <ul>
                                <li>upload your data on a repository based structure: you can create
                                    as many repositories as you like.</li>
                                <li>access your data from anywhere: once the data is at the main repository
                                    service you can access your data from anywhere you like.</li>
                                <li>synchronize your data: you can download complete or partial repositories
                                    on any workplace you like, work on them locally and upload the changes back
                                    to the main repository.</li>
                            </ul>
                        </li>
                        <li><p class="text-primary"><br/><strong>Share your data</strong></p>
                            <ul>
                                <li>make your data public: if you want to make your data accessible to the world,
                                    just make your repository publicly available. The data will be accessible but
                                    only you will be able to change it.</li>
                                <li>share your data with collaborators: you can also share your public or private
                                    repositories with other users of the GIN service
                                    making it easy to jointly work on a project.</li>
                            </ul>
                        </li>
                        <li><p class="text-primary"><br/><strong>Version your data</strong></p>
                            <ul>
                                <li>when changing your files and uploading them to the server,
                                    the history is automatically kept, you can always go back to a previous version.</li>
                            </ul>
                        </li>

                        <li><p class="text-primary"><br/><strong>Enhanced search of your repositories
                            <span class="label label-warning">in development</span></strong></p>
                            <ul>
                                <li>by indexing the repository contents it's easy to find the files you are looking for.</li>
                                <li>when using the <a href="https://github.com/G-Node/nix">NIX</a>
                                    (Neuroscience Exchange format) for scientific data and metadata,
                                    even the contents of these files will be indexed and searchable making
                                    it easy for you to identify even the data you are looking for.</li>
                            </ul>
                        </li>
                        <li><p class="text-primary"><br/><strong>Choose how you want to use our service</strong></p>
                            <ul>
                                <li>register with the GIN services and use the provided infrastructure.</li>
                                <li>set up and host your own in-house instance -
                                    our software is open source, you can use it for free.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                </div>

                <div class="panel-heading panel-heading-accordion">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">
                            Publish your data (DOI)
                            <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse3" class="panel-collapse collapse">
                    <div class="panel-body">
                        <p>A <a href="https://www.doi.org/">DOI (Digital Object Identifier)</a> <strong>permanently</strong> identifies a resource.</p>
                        <p>For your research this means:</p>
                        <ul>
                            <li>Make any of your data sets <strong>citable</strong>. You will get a permanent link
                                to the data set you provide. If you use the gin-doi service, your data will be hosted for free.</li>
                            <li>You can also make your scripts, software, laboratory protocols citable
                                by giving them a DOI and gaining credit for your work that cannot be normally published.</li>
                        </ul>

                        <hr>
                        <p>gin-doi is the G-Node Infrastructure DOI service. A Service which can copy your
                            public repository, packs everything into an archive file,
                            stores it in a location and provides you with a DOI such that you can
                            cite this data. gin-doi fulfills the <a href="https://www.datacite.org/">Data Cite</a>
                            standard which (according to Wikipedia) tries to:</p>
                        <ul>
                            <li>Establish easier access to research data on the Internet.</li>
                            <li>Increase acceptance of research data as legitimate,
                                citable contributions to the scholarly record.</li>
                            <li>Support data archiving that will permit results to be verified
                                and re-purposed for future study.</li>
                        </ul>
                        <p>You can find datasets already published with the
                            gin-doi service at <a :href="doid">{{ doid }}</a>.</p>
                    </div>
                </div>
                <div class="panel-heading panel-heading-accordion">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">
                            How to use the G-Node GIN services
                            <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse4" class="panel-collapse collapse">
                    <div class="panel-body">
                    <p>If you want to use our services</p>
                    <ul>
                        <li><a @click="register()">register</a> an account with us.</li>
                        <li>download the command line client
                            <a :href="client_dl">gin-cli</a> for your operating system.</li>
                        <li>create a private or a public repository.</li>
                        <li>upload your data using the client.
                            <!-- deactivated until material can be supplied -->
                            <!-- You can find a tutorial <a href="#">here</a>.
                            <strong><span class="label label-warning">in development</span></strong>
                            -->
                        </li>
                        <li>access your data via the web services
                            or download them on another machine using the command line client.</li>
                    </ul>
                    </div>
                </div>
                <div class="panel-heading panel-heading-accordion">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">
                            Set up your own in-house GIN service
                            <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse5" class="panel-collapse collapse">
                    <div class="panel-body">
                        <div class="bs-callout bs-callout-primary">
                            <div class="container"><div class="row">
                                <div class="col-sm-8">All of the GIN services are Open Source software,
                                    if you want to host your data solely in-house on your own servers,
                                    this can easily be done and for free as well!
                                </div>
                                <div class="col-sm-4"></div>
                            </div></div>
                        </div>
                        <p>You can find the complete source code and documentation on github: </p>

                        <ul>
                            <li><a href="https://github.com/G-Node/gin-ui">gin-ui</a>: The web interface for the GIN services.</li>
                            <li><a href="https://github.com/G-Node/gin-cli">gin-cli</a>: The command line client.</li>
                            <li><a href="https://github.com/G-Node/gin-repo">gin-repo</a>: The repository server.</li>
                            <li><a href="https://github.com/G-Node/gin-auth">gin-auth</a>: The authentication server.</li>
                        </ul>

                        <p>If you need any help setting up your own service, you can contact us at
                            <a :href="mailto">{{ contact }}</a>.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    export default {

        computed: {
            mailto: function() {
                return "mailto:"+ window.api.config.contact_email
            },
            contact: function() {
                return window.api.config.contact_email
            },
            doid: function() {
                return window.api.config.doid_url
            },
        },

        methods: {
            register() {
                window.api.register()
            }
        }
    }
</script>
