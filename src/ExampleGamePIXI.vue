<template>
    <CrissCrosser
        ref="cc"
        :config="config"
    >
        <p>Basic game mechanic with no additional functionality</p>
        <p>Rendering and interactivity facilitated with pixi.js</p>
        <canvas ref="gameStage" />
    </CrissCrosser>
</template>

<script>
    import * as PIXI from 'pixi.js';
    import CrissCrosser from './CrissCrosser.js';
    import config from './config/pieces.json';
    export default {
        components: {
            CrissCrosser,
        },
        data () {
            return {
                config,
                app: null,
                blocks: [],
            };
        },
        mounted () {
            this.app = new PIXI.Application({
                view: this.$refs.gameStage,
                width: this.$refs.cc.game.width,
                height: this.$refs.cc.game.height,
                transparent: true,
            });
            this.blocks = this.$refs.cc.game.pieces.map(item => {
                const sprite = new PIXI.Sprite();
                sprite.x = item.x;
                sprite.y = item.y;
                const g = this.createBlockGraphic(item);
                sprite.addChild(g);
                this.app.stage.addChild(sprite);
                sprite.interactive = true;
                sprite.on('mousedown', (e) => {
                    console.log(e);
                    this.$refs.cc.game.down(item.column, item.row, this.processEvent(e));
                });
                sprite.on('touchstart', (e) => {
                    this.$refs.cc.game.down(item.column, item.row, this.processEvent(e));
                });
                sprite.on('mousemove', (e) => {
                    if (this.$refs.cc.game.dragging) {
                        console.log(e.data.global.x);
                        this.$refs.cc.game.move(this.processEvent(e));
                        this.redraw();
                    }
                });
                sprite.on('touchmove', (e) => {
                    if (this.$refs.cc.game.dragging) {
                        this.$refs.cc.game.move(this.processEvent(e));
                        this.redraw();
                    }
                });
                sprite.on('mouseup', (e) => {
                    this.$refs.cc.game.up();
                    this.redraw(true);
                });
                sprite.on('touchend', (e) => {
                    this.$refs.cc.game.up();
                    this.redraw(true);
                });
                sprite.on('mouseupoutside', (e) => {
                    this.$refs.cc.game.up();
                    this.redraw(true);
                });
                sprite.on('touchendoutside', (e) => {
                    this.$refs.cc.game.up();
                    this.redraw(true);
                });
                return sprite;
            });
        },
        beforeDestroy () {
            this.app.destroy(true);
            this.app = null;
        },
        methods: {
            redraw (updateBlock) {
                for (let i = 0; i < this.$refs.cc.game.pieces.length; i++) {
                    this.blocks[i].x = this.$refs.cc.game.pieces[i].x;
                    this.blocks[i].y = this.$refs.cc.game.pieces[i].y;
                    if (updateBlock) {
                        this.blocks[i].removeChild(this.blocks[i].children[0]);
                        this.blocks[i].addChild(this.createBlockGraphic(this.$refs.cc.game.pieces[i]));
                    }
                }
            },
            processEvent (e) {
                return { x: e.data.global.x, y: e.data.global.y };
            },
            createBlockGraphic (peice) {
                let fill = 0x000000;
                switch (peice.data) {
                    case 'one': {
                        fill = 0xcc0000;
                        break;
                    }
                    case 'two': {
                        fill = 0x00cc00;
                        break;
                    }
                    case 'three': {
                        fill = 0x0000cc;
                        break;
                    }
                    case 'four': {
                        fill = 0xcc00cc;
                        break;
                    }
                    case 'five': {
                        fill = 0xcccc00;
                        break;
                    }
                }
                const g = new PIXI.Graphics();
                g.beginFill(fill, 1);
                g.lineStyle(0, 0, 0);
                g.drawCircle(peice.width / 2, peice.height / 2, peice.width / 2.5);
                g.endFill();
                return g;
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
canvas{
    margin: 0 auto;
    display: block;
}
</style>
