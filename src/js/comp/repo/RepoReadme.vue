<!--
    Copyright (c) 2016, German Neuroinformatics Node (G-Node)

    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted under the terms of the BSD License. See
    LICENSE file in the root of the Project.
-->

<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            Repository information
        </div>
        <div class="panel-body">
            <article style="margin-top: 1.5em">
                {{ description }}
            </article>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Alert from "../Alert.js"

    const no_description = "No description for this repository"

    export default {

        data() {
            return { description: no_description }
        },

        mounted() {
            this.update()
        },

        props: {
            repository: {required: true},
        },

        mixins: [ Alert ],

        methods: {
            update(){
                if (this.repository.Description !== undefined && this.repository.Description !== "") {
                    this.description = this.repository.Description
                }
            }
        }
    }
</script>
