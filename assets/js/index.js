let e,t;function n(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function o(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function l(e){let t,n=e.length;for(;0!==n;)t=Math.floor(Math.random()*n),n--,[e[n],e[t]]=[e[t],e[n]];return e}function i(e,t){let n=t||e.name||"anonymous function";"loading"===document.readyState?(console.log(`\u{1F550} Deferring ${n} until DOM is ready`),document.addEventListener("DOMContentLoaded",()=>{console.log(`\u{1F680} Executing deferred ${n}`),e()})):(console.log(`\u{26A1} DOM already ready, executing ${n} immediately`),e())}async function r(e,t){let n=$(e);if(1!==n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async e=>{if("A"!==e.target.tagName){let e=$(await t());n.empty().append(e)}})}let a=null;async function s(e){if(null!=a)return a;let t=(e||window.location.href).includes("https://idvork.in"),n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return a=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function c(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await s(e)}catch(e){throw Error("Missing url_info in data structure")}}async function d(){return[...Object.entries(await c()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}function u(e){let t={};for(let n of e){if(!n.last_modified)continue;let e=new Date(n.last_modified),o=`${e.toLocaleString("default",{month:"long"})} ${e.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(n)}return t}function p(e){let t="";for(let[n,o]of Object.entries(e))t+=`
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
    `;return t}async function f(e="last-modified-posts",t=15,n=document){console.log("\uD83D\uDD0D updateRecentPosts function called");let o=n.getElementById(e);if(console.log("\uD83D\uDD0D recent-posts container element:",o),!o){console.error(`\u{274C} ${e} container not found in DOM`);return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let e=await d(),l=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),l=p(u(n));if(o.length>0){var i,r;l+=(i=p(u(o)),r=o.length,`
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${r} more)
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
  `+l}(e,t);console.log("\uD83D\uDD0D Updating recent-posts content with HTML",`${l.substring(0,100)}...`),o.innerHTML=l,function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);if(!o){console.log(`Toggle element with ID ${e} not found`);return}o.addEventListener("click",function(){let e=n.getElementById(t);if(!e){console.log(`Content element with ID ${t} not found`);return}let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))})}("remaining-posts-toggle","remaining-posts-content",n),console.log("✅ Recent posts updated successfully")}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function g(e="last-modified-posts",t=document){console.log("\uD83D\uDD0D initRecentAllPosts called"),"loading"===t.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),t.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),f(e,15,t)})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),f(e,15,t)),console.log("\uD83D\uDD0D initRecentAllPosts completed initial setup")}async function m(e="recent-posts"){console.log("\uD83D\uDD0D updateRecentPosts function called");let t=document.getElementById(e);if(console.log("\uD83D\uDD0D recent-posts container element:",t?"found":"not found"),!t){console.error(`\u{274C} ${e} container not found in DOM`);return}try{var n;console.log("\uD83D\uDD0D Fetching back-links.json...");let e=await d();console.log("\uD83D\uDD0D Sorted pages, first 5:",e.slice(0,5).map(e=>({url:e.url,title:e.title,last_modified:e.last_modified})));let o=(n=function(e,t=5){return e.slice(0,t)}(e),0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `);console.log("\uD83D\uDD0D Updating recent-posts content with HTML",`${o.substring(0,100)}...`),t.innerHTML=o,console.log("✅ Recent posts updated successfully")}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function h(e,t){let n=e.filter(e=>e.url===t)[0];if(n)return n;let o=t.replace(/^\//,"").replace(/\/$/,"");return e.filter(e=>e.url.replace(/^\//,"").replace(/\/$/,"")===o)[0]}function y(e){let t=e.filter(e=>e.expanded);e.find(e=>"/eulogy"===e.url)||console.log("Eulogy node not found in pages");let n=function(e){let t=[];for(let n of e){for(let e of[...n.outgoing_links||[],...n.incoming_links||[]])h(v,e)&&t.push({source:n,target:e,value:1});0===t.filter(e=>e.source===n).length&&"/eulogy"===n.url&&console.log(`No valid links found for ${n.url}`)}return t}(t),o=n.map(t=>h(e,t.target)).filter(e=>e);return{nodes:t.concat(o),links:n}}function b(e,t,n){let o=e.outgoing_links.length,l=e.expanded?"-":`+${o}`,i=`${e.id} [${l}]`,r=12/n;t.font=`${r}px Sans-Serif`;let a=[t.measureText(i).width,r].map(e=>e+.2*r);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-a[0]/2,e.y-a[1]/2,...a),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(i,e.x,e.y),e.__bckgDimensions=a}function w(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}console.log("Load force graph in TS v 0.9");let v=[],D=null,k=null;function _(e){if(!k){console.log("Cannot center: Graph not initialized");return}if(!e){console.log("Cannot center: Node is null or undefined");return}k.centerAt(e.x,e.y,500),k.zoom(8,500),x(e)}function x(e){if(!e)return;D=e;let t=n(e),o=document.getElementById("detail");o&&(o.innerHTML=t)}function E(){D?D.url?window.open(D.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}function C(){for(let e of v)e.expanded=!1;D&&(D.expanded=!0),k&&(k.graphData(y(v)),D&&setTimeout(()=>{_(D)},300))}async function M(){if(!document.getElementById("graph")){console.log("Graph element not found, exiting initialization");return}window.location.hash.substr(1),v=Object.values(await s()).map(e=>({...e,id:e.url,expanded:!1}));let e=`/${window.location.hash?window.location.hash.substr(1):""}`,t=v.map(e=>e.url).includes(e)?e:"/eulogy";for(let e of v)e.expanded=e.url===t;if("undefined"==typeof ForceGraph){console.log("Force Graph not defined, providing fallback functionality");let e=h(v,t);e&&(x(e),D=e);let n=document.getElementById("center_control");n&&n.addEventListener("click",()=>{console.log("Center control clicked (fallback mode)")});let o=document.getElementById("goto_control");o&&o.addEventListener("click",()=>{D?.url&&window.open(D.url,"_blank")});let l=document.getElementById("collapse_control");l&&l.addEventListener("click",()=>{console.log("Collapse control clicked (fallback mode)")});return}k=ForceGraph()(document.getElementById("graph")).graphData(y(v)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(b).nodePointerAreaPaint(w).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{e.expanded=!e.expanded,0===v.filter(e=>e.expanded).length&&(e.expanded=!0),k.graphData(y(v)),setTimeout(()=>{_(e)},300)});let n=h(v,t);n?_(n):console.log("Initial node not found, cannot center");let o=document.getElementById("center_control");o?o.addEventListener("click",()=>{D?_(D):console.log("No last detail node to center on")}):console.log("Center control element not found");let l=document.getElementById("goto_control");l&&l.addEventListener("click",E);let i=document.getElementById("collapse_control");i&&i.addEventListener("click",C)}"undefined"!=typeof window&&(window.initializeGraph=M);let L={iconClass:"header-copy-link",tooltipDuration:2e3,domainMapping:{from:"idvork.in/",to:"idvorkin.azurewebsites.net/"}};function T(e,t){let n=e;return n=n.replace("localhost:4000/","idvorkin.azurewebsites.net/"),t.domainMapping&&(n=n.replace(t.domainMapping.from,t.domainMapping.to)),n=n.replace("#","/")}async function P(e,t){try{let n=window.location.href.split("#")[0],o=`${n}#${e}`,l=T(o,t);await navigator.clipboard.writeText(l),console.log(`Copied header link: ${l}`)}catch(l){console.error("Failed to copy header link:",l);let n=document.createElement("textarea"),o=window.location.href.split("#")[0];n.value=T(`${o}#${e}`,t),document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n)}}function I(e={}){let t={...L,...e},n=(document.getElementById("content-holder")||document.body).querySelectorAll("h1, h2, h3, h4, h5, h6");for(let e of Array.from(n))!function(e,t){if(e.querySelector(`.${t.iconClass||L.iconClass}`))return;let n=function(e){if(e.id)return e.id;let t=(e.textContent||"").toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""),n=t,o=1;for(;document.getElementById(n);)n=`${t}-${o}`,o++;return e.id=n,n}(e),o=function(e){let t=document.createElement("span");return t.className=e.iconClass||L.iconClass||"",t.innerHTML="\uD83D\uDD17",t.title="Copy link to this section",t.style.cursor="pointer",t.style.marginLeft="0.5rem",t.style.opacity="0",t.style.transition="opacity 0.2s ease",t.style.fontSize="0.8em",t.style.userSelect="none",t}(t);o.addEventListener("click",async e=>{e.preventDefault(),e.stopPropagation(),await P(n,t),function(e,t=2e3){let n=document.createElement("span");n.textContent="Copied!",n.style.position="absolute",n.style.backgroundColor="#333",n.style.color="white",n.style.padding="4px 8px",n.style.borderRadius="4px",n.style.fontSize="12px",n.style.zIndex="1000",n.style.marginLeft="10px",n.style.marginTop="-5px",e.parentElement?.appendChild(n),setTimeout(()=>{n.remove()},t)}(o,t.tooltipDuration)}),e.appendChild(o),e.addEventListener("mouseenter",()=>{o.style.opacity="1"}),e.addEventListener("mouseleave",()=>{o.style.opacity="0"})}(e,t);console.log(`\u{2705} Initialized copy links for ${n.length} headers`)}let S=!1,z=!0;function N(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");if(0===e.length||0===t.length){console.warn("TOC or toggle elements not found for expand/collapse");return}z?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function A(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function O(e,t){let n=$(`#${e}`);if(0===n.length){console.warn(`Target element #${e} not found for TOC generation`);return}if(n.html(""),0===$("#content-holder").length){console.warn("Content holder not found for TOC generation");return}new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),l=$('<a class="expand-toggle" href="#">Collapse all</a>'),i=$('<a class="back-to-top" href="#">Top of page</a>'),r=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),a=$('<a class="go-to-bottom" href="#">Pin ToC</a>');N(),l.click(e=>{e.preventDefault(),e.stopPropagation(),z=!z,N()}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),r.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),a.click(e=>A()),o.append(l).append(i).append(r),t&&o.append(a),n.append(o)}async function R(e){let t,o,l;try{if(!e){console.log("No backlinks available");return}if(!e[t=new URL(document.URL).pathname]){console.log(`Page ${t} not found in backlinks`);return}if(o=e[t]?.incoming_links,l=e[t]?.outgoing_links,!o&&!l){console.log(`No backlinks for the page ${t}`);return}}catch(e){console.log(`Error processing links: ${e instanceof Error?e.message:String(e)}`);return}let i=$("#links-to-page");if(!i||0===i.length){console.log("No back_link_location");return}i.append(`
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
`);let r=i.find("#incoming"),a=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(o)for(let t of o.sort(a)){let o=e[t];r.append(n(o))}let s=[];for(let t of l)e[t]&&s.push(t);let c=i.find("#outgoing");if(s)for(let t of s.sort(a)){let o=e[t];c.append(n(o))}console.log("Added Graph");let d=i.find("#graph"),u=t.replace(/\//g,"");d.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function B(e,t){let n=e?.attr?e.attr("href"):"unknown";return`<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`}async function H(){R(await s()),function(e){if(!e){console.log("No backlinks data available");return}try{let t=$.makeArray($(".summary-link"));if(!t||0===t.length){console.log("No summary links found");return}for(let n of t){let t=$(n);try{if(!t||!t.attr){console.log("Invalid link element");return}console.log(t.attr("href"));let n=t.attr("href");if(!n){t.html(B(t,"missing href"));return}if(!e.redirects||!e.url_info){t.html(B(t,"incomplete backLinks data"));return}if(void 0!==e.redirects[n]&&(n=e.redirects[n]),void 0===e.url_info[n]){t.html(B(t,"not found in url info"));return}t.html(function(e,t){if(!t)return B(e,"URL info is undefined");let n=t.url||"#",o=t.title||"Untitled",l=t.description||"No description available",i=`(From:<a href='${n}'> ${o}</a>)`;return`<div>
        <i> ${l}</i> ${i}
    </div>`}(t,e.url_info[n]))}catch(e){t?.html?t.html(B(t,e)):console.error("Error processing link and unable to display error:",e)}}}catch(e){console.error("Error processing summary links:",e)}}(await F())}let j=null;async function F(){try{if(null!=j)return j;let e=window.location.href.includes("https://idvork.in"),t="";t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json";try{let e=await $.getJSON(t);return e.redirects||(e.redirects={}),e.url_info||(e.url_info={}),j=e}catch(e){return console.error("Error fetching backlinks JSON:",e),{redirects:{},url_info:{}}}}catch(e){return console.error("Error in get_back_links:",e),{redirects:{},url_info:{}}}}function J(){let e=window.Mousetrap();e.bind("s",e=>void $("#autocomplete-search-box-button").click()),e.bind("t",e=>A()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n="http://localhost:4000",o=e.includes(t),l=e;l=o?e.replace(t,n):e.replace(n,t),window.location.href=l})()),e.bind("a",e=>{location.href="/all"}),e.bind("m",e=>{location.href="/toc"}),e.bind("6",e=>{location.href="/ig66"});let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function U(){console.log("\uD83D\uDD04 Replacing List Placeholders in Tables"),function(e){for(let[t,n]of Object.entries(e)){let e="undefined"!=typeof $&&$.fn?$(`a[href=${t}]`).first()[0]:document.querySelector(`a[href="${t}"]`);if(!e)return;let o=n.cloneNode(!0);o.children.length>0&&o.children[0].remove(),e.replaceWith(o),n.remove()}}(function(){let e={};for(let t of"undefined"!=typeof $&&$.fn?$("ul").toArray():Array.from(document.querySelectorAll("ul"))){let n=t.firstElementChild;if(!n)continue;let o=n.textContent;o&&o.startsWith("l")&&(Number.isNaN(Number.parseInt(o.substring(1)))||(e[o]=t))}return e}())}function G(){$(H),$(J),"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(U):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",U):U()),console.log("\uD83D\uDE80 About to call initRecentPosts from main.ts"),function(e="recent-posts",t=document){console.log("\uD83D\uDD0D initRecentPosts called"),"loading"===t.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),t.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),m(e)})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),m(e)),console.log("\uD83D\uDD0D initRecentPosts completed initial setup")}(),console.log("✅ Called initRecentPosts from main.ts"),document.getElementById("last-modified-posts")&&(console.log("\uD83D\uDE80 About to call initRecentAllPosts from main.ts"),g(),console.log("✅ Called initRecentAllPosts from main.ts")),$(()=>{O("ui-toc",!0),O("ui-toc-affix",!1)}),function(e={}){if(S){console.log("⚠️ Header copy links already initialized, skipping...");return}S=!0,console.log("\uD83D\uDD17 Initializing header copy links..."),function(){let e="header-copy-link-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=`
    .header-copy-link {
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
    
    h1:hover .header-copy-link,
    h2:hover .header-copy-link,
    h3:hover .header-copy-link,
    h4:hover .header-copy-link,
    h5:hover .header-copy-link,
    h6:hover .header-copy-link {
      opacity: 1;
    }
    
    /* Ensure headers have relative positioning for tooltip placement */
    h1, h2, h3, h4, h5, h6 {
      position: relative;
    }
  `,document.head.appendChild(t)}(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{I(e)}):I(e)}()}if("undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(G):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",G):G()),"undefined"!=typeof window&&window["@algolia/autocomplete-js"]){let n=window["@algolia/autocomplete-js"];e=n.autocomplete,t=n.getAlgoliaResults}function W({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;e.anchor&&(t+=`#${e.anchor}`);let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,l=n?.content?.value??"";return`
           <span onClick="window.location='${t}';">
              <b> <a href="${t}">${o}</a></b> <span>${l}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function q(){let e=o(Object.entries(await s()).map(e=>e[1]));return{title:e.title,url:e.url,description:e.description}}async function Y(e=4){try{let t=await s();return Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function Q(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>q()))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function V(e=4){return{sourceId:"recent_posts",getItems:async()=>await Y(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function Z(n,o,l,i,r,a=3,s=4,c=3){if(!e){console.error("Autocomplete is not defined");return}let d=algoliasearch(n,o),u=await Q(c),p=await V(s),f=i.startsWith("#")?i:`#${i}`;if(0===$(f).length){console.log("No autocomplete element found","autocomplete_id",i);return}return e({container:f,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let n=0===e.length;n&&(e=" ");let o=function(e,n,o,l=3,i=!1){let r="NOT tags:family-journal";return i&&(r=""),{sourceId:"featured_posts",getItems:()=>t?t({searchClient:e,queries:[{indexName:n,query:o,filters:r,params:{hitsPerPage:l,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}):(console.error("getAlgoliaResults is not defined"),[]),templates:{item:W,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(d,l,e,n?a:10,r);return n?[o,p,u]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}class K{constructor({name:e,value:t=25,children:n=[]}){this.name=e,this.children=l(n),this.value=t}}function X(e=et,t=ee){let n=e();for(let e of n.keys())t(e,n.get(e))}function ee(e,t,n=$,l=r){let i=n('<div class="alert alert-primary" role="alert"/>');n(e).after(i),l(i,()=>`<span>${o(t)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}function et(e=$){let t=e("h3").first(),n=t,o=[],l=new Map;for(let i=t;0!==i.length;i=e(i).next()){if("H3"===i.prop("tagName")){l.set(n,o),n=i,o=[];continue}"UL"===i.prop("tagName")&&(o=Array.from(e(i).find("li")).map(t=>e(t).text()))}return l.set(n,o),l}function*en(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function eo(e=et){return new Map(Array.from(e().entries()).map(([e,t],n)=>[e.text(),t]))}function el(e,t,n){let[l,i]=Array.from(en(t)).find(([t,n])=>t.name===e);return o(Array.from(en(l)).map(([e,t])=>e).filter(e=>n.has(e.name)).flatMap(e=>n.get(e.name).map(t=>`${e.name}: ${t}`)))}async function ei(e,t,n,o=$,l=Plotly){if(!l){console.error("Plotly is not available");return}let i=function(e){let t=Array.from(en(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n),r={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(r,i),r.values=void 0;try{let i=await l.newPlot(e,[r],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1}),a=e=>{o(`#${t}`).text(e)};return o(`#${t}`).first().click(()=>{let e=o("#sunburst text:first").text(),t=el(e,n,eo());a(t)}),i.on("plotly_sunburstclick",e=>{let t=e.points[0].label,o=el(t,n,eo());a(o)}),i}catch(e){return console.error("Failed to create sunburst plot:",e),null}}function er(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),l=new Date(e.published),i=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][l.getMonth()]} ${l.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!==e.thumbnail?(console.log(e.title),console.log(l),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${i}
      </div>`)):t.append(i),t.html()}function ea(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}r("#random-post",()=>er(o(e))),r("#achievment",()=>er(o(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),r("#random-recent",()=>er(o(e.filter(e=>e.tags.includes("family-journal")))))}function es(){$.getJSON("/ig66/ig66-export.json",ea)}function ec(e){$.getJSON("/eulogy.json",t=>(function(e,t){if(!t){console.log("No roles being imported");return}console.log("Processing",t.roles.length,"roles"),r(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(o(t.roles)))})(e,t))}class ed{get_tree(){return new K({name:"7H ",children:[new K({name:""}),new K({name:"Be Proactive"}),new K({name:"Begin with the end in mind"}),new K({name:"First things First"}),new K({name:"Think Win/Win"}),new K({name:"First Understand"}),new K({name:"Synergize"}),new K({name:"Sharpen the Saw"})]})}}class eu{get_tree(){let e=new K({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new K({name:"Magic",children:[new K({name:"Card Magic"}),new K({name:"Coin Magic"}),new K({name:"Band Magic"})]}),n=new K({name:"Hobbies",children:[new K({name:"Biking"}),new K({name:"Tech"}),new K({name:"Juggling"})]}),o=new K({name:"Relationships",children:[new K({name:"Zach"}),new K({name:"Amelia"}),new K({name:"Tori"}),new K({name:"Friends"})]}),l=new K({name:"Joy",children:[new K({name:"Balloons"}),new K({name:"Joy to Others"})]});return new K({name:"Invest in",children:[e,t,n,o,l]})}}function ep({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,l=`audio_player_${Math.floor(1e10*Math.random())}`,i=e.replace(/\//g,"_");return`
    <div>
        <audio id='${l}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${l}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function ef(e=s,t=o){try{let n=await e(),o=Object.entries(n).map(e=>e[1]),l=t(o);return ep({url:l.url,title:l.title,description:l.description})}catch(e){return console.error("Error generating random post HTML:",e),"<div>Could not load random post</div>"}}function eg(e="#e1",t="#e2",n="#e3",o=ec){try{o(e),o(t),o(n)}catch(e){console.error("Error loading random eulogy:",e)}}function em(e=ei,t=X,n=es,o=ec,l=r){try{e("sunburst","sunburst_text",new eu().get_tree()),t(),n(),o("#random-eulogy-role"),l("#random-blog-posts",async()=>await ef())}catch(e){console.error("❌ Error loading enjoy page:",e)}}function eh(e=ei,t=X){try{e("sunburst","sunburst_text",new ed().get_tree()),t()}catch(e){console.error("Error loading 7 habits page:",e)}}function ey(e=es){try{e()}catch(e){console.error("Error loading IG66 page:",e)}}function eb(e=ek,t=eD,n=ev){try{e("balance-heatmap-rest"),t("balance-heatmap-work"),n("balance-radar-map-ideal")}catch(e){console.error("Error loading balance page:",e)}}let e$=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],ew="#00BF00";async function ev(e,t){if(void 0!==t&&t)try{await t.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}catch(e){console.error("Error creating radar map:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eD(e,t){let n=["Tech","Work"],o={height:20*n.length+100,margin:{t:5},pad:0},l=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,ew],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:e$.slice(2,13),y:n,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];if(void 0!==t&&t)try{await t.newPlot(e,l,o,{displayModeBar:!1})}catch(e){console.error("Error creating work balance chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function ek(e,t){let n=["Health","Hobbies","Family","Magic"],o=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,ew],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:e$.slice(2,13),y:n.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],l={height:20*n.length+100,margin:{t:5},pad:0};if(void 0!==t&&t)try{await t.newPlot(e,o,l,{displayModeBar:!1})}catch(e){console.error("Error creating rest time chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}$(document).ready(()=>{i(G);let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let t=["item1","item2","item3"];console.log("Random item:",o(t)),console.log("Shuffled items:",l([...t])),s().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{o as random_from_list,l as shuffle,r as append_randomizer_div,i as defer,s as get_link_info,G as load_globals,n as MakeBackLinkHTML,Z as CreateAutoComplete,g as initRecentAllPosts,X as add_random_prompts,ei as add_sunburst,K as TreeNode,em as load_enjoy2,eh as load_7_habits,ep as makePostPreviewHTML,ey as load_ig66,eb as load_balance,eg as load_random_eulogy};
//# sourceMappingURL=index.js.map
