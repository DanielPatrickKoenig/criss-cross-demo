<template>
    <div id="app">
        <h1>Criss Cross Crush</h1>
        <p>Block removal game played by sliding blocks into the following patterns to destroy blocks</p>
        <ExampleGameCrush />
    </div>
</template>

<script>
    import ExampleGameCrush from './ExampleGameCrush.vue';
    export default {
        name: 'App',
        components: {
            ExampleGameCrush,
        },
        data () {
            return {
                mode: 0,
            };
        },
    };
</script>
<style>
.options{
    display: flex;
    margin: 8px;
    position: relative;
    z-index: 2;
}
body{
    background-color: #ccddee;
    background-image: linear-gradient(90deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0) 38.21428571428571%,rgba(0,0,0,0) 63.92857142857142%,rgba(0,0,0,0.05) 100%)
}
h1,p{
    max-width: 80%;
    margin: 0 auto;
}
</style>
