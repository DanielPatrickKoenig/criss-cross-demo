<template>
    <CrissCrosser
        v-slot="{
            game,
            down,
        }"
        ref="cc"
        :use-container="true"
        :config="config"
    >
        <p>Basic game mechanic with no additional functionality</p>
        <div
            ref="gameContainer"
            class="game-container"
        >
            <div class="overlay" />
            <div
                v-for="(piece, i) in game.pieces"
                :key="`piece-${i}`"
                :column="piece.column"
                :row="piece.row"
                class="game-piece"
                :style="{ width: `${piece.width}px`, height: `${piece.height}px`, left: `${piece.x}px`, top: `${piece.y}px` }"
                @mousedown="down"
                @touchstart="down"
            >
                {{ piece.data }}
            </div>
        </div>
    </CrissCrosser>
</template>

<script>
    import CrissCrosser from './CrissCrosser.js';

    import config from './config/pieces.json';
    export default {
        components: {
            CrissCrosser,
        },
        props: {
            configOverride: Object,
        },
        data () {
            return {
                config: this.configOverride ? this.configOverride : config,
            };
        },
    };
</script>

<style scoped>
.game-container{
    position: relative;
}
.game-piece{
    position:absolute;
    box-shadow: 0 0 0 1px #000000 inset;
}
.overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
}
</style>
