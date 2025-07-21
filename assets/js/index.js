let e,t;function n(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function o(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function i(e){let t,n=e.length;for(;0!==n;)t=Math.floor(Math.random()*n),n--,[e[n],e[t]]=[e[t],e[n]];return e}function r(e,t){let n=t||e.name||"anonymous function";"loading"===document.readyState?(console.log(`\u{1F550} Deferring ${n} until DOM is ready`),document.addEventListener("DOMContentLoaded",()=>{console.log(`\u{1F680} Executing deferred ${n}`),e()})):(console.log(`\u{26A1} DOM already ready, executing ${n} immediately`),e())}async function a(e,t){let n=$(e);if(1!==n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async e=>{if("A"!==e.target.tagName){let e=$(await t());n.empty().append(e)}})}let l=null;async function s(e){if(null!=l)return l;let t=(e||window.location.href).includes("https://idvork.in"),n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return l=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function c(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await s(e)}catch(e){throw Error("Missing url_info in data structure")}}async function d(){return[...Object.entries(await c()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}function u(e){let t={};for(let n of e){if(!n.last_modified)continue;let e=new Date(n.last_modified),o=`${e.toLocaleString("default",{month:"long"})} ${e.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(n)}return t}function p(e){let t="";for(let[n,o]of Object.entries(e))t+=`
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
    `;return t}async function g(e="last-modified-posts",t=15,n=document){let o=n.getElementById(e);if(!o){console.error(`\u{274C} ${e} container not found in DOM`);return}try{let e=await d();o.innerHTML=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),i=p(u(n));if(o.length>0){var r,a;i+=(r=p(u(o)),a=o.length,`
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${a} more)
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
  `+i}(e,t),function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);if(!o){console.log(`Toggle element with ID ${e} not found`);return}o.addEventListener("click",function(){let e=n.getElementById(t);if(!e){console.log(`Content element with ID ${t} not found`);return}let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))})}("remaining-posts-toggle","remaining-posts-content",n)}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function f(e="last-modified-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{g(e,15,t)}):g(e,15,t)}async function m(e="recent-posts"){let t=document.getElementById(e);if(!t){console.error(`\u{274C} ${e} container not found in DOM`);return}try{var n;let e=await d();n=function(e,t=5){return e.slice(0,t)}(e),t.innerHTML=0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function h(e,t){let n=e.filter(e=>e.url===t)[0];if(n)return n;let o=t.replace(/^\//,"").replace(/\/$/,"");return e.filter(e=>e.url.replace(/^\//,"").replace(/\/$/,"")===o)[0]}function y(e){let t=e.filter(e=>e.expanded);e.find(e=>"/eulogy"===e.url)||console.log("Eulogy node not found in pages");let n=function(e){let t=[];for(let n of e){for(let e of[...n.outgoing_links||[],...n.incoming_links||[]])h(v,e)&&t.push({source:n,target:e,value:1});0===t.filter(e=>e.source===n).length&&"/eulogy"===n.url&&console.log(`No valid links found for ${n.url}`)}return t}(t),o=n.map(t=>h(e,t.target)).filter(e=>e);return{nodes:t.concat(o),links:n}}function b(e,t,n){let o=e.outgoing_links.length,i=e.expanded?"-":`+${o}`,r=`${e.id} [${i}]`,a=12/n;t.font=`${a}px Sans-Serif`;let l=[t.measureText(r).width,a].map(e=>e+.2*a);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-l[0]/2,e.y-l[1]/2,...l),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(r,e.x,e.y),e.__bckgDimensions=l}function w(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}console.log("Load force graph in TS v 0.9");let v=[],k=null,_=null;function x(e){if(!_){console.log("Cannot center: Graph not initialized");return}if(!e){console.log("Cannot center: Node is null or undefined");return}_.centerAt(e.x,e.y,500),_.zoom(8,500),E(e)}function E(e){if(!e)return;k=e;let t=n(e),o=document.getElementById("detail");o&&(o.innerHTML=t)}function C(){k?k.url?window.open(k.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}function M(){for(let e of v)e.expanded=!1;k&&(k.expanded=!0),_&&(_.graphData(y(v)),k&&setTimeout(()=>{x(k)},300))}async function L(){if(!document.getElementById("graph")){console.log("Graph element not found, exiting initialization");return}window.location.hash.substr(1),v=Object.values(await s()).map(e=>({...e,id:e.url,expanded:!1}));let e=`/${window.location.hash?window.location.hash.substr(1):""}`,t=v.map(e=>e.url).includes(e)?e:"/eulogy";for(let e of v)e.expanded=e.url===t;if("undefined"==typeof ForceGraph){console.log("Force Graph not defined, providing fallback functionality");let e=h(v,t);e&&(E(e),k=e);let n=document.getElementById("center_control");n&&n.addEventListener("click",()=>{console.log("Center control clicked (fallback mode)")});let o=document.getElementById("goto_control");o&&o.addEventListener("click",()=>{k?.url&&window.open(k.url,"_blank")});let i=document.getElementById("collapse_control");i&&i.addEventListener("click",()=>{console.log("Collapse control clicked (fallback mode)")});return}_=ForceGraph()(document.getElementById("graph")).graphData(y(v)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(b).nodePointerAreaPaint(w).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{e.expanded=!e.expanded,0===v.filter(e=>e.expanded).length&&(e.expanded=!0),_.graphData(y(v)),setTimeout(()=>{x(e)},300)});let n=h(v,t);n?x(n):console.log("Initial node not found, cannot center");let o=document.getElementById("center_control");o?o.addEventListener("click",()=>{k?x(k):console.log("No last detail node to center on")}):console.log("Center control element not found");let i=document.getElementById("goto_control");i&&i.addEventListener("click",C);let r=document.getElementById("collapse_control");r&&r.addEventListener("click",M)}"undefined"!=typeof window&&(window.initializeGraph=L);let T={iconClass:"header-copy-link",tooltipDuration:2e3,domainMapping:{from:"idvork.in/",to:"idvorkin.azurewebsites.net/"}};function S(e,t){let n=e;return n=n.replace("localhost:4000/","idvorkin.azurewebsites.net/"),t.domainMapping&&(n=n.replace(t.domainMapping.from,t.domainMapping.to)),n=n.replace("#","/")}async function I(e,t){try{let n=window.location.href.split("#")[0],o=`${n}#${e}`,i=S(o,t);await navigator.clipboard.writeText(i),console.log(`Copied header link: ${i}`)}catch(i){console.error("Failed to copy header link:",i);let n=document.createElement("textarea"),o=window.location.href.split("#")[0];n.value=S(`${o}#${e}`,t),document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n)}}function D(e={}){let t={...T,...e};for(let e of Array.from((document.getElementById("content-holder")||document.body).querySelectorAll("h1, h2, h3, h4, h5, h6")))!function(e,t){if(e.querySelector(`.${t.iconClass||T.iconClass}`))return;let n=function(e){if(e.id)return e.id;let t=(e.textContent||"").toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""),n=t,o=1;for(;document.getElementById(n);)n=`${t}-${o}`,o++;return e.id=n,n}(e),o=function(e){let t=document.createElement("span");return t.className=e.iconClass||T.iconClass||"",t.innerHTML="\uD83D\uDD17",t.title="Copy link to this section",t.style.cursor="pointer",t.style.marginLeft="0.5rem",t.style.opacity="0",t.style.transition="opacity 0.2s ease",t.style.fontSize="0.8em",t.style.userSelect="none",t}(t);o.addEventListener("click",async e=>{e.preventDefault(),e.stopPropagation(),await I(n,t),function(e,t=2e3){let n=document.createElement("span");n.textContent="Copied!",n.style.position="absolute",n.style.backgroundColor="#333",n.style.color="white",n.style.padding="4px 8px",n.style.borderRadius="4px",n.style.fontSize="12px",n.style.zIndex="1000",n.style.marginLeft="10px",n.style.marginTop="-5px",e.parentElement?.appendChild(n),setTimeout(()=>{n.remove()},t)}(o,t.tooltipDuration)}),e.appendChild(o),e.addEventListener("mouseenter",()=>{o.style.opacity="1"}),e.addEventListener("mouseleave",()=>{o.style.opacity="0"})}(e,t)}let N=!1;function z(){console.log("\uD83D\uDDBC️ Enabling image zoom functionality");let e=document.createElement("div");if(e.style.cssText="position: fixed; top: 10px; right: 10px; background: yellow; padding: 10px; z-index: 9999;",e.textContent="Image zoom initializing...",document.body.appendChild(e),void 0===window.GLightbox){console.warn("⚠️ GLightbox not found, retrying in 100ms"),setTimeout(z,100);return}let t=document.querySelectorAll("p img, li img, .container img, .post-content img, article img, .markdown-body img, main img");console.log(`\u{1F50D} Found ${t.length} images to process`);let n=0;t.forEach((e,t)=>{if(e.parentElement?.tagName==="A"){console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - already wrapped`);return}if(e.naturalWidth>0&&e.naturalWidth<100&&e.naturalHeight<100){console.log(`\u{23ED}\u{FE0F} Skipping image ${t+1} - too small (${e.naturalWidth}x${e.naturalHeight})`);return}let o=document.createElement("a");o.href=e.src,o.className="glightbox",o.setAttribute("data-gallery","post-images"),e.alt&&o.setAttribute("data-description",e.alt),e.parentNode?.insertBefore(o,e),o.appendChild(e),n++,console.log(`\u{2705} Processed image ${t+1}: ${e.src.substring(e.src.lastIndexOf("/")+1)}`)}),n>0?(window.GLightbox({selector:".glightbox",touchNavigation:!0,loop:!0,autoplayVideos:!0}),console.log(`\u{1F389} Image zoom enabled for ${n} images`),e.textContent=`\u{2705} Image zoom enabled for ${n} images`,e.style.background="#90EE90"):(console.log("ℹ️ No images needed processing"),e.textContent="ℹ️ No images needed processing",e.style.background="#FFE4B5"),setTimeout(()=>e.remove(),3e3)}"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",z):setTimeout(z,500));let B=!0;function O(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");if(0===e.length||0===t.length){console.warn("TOC or toggle elements not found for expand/collapse");return}B?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function A(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function F(e,t){let n=$(`#${e}`);if(0===n.length){console.warn(`Target element #${e} not found for TOC generation`);return}if(n.html(""),0===$("#content-holder").length){console.warn("Content holder not found for TOC generation");return}new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),i=$('<a class="expand-toggle" href="#">Collapse all</a>'),r=$('<a class="back-to-top" href="#">Top of page</a>'),a=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),l=$('<a class="go-to-bottom" href="#">Pin ToC</a>');O(),i.click(e=>{e.preventDefault(),e.stopPropagation(),B=!B,O()}),r.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),a.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),l.click(e=>A()),o.append(i).append(r).append(a),t&&o.append(l),n.append(o)}async function P(e){let t,o,i;try{if(!e){console.log("No backlinks available");return}if(!e[t=new URL(document.URL).pathname]){console.log(`Page ${t} not found in backlinks`);return}if(o=e[t]?.incoming_links,i=e[t]?.outgoing_links,!o&&!i){console.log(`No backlinks for the page ${t}`);return}}catch(e){console.log(`Error processing links: ${e instanceof Error?e.message:String(e)}`);return}let r=$("#links-to-page");if(!r||0===r.length){console.log("No back_link_location");return}r.append(`
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
`);let a=r.find("#incoming"),l=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(o)for(let t of o.sort(l)){let o=e[t];a.append(n(o))}let s=[];for(let t of i)e[t]&&s.push(t);let c=r.find("#outgoing");if(s)for(let t of s.sort(l)){let o=e[t];c.append(n(o))}let d=r.find("#graph"),u=t.replace(/\//g,"");d.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function H(e,t){let n=e?.attr?e.attr("href"):"unknown";return`<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`}async function j(){let e="__idvorkin_add_link_loader_initialized__";window[e]||(window[e]=!0,P(await s()),function(e){if(!e){console.log("No backlinks data available");return}try{let t=$.makeArray($(".summary-link"));if(!t||0===t.length){console.log("No summary links found");return}for(let n of t){let t=$(n);try{if(!t||!t.attr){console.log("Invalid link element");return}let n=t.attr("href");if(!n){t.html(H(t,"missing href"));return}if(!e.redirects||!e.url_info){t.html(H(t,"incomplete backLinks data"));return}if(void 0!==e.redirects[n]&&(n=e.redirects[n]),void 0===e.url_info[n]){t.html(H(t,"not found in url info"));return}t.html(function(e,t){if(!t)return H(e,"URL info is undefined");let n=t.url||"#",o=t.title||"Untitled",i=t.description||"No description available",r=`(From:<a href='${n}'> ${o}</a>)`;return`<div>
        <i> ${i}</i> ${r}
    </div>`}(t,e.url_info[n]))}catch(e){t?.html?t.html(H(t,e)):console.error("Error processing link and unable to display error:",e)}}}catch(e){console.error("Error processing summary links:",e)}}(await J()))}let R=null;async function J(){try{if(null!=R)return R;let e=window.location.href.includes("https://idvork.in"),t="";t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json";try{let e=await $.getJSON(t);return e.redirects||(e.redirects={}),e.url_info||(e.url_info={}),R=e}catch(e){return console.error("Error fetching backlinks JSON:",e),{redirects:{},url_info:{}}}}catch(e){return console.error("Error in get_back_links:",e),{redirects:{},url_info:{}}}}function W(){let e=window.Mousetrap();e.bind("s",e=>void $("#autocomplete-search-box-button").click()),e.bind("t",e=>A()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n="http://localhost:4000",o=e.includes(t),i=e;i=o?e.replace(t,n):e.replace(n,t),window.location.href=i})()),e.bind("a",e=>{location.href="/all"}),e.bind("m",e=>{location.href="/toc"}),e.bind("6",e=>{location.href="/ig66"});let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function G(){!function(e){for(let[t,n]of Object.entries(e)){let e="undefined"!=typeof $&&$.fn?$(`a[href=${t}]`).first()[0]:document.querySelector(`a[href="${t}"]`);if(!e)return;let o=n.cloneNode(!0);o.children.length>0&&o.children[0].remove(),e.replaceWith(o),n.remove()}}(function(){let e={};for(let t of"undefined"!=typeof $&&$.fn?$("ul").toArray():Array.from(document.querySelectorAll("ul"))){let n=t.firstElementChild;if(!n)continue;let o=n.textContent;o&&o.startsWith("l")&&(Number.isNaN(Number.parseInt(o.substring(1)))||(e[o]=t))}return e}())}function U(){let e="__idvorkin_load_globals_initialized__";window[e]||(window[e]=!0,$(j),$(W),"undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(G):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",G):G()),function(e="recent-posts",t=document){"loading"===t.readyState?t.addEventListener("DOMContentLoaded",()=>{m(e)}):m(e)}(),document.getElementById("last-modified-posts")&&f(),$(()=>{F("ui-toc",!0),F("ui-toc-affix",!1)}),function(e={}){N||(N=!0,function(){let e="header-copy-link-styles";if(document.getElementById(e))return;let t=document.createElement("style");t.id=e,t.textContent=`
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
  `,document.head.appendChild(t)}(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{D(e)}):D(e))}(),z())}if("undefined"!=typeof $&&$.fn&&$.fn.ready?$(document).ready(U):"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",U):U()),"undefined"!=typeof window&&window["@algolia/autocomplete-js"]){let n=window["@algolia/autocomplete-js"];e=n.autocomplete,t=n.getAlgoliaResults}function q({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;e.anchor&&(t+=`#${e.anchor}`);let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,i=n?.content?.value??"";return`
           <span onClick="window.location='${t}';">
              <b> <a href="${t}">${o}</a></b> <span>${i}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function V(){let e=o(Object.entries(await s()).map(e=>e[1]));return{title:e.title,url:e.url,description:e.description}}async function Y(e=4){try{let t=await s();return Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function Q(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>V()))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function Z(e=4){return{sourceId:"recent_posts",getItems:async()=>await Y(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function K(n,o,i,r,a,l=3,s=4,c=3){if(!e){console.error("Autocomplete is not defined");return}let d=algoliasearch(n,o),u=await Q(c),p=await Z(s),g=r.startsWith("#")?r:`#${r}`;if(0===$(g).length){console.log("No autocomplete element found","autocomplete_id",r);return}return e({container:g,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let n=0===e.length;n&&(e=" ");let o=function(e,n,o,i=3,r=!1){let a="NOT tags:family-journal";return r&&(a=""),{sourceId:"featured_posts",getItems:()=>t?t({searchClient:e,queries:[{indexName:n,query:o,filters:a,params:{hitsPerPage:i,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}):(console.error("getAlgoliaResults is not defined"),[]),templates:{item:q,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(d,i,e,n?l:10,a);return n?[o,p,u]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}class X{constructor({name:e,value:t=25,children:n=[]}){this.name=e,this.children=i(n),this.value=t}}function ee(e=en,t=et){let n=e();for(let e of n.keys())t(e,n.get(e))}function et(e,t,n=$,i=a){let r=n('<div class="alert alert-primary" role="alert"/>');n(e).after(r),i(r,()=>`<span>${o(t)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}function en(e=$){let t=e("h3").first(),n=t,o=[],i=new Map;for(let r=t;0!==r.length;r=e(r).next()){if("H3"===r.prop("tagName")){i.set(n,o),n=r,o=[];continue}"UL"===r.prop("tagName")&&(o=Array.from(e(r).find("li")).map(t=>e(t).text()))}return i.set(n,o),i}function*eo(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function ei(e=en){return new Map(Array.from(e().entries()).map(([e,t],n)=>[e.text(),t]))}function er(e,t,n){let[i,r]=Array.from(eo(t)).find(([t,n])=>t.name===e);return o(Array.from(eo(i)).map(([e,t])=>e).filter(e=>n.has(e.name)).flatMap(e=>n.get(e.name).map(t=>`${e.name}: ${t}`)))}async function ea(e,t,n,o=$,i=Plotly){if(!i){console.error("Plotly is not available");return}let r=function(e){let t=Array.from(eo(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n),a={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(a,r),a.values=void 0;try{let r=await i.newPlot(e,[a],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1}),l=e=>{o(`#${t}`).text(e)};return o(`#${t}`).first().click(()=>{let e=o("#sunburst text:first").text(),t=er(e,n,ei());l(t)}),r.on("plotly_sunburstclick",e=>{let t=e.points[0].label,o=er(t,n,ei());l(o)}),r}catch(e){return console.error("Failed to create sunburst plot:",e),null}}function el(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),i=new Date(e.published),r=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][i.getMonth()]} ${i.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!==e.thumbnail?(console.log(e.title),console.log(i),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${r}
      </div>`)):t.append(r),t.html()}function es(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}a("#random-post",()=>el(o(e))),a("#achievment",()=>el(o(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),a("#random-recent",()=>el(o(e.filter(e=>e.tags.includes("family-journal")))))}function ec(){$.getJSON("/ig66/ig66-export.json",es)}function ed(e){$.getJSON("/eulogy.json",t=>(function(e,t){if(!t){console.log("No roles being imported");return}console.log("Processing",t.roles.length,"roles"),a(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(o(t.roles)))})(e,t))}class eu{get_tree(){return new X({name:"7H ",children:[new X({name:""}),new X({name:"Be Proactive"}),new X({name:"Begin with the end in mind"}),new X({name:"First things First"}),new X({name:"Think Win/Win"}),new X({name:"First Understand"}),new X({name:"Synergize"}),new X({name:"Sharpen the Saw"})]})}}class ep{get_tree(){let e=new X({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new X({name:"Magic",children:[new X({name:"Card Magic"}),new X({name:"Coin Magic"}),new X({name:"Band Magic"})]}),n=new X({name:"Hobbies",children:[new X({name:"Biking"}),new X({name:"Tech"}),new X({name:"Juggling"})]}),o=new X({name:"Relationships",children:[new X({name:"Zach"}),new X({name:"Amelia"}),new X({name:"Tori"}),new X({name:"Friends"})]}),i=new X({name:"Joy",children:[new X({name:"Balloons"}),new X({name:"Joy to Others"})]});return new X({name:"Invest in",children:[e,t,n,o,i]})}}function eg({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,i=`audio_player_${Math.floor(1e10*Math.random())}`,r=e.replace(/\//g,"_");return`
    <div>
        <audio id='${i}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${r}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${i}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function ef(e=s,t=o){try{let n=await e(),o=Object.entries(n).map(e=>e[1]),i=t(o);return eg({url:i.url,title:i.title,description:i.description})}catch(e){return console.error("Error generating random post HTML:",e),"<div>Could not load random post</div>"}}function em(e="#e1",t="#e2",n="#e3",o=ed){try{o(e),o(t),o(n)}catch(e){console.error("Error loading random eulogy:",e)}}function eh(e=ea,t=ee,n=ec,o=ed,i=a){try{e("sunburst","sunburst_text",new ep().get_tree()),t(),n(),o("#random-eulogy-role"),i("#random-blog-posts",async()=>await ef())}catch(e){console.error("❌ Error loading enjoy page:",e)}}function ey(e=ea,t=ee){try{e("sunburst","sunburst_text",new eu().get_tree()),t()}catch(e){console.error("Error loading 7 habits page:",e)}}function eb(e=ec){try{e()}catch(e){console.error("Error loading IG66 page:",e)}}function e$(e=ex,t=e_,n=ek){try{e("balance-heatmap-rest"),t("balance-heatmap-work"),n("balance-radar-map-ideal")}catch(e){console.error("Error loading balance page:",e)}}let ew=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],ev="#00BF00";async function ek(e,t){if(void 0!==t&&t)try{await t.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}catch(e){console.error("Error creating radar map:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function e_(e,t){let n=["Tech","Work"],o={height:20*n.length+100,margin:{t:5},pad:0},i=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,ev],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:ew.slice(2,13),y:n,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];if(void 0!==t&&t)try{await t.newPlot(e,i,o,{displayModeBar:!1})}catch(e){console.error("Error creating work balance chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function ex(e,t){let n=["Health","Hobbies","Family","Magic"],o=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,ev],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:ew.slice(2,13),y:n.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],i={height:20*n.length+100,margin:{t:5},pad:0};if(void 0!==t&&t)try{await t.newPlot(e,o,i,{displayModeBar:!1})}catch(e){console.error("Error creating rest time chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}$(document).ready(()=>{r(U);let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let t=["item1","item2","item3"];console.log("Random item:",o(t)),console.log("Shuffled items:",i([...t])),s().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{o as random_from_list,i as shuffle,a as append_randomizer_div,r as defer,s as get_link_info,U as load_globals,n as MakeBackLinkHTML,K as CreateAutoComplete,f as initRecentAllPosts,ee as add_random_prompts,ea as add_sunburst,X as TreeNode,eh as load_enjoy2,ey as load_7_habits,eg as makePostPreviewHTML,eb as load_ig66,e$ as load_balance,em as load_random_eulogy};
//# sourceMappingURL=index.js.map
