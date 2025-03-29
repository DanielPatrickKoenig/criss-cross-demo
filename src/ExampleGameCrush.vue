<template>
    <CrissCrosser
        v-slot="{
            game,
        }"
        ref="cc"
        :config="config"
        @user-move="userMove"
        class="criss-cosser"
    >
        <div class="pattern-container">
            <table
                v-for="(pattern, i) in config.patterns.primary"
                :key="`pattern-${i}`"
                class="pattern"
            >
                <tr
                    v-for="(row, j) in pattern"
                    :key="`row-${i}-${j}`"
                >
                    <td
                        v-for="(block, k) in row"
                        :key="`block-${i}-${j}-${k}`"
                        class="e-block"
                        :class="block ? 'full' : 'empty'"
                    />
                </tr>
            </table>
        </div>
        <hr />
        <div class="game-container">
            <div
                v-for="(removal, i) in currentRemovals" 
                :key="i"
                class="removal-graphic"
                :style="{
                    left: `${removal.x}px`,
                    top: `${removal.y}px`,
                    width: `${game.pieces[0].width}px`,
                    height: `${game.pieces[0].height}px`
                }"
            >
            </div>
            <div
                v-for="(piece, i) in game.pieces"
                :key="`piece-${i}`"
                :column="piece.column"
                :row="piece.row"
                class="game-piece"
                :class="`block-${piece.data}`"
                :style="{ width: `${piece.width}px`, height: `${piece.height}px`, left: `${piece.x}px`, top: `${piece.y}px` }"
                @mousedown="onDown"
                @touchstart="onDown"
            />
        </div>
    </CrissCrosser>
</template>

