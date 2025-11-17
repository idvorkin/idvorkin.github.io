let e,t;function n(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function o(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function r(e){let t,n=e.length;for(;0!==n;)t=Math.floor(Math.random()*n),n--,[e[n],e[t]]=[e[t],e[n]];return e}function i(e,t){let n=t||e.name||"anonymous function";"loading"===document.readyState?(console.log(`\u{1F550} Deferring ${n} until DOM is ready`),document.addEventListener("DOMContentLoaded",()=>{console.log(`\u{1F680} Executing deferred ${n}`),e()})):(console.log(`\u{26A1} DOM already ready, executing ${n} immediately`),e())}async function a(e,t){let n=$(e);if(1!==n.length)return void console.log(`append_randomizer_div ${e} not present`);let o=$(await t());n.empty().append(o),n.click(async e=>{if("A"!==e.target.tagName){let e=$(await t());n.empty().append(e)}})}let l=null;async function s(e){if(null!=l)return l;let t=(e||window.location.href).includes("https://idvork.in"),n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return l=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function d(){try{let e=await s(),t=Object.keys(e).filter(e=>{let t=["/404","/404.html","/search","/recent","/index.html","/graph","/about","/random"].some(t=>e===t||e.endsWith(t)),n=["/ig66/"].some(t=>e.includes(t));return!t&&!n});if(0===t.length)return"/";return o(t)||"/"}catch(e){return console.error("🚨 Error getting random page URL:",e),"/"}}async function c(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await s(e)}catch(e){throw Error("Missing url_info in data structure")}}async function u(){return[...Object.entries(await c()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}function p(e){let t={};for(let n of e){if(!n.last_modified)continue;let e=new Date(n.last_modified),o=`${e.toLocaleString("default",{month:"long"})} ${e.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(n)}return t}function m(e){let t="";for(let[n,o]of Object.entries(e))t+=`
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
    `;return t}async function g(e="last-modified-posts",t=15,n=document){let o=n.getElementById(e);if(!o)return void console.log(`\u{274C} ${e} container not found in DOM`);try{let e=await u();o.innerHTML=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),r=m(p(n));if(o.length>0){var i,a;r+=(i=m(p(o)),a=o.length,`
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${a} more)
      </h2>
      <div id="remaining-posts-content" class="remaining-content" style="display: none;">
        ${i}
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
  `+r}(e,t),function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);o?o.addEventListener("click",function(){let e=n.getElementById(t);if(!e)return void console.log(`Content element with ID ${t} not found`);let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))}):console.log(`Toggle element with ID ${e} not found`)}("remaining-posts-toggle","remaining-posts-content",n)}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function f(e="last-modified-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{g(e,15,t)}):g(e,15,t)}async function h(e="recent-posts"){let t=document.getElementById(e);if(!t)return void console.error(`\u{274C} ${e} container not found in DOM`);try{var n;let e=await u();n=function(e,t=5){return e.slice(0,t)}(e),t.innerHTML=0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function b(e,t){let n=e.filter(e=>e.url===t)[0];if(n)return n;let o=t.replace(/^\//,"").replace(/\/$/,"");return e.filter(e=>e.url.replace(/^\//,"").replace(/\/$/,"")===o)[0]}function y(e){let t=e.filter(e=>e.expanded);e.find(e=>"/eulogy"===e.url)||console.log("Eulogy node not found in pages");let n=function(e){let t=[];for(let n of e){for(let e of[...n.outgoing_links||[],...n.incoming_links||[]])b(x,e)&&t.push({source:n,target:e,value:1});0===t.filter(e=>e.source===n).length&&"/eulogy"===n.url&&console.log(`No valid links found for ${n.url}`)}return t}(t),o=n.map(t=>b(e,t.target)).filter(e=>e);return{nodes:t.concat(o),links:n}}function v(e,t,n){let o=e.outgoing_links.length,r=e.expanded?"-":`+${o}`,i=`${e.id} [${r}]`,a=12/n;t.font=`${a}px Sans-Serif`;let l=[t.measureText(i).width,a].map(e=>e+.2*a);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-l[0]/2,e.y-l[1]/2,...l),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(i,e.x,e.y),e.__bckgDimensions=l}function w(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}console.log("Load force graph in TS v 0.9");let x=[],k=null,_=null;function E(e){_?e?(_.centerAt(e.x,e.y,500),_.zoom(8,500),C(e)):console.log("Cannot center: Node is null or undefined"):console.log("Cannot center: Graph not initialized")}function C(e){if(!e)return;k=e;let t=n(e),o=document.getElementById("detail");o&&(o.innerHTML=t)}function L(){k?k.url?window.open(k.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}function S(){for(let e of x)e.expanded=!1;k&&(k.expanded=!0),_&&(_.graphData(y(x)),k&&setTimeout(()=>{E(k)},300))}async function N(){if(!document.getElementById("graph"))return void console.log("Graph element not found, exiting initialization");window.location.hash.substr(1),x=Object.values(await s()).map(e=>({...e,id:e.url,expanded:!1}));let e=`/${window.location.hash?window.location.hash.substr(1):""}`,t=x.map(e=>e.url).includes(e)?e:"/eulogy";for(let e of x)e.expanded=e.url===t;if("undefined"==typeof ForceGraph){console.log("Force Graph not defined, providing fallback functionality");let e=b(x,t);e&&(C(e),k=e);let n=document.getElementById("center_control");n&&n.addEventListener("click",()=>{console.log("Center control clicked (fallback mode)")});let o=document.getElementById("goto_control");o&&o.addEventListener("click",()=>{k?.url&&window.open(k.url,"_blank")});let r=document.getElementById("collapse_control");r&&r.addEventListener("click",()=>{console.log("Collapse control clicked (fallback mode)")});return}_=ForceGraph()(document.getElementById("graph")).graphData(y(x)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(v).nodePointerAreaPaint(w).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{e.expanded=!e.expanded,0===x.filter(e=>e.expanded).length&&(e.expanded=!0),_.graphData(y(x)),setTimeout(()=>{E(e)},300)});let n=b(x,t);n?E(n):console.log("Initial node not found, cannot center");let o=document.getElementById("center_control");o?o.addEventListener("click",()=>{k?E(k):console.log("No last detail node to center on")}):console.log("Center control element not found");let r=document.getElementById("goto_control");r&&r.addEventListener("click",L);let i=document.getElementById("collapse_control");i&&i.addEventListener("click",S)}"undefined"!=typeof window&&(window.initializeGraph=N);let T={iconClass:"header-copy-link",tooltipDuration:2e3,domainMapping:{from:"idvork.in/",to:"idvorkin.azurewebsites.net/"}};function M(e){e.style.display="none";let t=e.querySelector(".github-issue-comment");t&&(t.value="")}function I(e){if(!e)return"";let t=(window.location.pathname.replace(/^\//,"").replace(/\.html$/,"")||"index").replace(/-/g," "),n=[],o=Number.parseInt(e.tagName.substring(1)),r=Array.from(e.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim();if(o>=2){let t=e.previousElementSibling,r=[],i=new Set;for(;t;){let e=t.tagName;if(e?.match(/^H[1-6]$/)){let n=Number.parseInt(e.substring(1));if(n<o&&!i.has(n)){let e=Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim();if(e&&(r.push({level:n,text:e}),i.add(n)),1===n)break}}t=t.previousElementSibling}r.sort((e,t)=>e.level-t.level),r.forEach(e=>n.push(e.text))}n.push(r);let i=`[${t}]`;if(n.length>0){let e=n.slice(0,3);i+=`: ${e.join(" > ")}`,n.length>3&&(i+=" ...")}return i}function A(e,t){let n=e;n=n.replace("localhost:4000/","idvorkin.azurewebsites.net/"),t.domainMapping&&(n=n.replace(t.domainMapping.from,t.domainMapping.to));let o=new URL(n),r=o.pathname.replace(/^\//,"").replace(/\.html$/,"")||"index",i=o.hash.replace("#","");return i?`${r}#${i}`:r}async function z(e,t){try{let n=window.location.href,o=n.includes("#")?n.replace(/#.*/,`#${e}`):`${n}#${e}`,r=A(o,t),i=`https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`,a=document.getElementById(e),l=a?Array.from(a.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim():"",s=`${l} - Igor's Blog`,d=D(e),c=I(a),u=`From: ${c} ...`;d&&(u=`From: ${c} ...

${d}`);let p=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);if(navigator.share&&p)try{return await navigator.share({title:s,text:u,url:i}),console.log(`\u{1F4F1} Shared via native share: ${i}`),!0}catch(e){console.log("Share cancelled or failed, falling back to clipboard",e)}let m=i;return d&&(m=`From: ${c} ...

${d}

${i}`),await navigator.clipboard.writeText(m),console.log(`\u{1F4CB} Copied to clipboard with preview: ${m.substring(0,100)}...`),!1}catch(n){console.error("Failed to share/copy header link:",n);try{let n=window.location.href,o=n.includes("#")?n.replace(/#.*/,`#${e}`):`${n}#${e}`,r=A(o,t),i=`https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`,a=document.getElementById(e),l=I(a),s=D(e),d=i;s&&(d=`From: ${l} ...

${s}

${i}`);let c=document.createElement("textarea");return c.value=d,document.body.appendChild(c),c.select(),document.execCommand("copy"),document.body.removeChild(c),console.log(`\u{1F4CB} Copied with preview (fallback): ${d.substring(0,100)}...`),!1}catch(e){throw console.error("Failed to copy URL even with fallback:",e),e}}}function F(e){let t=e.nextElementSibling;for(;t&&!t.tagName.match(/^H[1-6]$/);){if("P"===t.tagName){let e=(t.textContent||"").trim();if(e.length>0)return e.length>500?`${e.substring(0,497)}...`:e}if("UL"===t.tagName||"OL"===t.tagName){let e=t.querySelectorAll("li"),n=[],o=0;for(let t of Array.from(e)){let e=Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE||e.nodeType===Node.ELEMENT_NODE&&"UL"!==e.tagName&&"OL"!==e.tagName).map(e=>(e.textContent||"").trim()).join(" ").trim();if(e.length>0&&(n.push(`\u{2022} ${e}`),(o+=e.length)>400))break}if(n.length>0){let e=n.join("\n");return e.length>500?`${e.substring(0,497)}...`:e}}t=t.nextElementSibling}return""}function B(e,t=400){if(e.length<=t)return e;let n=e.substring(0,t),o=n.lastIndexOf(" ");return o>0?`${n.substring(0,o)}...`:`${n}...`}function D(e){if(e){let t=document.getElementById(e);if(t){let e=F(t);if(e)return B(e);let n=t.nextElementSibling,o=[],r=0;for(;n&&r<400&&!n.tagName.match(/^H[1-6]$/);){if("P"===n.tagName||"LI"===n.tagName||"BLOCKQUOTE"===n.tagName||"DIV"===n.tagName){let e=(n.textContent||"").trim();e.length>0&&(o.push(e),r+=e.length)}n=n.nextElementSibling}if(o.length>0)return B(o.join(" "))}}for(let e of["article","main",".content",".post-content",".entry-content","#content-holder",".content-holder"]){let t=document.querySelector(e);if(t){let e=t.querySelector("p");if(e){let t=(e.textContent||"").trim();if(t.length>0)return B(t)}}}let t=document.querySelector("p");if(t){let e=(t.textContent||"").trim();if(e.length>0)return B(e)}return""}let O=new WeakMap,P=new WeakMap,H=new Set;function R(e={}){let t={...T,...e};for(let e of Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")))!function(e,t){let n;if(e.querySelector(`.${t.iconClass||T.iconClass}`))return;let o=function(e){if(e.id)return e.id;let t=(e.textContent||"").toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""),n=t,o=1;for(;document.getElementById(n);)n=`${t}-${o}`,o++;return e.id=n,n}(e),r=((n=document.createElement("span")).className=t.iconClass||T.iconClass||"",n.title="Share this section",n.style.cursor="pointer",n.style.marginLeft="0.5rem",n.style.opacity="0",n.style.transition="opacity 0.2s ease",n.style.fontSize="0.8em",n.style.userSelect="none",n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-label","Share this section"),n.innerHTML=`<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`,n),i=function(){let e=document.createElement("span");if(e.className="header-github-issue",e.title="Create GitHub issue for this section",e.style.cursor="pointer",e.style.marginLeft="0.5rem",e.style.opacity="0",e.style.transition="opacity 0.2s ease",e.style.fontSize="0.8em",e.style.userSelect="none",e.setAttribute("role","button"),e.setAttribute("tabindex","0"),e.setAttribute("aria-label","Create GitHub issue for this section"),document.querySelector('link[href*="font-awesome"]')||document.querySelector('script[src*="font-awesome"]')||document.querySelector(".fa, .fab, .fas, .far")||Array.from(document.styleSheets).some(e=>{try{return e.href?.includes("font-awesome")}catch(e){return!1}})){let t=document.createElement("i");t.className="fab fa-github",e.appendChild(t)}else e.textContent="⚠️";return e}(),a=[],l=async e=>{e.preventDefault(),e.stopPropagation(),await z(o,t)||function(e,t=2e3){if("undefined"!=typeof document&&document.querySelector){let e=document.querySelector(".copy-link-tooltip");e&&e.remove()}let n=document.createElement("span");n.className="copy-link-tooltip",n.textContent="Copied!",n.style.position="absolute",n.style.backgroundColor="#333",n.style.color="white",n.style.padding="4px 8px",n.style.borderRadius="4px",n.style.fontSize="12px",n.style.zIndex="1000",n.style.marginLeft="10px",n.style.marginTop="-5px",e.parentElement?.appendChild(n),setTimeout(()=>{n.remove()},t)}(r,t.tooltipDuration)};r.addEventListener("click",l),a.push(()=>r.removeEventListener("click",l));let s=e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),l(e))};r.addEventListener("keydown",s),a.push(()=>r.removeEventListener("keydown",s));let d=t=>{var n;let r,i,a,l;t.preventDefault(),t.stopPropagation(),n=function(e,t){let n=P.get(e);if(!n){var o;let r,i,a,l,s,d,c,u,p,m,g,f,h,b,y;o=e.textContent||"",(r=document.createElement("div")).className="github-issue-popup",r.style.display="none",r.id=`github-issue-popup-${t}`,(i=document.createElement("div")).className="github-issue-popup-content",(a=document.createElement("div")).className="github-issue-popup-header",(l=document.createElement("h4")).textContent=`Report Issue: ${o}`,(s=document.createElement("button")).className="github-issue-popup-close",s.title="Close",s.textContent="×",a.appendChild(l),a.appendChild(s),(d=document.createElement("div")).className="github-issue-popup-body",(c=document.createElement("label")).setAttribute("for",`issue-title-${t}`),c.textContent="Issue Title:",(u=document.createElement("input")).type="text",u.id=`issue-title-${t}`,u.className="github-issue-title",u.placeholder="Brief title for the issue",(p=document.createElement("label")).setAttribute("for",`issue-comment-${t}`),p.textContent="Description:",(m=document.createElement("textarea")).id=`issue-comment-${t}`,m.className="github-issue-comment",m.placeholder="Describe the issue with this section...",m.rows=4,(g=document.createElement("div")).className="github-issue-popup-buttons",(f=document.createElement("button")).className="github-issue-submit",f.textContent="Create Issue on GitHub",(h=document.createElement("button")).className="github-issue-cancel",h.textContent="Cancel",g.appendChild(f),g.appendChild(h),(b=document.createElement("div")).className="github-issue-popup-hint",(y=document.createElement("small")).textContent="Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit",b.appendChild(y),d.appendChild(c),d.appendChild(u),d.appendChild(p),d.appendChild(m),d.appendChild(g),d.appendChild(b),i.appendChild(a),i.appendChild(d),r.appendChild(i),n=r,document.body.appendChild(n),P.set(e,n),function(e,t,n){let o=[],r=e.querySelector(".github-issue-popup-close");if(r){let t=()=>M(e);r.addEventListener("click",t),o.push(()=>r.removeEventListener("click",t))}let i=e.querySelector(".github-issue-cancel");if(i){let t=()=>M(e);i.addEventListener("click",t),o.push(()=>i.removeEventListener("click",t))}let a=()=>{var o;let r,i,a,l,s,d,c,u,p,m,g=e.querySelector(".github-issue-title"),f=e.querySelector(".github-issue-comment"),h=g?.value||"",b=f?.value||"",y=(o=t.textContent||"",r=window.location.pathname.replace(/^\//,"").replace(/\.html$/,""),a=(i=document.querySelector('meta[property="markdown-path"]'))?i.getAttribute("content"):`${r||"index"}.md`,l="https://github.com/idvorkin/idvorkin.github.io",s=encodeURIComponent(h?`${r||"index"}/${n}: ${h}`:`${r||"index"}/${n}: Issue with ${o}`),d=b||h||`Issue with section: ${o}`,c=t?F(t):"",u=`\u{1F4CD} [${r||"index"}](https://idvorkin.azurewebsites.net/${r})/[${n}](https://idvorkin.azurewebsites.net/${r}/${n}) - [[GitHub]](${l}/blob/main/${a}#${n})`,p=`${u}

## Description

${d}

`,c&&(p+=`## Content Excerpt

#### ${o}

> ${c}

`),m=encodeURIComponent(p),`${l}/issues/new?title=${s}&body=${m}`);window.open(y,"_blank"),M(e)},l=e.querySelector(".github-issue-submit");l&&(l.addEventListener("click",a),o.push(()=>l.removeEventListener("click",a)));let s=e.querySelector(".github-issue-title"),d=e.querySelector(".github-issue-comment"),c=e=>{(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&(e.preventDefault(),a())};s&&(s.addEventListener("keydown",c),o.push(()=>s.removeEventListener("keydown",c))),d&&(d.addEventListener("keydown",c),o.push(()=>d.removeEventListener("keydown",c)));let u=O.get(t)||[];O.set(t,[...u,...o])}(n,e,t)}return n}(e,o),document.querySelectorAll(".github-issue-popup").forEach(e=>{e.style.display="none"}),n.style.display="block",n.style.position="absolute",n.style.zIndex="1000",r=e.getBoundingClientRect(),i=window.pageYOffset||document.documentElement.scrollTop,a=window.pageXOffset||document.documentElement.scrollLeft,n.style.top=`${r.bottom+i+10}px`,n.style.left=`${r.left+a}px`,(l=n.querySelector(".github-issue-title"))&&l.focus()};i.addEventListener("click",d),a.push(()=>i.removeEventListener("click",d));let c=t=>{let n=P.get(e);!n||n.contains(t.target)||t.target===i||i.contains(t.target)||"none"===n.style.display||M(n)},u=setTimeout(()=>{document.addEventListener("click",c,!0),a.push(()=>document.removeEventListener("click",c,!0))},100);a.push(()=>clearTimeout(u)),e.appendChild(r),e.appendChild(i);let p=()=>{r.style.opacity="1",i.style.opacity="1"},m=()=>{r.style.opacity="0",i.style.opacity="0"};e.addEventListener("mouseenter",p),e.addEventListener("mouseleave",m),a.push(()=>{e.removeEventListener("mouseenter",p),e.removeEventListener("mouseleave",m)}),O.set(e,a),H.add(e)}(e,t)}let j=!1;function q(e=0){if("undefined"==typeof document)return;if(console.log("🖼️ Enabling image zoom functionality"),void 0===window.GLightbox){if(e<50){console.warn(`\u{26A0}\u{FE0F} GLightbox not found, retrying in 100ms (attempt ${e+1}/50)`),setTimeout(()=>q(e+1),100);return}console.error(`\u{274C} GLightbox failed to load after ${5} seconds, aborting image zoom initialization`);return}let t=document.querySelectorAll("p img, li img, .container img, .post-content img, article img, .markdown-body img, main img");console.log(`\u{1F50D} Found ${t.length} images to process`);let n=0;t.forEach((e,t)=>{if(e.parentElement?.tagName==="A")return void console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - already wrapped`);if(e.naturalWidth>0&&e.naturalWidth<100&&e.naturalHeight<100)return void console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - too small (${e.naturalWidth}x${e.naturalHeight})`);let o=document.createElement("a");o.href=e.src,o.className="glightbox",o.setAttribute("data-gallery","post-images"),e.alt&&o.setAttribute("data-description",e.alt),e.parentNode?.insertBefore(o,e),o.appendChild(e),n++,console.log(`\u{2705} Processed image ${t+1}: ${e.src.substring(e.src.lastIndexOf("/")+1)}`)});try{window.GLightbox({selector:".glightbox",touchNavigation:!0,loop:!0,autoplayVideos:!0}),n>0?console.log(`\u{1F389} Image zoom enabled for ${n} images`):console.log("ℹ️ No images needed processing, but GLightbox initialized for existing elements")}catch(e){console.error("Error initializing GLightbox:",e)}}"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>q()):setTimeout(()=>q(),500));let U=!0;function G(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");0===e.length||0===t.length?console.warn("TOC or toggle elements not found for expand/collapse"):U?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function W(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function J(e,t){let n=$(`#${e}`);if(0===n.length)return void console.warn(`Target element #${e} not found for TOC generation`);if(n.html(""),0===$("#content-holder").length)return void console.warn("Content holder not found for TOC generation");new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),r=$('<a class="expand-toggle" href="#">Collapse all</a>'),i=$('<a class="back-to-top" href="#">Top of page</a>'),a=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),l=$('<a class="go-to-bottom" href="#">Pin ToC</a>');G(),r.click(e=>{e.preventDefault(),e.stopPropagation(),U=!U,G()}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),a.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),l.click(e=>W()),o.append(r).append(i).append(a),t&&o.append(l),n.append(o)}async function X(e){let t,o,r;try{if(!e)return void console.log("No backlinks available");if(!e[t=new URL(document.URL).pathname])return void console.log(`Page ${t} not found in backlinks`);if(o=e[t]?.incoming_links,r=e[t]?.outgoing_links,!o&&!r)return void console.log(`No backlinks for the page ${t}`)}catch(e){console.log(`Error processing links: ${e instanceof Error?e.message:String(e)}`);return}let i=$("#links-to-page");if(!i||0===i.length)return void console.log("No back_link_location");i.append(`
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
`);let a=i.find("#incoming"),l=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(o)for(let t of o.sort(l)){let o=e[t];a.append(n(o))}let s=[];for(let t of r)e[t]&&s.push(t);let d=i.find("#outgoing");if(s)for(let t of s.sort(l)){let o=e[t];d.append(n(o))}let c=i.find("#graph"),u=t.replace(/\//g,"");c.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function Q(e,t){let n=e?.attr?e.attr("href"):"unknown";return`<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`}async function K(){let e="__idvorkin_add_link_loader_initialized__";window[e]||(window[e]=!0,X(await s()),function(e){if(!e)return console.log("No backlinks data available");try{let t=$.makeArray($(".summary-link"));if(!t||0===t.length)return void console.log("No summary links found");for(let n of t){let t=$(n);try{if(!t||!t.attr)return void console.log("Invalid link element");let n=t.attr("href");if(!n)return void t.html(Q(t,"missing href"));if(!e.redirects||!e.url_info)return void t.html(Q(t,"incomplete backLinks data"));if(void 0!==e.redirects[n]&&(n=e.redirects[n]),void 0===e.url_info[n])return void t.html(Q(t,"not found in url info"));t.html(function(e,t){if(!t)return Q(e,"URL info is undefined");let n=t.url||"#",o=t.title||"Untitled",r=t.description||"No description available",i=`(From:<a href='${n}'> ${o}</a>)`;return`<div>
        <i> ${r}</i> ${i}
    </div>`}(t,e.url_info[n]))}catch(e){t?.html?t.html(Q(t,e)):console.error("Error processing link and unable to display error:",e)}}}catch(e){console.error("Error processing summary links:",e)}}(await Y()))}let V=null;async function Y(){try{if(null!=V)return V;let e=window.location.href.includes("https://idvork.in"),t="";t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json";try{let e=await $.getJSON(t);return e.redirects||(e.redirects={}),e.url_info||(e.url_info={}),V=e}catch(e){return console.error("Error fetching backlinks JSON:",e),{redirects:{},url_info:{}}}}catch(e){return console.error("Error in get_back_links:",e),{redirects:{},url_info:{}}}}function Z(){let e=window.Mousetrap();e.bind("s",e=>void(window.location.href="/")),e.bind("t",e=>W()),e.bind("p",e=>{let t,n,o,r,i,a;return t=window.location.href,n="https://idvork.in",o=window.location.port||"4000",r=`http://localhost:${o}`,i=t.includes(n),a=t,void(a=i?t.replace(n,r):t.replace(/http:\/\/localhost:\d+/,n),window.location.href=a)}),e.bind("a",e=>{location.href="/all"}),e.bind("m",e=>{location.href="/toc"}),e.bind("6",e=>{location.href="/ig66"});let t=`
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
  `,document.head.appendChild(t)}(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{R(e)}):R(e))}(),q(),function(){let e,t;console.log("Initializing dev info...");let n=(e=window.__GIT_BRANCH__)?(console.log("Branch from global variable:",e),e):(console.log("Branch info not found"),null),o=(t=window.__GIT_PR__)&&"number"==typeof t?(console.log("PR from global variable:",t),t):(console.log("PR info not found"),null),r=window.location.port||"80";if(console.log("Dev info - Branch:",n,"PR:",o,"Port:",r),(n||o)&&"80"!==r&&"443"!==r){let e=document.createElement("div");e.id="dev-info-banner",e.style.cssText=`
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
    `;let t="";if(n&&(t+=`<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${n}</code>`),o){n&&(t+=" | ");let e=`https://github.com/idvorkin/idvorkin.github.io/pull/${o}`;t+=`<i class="fas fa-code-pull-request"></i> PR: <a href="${e}" target="_blank" style="color: #58a6ff; text-decoration: none;"><code style="background: black; color: #58a6ff; padding: 2px 6px; border-radius: 3px;">#${o}</code></a>`}(n||o)&&r&&(t+=" | "),e.innerHTML=t+=`<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${r}</code>`,document.body.appendChild(e);let i=Number.parseInt(window.getComputedStyle(document.body).paddingTop)||0;document.body.style.paddingTop=`${i+40}px`}}())}function en(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),r=new Date(e.published),i=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][r.getMonth()]} ${r.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!==e.thumbnail?(console.log(e.title),console.log(r),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${i}
      </div>`)):t.append(i),t.html()}function eo(e){(console.log("Processing",e.length,"posts"),e)?(a("#random-post",()=>en(o(e))),a("#achievment",()=>en(o(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),a("#random-recent",()=>en(o(e.filter(e=>e.tags.includes("family-journal")))))):console.log("No posts being imported")}function er(){$.getJSON("/ig66/ig66-export.json",eo)}function ei(e){$.getJSON("/eulogy.json",t=>{!t?console.log("No roles being imported"):(console.log("Processing",t.roles.length,"roles"),a(e,()=>{var e;let n,r,i;return n=(e=o(t.roles)).title.replace(/ /g,"%20"),i=(r=["igor","ammon"])[Math.floor(Math.random()*r.length)],`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${i}/${n}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `}))})}"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(et):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",et):et());class ea{constructor({name:e,value:t=25,children:n=[]}){this.name=e,this.children=r(n),this.value=t}}function el(e=ed,t=es){let n=e();for(let e of n.keys())t(e,n.get(e))}function es(e,t,n=$,r=a){let i=n('<div class="alert alert-primary" role="alert"/>');n(e).after(i),r(i,()=>`<span>${o(t)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}function ed(e=$){let t=e("h3").first(),n=t,o=[],r=new Map;for(let i=t;0!==i.length;i=e(i).next()){if("H3"===i.prop("tagName")){r.set(n,o),n=i,o=[];continue}"UL"===i.prop("tagName")&&(o=Array.from(e(i).find("li")).map(t=>e(t).text()))}return r.set(n,o),r}function*ec(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function eu(e=ed){return new Map(Array.from(e().entries()).map(([e,t],n)=>[e.text(),t]))}function ep(e,t,n){let r=Array.from(ec(t)).find(([t,n])=>t.name===e);if(!r)return"Click in any box or circle";let[i,a]=r,l=Array.from(ec(i)).map(([e,t])=>e).filter(e=>{let t=n.has(e.name),o=n.has(`${e.name}\u{1F517}`);return t||o}).flatMap(e=>(n.get(e.name)||n.get(`${e.name}\u{1F517}`)||[]).map(t=>`${e.name}: ${t}`));return 0===l.length?"Click in any box or circle":o(l)}async function em(e,t,n,o=$,r=Plotly){let i;if(!r)return void console.error("Plotly is not available");let a={ids:(i=Array.from(ec(n)).map(([e,t])=>[e.name,t?.name])).map(([e,t])=>e),labels:i.map(([e,t])=>e),parents:i.map(([e,t])=>t)},l={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(l,a),l.values=void 0;try{await r.newPlot(e,[l],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1});let i=e=>{o(`#${t}`).text(e)};o(`#${t}`).first().click(()=>{let e=o("#sunburst text:first").text(),t=ep(e,n,eu());i(t)});let a=document.getElementById(e);return a&&"function"==typeof a.on&&a.on("plotly_click",e=>{if(e?.points?.[0]){let t=e.points[0].label,o=ep(t,n,eu());i(o)}}),a}catch(e){return console.error("Failed to create sunburst plot:",e),null}}async function eg(e,t,n="Root",o=null,r=$,i=Plotly){return em(e,t,function(e="Root",t=null,n=$){let o=t?n(t).find("h2"):n("h2"),r=[];return o.each((e,t)=>{let o=n(t),i=o.text().trim();if(!i)return;let a=[],l=o.next();for(;l.length>0&&"H2"!==l.prop("tagName");){if("H3"===l.prop("tagName")){let e=l.text().trim();e&&a.push(new ea({name:e}))}l=l.next()}a.length>0&&r.push(new ea({name:i,children:a}))}),new ea({name:e,children:r})}(n,o,r),r,i)}class ef{get_tree(){return new ea({name:"7H ",children:[new ea({name:""}),new ea({name:"Be Proactive"}),new ea({name:"Begin with the end in mind"}),new ea({name:"First things First"}),new ea({name:"Think Win/Win"}),new ea({name:"First Understand"}),new ea({name:"Synergize"}),new ea({name:"Sharpen the Saw"})]})}}class eh{get_tree(){let e=new ea({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new ea({name:"Magic",children:[new ea({name:"Card Magic"}),new ea({name:"Coin Magic"}),new ea({name:"Band Magic"})]}),n=new ea({name:"Hobbies",children:[new ea({name:"Biking"}),new ea({name:"Tech"}),new ea({name:"Juggling"})]}),o=new ea({name:"Relationships",children:[new ea({name:"Zach"}),new ea({name:"Amelia"}),new ea({name:"Tori"}),new ea({name:"Friends"})]}),r=new ea({name:"Joy",children:[new ea({name:"Balloons"}),new ea({name:"Joy to Others"})]});return new ea({name:"Invest in",children:[e,t,n,o,r]})}}function eb({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,r=`audio_player_${Math.floor(1e10*Math.random())}`,i=e.replace(/\//g,"_");return`
    <div>
        <audio id='${r}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${r}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function ey(e=s,t=o){try{let n=await e(),o=Object.entries(n).map(e=>e[1]),r=t(o);return eb({url:r.url,title:r.title,description:r.description})}catch(e){return console.error("Error generating random post HTML:",e),"<div>Could not load random post</div>"}}function e$(e="#e1",t="#e2",n="#e3",o=ei){try{o(e),o(t),o(n)}catch(e){console.error("Error loading random eulogy:",e)}}function ev(e=em,t=el,n=er,o=ei,r=a){try{e("sunburst","sunburst_text",new eh().get_tree()),t(),n(),o("#random-eulogy-role"),r("#random-blog-posts",async()=>await ey())}catch(e){console.error("❌ Error loading enjoy page:",e)}}function ew(e=em,t=el){try{e("sunburst","sunburst_text",new ef().get_tree()),t()}catch(e){console.error("Error loading 7 habits page:",e)}}function ex(e=er){try{e()}catch(e){console.error("Error loading IG66 page:",e)}}function ek(e=eS,t=eL,n=eC){try{e("balance-heatmap-rest"),t("balance-heatmap-work"),n("balance-radar-map-ideal")}catch(e){console.error("Error loading balance page:",e)}}let e_=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],eE="#00BF00";async function eC(e,t){if(void 0!==t&&t)try{await t.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}catch(e){console.error("Error creating radar map:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eL(e,t){let n=["Tech","Work"],o={height:20*n.length+100,margin:{t:5},pad:0},r=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,eE],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:e_.slice(2,13),y:n,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];if(void 0!==t&&t)try{await t.newPlot(e,r,o,{displayModeBar:!1})}catch(e){console.error("Error creating work balance chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eS(e,t){let n=["Health","Hobbies","Family","Magic"],o=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,eE],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:e_.slice(2,13),y:n.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],r={height:20*n.length+100,margin:{t:5},pad:0};if(void 0!==t&&t)try{await t.newPlot(e,o,r,{displayModeBar:!1})}catch(e){console.error("Error creating rest time chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}function eN(e="Topics",t=eg,n=el,o=er,r=ei,i=a){try{t("sunburst","sunburst_text",e),n(),o(),r("#random-eulogy-role"),i("#random-blog-posts",async()=>await ey())}catch(e){console.error("Error loading auto-generated sunburst:",e)}}if("undefined"!=typeof window&&window["@algolia/autocomplete-js"]){let n=window["@algolia/autocomplete-js"];e=n.autocomplete,t=n.getAlgoliaResults}function eT(e){let t=document.createElement("div");return t.textContent=e||"",t.innerHTML}function eM(e){if(!e)return!1;if(e.startsWith("/"))return!0;try{let t=new URL(e);return"http:"===t.protocol||"https:"===t.protocol}catch{return!1}}function eI({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;if(e.anchor&&(t+=`#${e.anchor}`),!eM(t))return console.warn("Invalid URL skipped in InstantSearchHitTemplate:",t),"<div>Invalid result</div>";let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,r=n?.content?.value??"";return`
           <span data-url="${eT(t)}" style="cursor: pointer;">
              <b> <a href="${eT(t)}">${o}</a></b> <span>${r}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function eA(){let e=performance.now(),t=await s(),n=performance.now()-e;console.log(`  \u{1F4CA} [get_random_post] Loaded links in ${n.toFixed(0)}ms`);let r=o(Object.entries(t).map(e=>e[1]));return{title:r.title,url:r.url,description:r.description}}async function ez(e=4){let t=performance.now(),n=await s(),o=performance.now()-t;console.log(`  \u{1F4CA} [get_random_posts_batch] Loaded links once in ${o.toFixed(0)}ms`);let r=Object.entries(n).map(e=>e[1]),i=[],a=new Set;for(;i.length<e&&i.length<r.length;){let e=Math.floor(Math.random()*r.length);if(!a.has(e)){a.add(e);let t=r[e];i.push({title:t.title,url:t.url,description:t.description})}}return i}async function eF(e=4){try{let t=performance.now(),n=await s(),o=performance.now()-t;return console.log(`  \u{1F4CA} [get_recent_posts] Loaded links in ${o.toFixed(0)}ms`),Object.entries(n).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function eB(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>{try{return await eA()}catch(e){return console.error("Error getting random post:",e),{url:"",title:"Error",description:"Failed to load post"}}}))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>eM(e.url)?t("div",{dangerouslySetInnerHTML:{__html:`
            <span data-url="${eT(e.url)}" style="cursor: pointer;">
           <b> <a href="${eT(e.url)}">${eT(e.title)}</a></b>
            <span>${eT(e.description)}</span>
            </span>
            `}}):(console.warn("Invalid URL skipped in GetRandomSearchResults:",e.url),t("div",{dangerouslySetInnerHTML:{__html:"<div>Invalid result</div>"}})),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function eD(e=4){return{sourceId:"recent_posts",getItems:async()=>await eF(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>eM(e.url)?t("div",{dangerouslySetInnerHTML:{__html:`
            <span data-url="${eT(e.url)}" style="cursor: pointer;">
           <b> <a href="${eT(e.url)}">${eT(e.title)}</a></b>
            <span>${eT(e.description)}</span>
            </span>
            `}}):(console.warn("Invalid URL skipped in GetRecentSearchResults:",e.url),t("div",{dangerouslySetInnerHTML:{__html:"<div>Invalid result</div>"}})),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function eO(n,o,r,i,a,l=3,s=4,d=3){if(!e)return void console.error("Autocomplete is not defined");let c=algoliasearch(n,o),u=await eB(d),p=await eD(s),m=i.startsWith("#")?i:`#${i}`;return 0===$(m).length?void console.log("No autocomplete element found","autocomplete_id",i):e({container:m,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let n=0===e.length;n&&(e=" ");let o=function(e,n,o,r=3,i=!1){let a="NOT tags:family-journal";return i&&(a=""),{sourceId:"featured_posts",getItems:()=>t?t({searchClient:e,queries:[{indexName:n,query:o,filters:a,params:{hitsPerPage:r,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}):(console.error("getAlgoliaResults is not defined"),[]),templates:{item:eI,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(c,r,e,n?l:10,a);return n?[o,p,u]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}$(document).ready(()=>{i(et);"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>{let e;(e=$("#search-box")).length>0&&e.focus()}),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let e=["item1","item2","item3"];console.log("Random item:",o(e)),console.log("Shuffled items:",r([...e])),s().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{o as random_from_list,r as shuffle,a as append_randomizer_div,i as defer,s as get_link_info,d as get_random_page_url,et as load_globals,n as MakeBackLinkHTML,eO as CreateAutoComplete,eA as get_random_post,eF as get_recent_posts,ez as get_random_posts_batch,f as initRecentAllPosts,el as add_random_prompts,em as add_sunburst,eg as add_sunburst_from_dom,ea as TreeNode,ev as load_enjoy2,ew as load_7_habits,eN as load_auto_sunburst,eb as makePostPreviewHTML,ey as make_random_post_html,ex as load_ig66,ek as load_balance,e$ as load_random_eulogy};
//# sourceMappingURL=index.js.map
