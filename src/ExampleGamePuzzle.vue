<template>
    <CrissCrosser
        v-slot="{
            game,
            down,
        }"
        ref="cc"
        :config="config"
        @user-move="userMove"
    >
        <p>Puzzle game solvable by arranging blocks into a cohesive image</p>
        <p>Uses the 'swapping' config setting to modify the functionality so that adjacent blocks are swapped instead of sliding block groups</p>
        <div
            v-if="solved"
            class="solved"
        >
            SOLVED!!
        </div>
        <div class="game-container">
            <div
                v-for="(piece, i) in game.pieces"
                :key="`piece-${i}`"
                :column="piece.column"
                :row="piece.row"
                class="game-piece"
                :style="{ width: `${piece.width}px`, height: `${piece.height}px`, left: `${piece.x}px`, top: `${piece.y}px`, 'background-position': `${(Number(piece.data.split('_')[1]) - 1) * piece.width * -1}px ${(Number(piece.data.split('_')[0]) - 1) * piece.height * -1}px` }"
                @mousedown="down"
                @touchstart="down"
            />
        </div>
    </CrissCrosser>
</template>

<script>
    import CrissCrosser from './CrissCrosser.js';
    import config from './config/puzzle.json';
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
                solved: false,
            };
        },
        methods: {
            userMove (e) {
                console.log(e);
                this.solved = JSON.stringify(e.game.pieces.map(item => item.data)) === JSON.stringify(e.game.baseState);
            },
        },
    };
</script>

<style scoped>
.game-container{
    position: relative;
}
.game-piece{
    position:absolute;
    background-image: url('images/bulseye.png')
}
.overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:rgba(0,0,0,.25);
}

</style>