<script>
    import { uniq, flatten } from 'lodash';
    import { transpose } from 'lodash-transpose';
    import { TweenLite, Sine } from 'gsap';
    import CrissCrosser from './CrissCrosser.js';
    import config from './config/crushLevels.json';
    export default {
        components: {
            CrissCrosser,
        },
        props: {
            configOverride: Object,
            level: {
                Number,
                default: 0
            }
        },
        data () {
            return {
                processingMove: false,
                animated: true,
                movesRemaining: 20,
                dropDuration: .5,
                pointsPerBlock: 10,
                points: 0,
                boardState: [],
                patterns: [],
                basePatterns: [],
                bonusPattern: [],
                validValues: [],
                currentRemovals: [],
            };
        },
        computed: {
            game () {
                return this.$refs.cc.game;
            },
            config () {
                return config[this.level];
            },
        },
        mounted () {
            console.log(this.game);
            this.validValues = uniq(this.game.pieces.map(item => item.data));
            this.setPatterns(this.config.patterns.primary);
            console.log(config);
        },
        methods: {
            onDown (e) {
                console.log('before down');
                this.boardState = this.game.pieces.map(item => item.data);
                this.$refs.cc.down(e);
            },
            userMove (e) {
                console.log('after up');
                this.evaluate(this.game.matrix);
                if (this.isValidMove() && this.movesRemaining > 0) {
                    this.movesRemaining--;
                }
                if (this.movesRemaining === 0) {
                    console.log('you lose');
                }
            },
            evaluate (matrix) {
                this.processingMove = true;
                const { results, foundPatterns } = this.scanBoard(matrix.map(item => item.map(_item => _item.data)));
                console.log(foundPatterns);
                this.resetValues();
                // console.log(transpose(matrix));
                const removals = this.updateBlocks(results);
                this.currentRemovals = removals;
                console.log('removals', removals);
                this.points += flatten(results).length * this.pointsPerBlock;
                const bonuses = this.getBonuses(foundPatterns);
                if (bonuses) {
                    this.awardBonus();
                }
                return { foundPatterns, results, removals, bonuses };
            },
            awardBonus () {
                console.log('AWARD BONUSES');
                this.movesRemaining += 2;
            },
            getBonuses (foundPatterns) {
                const bonusPatternString = this.bonusPattern.join('-');
                return foundPatterns.filter(item => item.join('-') === bonusPatternString).length;
            },
            isValidMove () {
                const currentState = this.game.pieces.map(item => item.data);
                return JSON.stringify(currentState) !== JSON.stringify(this.boardState);
            },
            resetValues () {
                this.game.matrix.map((item, index) => item.forEach(_item => {
                    _item.y = (this.game.height / this.game.matrix.length) * index;
                    console.log(_item.y);
                }));
            },
            findPattern (pattern, structure, value) {
                const remappedStructure = structure.map(row => row.map(item => item === value));
                const flattedStructure = flatten(remappedStructure.map((item, i) => item.map((value, j) => ({ value, i, j }))));
                return flattedStructure
                    .filter(item => this.patternMatch(remappedStructure, pattern, item.i, item.j))
                    .map(item => this.cellsToRemove(item.i, item.j, pattern));
            },
            patternMatch (structure, patternRows, row, column) {
                // let checks = []
                if (patternRows.length + row > structure.length) {
                    return false;
                }
                if (patternRows.filter((item, i) => !this.rowCheck(structure, row + i, item, column)).length > 0) {
                    return false;
                }
                return true;
            },
            rowCheck (structure, row, slots, offset) {
                const maxFill = offset + slots.length;
                if (maxFill > structure.length) {
                    return false;
                }
                const newRow = structure[row];
                for (let i = offset; i < slots.length + offset; i++) {
                    if (!newRow[i] && slots[i - offset]) {
                        return false;
                    }
                }
                return newRow;
            },
            cellsToRemove (row, column, pattern) {
                return flatten(pattern.map((item, i) => item.map((_item, j) => ({ row: i + row, column: j + column, valid: _item }))))
                    .filter(item => item.valid)
                    .map(item => ({ row: item.row, column: item.column }));
            },
            scanBoard (structure) {
                const patternsWithMatches = this.patterns.map(pattern => (
                    {
                        match: flatten([...Array(structure.length).keys()].map(item => this.findPattern(pattern, structure, item.toString()))),
                        pattern,
                    }
                ));
                const matches = patternsWithMatches.map(item => item.match);
                const foundPatterns = patternsWithMatches
                    .filter(item => item.match.length > 0)
                    .map(item => item.pattern);
                const results = uniq(flatten(matches).map(item => JSON.stringify(item))).map(item => JSON.parse(item));
                return { results, foundPatterns };
            },
            setPatterns (patterns) {
                this.basePatterns = patterns;
                this.patterns = this.bonusPattern.length ? [...this.basePatterns, ...[this.bonusPattern]] : this.basePatterns;
            },
            setBonusPattern (pattern) {
                this.bonusPattern = pattern;
                this.patterns = this.bonusPattern.length ? [...this.basePatterns, ...[this.bonusPattern]] : this.basePatterns;
            },
            updateBlocks (results) {
                const shouldAnimate = results.length;
                console.log(shouldAnimate);
                const transposedMatrix = transpose(this.game.matrix);
                const flattenedResults = flatten(results);
                const removalPositions = flattenedResults.map(item => ({
                    x: item.column * (this.game.width / this.game.matrix[0].length),
                    y: item.row * (this.game.height / this.game.matrix[0].length),
                    data: this.game.pieces.find(_item => _item.column === item.column && _item.row === item.row).data,
                }));
                const mappedResults = new Set(flattenedResults.map(item => `${item.column}_${item.row}`));
                const removeMarked = transposedMatrix.map(item => item.map((_item, index) => {
                    const shouldRemove = mappedResults.has(`${_item.column}_${_item.row}`);
                    _item.order = shouldRemove ? 0 : index + 1;
                    if (shouldRemove) {
                        _item.y = -1000;
                    }
                    return _item;
                })).map(item => {
                    const remove = item.filter(_item => _item.order === 0);
                    const keep = item.filter(_item => _item.order !== 0);
                    return [...remove, ...keep];
                });
                const reordered = removeMarked.map(item => {
                    item.reverse();
                    item.map((_item, index) => {
                        if (_item.order === 0) {
                            if (index === 0) {
                                _item.order = -1;
                            }
                            else if (item[index - 1].order <= 0) {
                                _item.order = item[index - 1].order - 1;
                            }
                            else {
                                _item.order = -1;
                            }
                        }
                        return _item;
                    });
                    item.reverse();
                    return item;
                })
                    .map(item => item.map((_item, index) => {
                        _item.row = index;
                        if (shouldAnimate) {
                            _item.drop = (this.game.height / this.game.matrix.length) * index;
                        }
                        else {
                            _item.y = (this.game.height / this.game.matrix.length) * index;
                        }
                        if (_item.order && _item.order <= 0) {
                            if (shouldAnimate) {
                                _item.y = _item.order * (this.game.height / this.game.matrix.length);
                            }
                            _item.data = this.validValues[Math.floor(Math.random() * this.validValues.length)];
                        }
                        console.log(_item.y);
                        return _item;
                    }));
                this.game.matrix = transpose(reordered);
                this.game.pieces = flatten(this.game.matrix);
                this.$forceUpdate();
                console.log(JSON.parse(JSON.stringify(this.game.matrix)));
                console.log(JSON.parse(JSON.stringify(this.game.pieces)));
                if (shouldAnimate) {
                    for (let i = 0; i < this.game.pieces.length; i++) {
                        const targetY = this.game.pieces[i].drop;
                        TweenLite.to(this.game.pieces[i], this.dropDuration, {
                            y: targetY,
                            ease: Sine.easeIn,
                            onUpdate: () => {
                                this.$forceUpdate();
                            },
                            onComplete: () => {
                                if (i === this.game.pieces.length - 1) {
                                    if (this.completeHandler) {
                                        this.completeHandler();
                                    }
                                    const evaluation = this.evaluate(this.game.matrix);
                                    if (this.completeHandler) {
                                        this.completeHandler(evaluation);
                                    }
                                }
                            },
                        });
                        this.game.pieces[i].drop = null;
                        this.game.pieces[i].order = null;
                    }
                }
                else {
                    this.processingMove = false;
                }
                return removalPositions;
            },
        },
    };
