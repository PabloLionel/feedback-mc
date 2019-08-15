<template>
    <div class="">
        <h2>{{title}}</h2>
        <v-text-field
            autocomplete="none"
            spellcheck="false"
            v-model="scoresConf.fun"
            label="Función"
            @keypress.enter="$refs.cotaInferior.focus()"
        ></v-text-field>
        <v-text-field
            autocomplete="none"
            spellcheck="false"
            v-model="scoresConf.inf"
            label="Cota inferior (A)"
            ref="cotaInferior"
            @keypress.enter="$refs.cotaSuperior.focus()"
        ></v-text-field>
        <v-text-field
            autocomplete="none"
            spellcheck="false"
            v-model="scoresConf.sup"
            label="Cota superior (B)"
            ref="cotaSuperior"
            @keypress.enter="$refs.incremento.focus()"
        ></v-text-field>
        <v-text-field
            autocomplete="none"
            spellcheck="false"
            v-model="scoresConf.inc"
            label="Incremento"
            ref="incremento"
            @keypress="evalFn"
        ></v-text-field>
        <v-list>
            <v-list-tile-title v-if="scoresConf.res.length">Separaciones halladas:</v-list-tile-title>
            <ol class="font-weight-bold">
                <li v-for="(item, index) in scoresConf.res"
                    :key="index">
                    <v-list-tile-title>
                        {{item.separation}}
                    </v-list-tile-title>
                </li>
            </ol>
        </v-list>
        <figure id="chartScores"></figure>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'; // @ is an alias to /src
import { scores } from './../../core/raices.de.ecuaciones';
import { parser, Parser } from 'mathjs';

interface ISeparation {
    separation: string;
}
interface IScores {
    fun: string;
    inf: string;
    sup: string;
    inc: string;
    res: ISeparation[];
}

@Component({})
export default class RaicesDeEcuaciones extends Vue {
    @Prop({
        type: Boolean,
        default: false,
    })
    public graph: boolean = false;
    private name: string = 'scores';
    private title: string = 'Metodo de tanteos';
    // .
    private scoresConf: IScores = {
        fun: 'f(x) = -x^2+3x+10',
        inf: '-3',
        sup: '6',
        inc: '.1',
        res: [],
    };
    private pars: Parser = parser();

    // public mounted() { }
        // this.pars.eval(this.scoresConf.fun);
        // const inf = parseFloat(this.scoresConf.inf);
        // const sup = parseFloat(this.scoresConf.sup);
        // const inc = parseFloat(this.scoresConf.inc);
        // const fun = (x: number) => this.pars.eval('f(' + x + ')');

        // const it = scores(fun)(inf)(sup)(inc);
        // const separations: T[] = [];

        // while (1) {
        //     const r = it.next();
        //     if (r.done) {
        //         separations.push(r.value);
        //     } else { break; }
        // }

        // const PS: T[] = [];
        // for (let x = inf; x < sup; x += inc) {
        //     PS.push([x, fun(x)]);
        // }

        // this.chartScore({
        //     dimensions: separations,
        //     PS,
        // });
    // }

    public evalFn() {
        try {
            this.pars.eval(this.scoresConf.fun);
            const inf = parseFloat(this.scoresConf.inf);
            const sup = parseFloat(this.scoresConf.sup);
            const inc = parseFloat(this.scoresConf.inc);
            const getFn = (x: number) => this.pars.eval('f(' + x + ')');

            const it = scores(getFn)(inf)(sup)(inc);
            this.scoresConf.res = [];
            while (1) {
                const r = it.next();
                if (!r.done) {
                    this.scoresConf.res.push({
                        separation: '(' + r.value[0] + ', ' + r.value[1] + ')',
                    });
                } else { break; }
            }
        } catch { return; }
    }
}
</script>
