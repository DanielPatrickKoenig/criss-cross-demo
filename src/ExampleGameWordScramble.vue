<template>
    <CrissCrosser
        v-slot="{
            game,
            down,
        }"
        :config="config"
        @user-move="userMove"
    >
        <p>Word scramble game won by sliding blocks to create a the word 'skates'</p>
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
    import { flatten } from 'lodash';
    import CrissCrosser from './CrissCrosser.js';
    import config from './config/word.json';
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
                const targetWord = flatten(this.config.pieces).filter(item => item !== ' ').join('');
                const createdWord = e.game.pieces.map(item => item.data).join('');
                this.solved = createdWord.includes(targetWord);
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
    box-shadow: 0 0 0 1px #000000 inset;
    display:flex;
    justify-content: center;
    align-items: center;
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
