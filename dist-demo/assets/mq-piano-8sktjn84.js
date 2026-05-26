import{i as at,b as m,a as ot,t as it,n as S}from"./property-BiLpLSdF.js";var st=Object.create,x=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,H=(r,t)=>(t=Symbol[r])?t:Symbol.for("Symbol."+r),f=r=>{throw TypeError(r)},J=(r,t,e)=>t in r?x(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,U=(r,t)=>x(r,"name",{value:t,configurable:!0}),dt=r=>[,,,st(r?.[H("metadata")]??null)],Q=["class","method","getter","setter","accessor","field","value","get","set"],w=r=>r!==void 0&&typeof r!="function"?f("Function expected"):r,lt=(r,t,e,i,a)=>({kind:Q[r],name:t,metadata:i,addInitializer:s=>e._?f("Already initialized"):a.push(w(s||null))}),ct=(r,t)=>J(t,H("metadata"),r[3]),_=(r,t,e,i)=>{for(var a=0,s=r[t>>1],d=s&&s.length;a<d;a++)t&1?s[a].call(e):i=s[a].call(e,i);return i},P=(r,t,e,i,a,s)=>{var d,n,y,u,M,o=t&7,O=!!(t&8),h=!!(t&16),A=o>3?r.length+1:o?O?1:2:0,B=Q[o+5],G=o>3&&(r[A-1]=[]),rt=r[A]||(r[A]=[]),p=o&&(!h&&!O&&(a=a.prototype),o<5&&(o>3||!h)&&nt(o<4?a:{get[e](){return z(this,s)},set[e](c){return K(this,s,c)}},e));o?h&&o<4&&U(s,(o>2?"set ":o>1?"get ":"")+e):U(a,e);for(var q=i.length-1;q>=0;q--)u=lt(o,e,y={},r[3],rt),o&&(u.static=O,u.private=h,M=u.access={has:h?c=>pt(a,c):c=>e in c},o^3&&(M.get=h?c=>(o^1?z:ht)(c,a,o^4?s:p.get):c=>c[e]),o>2&&(M.set=h?(c,D)=>K(c,a,D,o^4?s:p.set):(c,D)=>c[e]=D)),n=(0,i[q])(o?o<4?h?s:p[B]:o>4?void 0:{get:p.get,set:p.set}:a,u),y._=1,o^4||n===void 0?w(n)&&(o>4?G.unshift(n):o?h?s=n:p[B]=n:a=n):typeof n!="object"||n===null?f("Object expected"):(w(d=n.get)&&(p.get=d),w(d=n.set)&&(p.set=d),w(d=n.init)&&G.unshift(d));return o||ct(r,a),p&&x(a,e,p),h?o^4?s:p:a},N=(r,t,e)=>J(r,typeof t!="symbol"?t+"":t,e),C=(r,t,e)=>t.has(r)||f("Cannot "+e),pt=(r,t)=>Object(t)!==t?f('Cannot use the "in" operator on this value'):r.has(t),z=(r,t,e)=>(C(r,t,"read from private field"),e?e.call(r):t.get(r)),E=(r,t,e)=>t.has(r)?f("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),K=(r,t,e,i)=>(C(r,t,"write to private field"),i?i.call(r,e):t.set(r,e),e),ht=(r,t,e)=>(C(r,t,"access private method"),e),V,X,Z,j,F,tt,l,I,R,L,W;const b=[{type:"white",names:["C"],accurate:{top:14,bottom:23,startPad:0,endPad:9},centered:{top:17,bottom:24,startPad:0,endPad:7}},{type:"black",names:["Cs","Db"]},{type:"white",names:["D"],accurate:{top:14,bottom:24,startPad:5,endPad:5},centered:{top:10,bottom:24,startPad:7,endPad:7}},{type:"black",names:["Ds","Eb"]},{type:"white",names:["E"],accurate:{top:14,bottom:23,startPad:9,endPad:0},centered:{top:17,bottom:24,startPad:7,endPad:0}},{type:"white",names:["F"],accurate:{top:13,bottom:24,startPad:0,endPad:11},centered:{top:17,bottom:24,startPad:0,endPad:7}},{type:"black",names:["Fs","Gb"]},{type:"white",names:["G"],accurate:{top:13,bottom:23,startPad:3,endPad:7},centered:{top:10,bottom:24,startPad:7,endPad:7}},{type:"black",names:["Gs","Ab"]},{type:"white",names:["A"],accurate:{top:13,bottom:23,startPad:7,endPad:3},centered:{top:10,bottom:24,startPad:7,endPad:7}},{type:"black",names:["As","Bb"]},{type:"white",names:["B"],accurate:{top:13,bottom:24,startPad:11,endPad:0},centered:{top:17,bottom:24,startPad:7,endPad:0}}],et={};b.forEach((r,t)=>{for(const e of r.names)et[e]=t});function g(r){if(r==null)return null;const t=r.match(/^(?<note>[A-G][sb]?)(?<octave>\d+)$/)?.groups;if(t==null)return null;const e=et[t.note];return e==null?null:parseInt(t.octave)*12+e}function k(r){return b[r%12].type==="black"}const _t="C3",ut="E4",T=g(_t),$=g(ut),Y=$-T;tt=[it("mq-piano")];class v extends(F=ot,j=[S({attribute:"start-note"})],Z=[S({attribute:"end-note"})],X=[S()],V=[S({type:Boolean,attribute:"preserve-ratio"})],F){constructor(){super(...arguments),E(this,I,_(l,8,this)),_(l,11,this),E(this,R,_(l,12,this)),_(l,15,this),E(this,L,_(l,16,this,"accurate")),_(l,19,this),E(this,W,_(l,20,this,!1)),_(l,23,this),N(this,"_startSemitone",T),N(this,"_endSemitone",$),N(this,"_borderTpl",m`<div class="border"></div>`)}willUpdate(){let t=g(this.startNote),e=g(this.endNote);this.startNote!=null&&t==null&&console.warn(`mq-piano: invalid start-note "${this.startNote}", ignored`),this.endNote!=null&&e==null&&console.warn(`mq-piano: invalid end-note "${this.endNote}", ignored`),t==null&&e==null?(t=T,e=$):t==null?t=e-Y:e==null&&(e=t+Y),e<t&&(console.warn("mq-piano: end-note before start-note, falling back to defaults"),t=T,e=$),t=Math.max(0,t),k(t)&&t--,k(e)&&(e=e+1),this._startSemitone=t,this._endSemitone=e;let i=0;for(let a=t;a<=e;a++)b[a%12].type==="white"&&i++;this.style.aspectRatio=this.preserveRatio?`${i*23.5} / 150`:""}render(){const t=[],e=[];let i=!1;const a=b[this._startSemitone%12];if(a.type==="white"&&this._startSemitone>0&&k(this._startSemitone-1)){const d=this.mode==="centered"?a.centered:a.accurate;e.push(m`<div style="flex:${d.startPad}"></div>`)}for(let d=this._startSemitone;d<=this._endSemitone;d++){const n=b[d%12],y=Math.floor(d/12);if(n.type==="white"){i&&(t.push(this._borderTpl),e.push(this._borderTpl));const u=this.mode==="centered"?n.centered:n.accurate;t.push(this._renderKey(n,y,u)),e.push(m` <div
          class="white-spacer"
          data-key="${n.names.join("-")}"
          style="--top-width:${u.top}"
        ></div>`),i=!0}else t.push(this._borderTpl),e.push(this._renderKey(n,y)),i=!1}const s=b[this._endSemitone%12];if(s.type==="white"&&k(this._endSemitone+1)){const d=this.mode==="centered"?s.centered:s.accurate;e.push(m`<div style="flex:${d.endPad}"></div>`)}return m`
      <div class="layer layer-white">${t}</div>
      <div class="layer layer-black">${e}</div>
    `}_renderKey(t,e,i){const a=i==null?"":`--top-width:${i.top};--bottom-width:${i.bottom}`;return m`
      <div
        part="key key-${t.type}"
        data-type="${t.type}"
        data-key="${t.names.join("-")}"
        style="${a}"
      >
        ${t.names.map(s=>m` <slot name="note-${s}${e}"></slot>`)}
      </div>
    `}}l=dt(F);I=new WeakMap;R=new WeakMap;L=new WeakMap;W=new WeakMap;P(l,4,"startNote",j,v,I);P(l,4,"endNote",Z,v,R);P(l,4,"mode",X,v,L);P(l,4,"preserveRatio",V,v,W);v=P(l,0,"MqPiano",tt,v);N(v,"styles",at`
    :host {
      --border-color: var(--mq-piano-border-color, #000);
      --border-width: var(--mq-piano-border-width, 1px);
      border-color: var(--mq-piano-border-color-outer, var(--border-color));
      border-style: solid;
      border-width: var(--mq-piano-border-width-outer, var(--border-width));
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 2fr 1fr;
    }

    .layer {
      display: flex;
      grid-column: 1 / 2;
    }

    .layer-white {
      grid-row: 1 / 3;
    }

    .layer-black {
      grid-row: 1 / 2;
    }

    [data-type="white"] {
      background-color: #fff;
      flex: var(--bottom-width);
    }

    .white-spacer {
      flex: var(--top-width);
    }

    [data-type="black"] {
      background-color: #000;
      flex: 14;
    }

    .border {
      flex: 0 0 var(--mq-piano-border-width-inner, var(--border-width));
      background-color: var(--mq-piano-border-color-inner, var(--border-color));
    }

    .layer-black .border {
      visibility: hidden;
    }
  `);_(l,1,v);
