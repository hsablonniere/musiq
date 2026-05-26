import{i as j,b as k,A as D,a as tt,t as et,n as L}from"./property-BiLpLSdF.js";import{i as E,a as ot,n as O,d as K,t as nt,b as T,g as rt}from"./index-Bvi1N4eT.js";import{a as st,n as it}from"./utils-GjZxFZVf.js";import"./mq-piano-8sktjn84.js";var at=ct((t,e)=>[t[0]-e[0],t[1]-e[1]]);function ct(t){return(e,o)=>{const r=E(e).coord,n=E(o).coord;if(r&&n){const i=t(r,n);return ot(i).name}}}var H={empty:!0,name:"",symbol:"",root:"",bass:"",rootDegree:0,type:"",tonic:null,setNum:NaN,quality:"Unknown",chroma:"",normalized:"",aliases:[],notes:[],intervals:[]};function lt(t){const[e,o,r,n]=T(t);return e===""?P("",t):e==="A"&&n==="ug"?P("","aug"):P(e+o,r+n)}function P(t,e){const o=e.split("/");if(o.length===1)return[t,o[0],""];const[r,n,i,c]=T(o[1]);return r!==""&&i===""&&c===""?[t,o[0],r+n]:[t,e,""]}function dt(t){if(Array.isArray(t))return A(t[1]||"",t[0],t[2]);if(t==="")return H;{const[e,o,r]=lt(t),n=A(o,e,r);return n.empty?A(t):n}}function A(t,e,o){const r=rt(t),n=O(e||""),i=O(o||"");if(r.empty||e&&n.empty||o&&i.empty)return H;const c=K(n.pc,i.pc),a=r.intervals.indexOf(c),m=a>=0,u=m?i:O(""),_=a===-1?NaN:a+1,s=i.pc&&i.pc!==n.pc,f=Array.from(r.intervals);if(m)for(let h=1;h<_;h++){const z=f[0][0],l=f[0][1],$=parseInt(z,10)+7;f.push(`${$}${l}`),f.shift()}else if(s){const h=at(K(n.pc,i.pc),"8P");h&&f.unshift(h)}const p=n.empty?[]:f.map(h=>nt(n.pc,h));t=r.aliases.indexOf(t)!==-1?t:r.aliases[0];const g=`${n.empty?"":n.pc}${t}${m&&_>1?"/"+u.pc:s?"/"+i.pc:""}`,q=`${e?n.pc+" ":""}${r.name}${m&&_>1?" over "+u.pc:s?" over "+i.pc:""}`;return{...r,name:q,symbol:g,tonic:n.pc,type:r.name,root:u.pc,bass:s?i.pc:"",intervals:f,rootDegree:_,notes:p}}var pt=Object.create,N=Object.defineProperty,ft=Object.getOwnPropertyDescriptor,J=(t,e)=>(e=Symbol[t])?e:Symbol.for("Symbol."+t),b=t=>{throw TypeError(t)},Q=(t,e,o)=>e in t?N(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,W=(t,e)=>N(t,"name",{value:e,configurable:!0}),ht=t=>[,,,pt(t?.[J("metadata")]??null)],V=["class","method","getter","setter","accessor","field","value","get","set"],w=t=>t!==void 0&&typeof t!="function"?b("Function expected"):t,ut=(t,e,o,r,n)=>({kind:V[t],name:e,metadata:r,addInitializer:i=>o._?b("Already initialized"):n.push(w(i||null))}),vt=(t,e)=>Q(e,J("metadata"),t[3]),x=(t,e,o,r)=>{for(var n=0,i=t[e>>1],c=i&&i.length;n<c;n++)e&1?i[n].call(o):r=i[n].call(o,r);return r},S=(t,e,o,r,n,i)=>{var c,a,m,u,_,s=e&7,f=!!(e&8),p=!!(e&16),g=s>3?t.length+1:s?f?1:2:0,q=V[s+5],h=s>3&&(t[g-1]=[]),z=t[g]||(t[g]=[]),l=s&&(!p&&!f&&(n=n.prototype),s<5&&(s>3||!p)&&ft(s<4?n:{get[o](){return U(this,i)},set[o](d){return R(this,i,d)}},o));s?p&&s<4&&W(i,(s>2?"set ":s>1?"get ":"")+o):W(n,o);for(var $=r.length-1;$>=0;$--)u=ut(s,o,m={},t[3],z),s&&(u.static=f,u.private=p,_=u.access={has:p?d=>mt(n,d):d=>o in d},s^3&&(_.get=p?d=>(s^1?U:yt)(d,n,s^4?i:l.get):d=>d[o]),s>2&&(_.set=p?(d,C)=>R(d,n,C,s^4?i:l.set):(d,C)=>d[o]=C)),a=(0,r[$])(s?s<4?p?i:l[q]:s>4?void 0:{get:l.get,set:l.set}:n,u),m._=1,s^4||a===void 0?w(a)&&(s>4?h.unshift(a):s?p?i=a:l[q]=a:n=a):typeof a!="object"||a===null?b("Object expected"):(w(c=a.get)&&(l.get=c),w(c=a.set)&&(l.set=c),w(c=a.init)&&h.unshift(c));return s||vt(t,n),l&&N(n,o,l),p?s^4?i:l:n},_t=(t,e,o)=>Q(t,e+"",o),M=(t,e,o)=>e.has(t)||b("Cannot "+o),mt=(t,e)=>Object(e)!==e?b('Cannot use the "in" operator on this value'):t.has(e),U=(t,e,o)=>(M(t,e,"read from private field"),o?o.call(t):e.get(t)),G=(t,e,o)=>e.has(t)?b("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,o),R=(t,e,o,r)=>(M(t,e,"write to private field"),r?r.call(t,o):e.set(t,o),o),yt=(t,e,o)=>(M(t,e,"access private method"),o),X,Y,I,Z,v,F,B;Z=[et("mq-piano-chord")];class y extends(I=tt,Y=[L()],X=[L({type:Boolean,attribute:"note-labels"})],I){constructor(){super(...arguments),G(this,F,x(v,8,this,"")),x(v,11,this),G(this,B,x(v,12,this,!1)),x(v,15,this)}render(){const e=dt(this.chord);if(e.empty||e.notes.length===0)return k`<div class="error">Unknown chord: ${this.chord}</div>`;const o=st(e.notes,4),r=4,n=`C${r}`,i=`B${r+1}`;return k`
      ${this.chord?k`<div class="title" part="title">${this.chord}</div>`:D}
      <mq-piano
        start-note=${n}
        end-note=${i}
        mode="centered"
        exportparts="key, key-white, key-black"
      >
        ${o.map(c=>k`
            <div slot="note-${it(c)}" class="active-fill">
              ${this.noteLabels?k`<span class="label"
                    >${c.replace(/\d+$/,"").replace("#","♯").replace("b","♭")}</span
                  >`:D}
            </div>
          `)}
      </mq-piano>
    `}}v=ht(I);F=new WeakMap;B=new WeakMap;S(v,4,"chord",Y,y,F);S(v,4,"noteLabels",X,y,B);y=S(v,0,"MqPianoChord",Z,y);_t(y,"styles",j`
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
      background: var(--mq-piano-chord-active-color, #4a90d9);
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .label {
      font-family: system-ui, sans-serif;
      font-size: 0.55em;
      font-weight: bold;
      padding-bottom: 0.5em;
      color: #fff;
    }

    .error {
      font-family: system-ui, sans-serif;
      color: #c0392b;
      font-style: italic;
      padding: 1em;
    }
  `);x(v,1,y);
