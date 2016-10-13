<template>
    <div>
        <ul class="list-unstyled">
            <li v-for="repo in public_repo">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        {{ repo.Owner }}/{{ repo.Name }}
                    </div>
                    <div class="panel-body">
                        Head: {{ repo.Head }} <br/>
                        Description: {{ repo.Description }}
                    </div>
                </div>
            </li>
        </ul>

    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            public_repo: { required: true }
        }
    }
</script>
