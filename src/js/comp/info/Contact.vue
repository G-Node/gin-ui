<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div class="container">
        <p>
            G-Node (German Neuroinformatics Node)
            <br />
            Biozentrum
            Ludwig-Maximilians-Universität München
            Großhaderner Straße 2
            82152 Martinsried-Planegg
            Germany
            <br />
            Phone: +49 (0)89 2180 74810
            Fax: +49 89 2180 74803
            eMail: <a :href="mailto">{{ contact }}</a>
            <br />
            <a href="https://www.google.de/maps/place/G-Node/@48.109108,11.459057,15z/data=!4m5!3m4!1s0x0:0x1d6841c041030d33!8m2!3d48.109108!4d11.459057">
                G-Node location
            </a>
            <br />
        </p>
    </div>
</template>

<script>
    export default {
        computed: {
            mailto: function() {
                return "mailto:"+ window.api.config.contact_email
            },
            contact: function() {
                return window.api.config.contact_email
            },
        },
    }
</script>