</script>

<style scoped>
.criss-cosser{
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
}
.game-container{
    position: relative;
}
.game-piece{
    position:absolute;
}
.game-piece::after{
    content: '';
    display: block;
    position: absolute;
    width: 90%;
    height: 90%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background-color: #000000;
    border-radius: 5px;
    box-shadow: 0 -3px 5px 3px rgba(0, 0, 0, .2) inset, 0 0 0 1px rgba(0, 0, 0, .6) inset;
}
.overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:rgba(0,0,0,.25);
}
hr{
    margin-bottom: 10px;
}
.block-0::after{
    background-color: #104577;
}
.block-1::after{
    background-color: #7cb5d2;
}
.block-2::after{
    background-color: #18a68d;
}
.block-3::after{
    background-color: #96ceb7;
}
.block-4::after{
    background-color: #ac2324;
}
.block-5::after{
    background-color: #bb94b7;
}
.block-6::after{
    background-color: #bdd74b;
}
.block-7::after{
    background-color: #fce05e;
}
.block-8::after{
    background-color: #9966ff;
}
.pattern-container{
    display:flex;
    justify-content: center;
    align-items:center;
    margin: 0 auto;
    padding: 8px 0;
}
.pattern {
    padding: 0 6px;
}
.pattern .e-block {
    width: 10px;
    height: 10px;
}
.pattern .e-block.full{
    background-color: #000000;
}
.game-container{
  width: 320px;
}
.removal-graphic{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;

}

.removal-graphic img{
    width: 100%;
    height: 100%;
}

@keyframes removal {
    0%{
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
    }
    15%{
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
    }
    35%{
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100%{
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}

.removal-graphic::after{
    content: '';
    display: block;
    position: absolute;
    width: 50%;
    height: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background-color: transparent;
    border-radius: 5px;
    box-shadow: 0 0 5px 3px #ff3300, 0 0 10px 6px #ffcc00;
    animation: removal;
    animation-iteration-count: infinite;
    animation-duration: .5s;
}
</style>
