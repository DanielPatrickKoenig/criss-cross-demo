<template>
    <div id="app">
        <div class="options">
            <button @click="mode = 0">
                Base
            </button>
            <button @click="mode = 1">
                Puzzle
            </button>
            <button @click="mode = 2">
                Crush
            </button>
            <button @click="mode = 3">
                Base PIXI
            </button>
            <button @click="mode = 4">
                Colors
            </button>
            <button @click="mode = 5">
                Word
            </button>
        </div>
        <ExampleGame v-if="mode === 0" />
        <ExampleGamePuzzle v-if="mode === 1" />
        <ExampleGameCrush v-if="mode === 2" />
        <ExampleGamePIXI v-if="mode === 3" />
        <ExampleGameColors v-if="mode === 4" />
        <ExampleGameWordScramble v-if="mode === 5" />
    </div>
</template>

<script>
    // import ExampleComponent from './ExampleComponent.vue';
    import ExampleGame from './ExampleGame.vue';
    import ExampleGamePuzzle from './ExampleGamePuzzle.vue';
    import ExampleGamePIXI from './ExampleGamePIXI.vue';
    import ExampleGameCrush from './ExampleGameCrush.vue';
    import ExampleGameColors from './ExampleGameColors.vue';
    import ExampleGameWordScramble from './ExampleGameWordScramble.vue';
    export default {
        name: 'App',
        components: {
            ExampleGame,
            ExampleGamePuzzle,
            ExampleGamePIXI,
            ExampleGameCrush,
            ExampleGameColors,
            ExampleGameWordScramble,
        },
        data () {
            return {
                mode: 0,
            };
        },
    };
</script>
<style  scoped>
.options{
    display: flex;
    margin: 8px;
    position: relative;
    z-index: 2;
}
</style>
