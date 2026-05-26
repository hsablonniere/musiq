import{i as ie,b as $,A as q,a as ne,t as oe,n as b}from"./property-BiLpLSdF.js";import{c as G}from"./index-Bvi1N4eT.js";import{g as le}from"./index-B9O6Z9Gc.js";import"./mq-fretboard-B2Q3Y5F2.js";var ce=Object.create,W=Object.defineProperty,de=Object.getOwnPropertyDescriptor,J=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),F=e=>{throw TypeError(e)},K=(e,t,r)=>t in e?W(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,R=(e,t)=>W(e,"name",{value:t,configurable:!0}),fe=e=>[,,,ce(e?.[J("metadata")]??null)],Q=["class","method","getter","setter","accessor","field","value","get","set"],M=e=>e!==void 0&&typeof e!="function"?F("Function expected"):e,he=(e,t,r,f,i)=>({kind:Q[e],name:t,metadata:f,addInitializer:o=>r._?F("Already initialized"):i.push(M(o||null))}),_e=(e,t)=>K(t,J("metadata"),e[3]),l=(e,t,r,f)=>{for(var i=0,o=e[t>>1],p=o&&o.length;i<p;i++)t&1?o[i].call(r):f=o[i].call(r,f);return f},m=(e,t,r,f,i,o)=>{var p,c,S,v,n,s=t&7,k=!!(t&8),d=!!(t&16),y=s>3?e.length+1:s?k?1:2:0,w=Q[s+5],D=s>3&&(e[y-1]=[]),ae=e[y]||(e[y]=[]),u=s&&(!d&&!k&&(i=i.prototype),s<5&&(s>3||!d)&&de(s<4?i:{get[r](){return T(this,o)},set[r](h){return U(this,o,h)}},r));s?d&&s<4&&R(o,(s>2?"set ":s>1?"get ":"")+r):R(i,r);for(var C=f.length-1;C>=0;C--)v=he(s,r,S={},e[3],ae),s&&(v.static=k,v.private=d,n=v.access={has:d?h=>ue(i,h):h=>r in h},s^3&&(n.get=d?h=>(s^1?T:me)(h,i,s^4?o:u.get):h=>h[r]),s>2&&(n.set=d?(h,x)=>U(h,i,x,s^4?o:u.set):(h,x)=>h[r]=x)),c=(0,f[C])(s?s<4?d?o:u[w]:s>4?void 0:{get:u.get,set:u.set}:i,v),S._=1,s^4||c===void 0?M(c)&&(s>4?D.unshift(c):s?d?o=c:u[w]=c:i=c):typeof c!="object"||c===null?F("Object expected"):(M(p=c.get)&&(u.get=p),M(p=c.set)&&(u.set=p),M(p=c.init)&&D.unshift(p));return s||_e(e,i),u&&W(i,r,u),d?s^4?o:u:i},pe=(e,t,r)=>K(e,t+"",r),z=(e,t,r)=>t.has(e)||F("Cannot "+r),ue=(e,t)=>Object(t)!==t?F('Cannot use the "in" operator on this value'):e.has(t),T=(e,t,r)=>(z(e,t,"read from private field"),r?r.call(e):t.get(e)),g=(e,t,r)=>t.has(e)?F("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),U=(e,t,r,f)=>(z(e,t,"write to private field"),f?f.call(e,r):t.set(e,r),r),me=(e,t,r)=>(z(e,t,"access private method"),r),V,X,Y,Z,j,ee,te,re,O,se,a,L,A,P,E,I,N,B,H;se=[oe("mq-fretboard-scale")];class _ extends(O=ne,re=[b()],te=[b()],ee=[b({type:Number,attribute:"start-fret"})],j=[b({type:Number,attribute:"end-fret"})],Z=[b({type:Boolean,attribute:"note-labels"})],Y=[b({type:Boolean,attribute:"degree-labels"})],X=[b({type:Boolean,reflect:!0,attribute:"left-handed"})],V=[b({attribute:"inlays",converter:{fromAttribute:t=>t!=="false",toAttribute:t=>t?"":null}})],O){constructor(){super(...arguments),g(this,L,l(a,8,this,"")),l(a,11,this),g(this,A,l(a,12,this,"E,A,D,G,B,E")),l(a,15,this),g(this,P,l(a,16,this,0)),l(a,19,this),g(this,E,l(a,20,this,12)),l(a,23,this),g(this,I,l(a,24,this,!1)),l(a,27,this),g(this,N,l(a,28,this,!1)),l(a,31,this),g(this,B,l(a,32,this,!1)),l(a,35,this),g(this,H,l(a,36,this,!1)),l(a,39,this)}render(){const t=le(this.scale);if(t.empty||t.notes.length===0)return $`<div class="error">Unknown scale: ${this.scale}</div>`;const r=t.notes,f=r.map(n=>G(n)),i=f[0],o=this.tuning.split(",").map(n=>n.trim()).reverse(),p=o.length,c=Math.max(1,this.startFret),S=this.startFret<=0,v=[];for(let n=0;n<p;n++){const s=G(o[n]);if(s==null)continue;const k=S?0:c;for(let d=k;d<=this.endFret;d++){const y=(s+d)%12,w=f.indexOf(y);w>=0&&v.push({string:n+1,fret:d,note:r[w],degree:w+1,isRoot:y===i})}}return $`
      ${this.scale?$`<div class="title" part="title">${this.scale}</div>`:q}
      <mq-fretboard
        .strings=${p}
        start-fret=${c}
        end-fret=${this.endFret}
        ?left-handed=${this.leftHanded}
        fret-numbers="all"
        ?inlays=${this.inlays}
        exportparts="fret-number"
      >
        ${v.map(n=>{const s=n.fret===0?`s${n.string}-marker`:`s${n.string}-f${n.fret}`;return $`
            <div slot="${s}" class="dot${n.isRoot?" root":""}" part="dot">
              ${this.noteLabels?$`<span class="label">${n.note.replace("#","♯").replace("b","♭")}</span>`:q}
              ${this.degreeLabels?$`<span class="degree">${n.degree}</span>`:q}
            </div>
          `})}
      </mq-fretboard>
    `}}a=fe(O);L=new WeakMap;A=new WeakMap;P=new WeakMap;E=new WeakMap;I=new WeakMap;N=new WeakMap;B=new WeakMap;H=new WeakMap;m(a,4,"scale",re,_,L);m(a,4,"tuning",te,_,A);m(a,4,"startFret",ee,_,P);m(a,4,"endFret",j,_,E);m(a,4,"noteLabels",Z,_,I);m(a,4,"degreeLabels",Y,_,N);m(a,4,"leftHanded",X,_,B);m(a,4,"inlays",V,_,H);_=m(a,0,"MqFretboardScale",se,_);pe(_,"styles",ie`
    :host {
      display: flex;
      flex-direction: column;
    }

    .title {
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: 0.4em;
      font-family: system-ui, sans-serif;
    }

    mq-fretboard {
      flex: 1;
      min-height: 0;
    }

    .dot {
      width: 1.4em;
      height: 1.4em;
      border-radius: 50%;
      background: var(--mq-fretboard-scale-active-color, #2980b9);
      margin: 0.2em 0.4em;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .dot.root {
      background: var(--mq-fretboard-scale-root-color, #c0392b);
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.5em;
      font-weight: bold;
      color: #fff;
      line-height: 1;
    }

    .degree {
      font-family: system-ui, sans-serif;
      font-size: 0.4em;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1;
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `);l(a,1,_);
