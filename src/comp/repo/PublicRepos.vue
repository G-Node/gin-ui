<template>
    <div>
        <h2>Public Repositories</h2>
        <hr />
        <div class="form-inline row">
            <div class="form-group col-sm-9 col-sm-offset-1">
                <label class="sr-only" for="search">Search</label>
                <input type="text" class="form-control" id="search" placeholder="Search Text" v-model="searchText" style="width: 100%">
            </div>
            <div class="form-group col-sm-1">
                <button type="submit" class="btn btn-default" @click="search">Search</button>
            </div>
        </div>
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
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
            const d =  {
                searchText: "",
                repositories: null
            }

            api.repos.listPublic().then((repos) => { d.repositories = repos})

            return d
        },

        methods: {
            search() {
                api.repos.listPublic(this.searchText).then((repos) => { this.repositories = repos})
            }
        }
    }
</script>