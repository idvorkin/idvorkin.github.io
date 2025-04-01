let e,t;function n(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function o(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function l(e){let t=e.length,n;for(;0!=t;)n=Math.floor(Math.random()*t),t--,[e[t],e[n]]=[e[n],e[t]];return e}async function i(e,t){let n=$(e);if(1!=n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async function(e){if("A"!=e.target.tagName){let e=$(await t());n.empty().append(e)}})}let r=null;async function a(e){if(null!=r)return r;let t=(e||window.location.href).includes("https://idvork.in");var n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return r=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function s(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await a(e)}catch(e){throw Error("Missing url_info in data structure")}}async function c(){return[...Object.entries(await s()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}async function d(e="recent-posts"){console.log("\uD83D\uDD0D updateRecentPosts function called");let t=document.getElementById(e);if(console.log("\uD83D\uDD0D recent-posts container element:",t?"found":"not found"),!t){console.error(`\u{274C} ${e} container not found in DOM`);return}try{var n;console.log("\uD83D\uDD0D Fetching back-links.json...");let e=await c();console.log("\uD83D\uDD0D Sorted pages, first 5:",e.slice(0,5).map(e=>({url:e.url,title:e.title,last_modified:e.last_modified})));let o=(n=function(e,t=5){return e.slice(0,t)}(e),0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `);console.log("\uD83D\uDD0D Updating recent-posts content with HTML",o.substring(0,100)+"..."),t.innerHTML=o,console.log("✅ Recent posts updated successfully")}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function u(e){let t={};return e.forEach(e=>{if(!e.last_modified)return;let n=new Date(e.last_modified),o=`${n.toLocaleString("default",{month:"long"})} ${n.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(e)}),t}function g(e){let t="";return Object.entries(e).forEach(([e,n])=>{t+=`
      <h3>${e}</h3>
      <ul class="last-modified-list">
        ${n.map(e=>{let t=new Date(e.last_modified).toLocaleDateString("en-US",{day:"numeric",month:"short"});return`
          <li>
            <span class="date-badge">${t}</span>
            <a href="${e.url}">${e.title}</a>
            <p class="description">${e.description.split("\n")[0].substring(0,150)}${e.description.length>150?"...":""}</p>
          </li>
        `}).join("")}
      </ul>
    `}),t}async function p(e="last-modified-posts",t=15,n=document){console.log("\uD83D\uDD0D updateRecentPosts function called");let o=n.getElementById(e);if(console.log("\uD83D\uDD0D recent-posts container element:",o),!o){console.error(`\u{274C} ${e} container not found in DOM`);return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let e=await c(),l=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),l=g(u(n));if(o.length>0){var i,r;l+=(i=g(u(o)),r=o.length,`
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
  `+l}(e,t);console.log("\uD83D\uDD0D Updating recent-posts content with HTML",l.substring(0,100)+"..."),o.innerHTML=l,function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);if(!o){console.log(`Toggle element with ID ${e} not found`);return}o.addEventListener("click",function(){let e=n.getElementById(t);if(!e){console.log(`Content element with ID ${t} not found`);return}let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))})}("remaining-posts-toggle","remaining-posts-content",n),console.log("✅ Recent posts updated successfully")}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function f(e="last-modified-posts",t=document){console.log("\uD83D\uDD0D initRecentAllPosts called"),"loading"===t.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),t.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),p(e,15,t)})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),p(e,15,t)),console.log("\uD83D\uDD0D initRecentAllPosts completed initial setup")}function m(e,t){let n=e.filter(e=>e.url===t)[0];if(n)return n;let o=t.replace(/^\//,"").replace(/\/$/,"");return e.filter(e=>e.url.replace(/^\//,"").replace(/\/$/,"")===o)[0]}function h(e){let t=e.filter(e=>e.expanded);e.find(e=>"/eulogy"===e.url)||console.log("Eulogy node not found in pages");let n=function(e){let t=[];return e.forEach(e=>{[...e.outgoing_links||[],...e.incoming_links||[]].forEach(n=>{m(w,n)&&t.push({source:e,target:n,value:1})}),0===t.filter(t=>t.source===e).length&&"/eulogy"===e.url&&console.log(`No valid links found for ${e.url}`)}),t}(t),o=n.map(t=>m(e,t.target)).filter(e=>e);return{nodes:t.concat(o),links:n}}function b(e,t,n){let o=e.outgoing_links.length,l=e.expanded?"-":`+${o}`,i=e.id+" ["+l+"]",r=12/n;t.font=`${r}px Sans-Serif`;let a=[t.measureText(i).width,r].map(e=>e+.2*r);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-a[0]/2,e.y-a[1]/2,...a),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(i,e.x,e.y),e.__bckgDimensions=a}function y(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}console.log("Load force graph in TS v 0.9");let w=[],D=null,v=null;function k(e){if(!v){console.log("Cannot center: Graph not initialized");return}if(!e){console.log("Cannot center: Node is null or undefined");return}v.centerAt(e.x,e.y,500),v.zoom(8,500),function(e){if(!e)return;D=e;let t=n(e),o=document.getElementById("detail");o&&(o.innerHTML=t)}(e)}function _(){D?D.url?window.open(D.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}function x(){w.forEach(e=>{e.expanded=!1}),D&&(D.expanded=!0),v&&(v.graphData(h(w)),D&&setTimeout(()=>{k(D)},300))}async function E(){if(!document.getElementById("graph")){console.log("Graph element not found, exiting initialization");return}window.location.hash.substr(1),w=Object.values(await a()).map(e=>({...e,id:e.url,expanded:!1}));let e="/"+(window.location.hash?window.location.hash.substr(1):""),t=w.map(e=>e.url).includes(e)?e:"/eulogy";if(w.forEach(e=>{e.expanded=e.url==t}),"undefined"==typeof ForceGraph){console.log("Force Graph not defined, exiting initialization");return}v=ForceGraph()(document.getElementById("graph")).graphData(h(w)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(b).nodePointerAreaPaint(y).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{e.expanded=!e.expanded,0==w.filter(e=>e.expanded).length&&(e.expanded=!0),v.graphData(h(w)),setTimeout(()=>{k(e)},300)});let n=m(w,t);n?k(n):console.log("Initial node not found, cannot center");let o=document.getElementById("center_control");o?o.addEventListener("click",()=>{D?k(D):console.log("No last detail node to center on")}):console.log("Center control element not found");let l=document.getElementById("goto_control");l&&l.addEventListener("click",_);let i=document.getElementById("collapse_control");i&&i.addEventListener("click",x)}"undefined"!=typeof window&&(window.initializeGraph=E);let M=!0;function T(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");if(0===e.length||0===t.length){console.warn("TOC or toggle elements not found for expand/collapse");return}M?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function C(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function L(e,t){let n=$(`#${e}`);if(0===n.length){console.warn(`Target element #${e} not found for TOC generation`);return}if(n.html(""),0===$("#content-holder").length){console.warn("Content holder not found for TOC generation");return}new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),l=$('<a class="expand-toggle" href="#">Collapse all</a>'),i=$('<a class="back-to-top" href="#">Top of page</a>'),r=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),a=$('<a class="go-to-bottom" href="#">Pin ToC</a>');T(),l.click(e=>{e.preventDefault(),e.stopPropagation(),M=!M,T()}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),r.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),a.click(e=>C()),o.append(l).append(i).append(r),t&&o.append(a),n.append(o)}async function P(e){let t,o,l;try{if(!e){console.log("No backlinks available");return}if(!e[t=new URL(document.URL).pathname]){console.log(`Page ${t} not found in backlinks`);return}if(o=e[t]?.incoming_links,l=e[t]?.outgoing_links,!o&&!l){console.log(`No backlinks for the page ${t}`);return}}catch(e){console.log(`Error processing links: ${e.message}`);return}let i=$("#links-to-page");if(!i||0===i.length){console.log("No back_link_location");return}i.append(`
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
`);let r=i.find("#incoming");var a=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(o)for(var s of o.sort(a)){let t=e[s];r.append(n(t))}let c=[];for(var s of l)e[s]&&c.push(s);let d=i.find("#outgoing");if(c)for(let t of c.sort(a)){let o=e[t];d.append(n(o))}console.log("Added Graph");let u=i.find("#graph"),g=t.replace(/\//g,"");u.append(`<a href='/graph#${g}'>${t} (${g}) </a>`)}function I(e,t){let n=e&&e.attr?e.attr("href"):"unknown";return`<span class='text-danger'>Error: Invalid link for ${n} ${t} </span>`}async function R(){P(await a()),function(e){if(!e){console.log("No backlinks data available");return}try{let t=$.makeArray($(".summary-link"));if(!t||0===t.length){console.log("No summary links found");return}t.forEach(t=>{let n=$(t);try{if(!n||!n.attr){console.log("Invalid link element");return}console.log(n.attr("href"));let t=n.attr("href");if(!t){n.html(I(n,"missing href"));return}if(!e.redirects||!e.url_info){n.html(I(n,"incomplete backLinks data"));return}if(void 0!=e.redirects[t]&&(t=e.redirects[t]),void 0==e.url_info[t]){n.html(I(n,"not found in url info"));return}n.html(function(e,t){if(!t)return I(e,"URL info is undefined");let n=t.url||"#",o=t.title||"Untitled",l=t.description||"No description available",i=`(From:<a href='${n}'> ${o}</a>)`;return`<div>
        <i> ${l}</i> ${i}
    </div>`}(n,e.url_info[t]))}catch(e){n&&n.html?n.html(I(n,e)):console.error("Error processing link and unable to display error:",e)}})}catch(e){console.error("Error processing summary links:",e)}}(await S())}let N=null;async function S(){try{if(null!=N)return N;let t=window.location.href.includes("https://idvork.in");var e="";e=t?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json";try{let t=await $.getJSON(e);return t.redirects||(t.redirects={}),t.url_info||(t.url_info={}),N=t}catch(e){return console.error("Error fetching backlinks JSON:",e),{redirects:{},url_info:{}}}}catch(e){return console.error("Error in get_back_links:",e),{redirects:{},url_info:{}}}}function A(){let e=Mousetrap();e.bind("s",e=>void $("#autocomplete-search-box-button").click()),e.bind("t",e=>C()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n="http://localhost:4000",o=e.includes(t),l=e;l=o?e.replace(t,n):e.replace(n,t),window.location.href=l})()),e.bind("a",e=>location.href="/all"),e.bind("m",e=>location.href="/toc"),e.bind("6",e=>location.href="/ig66");let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function O(){console.log("\uD83D\uDD04 Replacing List Placeholders in Tables"),function(e){Object.entries(e).forEach(([e,t])=>{let n=$(`a[href=${e}]`).first();if(!n.length)return;let o=$(t).clone();o.children().length>0&&o.children().first().remove(),n.replaceWith(o),$(t).remove()})}(function(){let e={};return $("ul").each((t,n)=>{let o=n.firstElementChild;if(!o)return;let l=o.textContent;l&&l.startsWith("l")&&(isNaN(parseInt(l.substring(1)))||(e[l]=n))}),e}())}function j(){$(R),$(A),$(document).ready(O),console.log("\uD83D\uDE80 About to call initRecentPosts from main.ts"),function(e="recent-posts",t=document){console.log("\uD83D\uDD0D initRecentPosts called"),"loading"===t.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),t.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),d(e)})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),d(e)),console.log("\uD83D\uDD0D initRecentPosts completed initial setup")}(),console.log("✅ Called initRecentPosts from main.ts"),document.getElementById("last-modified-posts")&&(console.log("\uD83D\uDE80 About to call initRecentAllPosts from main.ts"),f(),console.log("✅ Called initRecentAllPosts from main.ts")),$(function(){L("ui-toc",!0),L("ui-toc-affix",!1)})}if("undefined"!=typeof window&&window["@algolia/autocomplete-js"]){let n=window["@algolia/autocomplete-js"];e=n.autocomplete,t=n.getAlgoliaResults}function z({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;e.anchor&&(t+=`#${e.anchor}`);let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,l=n?.content?.value??"";return`
           <span onClick="window.location='${t}';">
              <b> <a href="${t}">${o}</a></b> <span>${l}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function H(){let e=o(Object.entries(await a()).map(e=>e[1]));return{title:e.title,url:e.url,description:e.description}}async function B(e=4){try{let t=await a();return Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function F(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>H()))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function J(e=4){return{sourceId:"recent_posts",getItems:async()=>await B(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function U(n,o,l,i,r,a=3,s=4,c=3){if(!e){console.error("Autocomplete is not defined");return}let d=algoliasearch(n,o),u=await F(c),g=await J(s),p=i.startsWith("#")?i:`#${i}`;if(0===$(p).length){console.log("No autocomplete element found","autocomplete_id",i);return}return e({container:p,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let n=0===e.length;n&&(e=" ");let o=function(e,n,o,l=3,i=!1){let r="NOT tags:family-journal";return i&&(r=""),{sourceId:"featured_posts",getItems:()=>t?t({searchClient:e,queries:[{indexName:n,query:o,filters:r,params:{hitsPerPage:l,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}):(console.error("getAlgoliaResults is not defined"),[]),templates:{item:z,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(d,l,e,n?a:10,r);return n?[o,g,u]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}class G{constructor({name:e,value:t=25,children:n=[]}){this.name=e,this.children=l(n),this.value=t}}function W(e=Y,t=q){let n=e();for(let e of n.keys())t(e,n.get(e))}function q(e,t,n=$,l=i){let r=n('<div class="alert alert-primary" role="alert"/>');n(e).after(r),l(r,()=>`<span>${o(t)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}function Y(e=$){let t=e("h3").first(),n=t,o=[],l=new Map;for(let i=t;0!=i.length;i=e(i).next()){if("H3"==i.prop("tagName")){l.set(n,o),n=i,o=[];continue}"UL"==i.prop("tagName")&&(o=Array.from(e(i).find("li")).map(t=>e(t).text()))}return l.set(n,o),l}function*Q(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function V(e=Y){return new Map(Array.from(e().entries()).map(([e,t],n)=>[e.text(),t]))}function Z(e,t,n){let[l,i]=Array.from(Q(t)).find(([t,n])=>t.name==e);return o(Array.from(Q(l)).map(([e,t])=>e).filter(e=>n.has(e.name)).map(e=>n.get(e.name).map(t=>`${e.name}: ${t}`)).flat())}async function K(e,t,n,o=$,l=Plotly){if(!l){console.error("Plotly is not available");return}let i=function(e){let t=Array.from(Q(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n);var r={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(r,i),delete r.values;try{let i=await l.newPlot(e,[r],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1}),a=e=>{o(`#${t}`).text(e)};return o(`#${t}`).first().click(()=>{let e=o("#sunburst text:first").text(),t=Z(e,n,V());a(t)}),i.on("plotly_sunburstclick",e=>{let t=e.points[0].label,o=Z(t,n,V());a(o)}),i}catch(e){return console.error("Failed to create sunburst plot:",e),null}}function X(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),l=new Date(e.published),i=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][l.getMonth()]} ${l.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!=e.thumbnail?(console.log(e.title),console.log(l),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${i}
      </div>`)):t.append(i),t.html()}function ee(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}i("#random-post",()=>X(o(e))),i("#achievment",()=>X(o(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),i("#random-recent",()=>X(o(e.filter(e=>e.tags.includes("family-journal")))))}function et(){$.getJSON("/ig66/ig66-export.json",ee)}function en(e){$.getJSON("/eulogy.json",t=>(function(e,t){if(!t){console.log("No roles being imported");return}console.log("Processing",t.roles.length,"roles"),i(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(o(t.roles)))})(e,t))}class eo{get_tree(){return new G({name:"7H ",children:[new G({name:""}),new G({name:"Be Proactive"}),new G({name:"Begin with the end in mind"}),new G({name:"First things First"}),new G({name:"Think Win/Win"}),new G({name:"First Understand"}),new G({name:"Synergize"}),new G({name:"Sharpen the Saw"})]})}}class el{get_tree(){let e=new G({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new G({name:"Magic",children:[new G({name:"Card Magic"}),new G({name:"Coin Magic"}),new G({name:"Band Magic"})]}),n=new G({name:"Hobbies",children:[new G({name:"Biking"}),new G({name:"Tech"}),new G({name:"Juggling"})]}),o=new G({name:"Relationships",children:[new G({name:"Zach"}),new G({name:"Amelia"}),new G({name:"Tori"}),new G({name:"Friends"})]}),l=new G({name:"Joy",children:[new G({name:"Balloons"}),new G({name:"Joy to Others"})]});return new G({name:"Invest in",children:[e,t,n,o,l]})}}function ei({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,l="audio_player_"+Math.floor(1e10*Math.random()),i=e.replace(/\//g,"_");return`
    <div>
        <audio id='${l}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${l}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function er(e=a,t=o){try{let n=await e(),o=Object.entries(n).map(e=>e[1]),l=t(o);return ei({url:l.url,title:l.title,description:l.description})}catch(e){return console.error("Error generating random post HTML:",e),"<div>Could not load random post</div>"}}function ea(e="#e1",t="#e2",n="#e3",o=en){try{o(e),o(t),o(n)}catch(e){console.error("Error loading random eulogy:",e)}}function es(e=K,t=W,n=et,o=en,l=i){try{e("sunburst","sunburst_text",new el().get_tree()),t(),n(),o("#random-eulogy-role"),l("#random-blog-posts",er)}catch(e){console.error("Error loading enjoy page:",e)}}function ec(e=K,t=W){try{e("sunburst","sunburst_text",new eo().get_tree()),t()}catch(e){console.error("Error loading 7 habits page:",e)}}function ed(e=et){try{e()}catch(e){console.error("Error loading IG66 page:",e)}}function eu(e=eh,t=em,n=ef){try{e("balance-heatmap-rest"),t("balance-heatmap-work"),n("balance-radar-map-ideal")}catch(e){console.error("Error loading balance page:",e)}}let eg=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"],ep="#00BF00";async function ef(e,t){if(void 0!==t&&t)try{await t.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}catch(e){console.error("Error creating radar map:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function em(e,t){let n=["Tech","Work"],o={height:20*n.length+100,margin:{t:5},pad:0},l=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,ep],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:eg.slice(2,13),y:n,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];if(void 0!==t&&t)try{await t.newPlot(e,l,o,{displayModeBar:!1})}catch(e){console.error("Error creating work balance chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}async function eh(e,t){let n=["Health","Hobbies","Family","Magic"],o=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,ep],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:eg.slice(2,13),y:n.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],l={height:20*n.length+100,margin:{t:5},pad:0};if(void 0!==t&&t)try{await t.newPlot(e,o,l,{displayModeBar:!1})}catch(e){console.error("Error creating rest time chart:",e)}else console.warn("Plotly is not defined, skipping chart rendering")}$(document).ready(function(){"function"==typeof defer?defer(j):j();let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let t=["item1","item2","item3"];console.log("Random item:",o(t)),console.log("Shuffled items:",l([...t])),a().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{o as random_from_list,l as shuffle,i as append_randomizer_div,a as get_link_info,j as load_globals,n as MakeBackLinkHTML,U as CreateAutoComplete,f as initRecentAllPosts,W as add_random_prompts,K as add_sunburst,G as TreeNode,es as load_enjoy2,ec as load_7_habits,ei as makePostPreviewHTML,ed as load_ig66,eu as load_balance,ea as load_random_eulogy};
//# sourceMappingURL=index.js.map
