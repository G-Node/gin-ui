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
                <span v-if="owner_name">
                    Owner {{ owner_name }}<br/><br/>
                </span>
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
            return {
                description: no_description,
                owner_name: null
            }
        },

        mounted() {
            this.update()
        },

        props: {
            repository: {required: true}
        },

        mixins: [ Alert ],

        methods: {
            update(){
                if (this.repository.Description !== undefined && this.repository.Description !== "") {
                    this.description = this.repository.Description
                }

                var t = JSON.parse(localStorage.getItem("token"))
                this.owner_name = null
                if (t === undefined || t === null || t.login !== this.$route.params.username) {
                    const s = api.accounts.get(this.$route.params.username)
                    s.then(
                        (u) => {
                            this.owner_name = u.first_name+" "+u.last_name
                        },
                        (error) => {
                            console.log("[RepoInfo]"+ error)
                        }
                    )
                }
            }
        }
    }
</script>
