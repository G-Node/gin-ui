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
                                <li>Upload your data on a repository based structure: you can create
                                    as many repositories as you like.</li>
                                <li>Access your data from anywhere: once the data is at the main repository
                                    service you can securely access your data from anywhere you like.</li>
                                <li>Synchronize your data: you can download complete or partial repositories
                                    on any workplace you like, work on them locally and upload the changes back
                                    to the main repository.</li>
                            </ul>
                        </li>
                        <li><p class="text-primary"><br/><strong>Version your data</strong></p>
                            <ul>
                                <li>When changing your files and uploading them to the server,
                                    the history is automatically kept, you can always go back to a previous version.</li>
                            </ul>
                        </li>
                        <li><p class="text-primary"><br/><strong>Share your data</strong></p>
                            <ul>
                                <li>Make your data public: if you want to make your data accessible to the world,
                                    just make your repository publicly available. The data will be accessible but
                                    only you will be able to change it.</li>
                                <li>Share your data with collaborators: you can also share
                                    repositories with other users of the GIN service
                                    making it easy to jointly work on a project.</li>
                                <li>Make your data citable: through the gin DOI service you can obtain
                                    registered identifiers for your public datasets.
                                </li>
                            </ul>
                        </li>

                        <li><p class="text-primary"><br/><strong>Enhanced search of your repositories
                            <span class="label label-warning">in development</span></strong></p>
                            <ul>
                                <li>By indexing the repository contents it's easy to find the files you are looking for.</li>
                                <li>When using the <a href="https://github.com/G-Node/nix">NIX</a>
                                    data format for scientific data and metadata,
                                    even the contents of these files will be indexed and searchable making
                                    it easy for you to identify even the data you are looking for.</li>
                            </ul>
                        </li>
                        <li><p class="text-primary"><br/><strong>Choose how you want to use our service</strong></p>
                            <ul>
                                <li>Register with the GIN services and use the provided infrastructure.</li>
                                <li>Set up and host your own in-house instance -
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
                        <p>A <a href="https://www.doi.org/">DOI (Digital Object Identifier)</a>
                            <strong>permanently</strong> identifies a digital resource.</p>
                        <p>For your research this means:</p>
                        <ul>
                            <li>You can make any of your public data sets <strong>citable</strong>. You will get a
                                permanent link to the data set you provide, your data will be hosted on the
                                gin infrastructure.</li>
                            <li>You can also make your <strong>scripts, software, laboratory protocols</strong>
                                citable by giving them a DOI and gaining credit for your work.</li>
                        </ul>

                        <hr>
                        <p>gin-doi is the G-Node Infrastructure DOI service. A Service which archives your
                            public repository and stores it in a location and provides you with a DOI such
                            that you can cite this data. gin-doi fulfills the
                            <a href="https://www.datacite.org/">Data Cite</a> standard which tries to:</p>
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
                            Quickstart
                            <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse4" class="panel-collapse collapse">
                    <div class="panel-body">
                    <p><strong>To use infrastructure provided by the G-Node:</strong></p>
                    <ul>
                        <li><span style="cursor: pointer"><a @click="register()">register</a></span> an account.</li>
                        <li>download the command line client
                            <a :href="client_dl">gin-cli</a> for your operating system.</li>
                        <li>create a private or a public repository.</li>
                        <li>upload your data using the client.
                            <!-- deactivated until material can be supplied -->
                            <!-- You can find a tutorial <a href="#">here</a>.
                            <strong><span class="label label-warning">in development</span></strong>
                            -->
                        </li>
                        <li>browse your files via the web services or access your data
                            using the command line client.</li>
                    </ul>

                    <hr>
                    <p><strong>Set up your own in-house GIN service</strong></p>
                        <div class="bs-callout bs-callout-primary">
                            <div class="container"><div class="row">
                                <div class="col-sm-8">All of the GIN services are Open Source software.
                                    If you want to manage your data solely within your lab on your own servers,
                                    this can easily be done! Find instructions <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">below</a>
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
                <div class="panel-heading panel-heading-accordion">
                    <h4 class="panel-title">
                        <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">
                            You(r) own gin
                            <b class="caret"></b>
                        </a>
                    </h4>
                </div>
                <div id="collapse5" class="panel-collapse collapse">
                    <div class="panel-body">
                        <p class="text-primary"> <strong>Setup your own Gin Service using prebuild Docker containers </strong> </p>
                        In order to get you started you need to setup our three main gin microservices:
                        <hr>
                        <ul>
                            <li><a href="https://github.com/G-Node/gin-auth">gin-auth</a>: The authentication server.</li>
                            <li><a href="https://github.com/G-Node/gin-repo">gin-repo</a>: The repository server.</li>
                            <li><a href="https://github.com/G-Node/gin-ui">gin-ui</a>: The web interface for the GIN services.</li>
                        </ul>
                        For all three we provide pre build docker images which you just need to pull and run with
                        appropriate instructions. In case you need it, a docker image with a working postgres installation
                        is also provided. A short run trough follows:                        
                        <hr>
                        <p> <strong>Setup Docker</strong> </p>
                        First you need a working Docker installation. Find instruction <a href="https://www.docker.com/">here</a>
                        <hr>
                        <p> <strong>Setup gin-auth</strong> </p>
                        Second you need a working gin authentication server, to store userdata on. For that to work you need a running database 
                        server with a database setup as gin-auth expects it (see 
                        <a href="https://github.com/G-Node/gin-auth/blob/master/resources/conf/migrations/1_initial-schema.sql">here</a> for details).
                        You can also download and run our prebuild postgres docker image which has everything you need. Download it 
                        to your Server using the following command:
                        <pre><code>docker pull gnode/gin-pgres</code></pre>
                        followed by
                        <pre><code>docker run --name ginpgres -d  gnode/gin-pgres</code></pre>
                        to get up and running <p>
                        you can check whether it worked by issuing:
                        <pre><code>docker ps</code></pre> 
                        which should report smth like:
                        <pre><code>CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES 2bd4e61e37ff        gin-pgres            "/bin/bash."   24 seconds ago      Up 23 seconds       5432   ginpgres
                        </code></pre>
                        indicating that a docker container by the name gingpgres bases on the image gin-pgres is running with a exposed port 5432. You can always issue <code>docker ps</code> to check
                        for running docker container.<p>
                        Now we are ready to get the gin-auth docker for which we issue:
                        <pre><code>docker pull gnode/gin-auth</code></pre>
                        We ncould dtart the start that image with:
                        <pre><code>docker run --name ginauth -d -v &lt;localconf&gt;:/conf --link ginpgres gnode/gin-auth</code></pre>
                        but hang on as this most probably fails. We first need to do some configuration.
                        <code>&lt;localconf&gt;</code> should be replaces with an absolute path to a location on your server where you 
                        can put configuration files for gin-auth. Those files should look like the ones provided <a href="https://github.com/G-Node/gin-auth/tree/master/resources/conf">here</a>
                        which you could simply download to that location. <p>
                        Now its time to modify the file <code>dbconf.yml</code> such that it matches the postgres server.
                        Assuming that you have indeed named your postgres container (--name ginpgres) you can now change 
                        the second line in <code>dbconf.yml</code> such that it reads:
                        <pre><code>open: host= ginpgres dbname=gin_auth user=test password=test sslmode=disable</code></pre>
                        You also need to modify <code>server.yml</code> and remove localhost from the line that starts 
                        with Host (leave it empty for now such that it reads <code>Host: </code>)
                        Now we can start the server with:
                        <pre><code>docker run --name ginauth -v &lt;localconf&gt;:/conf --link ginpgres -p 8081:8081 -d gnode/gin-auth</code></pre>
                        which you can verify again with:
                        <pre><code>docker ps</code></pre>
                        <hr>
                        
                        <p> <strong>Setup gin-repo</strong> </p>
                        Again we start by pulling the docker image with:
                        <pre><code>docker pull gnode/gin-repo</code></pre>
                        Th command to start the repository server is:
                        <pre><code> docker run --name ginrepo -d -v &lt;localdata&gt;:/data --link ginauth -p 8022:22 -p 8082:8082 gnode/gin-repo</code></pre>
                        But agian we need do configure things beforehand.
                        &lt;localdata&gt; should be a location on you local server which has enough space to hold the
                        gin repositories and is writable. Furthermore, in that location, ginrepo expects a file called 
                        <code>user.store</code> which has the follwoing line:
                        <pre><code>ginauth@http://ginauth:8081</code></pre>
                        This instructs ginrepo to look for a authentication server at ginauth (the name of you ginauth
                        server container) at port 8081.
                        <code>docker ps</code> can again be used to check whether everything went fine.


                        <p> <strong>Setup gin-ui</strong> </p>
                        Lets pull the image:
                        <pre><code>docker pull gnode/gin-ui</code></pre>
                        Before starting some configuration is needed. gin-ui is configured with
                        <a href="https://github.com/G-Node/gin-ui/blob/master/src/js/config.json">config file</a>
                        calles <code>config.json</code>
                        the we could place into the same location as the auth configuration. The content of the file
                        should be modifies to look like this:
                        <pre><code>
{
  "auth_url": "http://&lt;authurl&gt;:&lt;authport&gt;",
  "repo_url": "http://&lt;repourl&gt;:&lt;repoport&gt;",
  "doi_example": "/dl/cloudberry.yml",
  "doid_url": "http://doid.gin.g-node.org",
  "client_dl": "https://web.gin.g-node.org/release/",
  "client_id": "gin",
  "client_secret": "secret",
  "contact_email": "dev@example.com"
}                       </code></pre>
                        where authurl, authprt,repourl,repopoport should be replaces by the corresponidng adresses and 
                        portnumbers of the respective services. Eg. for our real server this looks as fellows:
                        <pre><code>
{
"auth_url": "https://auth.gin.g-node.org",
"repo_url": "https://repo.gin.g-node.org",
"doi_example": "/dl/cloudberry.yml",
"doid_url": "http://doid.gin.g-node.org",
"client_dl": "https://web.gin.g-node.org/release/",
"client_id": "gin",
"client_secret": "secret",
"contact_email": "dev@example.com"
}                       </code></pre>
                        for a purely local install, with auth and repo running on ports 8081, 8082 respectively 
                        this could look like this:
                        <pre><code>
{
"auth_url": "http://localhost:8081",
"repo_url": "http://localhost:8082",
"doi_example": "/dl/cloudberry.yml",
"doid_url": "http://doid.gin.g-node.org",
"client_dl": "https://web.gin.g-node.org/release/",
"client_id": "gin",
"client_secret": "secret",
"contact_email": "dev@example.com"
}                       </code></pre>
                        or like this for an install in you local network on a machine called ginny:
                        <pre><code>
{
"auth_url": "http://ginny:8081",
"repo_url": "http://ginny:8082",
"doi_example": "/dl/cloudberry.yml",
"doid_url": "http://doid.gin.g-node.org",
"client_dl": "https://web.gin.g-node.org/release/",
"client_id": "gin",
"client_secret": "secret",
"contact_email": "dev@example.com"
}                       </code></pre>
                        We can start the image with
                        <pre><code>docker run --name ginui -it -p 8080:80 gnode/gin-ui </code></pre>
                        The terminal should be attached to the runing ui session now and you can redirect a browder to:
                        <code>http://localhost:8080</code> and be greated with the gin-ui page.
                        <hr>
                        
                        <p> <strong>Finalizing the configuration</strong> </p>
                        To get login and repo creation working we still need to work on the configuration files for 
                        gin-auth and gin-ui which you already provided locally. We start by shutting down both services:
                        <pre><code>docker stop ginui && docker stop ginauth && docker rm ginui && docker rm ginauth </code></pre>
                        First we  modify <code>clients.yml</code>. such that the entry gin looks somewhat like this:
                        <pre><code>
- UUID: 8b14d6bb-cae7-4163-bbd1-f3be46e43e31
  Name: gin
  Secret: &lt;ginsecret&gt;
  ScopeProvided:
    account-create: Create an account
    account-read: Read access to your account data
    account-write: Write access to your account data
    account-admin: Administrator access to accounts.
    repo-read: Read access to your repositories and repositories shared with you
    repo-write: Write access to your repositories and repositories you have write access to
  ScopeWhitelist:
    - account-create
    - account-read
    - account-write
    - repo-read
    - repo-write
  ScopeBlacklist:
    - account-admin
  RedirectURIs:
    - http://&lt;uiurl&gt;:&lt;uiport&gt;/oauth/login
    - http://&lt;uiurl&gt;:&lt;uiport&gt;/
                          </code></pre>
                        where &lt;ginsecret&gt; is a unique string that we now need to also put into <code>config.json</code>
                        as entry value for clientsecret.
                        
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
            client_dl: function() {
                return window.api.config.client_dl
            }
        },

        methods: {
            register() {
                window.api.register()
            }
        }
    }
</script>
