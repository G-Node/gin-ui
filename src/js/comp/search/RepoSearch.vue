<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in repositories">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a v-link="{ name: 'repository', params: { username: repo.owner, repository: repo.name } }">{{ repo.owner }}/{{ repo.name }}</a>
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
    export default {
        props: {
            repositories: {required: true}
        }
    }
</script>
