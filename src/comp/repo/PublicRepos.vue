<template>
    <div>
        <h2>Public Repositories</h2>
        <hr />
        <div class="form-inline row">
            <div class="form-group col-sm-9 col-sm-offset-1">
                <label class="sr-only" for="search">Search</label>
                <input type="email" class="form-control" id="search" placeholder="Search Text" v-model="searchText" style="width: 100%">
            </div>
            <div class="form-group col-sm-1">
                <button type="submit" class="btn btn-default" @click="search">Search</button>
            </div>
        </div>
        <hr />
        <ul>
            <li v-for="repo in repositories"><a v-link="{ name: 'repository', params: { username: repo.owner, repository: repo.name}}">{{ repo.owner }}/{{ repo.name }}</a></li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
            return {
                searchText: "",
                repositories: api.repos.listPublic()
            }
        },

        methods: {
            search() {
                this.repositories = api.repos.listPublic()
            }
        }
    }
</script>