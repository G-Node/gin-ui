<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div>
        <h1>Welcome to the <strong>GIN</strong> (<strong>G</strong>-Node <strong>IN</strong>frastructure)
            web services!</h1>
        <hr />
        <p>This service aims to provide a free, secure and community driven alternative to other
            proprietary cloud services.</p>

        <p>We therefore provide free data synchronisation, hosting, publishing and sharing for
            scientists to promote data sharing and collaboration within the scientific community!</p>

        <p>Therefore this service will always be free and Open Source - you can even setup your
            own in-house instance of this service.</p>

        <p>We also provide a free publishing service for data by issuing DOIs to public repositories.</p>



        <h2>Features:</h2><hr />

        <ul class="list-unstyled">
            <li><p class="text-primary"><strong>Choose how you want to use our service</strong></p>
                <ul>
                    <li>register with the GIN services and use the provided infrastructure</li>
                    <li>set up and host your own in-house instance -
                        our software is open source, you can use it for free</li>
                </ul>
            </li>
            <li></li>
            <li><p class="text-primary"><br/><strong>Manage your data from anywhere</strong></p>
                <ul>
                    <li>upload your data on a repository based structure: you can create
                        as many repositories as you like.</li>
                    <li>access your data from anywhere: once the data is at the main repository
                        service you can access your data from anywhere you like.</li>
                    <li>synchronize your data: you can download complete or partial repositories
                        on any workplace you like, work on them locally and upload the changes back
                        to the main repository.</li>
                    <li>version your data: when changing your files and uploading them to the server,
                        the history is automatically kept, you can always go back to a previous version.</li>
                </ul>
            </li>
            <li><p class="text-primary"><br/><strong>Share your data</strong></p>
                <ul>
                    <li>make your data public: if you want to make your data accessible to the world,
                        just make your repository publicly available. The data will be accessible but
                        only you will be able to change it.</li>
                    <li>share your data with collaborators: you can also share your public or private
                        repositories with other users of the GIN service making it easy to jointly work on a project.</li>
                </ul>
            </li>
            <li><p class="text-primary"><br/><strong>Publish your data (DOI)
                [in development]</strong></p>
                <ul>
                    <li>when you are hosting your data on the GIN server, we give you the option
                        to publish any of your public repositories. We will issue a DOI reliably hosting
                        your data for your publications. </li>
                </ul>
            </li>
            <li><p class="text-primary"><br/><strong>Enhanced search of your repositories
                [in development]</strong></p>
                <ul>
                    <li>By indexing the repository contents it's easy to find the files you are looking for</li>
                    <li>When using the <a href="https://github.com/G-Node/nix">NIX</a> (Neuroscience Exchange format)
                        for scientific data and metadata, even the contents of these files will
                        be indexed and searchable making it easy for you to identify even the data
                        you are looking for.</li>
                </ul>
            </li>
        </ul>


        <h2>How to use the GIN services</h2><hr/>

        <p>If you want to use our services</p>
        <ul>
            <li><a @click="register()">register</a> an account with us.</li>
            <li>download the command line client <a href="https://github.com/G-Node/gin-cli">gin-cli</a>.</li>
            <li>upload your data using gin-cli.</li>
            <li>access your data via the web services or download them on another machine using gin-cli.</li>
        </ul>


        <h2>Set up your own in-house GIN service</h2><hr/>

        <p>All of the GIN services are Open Source software, if you want to host your data solely
            in-house on your own servers, this can easily be done and for free as well!</p>
        <p>You can find the complete source code and documentation on github: </p>

        <ul>
            <li><a href="https://github.com/G-Node/gin-ui">gin-ui</a>: The web interface for the GIN services.</li>
            <li><a href="https://github.com/G-Node/gin-cli">gin-cli</a>: The command line client.</li>
            <li><a href="https://github.com/G-Node/gin-repo">gin-repo</a>: The repository server.</li>
            <li><a href="https://github.com/G-Node/gin-auth">gin-auth</a>: The authentication server.</li>
        </ul>

        <p>If you need any help setting up your own service, you can <a href="#">contact us</a>. [TBD]</p>

    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        methods: {
            register() {
                window.api.register()
            }
        }
    }
</script>
