let e,t;function n(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function o(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function r(e){let t,n=e.length;for(;0!==n;)t=Math.floor(Math.random()*n),n--,[e[n],e[t]]=[e[t],e[n]];return e}function i(e,t){let n=t||e.name||"anonymous function";"loading"===document.readyState?(console.log(`\u{1F550} Deferring ${n} until DOM is ready`),document.addEventListener("DOMContentLoaded",()=>{console.log(`\u{1F680} Executing deferred ${n}`),e()})):(console.log(`\u{26A1} DOM already ready, executing ${n} immediately`),e())}async function a(e,t){let n=$(e);if(1!==n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async e=>{if("A"!==e.target.tagName){let e=$(await t());n.empty().append(e)}})}let l=null;async function s(e){if(null!=l)return l;let t=(e||window.location.href).includes("https://idvork.in"),n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return l=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function c(){try{let e=await s(),t=Object.keys(e).filter(e=>{let t=["/404","/404.html","/search","/recent","/index.html","/graph","/about","/random"].some(t=>e===t||e.endsWith(t)),n=["/ig66/"].some(t=>e.includes(t));return!t&&!n});if(0===t.length)return"/";return o(t)||"/"}catch(e){return console.error("\uD83D\uDEA8 Error getting random page URL:",e),"/"}}async function d(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await s(e)}catch(e){throw Error("Missing url_info in data structure")}}async function u(){return[...Object.entries(await d()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}function p(e){let t={};for(let n of e){if(!n.last_modified)continue;let e=new Date(n.last_modified),o=`${e.toLocaleString("default",{month:"long"})} ${e.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(n)}return t}function m(e){let t="";for(let[n,o]of Object.entries(e))t+=`
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
    `;return t}async function g(e="last-modified-posts",t=15,n=document){let o=n.getElementById(e);if(!o){console.log(`\u{274C} ${e} container not found in DOM`);return}try{let e=await u();o.innerHTML=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),r=m(p(n));if(o.length>0){var i,a;r+=(i=m(p(o)),a=o.length,`
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
  `+r}(e,t),function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);if(!o){console.log(`Toggle element with ID ${e} not found`);return}o.addEventListener("click",function(){let e=n.getElementById(t);if(!e){console.log(`Content element with ID ${t} not found`);return}let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))})}("remaining-posts-toggle","remaining-posts-content",n)}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function f(e="last-modified-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{g(e,15,t)}):g(e,15,t)}async function h(e="recent-posts"){let t=document.getElementById(e);if(!t){console.error(`\u{274C} ${e} container not found in DOM`);return}try{var n;let e=await u();n=function(e,t=5){return e.slice(0,t)}(e),t.innerHTML=0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function b(e,t){let n=e.filter(e=>e.url===t)[0];if(n)return n;let o=t.replace(/^\//,"").replace(/\/$/,"");return e.filter(e=>e.url.replace(/^\//,"").replace(/\/$/,"")===o)[0]}function y(e){let t=e.filter(e=>e.expanded);e.find(e=>"/eulogy"===e.url)||console.log("Eulogy node not found in pages");let n=function(e){let t=[];for(let n of e){for(let e of[...n.outgoing_links||[],...n.incoming_links||[]])b(x,e)&&t.push({source:n,target:e,value:1});0===t.filter(e=>e.source===n).length&&"/eulogy"===n.url&&console.log(`No valid links found for ${n.url}`)}return t}(t),o=n.map(t=>b(e,t.target)).filter(e=>e);return{nodes:t.concat(o),links:n}}function w(e,t,n){let o=e.outgoing_links.length,r=e.expanded?"-":`+${o}`,i=`${e.id} [${r}]`,a=12/n;t.font=`${a}px Sans-Serif`;let l=[t.measureText(i).width,a].map(e=>e+.2*a);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-l[0]/2,e.y-l[1]/2,...l),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(i,e.x,e.y),e.__bckgDimensions=l}function v(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}console.log("Load force graph in TS v 0.9");let x=[],k=null,E=null;function C(e){if(!E){console.log("Cannot center: Graph not initialized");return}if(!e){console.log("Cannot center: Node is null or undefined");return}E.centerAt(e.x,e.y,500),E.zoom(8,500),_(e)}function _(e){if(!e)return;k=e;let t=n(e),o=document.getElementById("detail");o&&(o.innerHTML=t)}function L(){k?k.url?window.open(k.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}function S(){for(let e of x)e.expanded=!1;k&&(k.expanded=!0),E&&(E.graphData(y(x)),k&&setTimeout(()=>{C(k)},300))}async function N(){if(!document.getElementById("graph")){console.log("Graph element not found, exiting initialization");return}window.location.hash.substr(1),x=Object.values(await s()).map(e=>({...e,id:e.url,expanded:!1}));let e=`/${window.location.hash?window.location.hash.substr(1):""}`,t=x.map(e=>e.url).includes(e)?e:"/eulogy";for(let e of x)e.expanded=e.url===t;if("undefined"==typeof ForceGraph){console.log("Force Graph not defined, providing fallback functionality");let e=b(x,t);e&&(_(e),k=e);let n=document.getElementById("center_control");n&&n.addEventListener("click",()=>{console.log("Center control clicked (fallback mode)")});let o=document.getElementById("goto_control");o&&o.addEventListener("click",()=>{k?.url&&window.open(k.url,"_blank")});let r=document.getElementById("collapse_control");r&&r.addEventListener("click",()=>{console.log("Collapse control clicked (fallback mode)")});return}E=ForceGraph()(document.getElementById("graph")).graphData(y(x)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(w).nodePointerAreaPaint(v).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{e.expanded=!e.expanded,0===x.filter(e=>e.expanded).length&&(e.expanded=!0),E.graphData(y(x)),setTimeout(()=>{C(e)},300)});let n=b(x,t);n?C(n):console.log("Initial node not found, cannot center");let o=document.getElementById("center_control");o?o.addEventListener("click",()=>{k?C(k):console.log("No last detail node to center on")}):console.log("Center control element not found");let r=document.getElementById("goto_control");r&&r.addEventListener("click",L);let i=document.getElementById("collapse_control");i&&i.addEventListener("click",S)}"undefined"!=typeof window&&(window.initializeGraph=N);let T={iconClass:"header-copy-link",tooltipDuration:2e3,domainMapping:{from:"idvork.in/",to:"idvorkin.azurewebsites.net/"}};function D(e){e.style.display="none";let t=e.querySelector(".github-issue-comment");t&&(t.value="")}function M(e){if(!e)return"";let t=(window.location.pathname.replace(/^\//,"").replace(/\.html$/,"")||"index").replace(/-/g," "),n=[],o=parseInt(e.tagName.substring(1)),r=Array.from(e.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim();if(o>=2){let t=e.previousElementSibling,r=[],i=new Set;for(;t;){let e=t.tagName;if(e&&e.match(/^H[1-6]$/)){let n=parseInt(e.substring(1));if(n<o&&!i.has(n)){let e=Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim();if(e&&(r.push({level:n,text:e}),i.add(n)),1===n)break}}t=t.previousElementSibling}r.sort((e,t)=>e.level-t.level),r.forEach(e=>n.push(e.text))}n.push(r);let i=`[${t}]`;if(n.length>0){let e=n.slice(0,3);i+=`: ${e.join(" > ")}`,n.length>3&&(i+=" ...")}return i}function z(e,t){let n=e;n=n.replace("localhost:4000/","idvorkin.azurewebsites.net/"),t.domainMapping&&(n=n.replace(t.domainMapping.from,t.domainMapping.to));let o=new URL(n),r=o.pathname.replace(/^\//,"").replace(/\.html$/,"")||"index",i=o.hash.replace("#","");return i?`${r}#${i}`:r}async function I(e,t){try{let n=window.location.href,o=n.includes("#")?n.replace(/#.*/,`#${e}`):`${n}#${e}`,r=z(o,t),i=`https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`,a=document.getElementById(e),l=a?Array.from(a.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE).map(e=>e.textContent?.trim()).join(" ").trim():"",s=`${l} - Igor's Blog`,c=B(e),d=M(a),u=`From: ${d} ...`;c&&(u=`From: ${d} ...

${c}`);let p=/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);if(navigator.share&&p)try{return await navigator.share({title:s,text:u,url:i}),console.log(`\u{1F4F1} Shared via native share: ${i}`),!0}catch(e){console.log("Share cancelled or failed, falling back to clipboard",e)}let m=i;return c&&(m=`From: ${d} ...

${c}

${i}`),await navigator.clipboard.writeText(m),console.log(`\u{1F4CB} Copied to clipboard with preview: ${m.substring(0,100)}...`),!1}catch(n){console.error("Failed to share/copy header link:",n);try{let n=window.location.href,o=n.includes("#")?n.replace(/#.*/,`#${e}`):`${n}#${e}`,r=z(o,t),i=`https://tinyurl.com/igor-blog/?path=${encodeURIComponent(r)}`,a=document.getElementById(e),l=M(a),s=B(e),c=i;s&&(c=`From: ${l} ...

${s}

${i}`);let d=document.createElement("textarea");return d.value=c,document.body.appendChild(d),d.select(),document.execCommand("copy"),document.body.removeChild(d),console.log(`\u{1F4CB} Copied with preview (fallback): ${c.substring(0,100)}...`),!1}catch(e){throw console.error("Failed to copy URL even with fallback:",e),e}}}function A(e){let t=e.nextElementSibling;for(;t&&!t.tagName.match(/^H[1-6]$/);){if("P"===t.tagName){let e=(t.textContent||"").trim();if(e.length>0)return e.length>500?e.substring(0,497)+"...":e}if("UL"===t.tagName||"OL"===t.tagName){let e=t.querySelectorAll("li"),n=[],o=0;for(let t of Array.from(e)){let e=Array.from(t.childNodes).filter(e=>e.nodeType===Node.TEXT_NODE||e.nodeType===Node.ELEMENT_NODE&&"UL"!==e.tagName&&"OL"!==e.tagName).map(e=>(e.textContent||"").trim()).join(" ").trim();if(e.length>0&&(n.push(`\u{2022} ${e}`),(o+=e.length)>400))break}if(n.length>0){let e=n.join("\n");return e.length>500?e.substring(0,497)+"...":e}}t=t.nextElementSibling}return""}function F(e,t=400){if(e.length<=t)return e;let n=e.substring(0,t),o=n.lastIndexOf(" ");return o>0?n.substring(0,o)+"...":n+"..."}function B(e){if(e){let t=document.getElementById(e);if(t){let e=A(t);if(e)return F(e);let n=t.nextElementSibling,o=[],r=0;for(;n&&r<400&&!n.tagName.match(/^H[1-6]$/);){if("P"===n.tagName||"LI"===n.tagName||"BLOCKQUOTE"===n.tagName||"DIV"===n.tagName){let e=(n.textContent||"").trim();e.length>0&&(o.push(e),r+=e.length)}n=n.nextElementSibling}if(o.length>0)return F(o.join(" "))}}for(let e of["article","main",".content",".post-content",".entry-content","#content-holder",".content-holder"]){let t=document.querySelector(e);if(t){let e=t.querySelector("p");if(e){let t=(e.textContent||"").trim();if(t.length>0)return F(t)}}}let t=document.querySelector("p");if(t){let e=(t.textContent||"").trim();if(e.length>0)return F(e)}return""}let O=new WeakMap,j=new WeakMap,H=new Set;function P(e={}){let t={...T,...e};for(let e of Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")))!function(e,t){if(e.querySelector(`.${t.iconClass||T.iconClass}`))return;let n=function(e){if(e.id)return e.id;let t=(e.textContent||"").toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""),n=t,o=1;for(;document.getElementById(n);)n=`${t}-${o}`,o++;return e.id=n,n}(e),o=function(e){let t=document.createElement("span");return t.className=e.iconClass||T.iconClass||"",t.title="Share this section",t.style.cursor="pointer",t.style.marginLeft="0.5rem",t.style.opacity="0",t.style.transition="opacity 0.2s ease",t.style.fontSize="0.8em",t.style.userSelect="none",t.setAttribute("role","button"),t.setAttribute("tabindex","0"),t.setAttribute("aria-label","Share this section"),t.innerHTML=`<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
    <!-- Upward arrow -->
    <path d="M8 2 L8 12"/>
    <path d="M4 5.5 L8 2 L12 5.5"/>
    <!-- Box -->
    <path d="M3 8 L3 17 Q3 18 4 18 L12 18 Q13 18 13 17 L13 8"/>
  </svg>`,t}(t),r=function(){let e=document.createElement("span");if(e.className="header-github-issue",e.title="Create GitHub issue for this section",e.style.cursor="pointer",e.style.marginLeft="0.5rem",e.style.opacity="0",e.style.transition="opacity 0.2s ease",e.style.fontSize="0.8em",e.style.userSelect="none",e.setAttribute("role","button"),e.setAttribute("tabindex","0"),e.setAttribute("aria-label","Create GitHub issue for this section"),document.querySelector('link[href*="font-awesome"]')||document.querySelector('script[src*="font-awesome"]')||document.querySelector(".fa, .fab, .fas, .far")||Array.from(document.styleSheets).some(e=>{try{return e.href&&e.href.includes("font-awesome")}catch(e){return!1}})){let t=document.createElement("i");t.className="fab fa-github",e.appendChild(t)}else e.textContent="⚠️";return e}(),i=[],a=async e=>{e.preventDefault(),e.stopPropagation(),await I(n,t)||function(e,t=2e3){if("undefined"!=typeof document&&document.querySelector){let e=document.querySelector(".copy-link-tooltip");e&&e.remove()}let n=document.createElement("span");n.className="copy-link-tooltip",n.textContent="Copied!",n.style.position="absolute",n.style.backgroundColor="#333",n.style.color="white",n.style.padding="4px 8px",n.style.borderRadius="4px",n.style.fontSize="12px",n.style.zIndex="1000",n.style.marginLeft="10px",n.style.marginTop="-5px",e.parentElement?.appendChild(n),setTimeout(()=>{n.remove()},t)}(o,t.tooltipDuration)};o.addEventListener("click",a),i.push(()=>o.removeEventListener("click",a));let l=e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),a(e))};o.addEventListener("keydown",l),i.push(()=>o.removeEventListener("keydown",l));let s=t=>{let o;t.preventDefault(),t.stopPropagation(),!function(e,t){document.querySelectorAll(".github-issue-popup").forEach(e=>{e.style.display="none"}),e.style.display="block",e.style.position="absolute",e.style.zIndex="1000";let n=t.getBoundingClientRect(),o=window.pageYOffset||document.documentElement.scrollTop,r=window.pageXOffset||document.documentElement.scrollLeft;e.style.top=n.bottom+o+10+"px",e.style.left=n.left+r+"px";let i=e.querySelector(".github-issue-title");i&&i.focus()}(((o=j.get(e))||(o=function(e,t){let n=document.createElement("div");n.className="github-issue-popup",n.style.display="none",n.id=`github-issue-popup-${e}`;let o=document.createElement("div");o.className="github-issue-popup-content";let r=document.createElement("div");r.className="github-issue-popup-header";let i=document.createElement("h4");i.textContent=`Report Issue: ${t}`;let a=document.createElement("button");a.className="github-issue-popup-close",a.title="Close",a.textContent="×",r.appendChild(i),r.appendChild(a);let l=document.createElement("div");l.className="github-issue-popup-body";let s=document.createElement("label");s.setAttribute("for",`issue-title-${e}`),s.textContent="Issue Title:";let c=document.createElement("input");c.type="text",c.id=`issue-title-${e}`,c.className="github-issue-title",c.placeholder="Brief title for the issue";let d=document.createElement("label");d.setAttribute("for",`issue-comment-${e}`),d.textContent="Description:";let u=document.createElement("textarea");u.id=`issue-comment-${e}`,u.className="github-issue-comment",u.placeholder="Describe the issue with this section...",u.rows=4;let p=document.createElement("div");p.className="github-issue-popup-buttons";let m=document.createElement("button");m.className="github-issue-submit",m.textContent="Create Issue on GitHub";let g=document.createElement("button");g.className="github-issue-cancel",g.textContent="Cancel",p.appendChild(m),p.appendChild(g);let f=document.createElement("div");f.className="github-issue-popup-hint";let h=document.createElement("small");return h.textContent="Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit",f.appendChild(h),l.appendChild(s),l.appendChild(c),l.appendChild(d),l.appendChild(u),l.appendChild(p),l.appendChild(f),o.appendChild(r),o.appendChild(l),n.appendChild(o),n}(n,e.textContent||""),document.body.appendChild(o),j.set(e,o),function(e,t,n){let o=[],r=e.querySelector(".github-issue-popup-close");if(r){let t=()=>D(e);r.addEventListener("click",t),o.push(()=>r.removeEventListener("click",t))}let i=e.querySelector(".github-issue-cancel");if(i){let t=()=>D(e);i.addEventListener("click",t),o.push(()=>i.removeEventListener("click",t))}let a=()=>{let o=e.querySelector(".github-issue-title"),r=e.querySelector(".github-issue-comment"),i=o?.value||"",a=r?.value||"",l=function(e,t,n,o,r){let i=window.location.pathname.replace(/^\//,"").replace(/\.html$/,""),a=document.querySelector('meta[property="markdown-path"]'),l=a?a.getAttribute("content"):`${i||"index"}.md`,s="https://github.com/idvorkin/idvorkin.github.io",c=encodeURIComponent(n?`${i||"index"}/${e}: ${n}`:`${i||"index"}/${e}: Issue with ${t}`),d=o||n||`Issue with section: ${t}`,u=r?A(r):"",p=`\u{1F4CD} [${i||"index"}](https://idvorkin.azurewebsites.net/${i})/[${e}](https://idvorkin.azurewebsites.net/${i}/${e}) - [[GitHub]](${s}/blob/main/${l}#${e})`,m=`${p}

## Description

${d}

`;u&&(m+=`## Content Excerpt

#### ${t}

> ${u}

`);let g=encodeURIComponent(m);return`${s}/issues/new?title=${c}&body=${g}`}(n,t.textContent||"",i,a,t);window.open(l,"_blank"),D(e)},l=e.querySelector(".github-issue-submit");l&&(l.addEventListener("click",a),o.push(()=>l.removeEventListener("click",a)));let s=e.querySelector(".github-issue-title"),c=e.querySelector(".github-issue-comment"),d=e=>{(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&(e.preventDefault(),a())};s&&(s.addEventListener("keydown",d),o.push(()=>s.removeEventListener("keydown",d))),c&&(c.addEventListener("keydown",d),o.push(()=>c.removeEventListener("keydown",d)));let u=O.get(t)||[];O.set(t,[...u,...o])}(o,e,n)),o),e)};r.addEventListener("click",s),i.push(()=>r.removeEventListener("click",s));let c=t=>{let n=j.get(e);!n||n.contains(t.target)||t.target===r||r.contains(t.target)||"none"===n.style.display||D(n)},d=setTimeout(()=>{document.addEventListener("click",c,!0),i.push(()=>document.removeEventListener("click",c,!0))},100);i.push(()=>clearTimeout(d)),e.appendChild(o),e.appendChild(r);let u=()=>{o.style.opacity="1",r.style.opacity="1"},p=()=>{o.style.opacity="0",r.style.opacity="0"};e.addEventListener("mouseenter",u),e.addEventListener("mouseleave",p),i.push(()=>{e.removeEventListener("mouseenter",u),e.removeEventListener("mouseleave",p)}),O.set(e,i),H.add(e)}(e,t)}let R=!1;function q(e=0){if("undefined"==typeof document)return;if(console.log("\uD83D\uDDBC️ Enabling image zoom functionality"),void 0===window.GLightbox){if(e<50){console.warn(`\u{26A0}\u{FE0F} GLightbox not found, retrying in 100ms (attempt ${e+1}/50)`),setTimeout(()=>q(e+1),100);return}console.error(`\u{274C} GLightbox failed to load after ${5} seconds, aborting image zoom initialization`);return}let t=document.querySelectorAll("p img, li img, .container img, .post-content img, article img, .markdown-body img, main img");console.log(`\u{1F50D} Found ${t.length} images to process`);let n=0;t.forEach((e,t)=>{if(e.parentElement?.tagName==="A"){console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - already wrapped`);return}if(e.naturalWidth>0&&e.naturalWidth<100&&e.naturalHeight<100){console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - too small (${e.naturalWidth}x${e.naturalHeight})`);return}let o=document.createElement("a");o.href=e.src,o.className="glightbox",o.setAttribute("data-gallery","post-images"),e.alt&&o.setAttribute("data-description",e.alt),e.parentNode?.insertBefore(o,e),o.appendChild(e),n++,console.log(`\u{2705} Processed image ${t+1}: ${e.src.substring(e.src.lastIndexOf("/")+1)}`)});try{window.GLightbox({selector:".glightbox",touchNavigation:!0,loop:!0,autoplayVideos:!0}),n>0?console.log(`\u{1F389} Image zoom enabled for ${n} images`):console.log("ℹ️ No images needed processing, but GLightbox initialized for existing elements")}catch(e){console.error("Error initializing GLightbox:",e)}}"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>q()):setTimeout(()=>q(),500));let U=null,G=new WeakSet;function W(e=0){if("undefined"==typeof document)return;if(console.log("\uD83D\uDCCA Enabling chart zoom functionality"),U){console.log("⚠️ Modal is open, skipping chart zoom reinitialization");return}if(void 0===window.Chart){if(e<50){console.warn(`\u{26A0}\u{FE0F} Chart.js not found, retrying in 100ms (attempt ${e+1}/50)`),setTimeout(()=>W(e+1),100);return}console.log("ℹ️ Chart.js not found, skipping chart zoom initialization");return}let t=document.querySelectorAll("canvas.chart-zoom-enabled");console.log(`\u{1F50D} Found ${t.length} canvas elements with chart-zoom-enabled class`);let n=0;t.forEach((e,t)=>{if(G.has(e))return;let o=window.Chart.getChart(e);if(!o){console.log(`\u{23ED}\u{FE0F} Skipping canvas ${t+1} - no Chart.js instance found`);return}console.log(`\u{1F4C8} Processing Chart.js chart ${t+1}: ${e.id||"unnamed"}`),e.style.cursor="pointer",e.style.transition="transform 0.2s ease, box-shadow 0.2s ease",e.addEventListener("mouseenter",()=>{e.style.transform="scale(1.02)",e.style.boxShadow="0 4px 12px rgba(0,0,0,0.15)"}),e.addEventListener("mouseleave",()=>{e.style.transform="scale(1)",e.style.boxShadow="none"}),e.addEventListener("click",()=>(function(e,t){let n;if(console.log("\uD83D\uDD0D Opening chart zoom modal"),U){console.log("⚠️ Modal already open, ignoring click");return}let{modalContainer:o,modalContent:r,modalCanvas:i,closeButton:a}=function(){console.log("✅ Creating modal DOM elements");let e=document.createElement("div");e.className="chart-zoom-modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","chart-modal-title"),e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    box-sizing: border-box;
  `;let t=document.createElement("div");t.style.cssText=`
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `;let n=document.createElement("canvas");n.setAttribute("aria-label","Zoomed chart view"),n.style.cssText=`
    width: 800px;
    height: 400px;
    max-width: 90vw;
    max-height: 60vh;
    display: block;
  `;let o=document.createElement("button");return o.textContent="×",o.setAttribute("aria-label","Close chart zoom modal"),o.style.cssText=`
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    z-index: 10000;
  `,t.appendChild(n),t.appendChild(o),e.appendChild(t),{modalContainer:e,modalContent:t,modalCanvas:n,closeButton:o}}();document.body.appendChild(o);let l=function(e,t){console.log("\uD83D\uDCCA Creating modal Chart.js instance");try{let n=new window.Chart(e,t);return console.log("✅ Modal chart created successfully"),n.update(),n.resize(),console.log("✅ Modal chart updated and resized"),n}catch(e){return console.error("❌ Error creating modal chart:",e),null}}(i,function(e){console.log("\uD83D\uDCCA Creating chart configuration");try{let t=e.config,n={type:t.type,data:t.data,options:{responsive:!0,maintainAspectRatio:!0,...t.options||{}}};return console.log("✅ Chart config constructed successfully"),n}catch(t){console.error("❌ Error constructing config:",t),console.log("\uD83D\uDCCA Falling back to simple config copy");try{return JSON.parse(JSON.stringify(e.config))}catch(e){return console.error("❌ Fallback also failed:",e),{type:"line",data:{labels:[],datasets:[]},options:{responsive:!0,maintainAspectRatio:!0}}}}}(e));if(!l){o.parentNode&&o.parentNode.removeChild(o);return}n=function(e,t,n,o,r){console.log("✅ Setting up modal event listeners");let i=document.activeElement;t.focus();let a=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),r()),"Tab"===e.key&&(e.preventDefault(),t.focus())},l=()=>{console.log("\uD83D\uDCF1 Window resize/orientation change detected, updating modal chart");let e=Math.min(800,.9*window.innerWidth),t=Math.min(400,.6*window.innerHeight);if(n.style.width=`${e}px`,n.style.height=`${t}px`,o)try{o.resize(),console.log("✅ Modal chart resized for new viewport")}catch(e){console.warn("Error resizing modal chart:",e)}};return t.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),r()}),e.addEventListener("click",t=>{t.target===e&&(t.preventDefault(),t.stopPropagation(),r())}),document.addEventListener("keydown",a),window.addEventListener("resize",l),window.addEventListener("orientationchange",l),()=>{document.removeEventListener("keydown",a),window.removeEventListener("resize",l),window.removeEventListener("orientationchange",l),i&&i.focus()}}(o,a,i,l,()=>{!function(e,t,n){if(console.log("\uD83D\uDD0D Cleaning up chart zoom modal"),e)try{e.destroy()}catch(e){console.warn("Error destroying modal chart:",e)}if(n(),t&&t.parentNode)try{t.parentNode.removeChild(t)}catch(e){console.warn("Error removing modal container:",e)}document.body.style.overflow="",U=null,console.log("✅ Chart zoom modal cleaned up")}(l,o,n)}),U={originalChart:e,modalChart:l,originalCanvas:t,modalCanvas:i,modalContainer:o},document.body.style.overflow="hidden",console.log("✅ Chart zoom modal opened")})(o,e)),G.add(e),n++,console.log(`\u{2705} Processed chart ${t+1}: ${e.id||"unnamed"} - now clickable for zoom`)}),n>0?console.log(`\u{1F389} Chart zoom enabled for ${n} charts`):console.log("ℹ️ No Chart.js charts found to process")}let J=!0;function X(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");if(0===e.length||0===t.length){console.warn("TOC or toggle elements not found for expand/collapse");return}J?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function Q(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function Z(e,t){let n=$(`#${e}`);if(0===n.length){console.warn(`Target element #${e} not found for TOC generation`);return}if(n.html(""),0===$("#content-holder").length){console.warn("Content holder not found for TOC generation");return}new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),r=$('<a class="expand-toggle" href="#">Collapse all</a>'),i=$('<a class="back-to-top" href="#">Top of page</a>'),a=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),l=$('<a class="go-to-bottom" href="#">Pin ToC</a>');X(),r.click(e=>{e.preventDefault(),e.stopPropagation(),J=!J,X()}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),a.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),l.click(e=>Q()),o.append(r).append(i).append(a),t&&o.append(l),n.append(o)}async function K(e){let t,o,r;try{if(!e){console.log("No backlinks available");return}if(!e[t=new URL(document.URL).pathname]){console.log(`Page ${t} not found in backlinks`);return}if(o=e[t]?.incoming_links,r=e[t]?.outgoing_links,!o&&!r){console.log(`No backlinks for the page ${t}`);return}}catch(e){console.log(`Error processing links: ${e instanceof Error?e.message:String(e)}`);return}let i=$("#links-to-page");if(!i||0===i.length){console.log("No back_link_location");return}i.append(`
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
`);let a=i.find("#incoming"),l=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(o)for(let t of o.sort(l)){let o=e[t];a.append(n(o))}let s=[];for(let t of r)e[t]&&s.push(t);let c=i.find("#outgoing");if(s)for(let t of s.sort(l)){let o=e[t];c.append(n(o))}let d=i.find("#graph"),u=t.replace(/\//g,"");d.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function V(e,t){let n=e?.attr?e.attr("href"):"unknown";return`<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`}async function Y(){let e="__idvorkin_add_link_loader_initialized__";window[e]||(window[e]=!0,K(await s()),function(e){if(!e){console.log("No backlinks data available");return}try{let t=$.makeArray($(".summary-link"));if(!t||0===t.length){console.log("No summary links found");return}for(let n of t){let t=$(n);try{if(!t||!t.attr){console.log("Invalid link element");return}let n=t.attr("href");if(!n){t.html(V(t,"missing href"));return}if(!e.redirects||!e.url_info){t.html(V(t,"incomplete backLinks data"));return}if(void 0!==e.redirects[n]&&(n=e.redirects[n]),void 0===e.url_info[n]){t.html(V(t,"not found in url info"));return}t.html(function(e,t){if(!t)return V(e,"URL info is undefined");let n=t.url||"#",o=t.title||"Untitled",r=t.description||"No description available",i=`(From:<a href='${n}'> ${o}</a>)`;return`<div>
        <i> ${r}</i> ${i}
    </div>`}(t,e.url_info[n]))}catch(e){t?.html?t.html(V(t,e)):console.error("Error processing link and unable to display error:",e)}}}catch(e){console.error("Error processing summary links:",e)}}(await et()))}let ee=null;async function et(){try{if(null!=ee)return ee;let e=window.location.href.includes("https://idvork.in"),t="";t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json";try{let e=await $.getJSON(t);return e.redirects||(e.redirects={}),e.url_info||(e.url_info={}),ee=e}catch(e){return console.error("Error fetching backlinks JSON:",e),{redirects:{},url_info:{}}}}catch(e){return console.error("Error in get_back_links:",e),{redirects:{},url_info:{}}}}function en(){let e=window.Mousetrap();e.bind("s",e=>void(window.location.href="/")),e.bind("t",e=>Q()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n=window.location.port||"4000",o=`http://localhost:${n}`,r=e.includes(t),i=e;i=r?e.replace(t,o):e.replace(/http:\/\/localhost:\d+/,t),window.location.href=i})()),e.bind("a",e=>{location.href="/all"}),e.bind("m",e=>{location.href="/toc"}),e.bind("6",e=>{location.href="/ig66"});let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function eo(){!function(e){for(let[t,n]of Object.entries(e)){let e="undefined"!=typeof $&&$.fn?$(`a[href=${t}]`).first()[0]:document.querySelector(`a[href="${t}"]`);if(!e)return;let o=n.cloneNode(!0);o.children.length>0&&o.children[0].remove(),e.replaceWith(o),n.remove()}}(function(){let e={};for(let t of"undefined"!=typeof $&&$.fn?$("ul").toArray():Array.from(document.querySelectorAll("ul"))){let n=t.firstElementChild;if(!n)continue;let o=n.textContent;o&&o.startsWith("l")&&(Number.isNaN(Number.parseInt(o.substring(1)))||(e[o]=t))}return e}())}function er(){let e="__idvorkin_load_globals_initialized__";window[e]||(window[e]=!0,$(Y),$(en),"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(eo):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",eo):eo()),function(e="recent-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{h(e)}):h(e)}(),document.getElementById("last-modified-posts")&&f(),$(()=>{Z("ui-toc",!0),Z("ui-toc-affix",!1)}),function(e={}){R||(R=!0,function(){let e="header-copy-link-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)}(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{P(e)}):P(e))}(),q(),function(){if("localhost"!==window.location.hostname&&"127.0.0.1"!==window.location.hostname){console.log("Not on dev server, skipping dev info");return}console.log("Dev server detected, initializing dev info...");let e=function(){let e=window.__GIT_BRANCH__;return e?(console.log("Branch from global variable:",e),e):(console.log("Branch info not found"),null)}(),t=window.location.port||"80";if(console.log("Dev info - Branch:",e,"Port:",t),e&&"main"!==e||"4000"!==t){let n=document.createElement("div");n.id="dev-info-banner",n.style.cssText=`
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
    `;let o="";e&&(o+=`<i class="fas fa-code-branch"></i> Branch: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${e}</code>`),e&&t&&(o+=" | "),n.innerHTML=o+=`<i class="fas fa-server"></i> Port: <code style="background: black; color: white; padding: 2px 6px; border-radius: 3px;">${t}</code>`,document.body.appendChild(n);let r=parseInt(window.getComputedStyle(document.body).paddingTop)||0;document.body.style.paddingTop=`${r+40}px`}}())}function ei(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),r=new Date(e.published),i=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][r.getMonth()]} ${r.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!==e.thumbnail?(console.log(e.title),console.log(r),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${i}
      </div>`)):t.append(i),t.html()}function ea(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}a("#random-post",()=>ei(o(e))),a("#achievment",()=>ei(o(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),a("#random-recent",()=>ei(o(e.filter(e=>e.tags.includes("family-journal")))))}function el(){$.getJSON("/ig66/ig66-export.json",ea)}function es(e){$.getJSON("/eulogy.json",t=>(function(e,t){if(!t){console.log("No roles being imported");return}console.log("Processing",t.roles.length,"roles"),a(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(o(t.roles)))})(e,t))}"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(er):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",er):er());class ec{constructor({name:e,value:t=25,children:n=[]}){this.name=e,this.children=r(n),this.value=t}}function ed(e=ep,t=eu){let n=e();for(let e of n.keys())t(e,n.get(e))}function eu(e,t,n=$,r=a){let i=n('<div class="alert alert-primary" role="alert"/>');n(e).after(i),r(i,()=>`<span>${o(t)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}function ep(e=$){let t=e("h3").first(),n=t,o=[],r=new Map;for(let i=t;0!==i.length;i=e(i).next()){if("H3"===i.prop("tagName")){r.set(n,o),n=i,o=[];continue}"UL"===i.prop("tagName")&&(o=Array.from(e(i).find("li")).map(t=>e(t).text()))}return r.set(n,o),r}function*em(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function eg(e=ep){return new Map(Array.from(e().entries()).map(([e,t],n)=>[e.text(),t]))}function ef(e,t,n){let r=Array.from(em(t)).find(([t,n])=>t.name===e);if(!r)return"Click in any box or circle";let[i,a]=r,l=Array.from(em(i)).map(([e,t])=>e).filter(e=>{let t=n.has(e.name),o=n.has(`${e.name}\u{1F517}`);return t||o}).flatMap(e=>(n.get(e.name)||n.get(`${e.name}\u{1F517}`)||[]).map(t=>`${e.name}: ${t}`));return 0===l.length?"Click in any box or circle":o(l)}async function eh(e,t,n,o=$,r=Plotly){if(!r){console.error("Plotly is not available");return}let i=function(e){let t=Array.from(em(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n),a={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(a,i),a.values=void 0;try{await r.newPlot(e,[a],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1});let i=e=>{o(`#${t}`).text(e)};o(`#${t}`).first().click(()=>{let e=o("#sunburst text:first").text(),t=ef(e,n,eg());i(t)});let l=document.getElementById(e);return l&&"function"==typeof l.on&&l.on("plotly_click",e=>{if(e?.points?.[0]){let t=e.points[0].label,o=ef(t,n,eg());i(o)}}),l}catch(e){return console.error("Failed to create sunburst plot:",e),null}}async function eb(e,t,n="Root",o=null,r=$,i=Plotly){return eh(e,t,function(e="Root",t=null,n=$){let o=t?n(t).find("h2"):n("h2"),r=[];return o.each((e,t)=>{let o=n(t),i=o.text().trim();if(!i)return;let a=[],l=o.next();for(;l.length>0&&"H2"!==l.prop("tagName");){if("H3"===l.prop("tagName")){let e=l.text().trim();e&&a.push(new ec({name:e}))}l=l.next()}a.length>0&&r.push(new ec({name:i,children:a}))}),new ec({name:e,children:r})}(n,o,r),r,i)}class ey{get_tree(){return new ec({name:"7H ",children:[new ec({name:""}),new ec({name:"Be Proactive"}),new ec({name:"Begin with the end in mind"}),new ec({name:"First things First"}),new ec({name:"Think Win/Win"}),new ec({name:"First Understand"}),new ec({name:"Synergize"}),new ec({name:"Sharpen the Saw"})]})}}class ew{get_tree(){let e=new ec({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new ec({name:"Magic",children:[new ec({name:"Card Magic"}),new ec({name:"Coin Magic"}),new ec({name:"Band Magic"})]}),n=new ec({name:"Hobbies",children:[new ec({name:"Biking"}),new ec({name:"Tech"}),new ec({name:"Juggling"})]}),o=new ec({name:"Relationships",children:[new ec({name:"Zach"}),new ec({name:"Amelia"}),new ec({name:"Tori"}),new ec({name:"Friends"})]}),r=new ec({name:"Joy",children:[new ec({name:"Balloons"}),new ec({name:"Joy to Others"})]});return new ec({name:"Invest in",children:[e,t,n,o,r]})}}function e$({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,r=`audio_player_${Math.floor(1e10*Math.random())}`,i=e.replace(/\//g,"_");return`
    <div>
        <audio id='${r}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${r}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function ev(e=s,t=o){try{let n=await e(),o=Object.entries(n).map(e=>e[1]),r=t(o);return e$({url:r.url,title:r.title,description:r.description})}catch(e){return console.error("Error generating random post HTML:",e),"<div>Could not load random post</div>"}}function ex(e="#e1",t="#e2",n="#e3",o=es){try{o(e),o(t),o(n)}catch(e){console.error("Error loading random eulogy:",e)}}function ek(e=eh,t=ed,n=el,o=es,r=a){try{e("sunburst","sunburst_text",new ew().get_tree()),t(),n(),o("#random-eulogy-role"),r("#random-blog-posts",async()=>await ev())}catch(e){console.error("❌ Error loading enjoy page:",e)}}function eE(e=eh,t=ed){try{e("sunburst","sunburst_text",new ey().get_tree()),t()}catch(e){console.error("Error loading 7 habits page:",e)}}function eC(e=el){try{e()}catch(e){console.error("Error loading IG66 page:",e)}}function e_(e=eD,t=eT,n=eN){try{e("balance-heatmap-rest"),t("balance-heatmap-work"),n("balance-radar-map-ideal")}catch(e){console.error("Error loading balance page:",e)}}let eL=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],eS="#00BF00";async function eN(e,t){if(void 0!==t&&t)try{await t.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}catch(e){console.error("Error creating radar map:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eT(e,t){let n=["Tech","Work"],o={height:20*n.length+100,margin:{t:5},pad:0},r=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,eS],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:eL.slice(2,13),y:n,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];if(void 0!==t&&t)try{await t.newPlot(e,r,o,{displayModeBar:!1})}catch(e){console.error("Error creating work balance chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eD(e,t){let n=["Health","Hobbies","Family","Magic"],o=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,eS],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:eL.slice(2,13),y:n.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],r={height:20*n.length+100,margin:{t:5},pad:0};if(void 0!==t&&t)try{await t.newPlot(e,o,r,{displayModeBar:!1})}catch(e){console.error("Error creating rest time chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}function eM(e="Topics",t=eb,n=ed,o=el,r=es,i=a){try{t("sunburst","sunburst_text",e),n(),o(),r("#random-eulogy-role"),i("#random-blog-posts",async()=>await ev())}catch(e){console.error("Error loading auto-generated sunburst:",e)}}if("undefined"!=typeof window&&window["@algolia/autocomplete-js"]){let n=window["@algolia/autocomplete-js"];e=n.autocomplete,t=n.getAlgoliaResults}function ez(e){let t=document.createElement("div");return t.textContent=e||"",t.innerHTML}function eI(e){if(!e)return!1;if(e.startsWith("/"))return!0;try{let t=new URL(e);return"http:"===t.protocol||"https:"===t.protocol}catch{return!1}}function eA({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;if(e.anchor&&(t+=`#${e.anchor}`),!eI(t))return console.warn("Invalid URL skipped in InstantSearchHitTemplate:",t),"<div>Invalid result</div>";let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,r=n?.content?.value??"";return`
           <span data-url="${ez(t)}" style="cursor: pointer;">
              <b> <a href="${ez(t)}">${o}</a></b> <span>${r}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function eF(){let e=performance.now(),t=await s(),n=performance.now()-e;console.log(`  \u{1F4CA} [get_random_post] Loaded links in ${n.toFixed(0)}ms`);let r=o(Object.entries(t).map(e=>e[1]));return{title:r.title,url:r.url,description:r.description}}async function eB(e=4){let t=performance.now(),n=await s(),o=performance.now()-t;console.log(`  \u{1F4CA} [get_random_posts_batch] Loaded links once in ${o.toFixed(0)}ms`);let r=Object.entries(n).map(e=>e[1]),i=[],a=new Set;for(;i.length<e&&i.length<r.length;){let e=Math.floor(Math.random()*r.length);if(!a.has(e)){a.add(e);let t=r[e];i.push({title:t.title,url:t.url,description:t.description})}}return i}async function eO(e=4){try{let t=performance.now(),n=await s(),o=performance.now()-t;return console.log(`  \u{1F4CA} [get_recent_posts] Loaded links in ${o.toFixed(0)}ms`),Object.entries(n).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function ej(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>{try{return await eF()}catch(e){return console.error("Error getting random post:",e),{url:"",title:"Error",description:"Failed to load post"}}}))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>eI(e.url)?t("div",{dangerouslySetInnerHTML:{__html:`
            <span data-url="${ez(e.url)}" style="cursor: pointer;">
           <b> <a href="${ez(e.url)}">${ez(e.title)}</a></b>
            <span>${ez(e.description)}</span>
            </span>
            `}}):(console.warn("Invalid URL skipped in GetRandomSearchResults:",e.url),t("div",{dangerouslySetInnerHTML:{__html:"<div>Invalid result</div>"}})),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function eH(e=4){return{sourceId:"recent_posts",getItems:async()=>await eO(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>eI(e.url)?t("div",{dangerouslySetInnerHTML:{__html:`
            <span data-url="${ez(e.url)}" style="cursor: pointer;">
           <b> <a href="${ez(e.url)}">${ez(e.title)}</a></b>
            <span>${ez(e.description)}</span>
            </span>
            `}}):(console.warn("Invalid URL skipped in GetRecentSearchResults:",e.url),t("div",{dangerouslySetInnerHTML:{__html:"<div>Invalid result</div>"}})),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function eP(n,o,r,i,a,l=3,s=4,c=3){if(!e){console.error("Autocomplete is not defined");return}let d=algoliasearch(n,o),u=await ej(c),p=await eH(s),m=i.startsWith("#")?i:`#${i}`;if(0===$(m).length){console.log("No autocomplete element found","autocomplete_id",i);return}return e({container:m,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let n=0===e.length;n&&(e=" ");let o=function(e,n,o,r=3,i=!1){let a="NOT tags:family-journal";return i&&(a=""),{sourceId:"featured_posts",getItems:()=>t?t({searchClient:e,queries:[{indexName:n,query:o,filters:a,params:{hitsPerPage:r,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}):(console.error("getAlgoliaResults is not defined"),[]),templates:{item:eA,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(d,r,e,n?l:10,a);return n?[o,p,u]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}$(document).ready(()=>{i(er);let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let t=["item1","item2","item3"];console.log("Random item:",o(t)),console.log("Shuffled items:",r([...t])),s().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")}),"undefined"!=typeof window&&(window.enableChartZoom=W);export{o as random_from_list,r as shuffle,a as append_randomizer_div,i as defer,s as get_link_info,c as get_random_page_url,er as load_globals,W as enableChartZoom,n as MakeBackLinkHTML,eP as CreateAutoComplete,eF as get_random_post,eO as get_recent_posts,eB as get_random_posts_batch,f as initRecentAllPosts,ed as add_random_prompts,eh as add_sunburst,eb as add_sunburst_from_dom,ec as TreeNode,ek as load_enjoy2,eE as load_7_habits,eM as load_auto_sunburst,e$ as makePostPreviewHTML,ev as make_random_post_html,eC as load_ig66,e_ as load_balance,ex as load_random_eulogy};
//# sourceMappingURL=index.js.map
