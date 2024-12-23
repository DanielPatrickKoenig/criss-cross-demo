import { initGame } from './engine/index.js';
import { h } from "vue";
export default {
    props: {
        config: {
            type: Object,
            required: true,
        },
        useContainer: Boolean,
    },
    data () {
        return {
            game: {},
            gameState: null,
        };
    },
    created () {
        this.game = initGame(this.config);
        this.game.minMovement = 5;
    },
    methods: {
        getOverlayElement (el) {
            return this.useContainer ? el.parentNode : window;
        },
        processEvent (e) {
            if (e.touches) {
                e.preventDefault();
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        },
        down (e) {
            this.game.down(Number(e.currentTarget.getAttribute('column')), Number(e.currentTarget.getAttribute('row')), this.processEvent(e));
            if (e.type === 'touchstart') {
                this.getOverlayElement(e.currentTarget).addEventListener('touchmove', this.move);
                this.getOverlayElement(e.currentTarget).addEventListener('touchend', this.up);
            }
            else if (e.type === 'mousedown') {
                this.getOverlayElement(e.currentTarget).addEventListener('mousemove', this.move);
                this.getOverlayElement(e.currentTarget).addEventListener('mouseup', this.up);
            }
        },
        move (e) {
            if (this.game.dragging) {
                this.game.move(this.processEvent(e));
            }
        },
        up (e) {
            this.gameState = this.game.up();
            this.$emit('user-move', { state: this.gameState, game: this.game });
            if (e.type === 'touchend') {
                this.getOverlayElement(e.currentTarget).removeEventListener('touchmove', this.move);
                this.getOverlayElement(e.currentTarget).removeEventListener('touchend', this.up);
            }
            else if (e.type === 'mouseup') {
                this.getOverlayElement(e.currentTarget).removeEventListener('mousemove', this.move);
                this.getOverlayElement(e.currentTarget).removeEventListener('mouseup', this.up);
            }
        },
    },
    render () {
        return h("div", this.$slots.default(this));
    },
};
