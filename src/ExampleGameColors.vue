<template>
    <CrissCrosser
        v-slot="{
            game,
            down,
        }"
        :config="config"
        @user-move="userMove"
    >
        <p>Rubix cube like game won by arranging rows or columns into colors</p>
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
                :class="`block-${piece.data}`"
                :style="{ width: `${piece.width}px`, height: `${piece.height}px`, left: `${piece.x}px`, top: `${piece.y}px` }"
                @mousedown="down"
                @touchstart="down"
            />
        </div>
    </CrissCrosser>
</template>

<script>
    import CrissCrosser from './CrissCrosser.js';
    import config from './config/colors.json';
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
                this.solved = false;
                const completedRows = e.game.matrix.map(item => item.filter((_item) => _item.data === item[0].data)).filter(item => item.length === e.game.matrix[0].length);
                const rowMatch = completedRows.length === e.game.matrix.length;
                if (rowMatch) {
                    this.solved = true;
                }
                else {
                    const rowStrings = e.game.matrix.map(item => item.map(_item => _item.data).join(','));
                    const columnMatch = rowStrings.filter(item => item === rowStrings[0]).length === e.game.matrix.length;
                    if (columnMatch) {
                        this.solved = true;
                    }
                }
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
}
.overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:rgba(0,0,0,.25);
}
.block-0{
    background-color: #104577;
}
.block-1{
    background-color: #7cb5d2;
}
.block-2{
    background-color: #18a68d;
}
.block-3{
    background-color: #96ceb7;
}
.block-4{
    background-color: #ac2324;
}
</style>
