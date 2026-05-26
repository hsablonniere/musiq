import{i as ht,A as I,b as _,a as ft,t as pt,n as g}from"./property-BiLpLSdF.js";var ut=Object.create,C=Object.defineProperty,mt=Object.getOwnPropertyDescriptor,J=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),x=e=>{throw TypeError(e)},Q=(e,t,s)=>t in e?C(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,L=(e,t)=>C(e,"name",{value:t,configurable:!0}),vt=e=>[,,,ut(e?.[J("metadata")]??null)],Y=["class","method","getter","setter","accessor","field","value","get","set"],M=e=>e!==void 0&&typeof e!="function"?x("Function expected"):e,_t=(e,t,s,f,l)=>({kind:Y[e],name:t,metadata:f,addInitializer:o=>s._?x("Already initialized"):l.push(M(o||null))}),$t=(e,t)=>Q(t,J("metadata"),e[3]),p=(e,t,s,f)=>{for(var l=0,o=e[t>>1],u=o&&o.length;l<u;l++)t&1?o[l].call(s):f=o[l].call(s,f);return f},$=(e,t,s,f,l,o)=>{var u,c,A,w,y,i=t&7,k=!!(t&8),v=!!(t&16),F=i>3?e.length+1:i?k?1:2:0,W=Y[i+5],z=i>3&&(e[F-1]=[]),r=e[F]||(e[F]=[]),n=i&&(!v&&!k&&(l=l.prototype),i<5&&(i>3||!v)&&mt(i<4?l:{get[s](){return U(this,o)},set[s](h){return V(this,o,h)}},s));i?v&&i<4&&L(o,(i>2?"set ":i>1?"get ":"")+s):L(l,s);for(var d=f.length-1;d>=0;d--)w=_t(i,s,A={},e[3],r),i&&(w.static=k,w.private=v,y=w.access={has:v?h=>bt(l,h):h=>s in h},i^3&&(y.get=v?h=>(i^1?U:yt)(h,l,i^4?o:n.get):h=>h[s]),i>2&&(y.set=v?(h,q)=>V(h,l,q,i^4?o:n.set):(h,q)=>h[s]=q)),c=(0,f[d])(i?i<4?v?o:n[W]:i>4?void 0:{get:n.get,set:n.set}:l,w),A._=1,i^4||c===void 0?M(c)&&(i>4?z.unshift(c):i?v?o=c:n[W]=c:l=c):typeof c!="object"||c===null?x("Object expected"):(M(u=c.get)&&(n.get=u),M(u=c.set)&&(n.set=u),M(u=c.init)&&z.unshift(u));return i||$t(e,l),n&&C(l,s,n),v?i^4?o:n:l},gt=(e,t,s)=>Q(e,t+"",s),D=(e,t,s)=>t.has(e)||x("Cannot "+s),bt=(e,t)=>Object(t)!==t?x('Cannot use the "in" operator on this value'):e.has(t),U=(e,t,s)=>(D(e,t,"read from private field"),s?s.call(e):t.get(e)),b=(e,t,s)=>t.has(e)?x("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),V=(e,t,s,f)=>(D(e,t,"write to private field"),f?f.call(e,s):t.set(e,s),s),yt=(e,t,s)=>(D(e,t,"access private method"),s),Z,tt,et,rt,st,it,at,nt,ot,O,lt,a,R,P,T,B,H,j,K,X,G;const kt=[3,5,7,9,12,15,17,19,21,24],wt=new Set([12,24]);lt=[pt("mq-fretboard")];class m extends(O=ft,ot=[g({type:Number})],nt=[g({type:Number,attribute:"start-fret"})],at=[g({type:Number,attribute:"end-fret"})],it=[g({reflect:!0})],st=[g({attribute:"fret-numbers"})],rt=[g({attribute:"inlays",converter:{fromAttribute:t=>t!=="false",toAttribute:t=>t?"":null}})],et=[g({type:Boolean,attribute:"full-neck"})],tt=[g({type:Boolean,reflect:!0,attribute:"left-handed"})],Z=[g({attribute:"extra-slots"})],O){constructor(){super(...arguments),b(this,R,p(a,8,this,6)),p(a,11,this),b(this,P,p(a,12,this,1)),p(a,15,this),b(this,T,p(a,16,this,12)),p(a,19,this),b(this,B,p(a,20,this,"horizontal")),p(a,23,this),b(this,H,p(a,24,this,"")),p(a,27,this),b(this,j,p(a,28,this,!1)),p(a,31,this),b(this,K,p(a,32,this,!1)),p(a,35,this),b(this,X,p(a,36,this,!1)),p(a,39,this),b(this,G,p(a,40,this,"")),p(a,43,this)}_place(t,s){return this.orientation==="vertical"?`grid-column: ${s}; grid-row: ${t}`:`grid-column: ${t}; grid-row: ${s}`}render(){const t=this.endFret-this.startFret+1,s=this.startFret===1,f=this.orientation==="vertical",l=["auto","var(--mq-fretboard-nut-width, 3px)"];for(let r=0;r<t;r++)l.push("minmax(1em, 1fr)","auto");const o=f?1:0,u=[];f&&u.push("auto");for(let r=0;r<this.strings;r++)u.push("minmax(0.5em, 1fr)","auto","minmax(0.5em, 1fr)");f||u.push("auto");const c=r=>o+(r-1)*3+2,A=r=>`${o+(r-1)*3+1} / ${o+(r-1)*3+4}`,w=r=>2+(r-this.startFret)*2+2,y=r=>2+(r-this.startFret)*2+1,i=3+t*2,k=this.fullNeck?`${o+1} / ${o+this.strings*3+1}`:`${c(1)} / ${c(this.strings)+1}`,v=f?"1":`${this.strings*3+1}`;let F=[];if(this.fretNumbers==="all")for(let r=this.startFret;r<=this.endFret;r++)F.push(r);else this.fretNumbers&&(F=this.fretNumbers.split(",").map(r=>parseInt(r.trim(),10)).filter(r=>!isNaN(r)&&r>=this.startFret&&r<=this.endFret));const W=this.inlays?kt.filter(r=>r>=this.startFret&&r<=this.endFret):[],z=`${o+1} / ${o+this.strings*3+1}`;return _`
      <div
        class="grid"
        style="grid-template-columns: ${(f?u:l).join(" ")}; grid-template-rows: ${(f?l:u).join(" ")};"
      >
        <div
          class="neck"
          style="${this._place(`2 / ${i}`,this.fullNeck?z:k)}"
        ></div>
        ${s?_`<div class="nut" style="${this._place("2 / 3",k)}"></div>`:_`<div class="fret first-fret" style="${this._place("2 / 3",k)}"></div>`}
        ${Array.from({length:t},(r,n)=>{const d=w(this.startFret+n);return _`<div class="fret" style="${this._place(`${d} / ${d+1}`,k)}"></div>`})}
        ${Array.from({length:this.strings},(r,n)=>{const d=c(n+1);return _`<div
            class="string"
            style="${this._place(`3 / ${i}`,`${d} / ${d+1}`)}"
          ></div>`})}
        ${W.map(r=>{const n=y(r),d=`${n} / ${n+1}`;if(wt.has(r)){const h=Math.ceil(this.strings/2);return _` <div
                class="inlay"
                style="${this._place(d,`${c(1)-1} / ${c(h)+2}`)}"
              ></div>
              <div
                class="inlay"
                style="${this._place(d,`${c(h+1)-1} / ${c(this.strings)+2}`)}"
              ></div>`}return _`<div
            class="inlay"
            style="${this._place(d,`${c(1)-1} / ${c(this.strings)+2}`)}"
          ></div>`})}
        ${F.map(r=>{const n=y(r);return _`<div
            class="fret-number"
            part="fret-number"
            style="${this._place(`${n} / ${n+1}`,v)}"
          >
            ${r}
          </div>`})}
        ${Array.from({length:this.strings},(r,n)=>{const d=n+1,h=A(d);return _` <slot
              name="s${d}-marker"
              style="${this._place("1 / 2",h)}; place-self: center;"
            ></slot>
            ${Array.from({length:t},(q,S)=>{const N=this.startFret+S,E=y(N);return _`<slot
                name="s${d}-f${N}"
                style="${this._place(`${E} / ${E+1}`,h)}; place-self: center;"
              ></slot>`})}`})}
        ${this.extraSlots?this.extraSlots.split(",").map(r=>{const n=r.trim(),d=n.match(/^s(\d+)-s(\d+)-f(\d+)$/);if(!d)return I;const h=parseInt(d[1],10),q=parseInt(d[2],10),S=parseInt(d[3],10);if(S<this.startFret||S>this.endFret)return I;const N=y(S),E=o+(h-1)*3+1,ct=o+(q-1)*3+4,dt=f?"align-self: center; justify-self: stretch;":"align-self: stretch; justify-self: center;";return _`<slot
                name="${n}"
                style="${this._place(`${N} / ${N+1}`,`${E} / ${ct}`)}; display: grid; ${dt}"
              ></slot>`}):I}
      </div>
    `}}a=vt(O);R=new WeakMap;P=new WeakMap;T=new WeakMap;B=new WeakMap;H=new WeakMap;j=new WeakMap;K=new WeakMap;X=new WeakMap;G=new WeakMap;$(a,4,"strings",ot,m,R);$(a,4,"startFret",nt,m,P);$(a,4,"endFret",at,m,T);$(a,4,"orientation",it,m,B);$(a,4,"fretNumbers",st,m,H);$(a,4,"inlays",rt,m,j);$(a,4,"fullNeck",et,m,K);$(a,4,"leftHanded",tt,m,X);$(a,4,"extraSlots",Z,m,G);m=$(a,0,"MqFretboard",lt,m);gt(m,"styles",ht`
    :host {
      display: block;
    }

    :host([orientation="vertical"]) {
      display: inline-block;
    }

    .grid {
      display: grid;
    }

    :host([orientation="vertical"]) .grid {
      display: inline-grid;
    }

    slot {
      display: block;
    }

    .neck {
      background: var(--mq-fretboard-neck-color);
    }

    .nut {
      background-color: var(--mq-fretboard-nut-color, #000);
      border-radius: var(--mq-fretboard-nut-radius, 0);
    }

    :host(:not([orientation="vertical"])) .nut {
      width: var(--mq-fretboard-nut-width, 3px);
    }

    :host([orientation="vertical"]) .nut {
      height: var(--mq-fretboard-nut-width, 3px);
    }

    .fret {
      background-color: var(--mq-fretboard-fret-color, #000);
    }

    :host(:not([orientation="vertical"])) .fret {
      width: var(--mq-fretboard-fret-width, 1px);
    }

    :host([orientation="vertical"]) .fret {
      height: var(--mq-fretboard-fret-width, 1px);
    }

    :host(:not([orientation="vertical"])) .first-fret {
      justify-self: end;
      margin-left: calc(var(--mq-fretboard-nut-width, 3px) - var(--mq-fretboard-fret-width, 1px));
    }

    :host([orientation="vertical"]) .first-fret {
      align-self: end;
      margin-top: calc(var(--mq-fretboard-nut-width, 3px) - var(--mq-fretboard-fret-width, 1px));
    }

    .string {
      background-color: var(--mq-fretboard-string-color, #000);
    }

    :host(:not([orientation="vertical"])) .string {
      height: var(--mq-fretboard-string-width, 1px);
    }

    :host([orientation="vertical"]) .string {
      width: var(--mq-fretboard-string-width, 1px);
    }

    .inlay {
      background-color: var(--mq-fretboard-inlay-color, #000);
      width: var(--mq-fretboard-inlay-size, 6px);
      height: var(--mq-fretboard-inlay-size, 6px);
      border-radius: 50%;
      place-self: center;
    }

    .fret-number {
      color: inherit;
      font-size: 0.75em;
      line-height: 1;
      place-self: center;
    }

    :host(:not([orientation="vertical"])) .fret-number {
      margin-top: 0.3em;
    }

    :host([orientation="vertical"]) .fret-number {
      margin-right: 0.3em;
    }

    :host([left-handed]) .grid {
      transform: scaleX(-1);
    }

    :host(:not([orientation="vertical"])) slot[name$="-marker"] {
      margin-right: 0.3em;
    }

    :host(:not([orientation="vertical"])[left-handed]) slot[name$="-marker"] {
      margin-right: 0;
      margin-left: 0.3em;
    }

    :host([orientation="vertical"]) slot[name$="-marker"] {
      margin-bottom: 0.3em;
    }

    :host([left-handed]) slot,
    :host([left-handed]) .fret-number {
      transform: scaleX(-1);
    }
  `);p(a,1,m);
