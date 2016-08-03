<template>
    <div>
        <h2>Public Repositories</h2>
        <hr />
        <repo-search v-bind:repositories.sync="repositories" v-bind:accounts.sync="accounts"></repo-search>
        <hr />
        <ul class="list-unstyled">
            <li v-for="repo in repositories">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a v-link="{ name: 'repository', params: { username: repo.owner, repository: repo.name}}">{{ repo.owner }}/{{ repo.name }}</a>
                    </div>
                    <div class="panel-body">
                        {{ repo.description }}
                    </div>
                </div>
            </li>
            <li v-for="acc in accounts">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        {{ acc.first_name }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from "vue"

    import RepoSearch from "../repo/RepoSearch.vue"

    Vue.component("repo-search", RepoSearch)

    export default {
        data() {
            return {
                repositories: null,
                accounts: null
            }
        }
    }
</script>
