import{i as Q,b as m,A as S,a as V,t as X,n as O}from"./property-BiLpLSdF.js";import"./index-Bvi1N4eT.js";import{g as Y}from"./index-B9O6Z9Gc.js";import{a as Z,n as j}from"./utils-GjZxFZVf.js";import"./mq-piano-8sktjn84.js";var ee=Object.create,L=Object.defineProperty,te=Object.getOwnPropertyDescriptor,E=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),u=e=>{throw TypeError(e)},D=(e,t,a)=>t in e?L(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,K=(e,t)=>L(e,"name",{value:t,configurable:!0}),ae=e=>[,,,ee(e?.[E("metadata")]??null)],T=["class","method","getter","setter","accessor","field","value","get","set"],g=e=>e!==void 0&&typeof e!="function"?u("Function expected"):e,ie=(e,t,a,n,o)=>({kind:T[e],name:t,metadata:n,addInitializer:s=>a._?u("Already initialized"):o.push(g(s||null))}),oe=(e,t)=>D(t,E("metadata"),e[3]),v=(e,t,a,n)=>{for(var o=0,s=e[t>>1],c=s&&s.length;o<c;o++)t&1?s[o].call(a):n=s[o].call(a,n);return n},k=(e,t,a,n,o,s)=>{var c,r,y,_,b,i=t&7,$=!!(t&8),f=!!(t&16),x=i>3?e.length+1:i?$?1:2:0,B=T[i+5],I=i>3&&(e[x-1]=[]),J=e[x]||(e[x]=[]),p=i&&(!f&&!$&&(o=o.prototype),i<5&&(i>3||!f)&&te(i<4?o:{get[a](){return N(this,s)},set[a](l){return A(this,s,l)}},a));i?f&&i<4&&K(s,(i>2?"set ":i>1?"get ":"")+a):K(o,a);for(var w=n.length-1;w>=0;w--)_=ie(i,a,y={},e[3],J),i&&(_.static=$,_.private=f,b=_.access={has:f?l=>re(o,l):l=>a in l},i^3&&(b.get=f?l=>(i^1?N:ne)(l,o,i^4?s:p.get):l=>l[a]),i>2&&(b.set=f?(l,q)=>A(l,o,q,i^4?s:p.set):(l,q)=>l[a]=q)),r=(0,n[w])(i?i<4?f?s:p[B]:i>4?void 0:{get:p.get,set:p.set}:o,_),y._=1,i^4||r===void 0?g(r)&&(i>4?I.unshift(r):i?f?s=r:p[B]=r:o=r):typeof r!="object"||r===null?u("Object expected"):(g(c=r.get)&&(p.get=c),g(c=r.set)&&(p.set=c),g(c=r.init)&&I.unshift(c));return i||oe(e,o),p&&L(o,a,p),f?i^4?s:p:o},se=(e,t,a)=>D(e,t+"",a),M=(e,t,a)=>t.has(e)||u("Cannot "+a),re=(e,t)=>Object(t)!==t?u('Cannot use the "in" operator on this value'):e.has(t),N=(e,t,a)=>(M(e,t,"read from private field"),a?a.call(e):t.get(e)),z=(e,t,a)=>t.has(e)?u("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,a),A=(e,t,a,n)=>(M(e,t,"write to private field"),n?n.call(e,a):t.set(e,a),a),ne=(e,t,a)=>(M(e,t,"access private method"),a),G,R,U,P,H,d,C,F,W;function le(e){const t=e.replace(/\d+$/,"");return t.includes("#")||t.length>1&&t.includes("b")}H=[X("mq-piano-scale")];class h extends(P=V,U=[O()],R=[O({type:Boolean,attribute:"note-labels"})],G=[O({type:Boolean,attribute:"degree-labels"})],P){constructor(){super(...arguments),z(this,C,v(d,8,this,"")),v(d,11,this),z(this,F,v(d,12,this,!1)),v(d,15,this),z(this,W,v(d,16,this,!1)),v(d,19,this)}render(){const t=Y(this.scale);if(t.empty||t.notes.length===0)return m`<div class="error">Unknown scale: ${this.scale}</div>`;const a=Z([...t.notes,t.notes[0]],4),n=4,o=`C${n}`,s=`B${n+1}`;return m`
      ${this.scale?m`<div class="title" part="title">${this.scale}</div>`:S}
      <mq-piano
        start-note=${o}
        end-note=${s}
        mode="centered"
        exportparts="key, key-white, key-black"
      >
        ${a.map((c,r)=>{const y=r===0||r===a.length-1,_=r===a.length-1?1:r+1,b=le(c);return m`
            <div
              slot="note-${j(c)}"
              class="active-fill${y?" root":""}${b?" black":""}"
            >
              ${this.noteLabels?m`<span class="label"
                    >${c.replace(/\d+$/,"").replace("#","♯").replace("b","♭")}</span
                  >`:S}
              ${this.degreeLabels?m`<span class="degree">${_}</span>`:S}
            </div>
          `})}
      </mq-piano>
    `}}d=ae(P);C=new WeakMap;F=new WeakMap;W=new WeakMap;k(d,4,"scale",U,h,C);k(d,4,"noteLabels",R,h,F);k(d,4,"degreeLabels",G,h,W);h=k(d,0,"MqPianoScale",H,h);se(h,"styles",Q`
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

    mq-piano {
      flex: 1;
      min-height: 0;
    }

    mq-piano::part(key-white),
    mq-piano::part(key-black) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .active-fill {
      width: 100%;
      height: 100%;
      background: var(--mq-piano-scale-active-color, #27ae60);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .active-fill.root {
      background: var(--mq-piano-scale-root-color, var(--mq-piano-scale-active-color, #1e8449));
    }

    .active-fill.black {
      border-left: 1px solid #000;
      border-right: 1px solid #000;
      border-bottom: 1px solid #000;
      box-sizing: border-box;
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.55em;
      font-weight: bold;
      padding-bottom: 0.2em;
      color: #fff;
    }

    .degree {
      font-family: system-ui, sans-serif;
      font-size: 0.45em;
      padding-bottom: 0.4em;
      color: rgba(255, 255, 255, 0.8);
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `);v(d,1,h);
