<template>
    <div id="app">
        <h1><span class="grid-text-3">&nbsp;</span><span class="grid-text-2">&nbsp;</span><span class="grid-text-1">&nbsp;</span>Criss Cross Crush<span class="grid-text-1">&nbsp;</span><span class="grid-text-2">&nbsp;</span><span class="grid-text-3">&nbsp;</span></h1>
        <p>Block removal game played by sliding blocks into the following patterns to destroy blocks</p>
        <ExampleGameCrush
            v-if="active"
            :level="mode"
        />
        <div class="level-selector">
            <p>Current Level: {{ mode }}</p>
            <ul>
                <li v-for="level in [0, 1, 2]" :key="level">
                    <button @click="updateLevel(level)">level {{ level + 1 }}</button>
                </li>
            </ul>
        </div>
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
                active: true,
            };
        },
        methods: {
            async updateLevel (lvl) {
                this.active = false;
                this.mode = lvl;
                await new Promise(resolve => setTimeout(resolve, 100));
                this.active = true;
            } 
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
.level-selector{
    left: 0;
    right: 0;
    top: 550px;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.level-selector p{
    text-align: center;
}
.level-selector ul{
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 4px auto 0;

}
.level-selector ul li{
    display: block;
    margin: 0;
    padding: 4px;
}
</style>
