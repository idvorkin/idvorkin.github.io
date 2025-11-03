let e,t;function n(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function o(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function i(e){let t,n=e.length;for(;0!==n;)t=Math.floor(Math.random()*n),n--,[e[n],e[t]]=[e[t],e[n]];return e}function r(e,t){let n=t||e.name||"anonymous function";"loading"===document.readyState?(console.log(`\u{1F550} Deferring ${n} until DOM is ready`),document.addEventListener("DOMContentLoaded",()=>{console.log(`\u{1F680} Executing deferred ${n}`),e()})):(console.log(`\u{26A1} DOM already ready, executing ${n} immediately`),e())}async function l(e,t){let n=$(e);if(1!==n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async e=>{if("A"!==e.target.tagName){let e=$(await t());n.empty().append(e)}})}let a=null;async function s(e){if(null!=a)return a;let t=(e||window.location.href).includes("https://idvork.in"),n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return a=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function c(){try{let e=await s(),t=Object.keys(e).filter(e=>{let t=["/404","/404.html","/search","/recent","/index.html","/graph","/about","/random"].some(t=>e===t||e.endsWith(t)),n=["/ig66/"].some(t=>e.includes(t));return!t&&!n});if(0===t.length)return"/";return o(t)||"/"}catch(e){return console.error("\uD83D\uDEA8 Error getting random page URL:",e),"/"}}async function d(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await s(e)}catch(e){throw Error("Missing url_info in data structure")}}async function u(){return[...Object.entries(await d()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}function p(e){let t={};for(let n of e){if(!n.last_modified)continue;let e=new Date(n.last_modified),o=`${e.toLocaleString("default",{month:"long"})} ${e.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(n)}return t}function m(e){let t="";for(let[n,o]of Object.entries(e))t+=`
      <h3>${n}</h3>
      <ul class="last-modified-list">
        ${o.map(e=>{let t=new Date(e.last_modified).toLocaleDateString("en-US",{day:"numeric",month:"short"});return`
          <li>
            <span class="date-badge">${t}</span>
            <a href="${e.url}">${e.title}</a>
            <p class="description">${e.description.split("\n")[0].substring(0,150)}${e.description.length>150?"...":""}</p>
          </li>
        `}).join("")}
      </ul>
    `;return t}async function g(e="last-modified-posts",t=15,n=document){let o=n.getElementById(e);if(!o){console.log(`\u{274C} ${e} container not found in DOM`);return}try{let e=await u();o.innerHTML=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),i=m(p(n));if(o.length>0){var r,l;i+=(r=m(p(o)),l=o.length,`
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${l} more)
      </h2>
      <div id="remaining-posts-content" class="remaining-content" style="display: none;">
        ${r}
      </div>
    </div>
  `)}return`
    <style>
      .last-modified-list {
        list-style-type: none;
        padding-left: 0;
      }
      .last-modified-list li {
        margin-bottom: 1.5rem;
        position: relative;
      }
      .date-badge {
        display: inline-block;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        margin-right: 0.5rem;
        font-size: 0.8rem;
      }
      .description {
        margin-top: 0.5rem;
        margin-bottom: 0;
        color: #6c757d;
      }
      .remaining-toggle {
        cursor: pointer;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        margin-top: 2rem;
        transition: background-color 0.3s;
      }
      .remaining-toggle:hover {
        background-color: #e9ecef;
      }
      .toggle-icon {
        display: inline-block;
        transition: transform 0.3s;
      }
      .toggle-icon.open {
        transform: rotate(90deg);
      }
    </style>
  `+i}(e,t),function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);if(!o){console.log(`Toggle element with ID ${e} not found`);return}o.addEventListener("click",function(){let e=n.getElementById(t);if(!e){console.log(`Content element with ID ${t} not found`);return}let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))})}("remaining-posts-toggle","remaining-posts-content",n)}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function f(e="last-modified-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{g(e,15,t)}):g(e,15,t)}async function h(e="recent-posts"){let t=document.getElementById(e);if(!t){console.error(`\u{274C} ${e} container not found in DOM`);return}try{var n;let e=await u();n=function(e,t=5){return e.slice(0,t)}(e),t.innerHTML=0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function b(e,t){let n=e.filter(e=>e.url===t)[0];if(n)return n;let o=t.replace(/^\//,"").replace(/\/$/,"");return e.filter(e=>e.url.replace(/^\//,"").replace(/\/$/,"")===o)[0]}function y(e){let t=e.filter(e=>e.expanded);e.find(e=>"/eulogy"===e.url)||console.log("Eulogy node not found in pages");let n=function(e){let t=[];for(let n of e){for(let e of[...n.outgoing_links||[],...n.incoming_links||[]])b(x,e)&&t.push({source:n,target:e,value:1});0===t.filter(e=>e.source===n).length&&"/eulogy"===n.url&&console.log(`No valid links found for ${n.url}`)}return t}(t),o=n.map(t=>b(e,t.target)).filter(e=>e);return{nodes:t.concat(o),links:n}}function v(e,t,n){let o=e.outgoing_links.length,i=e.expanded?"-":`+${o}`,r=`${e.id} [${i}]`,l=12/n;t.font=`${l}px Sans-Serif`;let a=[t.measureText(r).width,l].map(e=>e+.2*l);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-a[0]/2,e.y-a[1]/2,...a),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(r,e.x,e.y),e.__bckgDimensions=a}function w(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}console.log("Load force graph in TS v 0.9");let x=[],k=null,_=null;function E(e){if(!_){console.log("Cannot center: Graph not initialized");return}if(!e){console.log("Cannot center: Node is null or undefined");return}_.centerAt(e.x,e.y,500),_.zoom(8,500),C(e)}function C(e){if(!e)return;k=e;let t=n(e),o=document.getElementById("detail");o&&(o.innerHTML=t)}function L(){k?k.url?window.open(k.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}function S(){for(let e of x)e.expanded=!1;k&&(k.expanded=!0),_&&(_.graphData(y(x)),k&&setTimeout(()=>{E(k)},300))}async function N(){if(!document.getElementById("graph")){console.log("Graph element not found, exiting initialization");return}window.location.hash.substr(1),x=Object.values(await s()).map(e=>({...e,id:e.url,expanded:!1}));let e=`/${window.location.hash?window.location.hash.substr(1):""}`,t=x.map(e=>e.url).includes(e)?e:"/eulogy";for(let e of x)e.expanded=e.url===t;if("undefined"==typeof ForceGraph){console.log("Force Graph not defined, providing fallback functionality");let e=b(x,t);e&&(C(e),k=e);let n=document.getElementById("center_control");n&&n.addEventListener("click",()=>{console.log("Center control clicked (fallback mode)")});let o=document.getElementById("goto_control");o&&o.addEventListener("click",()=>{k?.url&&window.open(k.url,"_blank")});let i=document.getElementById("collapse_control");i&&i.addEventListener("click",()=>{console.log("Collapse control clicked (fallback mode)")});return}_=ForceGraph()(document.getElementById("graph")).graphData(y(x)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(v).nodePointerAreaPaint(w).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{e.expanded=!e.expanded,0===x.filter(e=>e.expanded).length&&(e.expanded=!0),_.graphData(y(x)),setTimeout(()=>{E(e)},300)});let n=b(x,t);n?E(n):console.log("Initial node not found, cannot center");let o=document.getElementById("center_control");o?o.addEventListener("click",()=>{k?E(k):console.log("No last detail node to center on")}):console.log("Center control element not found");let i=document.getElementById("goto_control");i&&i.addEventListener("click",L);let r=document.getElementById("collapse_control");r&&r.addEventListener("click",S)}"undefined"!=typeof window&&(window.initializeGraph=N);let T={iconClass:"header-copy-link",tooltipDuration:2e3,domainMapping:{from:"idvork.in/",to:"idvorkin.azurewebsites.net/"}};function M(e){e.style.display="none";let t=e.querySelector(".github-issue-comment");t&&(t.value="")}function I(e){if(!e)return"";let t=(window.location.pathname.replace(/^\//,"").replace(/\.html$/,"")||"index").replace(/-/g," "),n=[],o=Number.parseInt(e.tagName.substring(1)),i=Array.from(e.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim();if(o>=2){let t=e.previousElementSibling,i=[],r=new Set;for(;t;){let e=t.tagName;if(e?.match(/^H[1-6]$/)){let n=Number.parseInt(e.substring(1));if(n<o&&!r.has(n)){let e=Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim();if(e&&(i.push({level:n,text:e}),r.add(n)),1===n)break}}t=t.previousElementSibling}i.sort((e,t)=>e.level-t.level),i.forEach(e=>n.push(e.text))}n.push(i);let r=`[${t}]`;if(n.length>0){let e=n.slice(0,3);r+=`: ${e.join(" > ")}`,n.length>3&&(r+=" ...")}return r}function A(e,t){let n=e;n=n.replace("localhost:4000/","idvorkin.azurewebsites.net/"),t.domainMapping&&(n=n.replace(t.domainMapping.from,t.domainMapping.to));let o=new URL(n),i=o.pathname.replace(/^\//,"").replace(/\.html$/,"")||"index",r=o.hash.replace("#","");return r?`${i}#${r}`:i}async function D(e,t){try{let n=window.location.href,o=n.includes("#")?n.replace(/#.*/,`#${e}`):`${n}#${e}`,i=A(o,t),r=`https://tinyurl.com/igor-blog/?path=${encodeURIComponent(i)}`,l=document.getElementById(e),a=l?Array.from(l.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim():"",s=`${a} - Igor's Blog`,c=F(e),d=I(l),u=`From: ${d} ...`;c&&(u=`From: ${d} ...

${c}`);let p=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);if(navigator.share&&p)try{return await navigator.share({title:s,text:u,url:r}),console.log(`\u{1F4F1} Shared via native share: ${r}`),!0}catch(e){console.log("Share cancelled or failed, falling back to clipboard",e)}let m=r;return c&&(m=`From: ${d} ...

${c}

${r}`),await navigator.clipboard.writeText(m),console.log(`\u{1F4CB} Copied to clipboard with preview: ${m.substring(0,100)}...`),!1}catch(n){console.error("Failed to share/copy header link:",n);try{let n=window.location.href,o=n.includes("#")?n.replace(/#.*/,`#${e}`):`${n}#${e}`,i=A(o,t),r=`https://tinyurl.com/igor-blog/?path=${encodeURIComponent(i)}`,l=document.getElementById(e),a=I(l),s=F(e),c=r;s&&(c=`From: ${a} ...

${s}

${r}`);let d=document.createElement("textarea");return d.value=c,document.body.appendChild(d),d.select(),document.execCommand("copy"),document.body.removeChild(d),console.log(`\u{1F4CB} Copied with preview (fallback): ${c.substring(0,100)}...`),!1}catch(e){throw console.error("Failed to copy URL even with fallback:",e),e}}}function z(e){let t=e.nextElementSibling;for(;t&&!t.tagName.match(/^H[1-6]$/);){if("P"===t.tagName){let e=(t.textContent||"").trim();if(e.length>0)return e.length>500?`${e.substring(0,497)}...`:e}if("UL"===t.tagName||"OL"===t.tagName){let e=t.querySelectorAll("li"),n=[],o=0;for(let t of Array.from(e)){let e=Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE||e.nodeType===Node.ELEMENT_NODE&&"UL"!==e.tagName&&"OL"!==e.tagName).map(e=>(e.textContent||"").trim()).join(" ").trim();if(e.length>0&&(n.push(`\u{2022} ${e}`),(o+=e.length)>400))break}if(n.length>0){let e=n.join("\n");return e.length>500?`${e.substring(0,497)}...`:e}}t=t.nextElementSibling}return""}function B(e,t=400){if(e.length<=t)return e;let n=e.substring(0,t),o=n.lastIndexOf(" ");return o>0?`${n.substring(0,o)}...`:`${n}...`}function F(e){if(e){let t=document.getElementById(e);if(t){let e=z(t);if(e)return B(e);let n=t.nextElementSibling,o=[],i=0;for(;n&&i<400&&!n.tagName.match(/^H[1-6]$/);){if("P"===n.tagName||"LI"===n.tagName||"BLOCKQUOTE"===n.tagName||"DIV"===n.tagName){let e=(n.textContent||"").trim();e.length>0&&(o.push(e),i+=e.length)}n=n.nextElementSibling}if(o.length>0)return B(o.join(" "))}}for(let e of["article","main",".content",".post-content",".entry-content","#content-holder",".content-holder"]){let t=document.querySelector(e);if(t){let e=t.querySelector("p");if(e){let t=(e.textContent||"").trim();if(t.length>0)return B(t)}}}let t=document.querySelector("p");if(t){let e=(t.textContent||"").trim();if(e.length>0)return B(e)}return""}let O=new WeakMap,P=new WeakMap,H=new Set;function R(e={}){let t={...T,...e};for(let e of Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")))!function(e,t){if(e.querySelector(`.${t.iconClass||T.iconClass}`))return;let n=function(e){if(e.id)return e.id;let t=(e.textContent||"").toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""),n=t,o=1;for(;document.getElementById(n);)n=`${t}-${o}`,o++;return e.id=n,n}(e),o=function(e){let t=document.createElement("span");return t.className=e.iconClass||T.iconClass||"",t.title="Share this section",t.style.cursor="pointer",t.style.marginLeft="0.5rem",t.style.opacity="0",t.style.transition="opacity 0.2s ease",t.style.fontSize="0.8em",t.style.userSelect="none",t.setAttribute("role","button"),t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Share this section"),t.innerHTML=`<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`,t}(t),i=function(){let e=document.createElement("span");if(e.className="header-github-issue",e.title="Create GitHub issue for this section",e.style.cursor="pointer",e.style.marginLeft="0.5rem",e.style.opacity="0",e.style.transition="opacity 0.2s ease",e.style.fontSize="0.8em",e.style.userSelect="none",e.setAttribute("role","button"),e.setAttribute("tabindex","0"),e.setAttribute("aria-label","Create GitHub issue for this section"),document.querySelector('link[href*="font-awesome"]')||document.querySelector('script[src*="font-awesome"]')||document.querySelector(".fa, .fab, .fas, .far")||Array.from(document.styleSheets).some(e=>{try{return e.href?.includes("font-awesome")}catch(e){return!1}})){let t=document.createElement("i");t.className="fab fa-github",e.appendChild(t)}else e.textContent="⚠️";return e}(),r=[],l=async e=>{e.preventDefault(),e.stopPropagation(),await D(n,t)||function(e,t=2e3){if("undefined"!=typeof document&&document.querySelector){let e=document.querySelector(".copy-link-tooltip");e&&e.remove()}let n=document.createElement("span");n.className="copy-link-tooltip",n.textContent="Copied!",n.style.position="absolute",n.style.backgroundColor="#333",n.style.color="white",n.style.padding="4px 8px",n.style.borderRadius="4px",n.style.fontSize="12px",n.style.zIndex="1000",n.style.marginLeft="10px",n.style.marginTop="-5px",e.parentElement?.appendChild(n),setTimeout(()=>{n.remove()},t)}(o,t.tooltipDuration)};o.addEventListener("click",l),r.push(()=>o.removeEventListener("click",l));let a=e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),l(e))};o.addEventListener("keydown",a),r.push(()=>o.removeEventListener("keydown",a));let s=t=>{let o;t.preventDefault(),t.stopPropagation(),!function(e,t){document.querySelectorAll(".github-issue-popup").forEach(e=>{e.style.display="none"}),e.style.display="block",e.style.position="absolute",e.style.zIndex="1000";let n=t.getBoundingClientRect(),o=window.pageYOffset||document.documentElement.scrollTop,i=window.pageXOffset||document.documentElement.scrollLeft;e.style.top=`${n.bottom+o+10}px`,e.style.left=`${n.left+i}px`;let r=e.querySelector(".github-issue-title");r&&r.focus()}(((o=P.get(e))||(o=function(e,t){let n=document.createElement("div");n.className="github-issue-popup",n.style.display="none",n.id=`github-issue-popup-${e}`;let o=document.createElement("div");o.className="github-issue-popup-content";let i=document.createElement("div");i.className="github-issue-popup-header";let r=document.createElement("h4");r.textContent=`Report Issue: ${t}`;let l=document.createElement("button");l.className="github-issue-popup-close",l.title="Close",l.textContent="×",i.appendChild(r),i.appendChild(l);let a=document.createElement("div");a.className="github-issue-popup-body";let s=document.createElement("label");s.setAttribute("for",`issue-title-${e}`),s.textContent="Issue Title:";let c=document.createElement("input");c.type="text",c.id=`issue-title-${e}`,c.className="github-issue-title",c.placeholder="Brief title for the issue";let d=document.createElement("label");d.setAttribute("for",`issue-comment-${e}`),d.textContent="Description:";let u=document.createElement("textarea");u.id=`issue-comment-${e}`,u.className="github-issue-comment",u.placeholder="Describe the issue with this section...",u.rows=4;let p=document.createElement("div");p.className="github-issue-popup-buttons";let m=document.createElement("button");m.className="github-issue-submit",m.textContent="Create Issue on GitHub";let g=document.createElement("button");g.className="github-issue-cancel",g.textContent="Cancel",p.appendChild(m),p.appendChild(g);let f=document.createElement("div");f.className="github-issue-popup-hint";let h=document.createElement("small");return h.textContent="Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit",f.appendChild(h),a.appendChild(s),a.appendChild(c),a.appendChild(d),a.appendChild(u),a.appendChild(p),a.appendChild(f),o.appendChild(i),o.appendChild(a),n.appendChild(o),n}(n,e.textContent||""),document.body.appendChild(o),P.set(e,o),function(e,t,n){let o=[],i=e.querySelector(".github-issue-popup-close");if(i){let t=()=>M(e);i.addEventListener("click",t),o.push(()=>i.removeEventListener("click",t))}let r=e.querySelector(".github-issue-cancel");if(r){let t=()=>M(e);r.addEventListener("click",t),o.push(()=>r.removeEventListener("click",t))}let l=()=>{let o=e.querySelector(".github-issue-title"),i=e.querySelector(".github-issue-comment"),r=o?.value||"",l=i?.value||"",a=function(e,t,n,o,i){let r=window.location.pathname.replace(/^\//,"").replace(/\.html$/,""),l=document.querySelector('meta[property="markdown-path"]'),a=l?l.getAttribute("content"):`${r||"index"}.md`,s="https://github.com/idvorkin/idvorkin.github.io",c=encodeURIComponent(n?`${r||"index"}/${e}: ${n}`:`${r||"index"}/${e}: Issue with ${t}`),d=o||n||`Issue with section: ${t}`,u=i?z(i):"",p=`\u{1F4CD} [${r||"index"}](https://idvorkin.azurewebsites.net/${r})/[${e}](https://idvorkin.azurewebsites.net/${r}/${e}) - [[GitHub]](${s}/blob/main/${a}#${e})`,m=`${p}

## Description

${d}

`;u&&(m+=`## Content Excerpt

#### ${t}

> ${u}

`);let g=encodeURIComponent(m);return`${s}/issues/new?title=${c}&body=${g}`}(n,t.textContent||"",r,l,t);window.open(a,"_blank"),M(e)},a=e.querySelector(".github-issue-submit");a&&(a.addEventListener("click",l),o.push(()=>a.removeEventListener("click",l)));let s=e.querySelector(".github-issue-title"),c=e.querySelector(".github-issue-comment"),d=e=>{(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&(e.preventDefault(),l())};s&&(s.addEventListener("keydown",d),o.push(()=>s.removeEventListener("keydown",d))),c&&(c.addEventListener("keydown",d),o.push(()=>c.removeEventListener("keydown",d)));let u=O.get(t)||[];O.set(t,[...u,...o])}(o,e,n)),o),e)};i.addEventListener("click",s),r.push(()=>i.removeEventListener("click",s));let c=t=>{let n=P.get(e);!n||n.contains(t.target)||t.target===i||i.contains(t.target)||"none"===n.style.display||M(n)},d=setTimeout(()=>{document.addEventListener("click",c,!0),r.push(()=>document.removeEventListener("click",c,!0))},100);r.push(()=>clearTimeout(d)),e.appendChild(o),e.appendChild(i);let u=()=>{o.style.opacity="1",i.style.opacity="1"},p=()=>{o.style.opacity="0",i.style.opacity="0"};e.addEventListener("mouseenter",u),e.addEventListener("mouseleave",p),r.push(()=>{e.removeEventListener("mouseenter",u),e.removeEventListener("mouseleave",p)}),O.set(e,r),H.add(e)}(e,t)}let j=!1;function q(e=0){if("undefined"==typeof document)return;if(console.log("\uD83D\uDDBC️ Enabling image zoom functionality"),void 0===window.GLightbox){if(e<50){console.warn(`\u{26A0}\u{FE0F} GLightbox not found, retrying in 100ms (attempt ${e+1}/50)`),setTimeout(()=>q(e+1),100);return}console.error(`\u{274C} GLightbox failed to load after ${5} seconds, aborting image zoom initialization`);return}let t=document.querySelectorAll("p img, li img, .container img, .post-content img, article img, .markdown-body img, main img");console.log(`\u{1F50D} Found ${t.length} images to process`);let n=0;t.forEach((e,t)=>{if(e.parentElement?.tagName==="A"){console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - already wrapped`);return}if(e.naturalWidth>0&&e.naturalWidth<100&&e.naturalHeight<100){console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - too small (${e.naturalWidth}x${e.naturalHeight})`);return}let o=document.createElement("a");o.href=e.src,o.className="glightbox",o.setAttribute("data-gallery","post-images"),e.alt&&o.setAttribute("data-description",e.alt),e.parentNode?.insertBefore(o,e),o.appendChild(e),n++,console.log(`\u{2705} Processed image ${t+1}: ${e.src.substring(e.src.lastIndexOf("/")+1)}`)});try{window.GLightbox({selector:".glightbox",touchNavigation:!0,loop:!0,autoplayVideos:!0}),n>0?console.log(`\u{1F389} Image zoom enabled for ${n} images`):console.log("ℹ️ No images needed processing, but GLightbox initialized for existing elements")}catch(e){console.error("Error initializing GLightbox:",e)}}"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>q()):setTimeout(()=>q(),500));let U=!0;function G(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");if(0===e.length||0===t.length){console.warn("TOC or toggle elements not found for expand/collapse");return}U?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function W(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function J(e,t){let n=$(`#${e}`);if(0===n.length){console.warn(`Target element #${e} not found for TOC generation`);return}if(n.html(""),0===$("#content-holder").length){console.warn("Content holder not found for TOC generation");return}new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),i=$('<a class="expand-toggle" href="#">Collapse all</a>'),r=$('<a class="back-to-top" href="#">Top of page</a>'),l=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),a=$('<a class="go-to-bottom" href="#">Pin ToC</a>');G(),i.click(e=>{e.preventDefault(),e.stopPropagation(),U=!U,G()}),r.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),l.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),a.click(e=>W()),o.append(i).append(r).append(l),t&&o.append(a),n.append(o)}async function X(e){let t,o,i;try{if(!e){console.log("No backlinks available");return}if(!e[t=new URL(document.URL).pathname]){console.log(`Page ${t} not found in backlinks`);return}if(o=e[t]?.incoming_links,i=e[t]?.outgoing_links,!o&&!i){console.log(`No backlinks for the page ${t}`);return}}catch(e){console.log(`Error processing links: ${e instanceof Error?e.message:String(e)}`);return}let r=$("#links-to-page");if(!r||0===r.length){console.log("No back_link_location");return}r.append(`
<ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#incoming" type="button" role="tab" aria-controls="incoming" aria-selected="true">Links to here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#outgoing" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Link from here</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#graph" type="button" role="tab" aria-controls="outgoing" aria-selected="false">Graph</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active " id="incoming" role="tabpanel" aria-labelledby="incoming-tab"></div>
  <div class="tab-pane fade" id="outgoing" role="tabpanel" aria-labelledby="outgoing-tab"></div>
  <div class="tab-pane fade" id="graph" role="tabpanel" aria-labelledby="outgoing-tab">
    <span> View the graph for: </span>
  </div>
</div>
`);let l=r.find("#incoming"),a=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(o)for(let t of o.sort(a)){let o=e[t];l.append(n(o))}let s=[];for(let t of i)e[t]&&s.push(t);let c=r.find("#outgoing");if(s)for(let t of s.sort(a)){let o=e[t];c.append(n(o))}let d=r.find("#graph"),u=t.replace(/\//g,"");d.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function Q(e,t){let n=e?.attr?e.attr("href"):"unknown";return`<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`}async function K(){let e="__idvorkin_add_link_loader_initialized__";window[e]||(window[e]=!0,X(await s()),function(e){if(!e){console.log("No backlinks data available");return}try{let t=$.makeArray($(".summary-link"));if(!t||0===t.length){console.log("No summary links found");return}for(let n of t){let t=$(n);try{if(!t||!t.attr){console.log("Invalid link element");return}let n=t.attr("href");if(!n){t.html(Q(t,"missing href"));return}if(!e.redirects||!e.url_info){t.html(Q(t,"incomplete backLinks data"));return}if(void 0!==e.redirects[n]&&(n=e.redirects[n]),void 0===e.url_info[n]){t.html(Q(t,"not found in url info"));return}t.html(function(e,t){if(!t)return Q(e,"URL info is undefined");let n=t.url||"#",o=t.title||"Untitled",i=t.description||"No description available",r=`(From:<a href='${n}'> ${o}</a>)`;return`<div>
        <i> ${i}</i> ${r}
    </div>`}(t,e.url_info[n]))}catch(e){t?.html?t.html(Q(t,e)):console.error("Error processing link and unable to display error:",e)}}}catch(e){console.error("Error processing summary links:",e)}}(await Y()))}let V=null;async function Y(){try{if(null!=V)return V;let e=window.location.href.includes("https://idvork.in"),t="";t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json";try{let e=await $.getJSON(t);return e.redirects||(e.redirects={}),e.url_info||(e.url_info={}),V=e}catch(e){return console.error("Error fetching backlinks JSON:",e),{redirects:{},url_info:{}}}}catch(e){return console.error("Error in get_back_links:",e),{redirects:{},url_info:{}}}}function Z(){let e=window.Mousetrap();e.bind("s",e=>void(window.location.href="/")),e.bind("t",e=>W()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n=window.location.port||"4000",o=`http://localhost:${n}`,i=e.includes(t),r=e;r=i?e.replace(t,o):e.replace(/http:\/\/localhost:\d+/,t),window.location.href=r})()),e.bind("a",e=>{location.href="/all"}),e.bind("m",e=>{location.href="/toc"}),e.bind("6",e=>{location.href="/ig66"});let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function ee(){!function(e){for(let[t,n]of Object.entries(e)){let e="undefined"!=typeof $&&$.fn?$(`a[href=${t}]`).first()[0]:document.querySelector(`a[href="${t}"]`);if(!e)return;let o=n.cloneNode(!0);o.children.length>0&&o.children[0].remove(),e.replaceWith(o),n.remove()}}(function(){let e={};for(let t of"undefined"!=typeof $&&$.fn?$("ul").toArray():Array.from(document.querySelectorAll("ul"))){let n=t.firstElementChild;if(!n)continue;let o=n.textContent;o&&o.startsWith("l")&&(Number.isNaN(Number.parseInt(o.substring(1)))||(e[o]=t))}return e}())}function et(){let e="__idvorkin_load_globals_initialized__";window[e]||(window[e]=!0,$(K),$(Z),"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(ee):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",ee):ee()),function(e="recent-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{h(e)}):h(e)}(),document.getElementById("last-modified-posts")&&f(),$(()=>{J("ui-toc",!0),J("ui-toc-affix",!1)}),function(e={}){j||(j=!0,function(){let e="header-copy-link-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=`
    .header-copy-link,
    .header-github-issue {
      opacity: 0;
      margin-left: 0.5rem;
      transition: opacity 0.2s ease;
      cursor: pointer;
      user-select: none;
      font-size: 0.8em;
      color: #6c757d;
      text-decoration: none;
    }
    
    .header-copy-link:hover {
      color: #007bff;
    }
    
    .header-github-issue:hover {
      color: #dc3545;
    }
    
    h1:hover .header-copy-link,
    h2:hover .header-copy-link,
    h3:hover .header-copy-link,
    h4:hover .header-copy-link,
    h5:hover .header-copy-link,
    h6:hover .header-copy-link,
    h1:hover .header-github-issue,
    h2:hover .header-github-issue,
    h3:hover .header-github-issue,
    h4:hover .header-github-issue,
    h5:hover .header-github-issue,
    h6:hover .header-github-issue {
      opacity: 1;
    }
    
    /* Ensure headers have relative positioning for tooltip placement */
    h1, h2, h3, h4, h5, h6 {
      position: relative;
    }
    
    /* GitHub Issue Popup Styles */
    .github-issue-popup {
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 400px;
      max-width: 90vw;
      z-index: 1000;
    }
    
    .github-issue-popup-content {
      padding: 0;
    }
    
    .github-issue-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f6f8fa;
      border-bottom: 1px solid #e1e4e8;
      border-radius: 8px 8px 0 0;
    }
    
    .github-issue-popup-header h4 {
      margin: 0;
      font-size: 14px;
      color: #24292e;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 350px;
    }
    
    .github-issue-popup-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #586069;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .github-issue-popup-close:hover {
      color: #24292e;
    }
    
    .github-issue-popup-body {
      padding: 16px;
    }
    
    .github-issue-popup-body label {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
      font-weight: 600;
      color: #24292e;
    }
    
    .github-issue-title,
    .github-issue-comment {
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 12px;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }
    
    .github-issue-title:focus,
    .github-issue-comment:focus {
      outline: none;
      border-color: #0366d6;
      box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
    }
    
    .github-issue-comment {
      resize: vertical;
      min-height: 80px;
    }
    
    .github-issue-popup-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 12px;
    }
    
    .github-issue-submit,
    .github-issue-cancel {
      padding: 6px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid;
      transition: all 0.2s;
    }
    
    .github-issue-submit {
      background: #2ea44f;
      color: white;
      border-color: #2ea44f;
    }
    
    .github-issue-submit:hover {
      background: #2c974b;
      border-color: #2c974b;
    }
    
    .github-issue-cancel {
      background: #fafbfc;
      color: #24292e;
      border-color: #e1e4e8;
    }
    
    .github-issue-cancel:hover {
      background: #f3f4f6;
      border-color: #c9ced1;
    }
    
    .github-issue-popup-hint {
      margin-top: 8px;
      text-align: center;
      color: #586069;
    }
  `,document.head.appendChild(t)}(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{R(e)}):R(e))}(),q(),function(){console.log("Initializing dev info...");let e=function(){let e=window.__GIT_BRANCH__;return e?(console.log("Branch from global variable:",e),e):(console.log("Branch info not found"),null)}(),t=function(){let e=window.__GIT_PR__;return e&&"number"==typeof e?(console.log("PR from global variable:",e),e):(console.log("PR info not found"),null)}(),n=window.location.port||"80";if(console.log("Dev info - Branch:",e,"PR:",t,"Port:",n),e&&"main"!==e||"4000"!==n){let o=document.createElement("div");o.id="dev-info-banner",o.style.cssText=`
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background-color: #2c2c2c;
      color: white;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;let i="";if(e&&(i+=`<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${e}</code>`),t){e&&(i+=" | ");let n=`https://github.com/idvorkin/idvorkin.github.io/pull/${t}`;i+=`<i class="fas fa-code-pull-request"></i> PR: <a href="${n}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${t}</code></a>`}(e||t)&&n&&(i+=" | "),o.innerHTML=i+=`<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${n}</code>`,document.body.appendChild(o);let r=Number.parseInt(window.getComputedStyle(document.body).paddingTop)||0;document.body.style.paddingTop=`${r+40}px`}}())}function en(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),i=new Date(e.published),r=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][i.getMonth()]} ${i.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!==e.thumbnail?(console.log(e.title),console.log(i),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${r}
      </div>`)):t.append(r),t.html()}function eo(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}l("#random-post",()=>en(o(e))),l("#achievment",()=>en(o(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),l("#random-recent",()=>en(o(e.filter(e=>e.tags.includes("family-journal")))))}function ei(){$.getJSON("/ig66/ig66-export.json",eo)}function er(e){$.getJSON("/eulogy.json",t=>(function(e,t){if(!t){console.log("No roles being imported");return}console.log("Processing",t.roles.length,"roles"),l(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(o(t.roles)))})(e,t))}"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(et):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",et):et());class el{constructor({name:e,value:t=25,children:n=[]}){this.name=e,this.children=i(n),this.value=t}}function ea(e=ec,t=es){let n=e();for(let e of n.keys())t(e,n.get(e))}function es(e,t,n=$,i=l){let r=n('<div class="alert alert-primary" role="alert"/>');n(e).after(r),i(r,()=>`<span>${o(t)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}function ec(e=$){let t=e("h3").first(),n=t,o=[],i=new Map;for(let r=t;0!==r.length;r=e(r).next()){if("H3"===r.prop("tagName")){i.set(n,o),n=r,o=[];continue}"UL"===r.prop("tagName")&&(o=Array.from(e(r).find("li")).map(t=>e(t).text()))}return i.set(n,o),i}function*ed(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function eu(e=ec){return new Map(Array.from(e().entries()).map(([e,t],n)=>[e.text(),t]))}function ep(e,t,n){let i=Array.from(ed(t)).find(([t,n])=>t.name===e);if(!i)return"Click in any box or circle";let[r,l]=i,a=Array.from(ed(r)).map(([e,t])=>e).filter(e=>{let t=n.has(e.name),o=n.has(`${e.name}\u{1F517}`);return t||o}).flatMap(e=>(n.get(e.name)||n.get(`${e.name}\u{1F517}`)||[]).map(t=>`${e.name}: ${t}`));return 0===a.length?"Click in any box or circle":o(a)}async function em(e,t,n,o=$,i=Plotly){if(!i){console.error("Plotly is not available");return}let r=function(e){let t=Array.from(ed(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n),l={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(l,r),l.values=void 0;try{await i.newPlot(e,[l],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1});let r=e=>{o(`#${t}`).text(e)};o(`#${t}`).first().click(()=>{let e=o("#sunburst text:first").text(),t=ep(e,n,eu());r(t)});let a=document.getElementById(e);return a&&"function"==typeof a.on&&a.on("plotly_click",e=>{if(e?.points?.[0]){let t=e.points[0].label,o=ep(t,n,eu());r(o)}}),a}catch(e){return console.error("Failed to create sunburst plot:",e),null}}async function eg(e,t,n="Root",o=null,i=$,r=Plotly){return em(e,t,function(e="Root",t=null,n=$){let o=t?n(t).find("h2"):n("h2"),i=[];return o.each((e,t)=>{let o=n(t),r=o.text().trim();if(!r)return;let l=[],a=o.next();for(;a.length>0&&"H2"!==a.prop("tagName");){if("H3"===a.prop("tagName")){let e=a.text().trim();e&&l.push(new el({name:e}))}a=a.next()}l.length>0&&i.push(new el({name:r,children:l}))}),new el({name:e,children:i})}(n,o,i),i,r)}class ef{get_tree(){return new el({name:"7H ",children:[new el({name:""}),new el({name:"Be Proactive"}),new el({name:"Begin with the end in mind"}),new el({name:"First things First"}),new el({name:"Think Win/Win"}),new el({name:"First Understand"}),new el({name:"Synergize"}),new el({name:"Sharpen the Saw"})]})}}class eh{get_tree(){let e=new el({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new el({name:"Magic",children:[new el({name:"Card Magic"}),new el({name:"Coin Magic"}),new el({name:"Band Magic"})]}),n=new el({name:"Hobbies",children:[new el({name:"Biking"}),new el({name:"Tech"}),new el({name:"Juggling"})]}),o=new el({name:"Relationships",children:[new el({name:"Zach"}),new el({name:"Amelia"}),new el({name:"Tori"}),new el({name:"Friends"})]}),i=new el({name:"Joy",children:[new el({name:"Balloons"}),new el({name:"Joy to Others"})]});return new el({name:"Invest in",children:[e,t,n,o,i]})}}function eb({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,i=`audio_player_${Math.floor(1e10*Math.random())}`,r=e.replace(/\//g,"_");return`
    <div>
        <audio id='${i}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${r}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${i}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function ey(e=s,t=o){try{let n=await e(),o=Object.entries(n).map(e=>e[1]),i=t(o);return eb({url:i.url,title:i.title,description:i.description})}catch(e){return console.error("Error generating random post HTML:",e),"<div>Could not load random post</div>"}}function e$(e="#e1",t="#e2",n="#e3",o=er){try{o(e),o(t),o(n)}catch(e){console.error("Error loading random eulogy:",e)}}function ev(e=em,t=ea,n=ei,o=er,i=l){try{e("sunburst","sunburst_text",new eh().get_tree()),t(),n(),o("#random-eulogy-role"),i("#random-blog-posts",async()=>await ey())}catch(e){console.error("❌ Error loading enjoy page:",e)}}function ew(e=em,t=ea){try{e("sunburst","sunburst_text",new ef().get_tree()),t()}catch(e){console.error("Error loading 7 habits page:",e)}}function ex(e=ei){try{e()}catch(e){console.error("Error loading IG66 page:",e)}}function ek(e=eS,t=eL,n=eC){try{e("balance-heatmap-rest"),t("balance-heatmap-work"),n("balance-radar-map-ideal")}catch(e){console.error("Error loading balance page:",e)}}let e_=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],eE="#00BF00";async function eC(e,t){if(void 0!==t&&t)try{await t.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}catch(e){console.error("Error creating radar map:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eL(e,t){let n=["Tech","Work"],o={height:20*n.length+100,margin:{t:5},pad:0},i=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,eE],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:e_.slice(2,13),y:n,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];if(void 0!==t&&t)try{await t.newPlot(e,i,o,{displayModeBar:!1})}catch(e){console.error("Error creating work balance chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eS(e,t){let n=["Health","Hobbies","Family","Magic"],o=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,eE],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:e_.slice(2,13),y:n.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],i={height:20*n.length+100,margin:{t:5},pad:0};if(void 0!==t&&t)try{await t.newPlot(e,o,i,{displayModeBar:!1})}catch(e){console.error("Error creating rest time chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}function eN(e="Topics",t=eg,n=ea,o=ei,i=er,r=l){try{t("sunburst","sunburst_text",e),n(),o(),i("#random-eulogy-role"),r("#random-blog-posts",async()=>await ey())}catch(e){console.error("Error loading auto-generated sunburst:",e)}}if("undefined"!=typeof window&&window["@algolia/autocomplete-js"]){let n=window["@algolia/autocomplete-js"];e=n.autocomplete,t=n.getAlgoliaResults}function eT(e){let t=document.createElement("div");return t.textContent=e||"",t.innerHTML}function eM(e){if(!e)return!1;if(e.startsWith("/"))return!0;try{let t=new URL(e);return"http:"===t.protocol||"https:"===t.protocol}catch{return!1}}function eI({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;if(e.anchor&&(t+=`#${e.anchor}`),!eM(t))return console.warn("Invalid URL skipped in InstantSearchHitTemplate:",t),"<div>Invalid result</div>";let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,i=n?.content?.value??"";return`
           <span data-url="${eT(t)}" style="cursor: pointer;">
              <b> <a href="${eT(t)}">${o}</a></b> <span>${i}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function eA(){let e=performance.now(),t=await s(),n=performance.now()-e;console.log(`  \u{1F4CA} [get_random_post] Loaded links in ${n.toFixed(0)}ms`);let i=o(Object.entries(t).map(e=>e[1]));return{title:i.title,url:i.url,description:i.description}}async function eD(e=4){let t=performance.now(),n=await s(),o=performance.now()-t;console.log(`  \u{1F4CA} [get_random_posts_batch] Loaded links once in ${o.toFixed(0)}ms`);let i=Object.entries(n).map(e=>e[1]),r=[],l=new Set;for(;r.length<e&&r.length<i.length;){let e=Math.floor(Math.random()*i.length);if(!l.has(e)){l.add(e);let t=i[e];r.push({title:t.title,url:t.url,description:t.description})}}return r}async function ez(e=4){try{let t=performance.now(),n=await s(),o=performance.now()-t;return console.log(`  \u{1F4CA} [get_recent_posts] Loaded links in ${o.toFixed(0)}ms`),Object.entries(n).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function eB(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>{try{return await eA()}catch(e){return console.error("Error getting random post:",e),{url:"",title:"Error",description:"Failed to load post"}}}))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>eM(e.url)?t("div",{dangerouslySetInnerHTML:{__html:`
            <span data-url="${eT(e.url)}" style="cursor: pointer;">
           <b> <a href="${eT(e.url)}">${eT(e.title)}</a></b>
            <span>${eT(e.description)}</span>
            </span>
            `}}):(console.warn("Invalid URL skipped in GetRandomSearchResults:",e.url),t("div",{dangerouslySetInnerHTML:{__html:"<div>Invalid result</div>"}})),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function eF(e=4){return{sourceId:"recent_posts",getItems:async()=>await ez(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>eM(e.url)?t("div",{dangerouslySetInnerHTML:{__html:`
            <span data-url="${eT(e.url)}" style="cursor: pointer;">
           <b> <a href="${eT(e.url)}">${eT(e.title)}</a></b>
            <span>${eT(e.description)}</span>
            </span>
            `}}):(console.warn("Invalid URL skipped in GetRecentSearchResults:",e.url),t("div",{dangerouslySetInnerHTML:{__html:"<div>Invalid result</div>"}})),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function eO(n,o,i,r,l,a=3,s=4,c=3){if(!e){console.error("Autocomplete is not defined");return}let d=algoliasearch(n,o),u=await eB(c),p=await eF(s),m=r.startsWith("#")?r:`#${r}`;if(0===$(m).length){console.log("No autocomplete element found","autocomplete_id",r);return}return e({container:m,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let n=0===e.length;n&&(e=" ");let o=function(e,n,o,i=3,r=!1){let l="NOT tags:family-journal";return r&&(l=""),{sourceId:"featured_posts",getItems:()=>t?t({searchClient:e,queries:[{indexName:n,query:o,filters:l,params:{hitsPerPage:i,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}):(console.error("getAlgoliaResults is not defined"),[]),templates:{item:eI,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(d,i,e,n?a:10,l);return n?[o,p,u]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}$(document).ready(()=>{r(et);let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let t=["item1","item2","item3"];console.log("Random item:",o(t)),console.log("Shuffled items:",i([...t])),s().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{o as random_from_list,i as shuffle,l as append_randomizer_div,r as defer,s as get_link_info,c as get_random_page_url,et as load_globals,n as MakeBackLinkHTML,eO as CreateAutoComplete,eA as get_random_post,ez as get_recent_posts,eD as get_random_posts_batch,f as initRecentAllPosts,ea as add_random_prompts,em as add_sunburst,eg as add_sunburst_from_dom,el as TreeNode,ev as load_enjoy2,ew as load_7_habits,eN as load_auto_sunburst,eb as makePostPreviewHTML,ey as make_random_post_html,ex as load_ig66,ek as load_balance,e$ as load_random_eulogy};
//# sourceMappingURL=index.js.map
