<template>
    <div id="app">
        <h1><span class="grid-text-3">&nbsp;</span><span class="grid-text-2">&nbsp;</span><span class="grid-text-1">&nbsp;</span>Criss Cross Crush<span class="grid-text-1">&nbsp;</span><span class="grid-text-2">&nbsp;</span><span class="grid-text-3">&nbsp;</span></h1>
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
@import url('https://fonts.googleapis.com/css2?family=Micro+5+Charted&family=Patua+One&display=swap');
#app{
    padding-top: 40px;
}
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
h1{
    font-family: "Micro 5 Charted", serif;
    font-size: 46px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0;
    text-align: center;
    color: #ffffff;
    background-color: #333333;
}
h1 .grid-text-1{
    opacity: .75;
}
h1 .grid-text-2{
    opacity: .5;
}
h1 .grid-text-3{
    opacity: .25;
}
p{
    max-width: 80%;
    margin: 0 auto;
    text-align:  center;
    font-family: "Patua One", serif;
}
</style>
