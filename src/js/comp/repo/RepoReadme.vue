<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            README.md
        </div>
        <div class="panel-body">
            <article style="margin-top: 1.5em">
                Show the content of the README.md here.
            </article>
            <br/>
            Current Branch: {{ curr_branch.Name }}<br/>
            Latest Commit: {{ curr_branch.Commit }}
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props:{
            curr_branch: { required: true }
        }
    }
</script>