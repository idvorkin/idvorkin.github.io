function e(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function t(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function n(e){let t=e.length,n;for(;0!=t;)n=Math.floor(Math.random()*t),t--,[e[t],e[n]]=[e[n],e[t]];return e}async function o(e,t){let n=$(e);if(1!=n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async function(e){if("A"!=e.target.tagName){let e=$(await t());n.empty().append(e)}})}let l=null;async function a(e){if(null!=l)return l;let t=(e||window.location.href).includes("https://idvork.in");var n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return l=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function i(){console.log("\uD83D\uDD0D updateRecentPosts function called");let e=document.getElementById("recent-posts");if(console.log("\uD83D\uDD0D recent-posts container element:",e),!e){console.error("❌ recent-posts container not found in DOM");return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let t=await fetch("/back-links.json"),n=await t.json();if(console.log("\uD83D\uDD0D Received data from back-links.json:",n),console.log("\uD83D\uDD0D Keys in data:",Object.keys(n)),!n.url_info){console.error("❌ Missing url_info in data structure"),e.innerHTML="<p>Error: Could not load recent posts data.</p>";return}let o=n.url_info;console.log("\uD83D\uDD0D Number of entries in urlInfoMap:",Object.keys(o).length);let l=Object.entries(o).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""}));console.log("\uD83D\uDD0D Transformed pages array, length:",l.length);let a=l.filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim());console.log("\uD83D\uDD0D Filtered real pages, length:",a.length),console.log("\uD83D\uDD0D First 3 real pages:",a.slice(0,3));let i=a.sort((e,t)=>e.last_modified&&t.last_modified?(console.log("\uD83D\uDD0D Comparing last_modified dates:",e.url,e.last_modified,"vs",t.url,t.last_modified),new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime()):t.doc_size-e.doc_size);console.log("\uD83D\uDD0D Sorted pages, first 5:",i.slice(0,5).map(e=>({url:e.url,title:e.title,last_modified:e.last_modified})));let r=i.slice(0,5);if(0===r.length){console.warn("⚠️ No recent pages found after filtering and sorting"),e.innerHTML="<p>No recent posts found.</p>";return}let s=`
      <ul>
        ${r.map(e=>`
          <li>
            <a href="${e.url}">${e.title}</a> - 
            ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
          </li>
        `).join("")}
      </ul>
    `;console.log("\uD83D\uDD0D Updating recent-posts content with HTML",s.substring(0,100)+"..."),e.innerHTML=s,console.log("✅ Recent posts updated successfully")}catch(t){console.error("❌ Error loading recent posts:",t),e.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}async function r(){console.log("\uD83D\uDD0D updateRecentPosts function called");let e=document.getElementById("last-modified-posts");if(console.log("\uD83D\uDD0D recent-posts container element:",e),!e){console.error("❌ recent-posts container not found in DOM");return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let t=await a();console.log("\uD83D\uDD0D Number of entries in urlInfoMap:",Object.keys(t).length);let n=Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""}));console.log("\uD83D\uDD0D Transformed pages array, length:",n.length);let o=n.filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim());console.log("\uD83D\uDD0D Filtered real pages, length:",o.length);let l=o.sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size);if(0===l.length){console.warn("⚠️ No pages found after filtering and sorting"),e.innerHTML="<p>No modified posts found.</p>";return}let i=l.slice(15),r={};l.slice(0,15).forEach(e=>{if(!e.last_modified)return;let t=new Date(e.last_modified),n=`${t.toLocaleString("default",{month:"long"})} ${t.getFullYear()}`;r[n]||(r[n]=[]),r[n].push(e)});let s="";if(Object.entries(r).forEach(([e,t])=>{s+=`
        <h3>${e}</h3>
        <ul class="last-modified-list">
          ${t.map(e=>{let t=new Date(e.last_modified).toLocaleDateString("en-US",{day:"numeric",month:"short"});return`
            <li>
              <span class="date-badge">${t}</span>
              <a href="${e.url}">${e.title}</a>
              <p class="description">${e.description.split("\n")[0].substring(0,150)}${e.description.length>150?"...":""}</p>
            </li>
          `}).join("")}
        </ul>
      `}),i.length>0){let e={};i.forEach(t=>{if(!t.last_modified)return;let n=new Date(t.last_modified),o=`${n.toLocaleString("default",{month:"long"})} ${n.getFullYear()}`;e[o]||(e[o]=[]),e[o].push(t)});let t="";Object.entries(e).forEach(([e,n])=>{t+=`
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
        `}),s+=`
        <div class="remaining-posts-section">
          <h2 id="remaining-posts-toggle" class="remaining-toggle">
            <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${i.length} more)
          </h2>
          <div id="remaining-posts-content" class="remaining-content" style="display: none;">
            ${t}
          </div>
        </div>
      `}s=`
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
      ${s}
    `,console.log("\uD83D\uDD0D Updating recent-posts content with HTML",s.substring(0,100)+"..."),e.innerHTML=s;let c=document.getElementById("remaining-posts-toggle");c&&c.addEventListener("click",function(){let e=document.getElementById("remaining-posts-content"),t=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",t.classList.add("open")):(e.style.display="none",t.classList.remove("open"))}),console.log("✅ Recent posts updated successfully")}catch(t){console.error("❌ Error loading recent posts:",t),e.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function s(){console.log("\uD83D\uDD0D initRecentAllPosts called"),"loading"===document.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),document.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),r()})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),r()),console.log("\uD83D\uDD0D initRecentAllPosts completed initial setup")}console.log("Load force graph in TS v 0.9"),window.location.hash.substr(1);let c=Object.values(await a()).map(e=>({...e,id:e.url,expanded:!1})),d="/"+window.location.href.split("#")[1],u=c.map(e=>e.url).includes(d)?d:"/eulogy";function p(e){return c.map(e=>e.url).includes(e)}function g(e,t){return e.filter(e=>e.url==t)[0]}function f(e){let t=e.filter(e=>e.expanded),n=function(e){let t=[];return e.forEach(e=>{e.outgoing_links.concat(e.incoming_links).filter(p).forEach(n=>{t.push({source:e,target:n,value:1})})}),t}(t),o=n.map(t=>g(e,t.target));return{nodes:t.concat(o),links:n}}if(c.forEach(e=>{e.expanded=e.url==u}),"undefined"==typeof ForceGraph)console.log("Force Graph not defined");else{let t=ForceGraph()(document.getElementById("graph")).graphData(f(c)).nodeLabel("id").nodeAutoColorBy("group").nodeCanvasObject(function(e,t,n){let o=e.outgoing_links.length,l=e.expanded?"-":`+${o}`,a=e.id+" ["+l+"]",i=12/n;t.font=`${i}px Sans-Serif`;let r=[t.measureText(a).width,i].map(e=>e+.2*i);t.fillStyle="rgba(255, 255, 255, 0.8)",t.fillRect(e.x-r[0]/2,e.y-r[1]/2,...r),t.textAlign="center",t.textBaseline="middle",t.fillStyle=e.color,t.fillText(a,e.x,e.y),e.__bckgDimensions=r}).nodePointerAreaPaint(function(e,t,n){n.fillStyle=t;let o=e.__bckgDimensions;o&&n.fillRect(e.x-o[0]/2,e.y-o[1]/2,...o)}).onNodeRightClick(e=>{window.open(e.url,"_blank")}).onNodeClick(e=>{console.log(e),e.expanded=!e.expanded,0==c.filter(e=>e.expanded).length&&(e.expanded=!0),t.graphData(f(c)),setTimeout(()=>{m(e)},300)});function m(n){t.centerAt(n.x,n.y,500),t.zoom(8,500),function(t){h=t;let n=e(t);document.getElementById("detail").innerHTML=n}(n),console.log("centering on",n)}m(g(c,u));var h=null;$("#center_control").on("click",()=>m(h)),$("#goto_control").on("click",function(){console.log("Goto control clicked"),h?h.url?window.open(h.url,"_blank"):console.log("Active node has no URL"):console.log("No active node to go to")}),$("#collapse_control").on("click",function(){console.log("Collapse control clicked"),c.forEach(e=>{e.expanded=!1}),h&&(h.expanded=!0),t.graphData(f(c)),h&&setTimeout(()=>{m(h)},300)})}console.log("Post Graph");let b=!0;function D(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");b?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function y(){let e=$("#right-sidebar"),t=$("#main-content");e.removeClass(),e.addClass("col-4 pl-0"),t.removeClass(),t.addClass("col-8 pr-0");let n=$("#id-ui-toc-dropdown");n.removeClass(),n.addClass("d-none")}function _(e,t){let n=$(`#${e}`);n.html(""),new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),l=$('<a class="expand-toggle" href="#">Collapse all</a>'),a=$('<a class="back-to-top" href="#">Top of page</a>'),i=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),r=$('<a class="go-to-bottom" href="#">Pin ToC</a>');D(),l.click(e=>{e.preventDefault(),e.stopPropagation(),b=!b,D()}),a.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),r.click(e=>y()),o.append(l).append(a).append(i),t&&o.append(r),n.append(o)}async function w(e){let t=new URL(document.URL).pathname,n=e[t]?.incoming_links,o=e[t]?.outgoing_links;if(!n&&!o){console.log(`No backlinks for the page ${t}`);return}let l=$("#links-to-page");if(!l){console.log("No back_link_location");return}l.append(`
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
`);let a=l.find("#incoming");var i=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(n)for(var r of n.sort(i)){let t=e[r];a.append(MakeBackLinkHTML(t))}let s=[];for(var r of o)e[r]&&s.push(r);let c=l.find("#outgoing");if(s)for(let t of s.sort(i)){let n=e[t];c.append(MakeBackLinkHTML(n))}console.log("Added Graph");let d=l.find("#graph"),u=t.replace(/\//g,"");d.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function v(e,t){return`<span class='text-danger'>Error: Invalid link for ${e.attr("href")} ${t} </span>`}async function k(){var e;w(await a()),e=await M(),$.makeArray($(".summary-link")).forEach(t=>{let n=$(t);try{console.log(n.attr("href"));let t=n.attr("href");if(void 0!=e.redirects[t]&&(t=e.redirects[t]),void 0==e.url_info[t]){n.html(v(n,"not found in url info"));return}n.html(function(e,t){let n=`(From:<a href='${t.url}'> ${t.title}</a>)`;return`<div>
        <i> ${t.description}</i> ${n}
    </div>`}(0,e.url_info[t]))}catch(e){n.html(v(n,e))}})}let x=null;async function M(){if(null!=x)return x;let e=window.location.href.includes("https://idvork.in");var t="";return t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json",x=await $.getJSON(t)}function T(){let e=Mousetrap();e.bind("s",e=>void $("#autocomplete-search-box-button").click()),e.bind("t",e=>y()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n="http://localhost:4000",o=e.includes(t),l=e;l=o?e.replace(t,n):e.replace(n,t),window.location.href=l})()),e.bind("a",e=>location.href="/all"),e.bind("m",e=>location.href="/toc"),e.bind("6",e=>location.href="/ig66");let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function L(){console.log("\uD83D\uDD04 Replacing List Placeholders in Tables"),function(e){Object.entries(e).forEach(([e,t])=>{let n=$(`a[href=${e}]`).first();if(!n.length)return;let o=$(t).clone();o.children().first().remove(),n.replaceWith(o),$(t).remove()})}(function(){let e={};return $("ul").each((t,n)=>{let o=n.firstElementChild;if(!o)return;let l=o.textContent;l&&l.startsWith("l")&&(isNaN(parseInt(l.substring(1)))||(e[l]=n))}),e}())}function P(){$(k),$(T),$(document).ready(L),console.log("\uD83D\uDE80 About to call initRecentPosts from main.ts"),console.log("\uD83D\uDD0D initRecentPosts called"),"loading"===document.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),document.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),i()})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),i()),console.log("\uD83D\uDD0D initRecentPosts completed initial setup"),console.log("✅ Called initRecentPosts from main.ts"),document.getElementById("last-modified-posts")&&(console.log("\uD83D\uDE80 About to call initRecentAllPosts from main.ts"),s(),console.log("✅ Called initRecentAllPosts from main.ts")),$(function(){_("ui-toc",!0),_("ui-toc-affix",!1)})}let{autocomplete:C,getAlgoliaResults:E}=window["@algolia/autocomplete-js"];function j({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;e.anchor&&(t+=`#${e.anchor}`);let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,l=n?.content?.value??"";return`
           <span onClick="window.location='${t}';">
              <b> <a href="${t}">${o}</a></b> <span>${l}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function S(){let e=t(Object.entries(await a()).map(e=>e[1]));return{title:e.title,url:e.url,description:e.description}}async function R(e=4){try{let t=await a();return Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function H(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>S()))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function O(e=4){return{sourceId:"recent_posts",getItems:async()=>await R(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function z(e,t,n,o,l,a=3,i=4,r=3){let s=algoliasearch(e,t),c=await H(r),d=await O(i),u=o.startsWith("#")?o:`#${o}`;if(0===$(u).length){console.log("No autocomplete element found","autocomplete_id",o);return}return C({container:u,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let t=0===e.length;t&&(e=" ");let o=function(e,t,n,o=3,l=!1){let a="NOT tags:family-journal";return l&&(a=""),{sourceId:"featured_posts",getItems:()=>E({searchClient:e,queries:[{indexName:t,query:n,filters:a,params:{hitsPerPage:o,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}),templates:{item:j,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(s,n,e,t?a:10,l);return t?[o,d,c]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}class N{constructor({name:e,value:t=25,children:o=[]}){this.name=e,this.children=n(o),this.value=t}}function A(){let e=I();for(let n of e.keys())!function(e,n){let l=$('<div class="alert alert-primary" role="alert"/>');$(e).after(l),o(l,()=>`<span>${t(n)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}(n,e.get(n))}function I(){let e=$("h3").first(),t=e,n=[],o=new Map;for(let l=e;0!=l.length;l=$(l).next()){if("H3"==l.prop("tagName")){o.set(t,n),t=l,n=[];continue}"UL"==l.prop("tagName")&&(n=Array.from($(l).find("li")).map(e=>$(e).text()))}return o.set(t,n),o}function*B(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function F(){return new Map(Array.from(I().entries()).map(([e,t],n)=>[e.text(),t]))}function J(e,n,o){let[l,a]=Array.from(B(n)).find(([t,n])=>t.name==e);return t(Array.from(B(l)).map(([e,t])=>e).filter(e=>o.has(e.name)).map(e=>o.get(e.name).map(t=>`${e.name}: ${t}`)).flat())}async function U(e,t,n){let o=function(e){let t=Array.from(B(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n);var l={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(l,o),delete l.values;let a=await Plotly.newPlot(e,[l],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1}),i=e=>{console.log("set_random_prompt_text",e),$(`#${t}`).text(e)};$(`#${t}`).first().click(()=>{i(J($("#sunburst text:first").text(),n,F()))}),a.on("plotly_sunburstclick",e=>{i(J(e.points[0].label,n,F()))})}function W(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),l=new Date(e.published),a=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][l.getMonth()]} ${l.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!=e.thumbnail?(console.log(e.title),console.log(l),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${a}
      </div>`)):t.append(a),t.html()}function G(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}o("#random-post",()=>W(t(e))),o("#achievment",()=>W(t(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),o("#random-recent",()=>W(t(e.filter(e=>e.tags.includes("family-journal")))))}function q(){$.getJSON("/ig66/ig66-export.json",G)}function Y(e){$.getJSON("/eulogy.json",n=>(function(e,n){if(!n){console.log("No roles being imported");return}console.log("Processing",n.roles.length,"roles"),o(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(t(n.roles)))})(e,n))}class K{get_tree(){return new N({name:"7H ",children:[new N({name:""}),new N({name:"Be Proactive"}),new N({name:"Begin with the end in mind"}),new N({name:"First things First"}),new N({name:"Think Win/Win"}),new N({name:"First Understand"}),new N({name:"Synergize"}),new N({name:"Sharpen the Saw"})]})}}class Q{get_tree(){let e=new N({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new N({name:"Magic",children:[new N({name:"Card Magic"}),new N({name:"Coin Magic"}),new N({name:"Band Magic"})]}),n=new N({name:"Hobbies",children:[new N({name:"Biking"}),new N({name:"Tech"}),new N({name:"Juggling"})]}),o=new N({name:"Relationships",children:[new N({name:"Zach"}),new N({name:"Amelia"}),new N({name:"Tori"}),new N({name:"Friends"})]}),l=new N({name:"Joy",children:[new N({name:"Balloons"}),new N({name:"Joy to Others"})]});return new N({name:"Invest in",children:[e,t,n,o,l]})}}function V({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,l="audio_player_"+Math.floor(1e10*Math.random()),a=e.replace(/\//g,"_");return`
    <div>
        <audio id='${l}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${a}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${l}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function Z(){let e=t(Object.entries(await a()).map(e=>e[1]));return V({url:e.url,title:e.title,description:e.description})}function X(){Y("#e1"),Y("#e2"),Y("#e3")}function ee(){U("sunburst","sunburst_text",new Q().get_tree()),A(),q(),Y("#random-eulogy-role"),o("#random-blog-posts",Z)}function et(){U("sunburst","sunburst_text",new K().get_tree()),A()}function en(){q()}function eo(){es("balance-heatmap-rest"),er("balance-heatmap-work"),ea("balance-radar-map-ideal")}let el=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];async function ea(e){Plotly.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}let ei="#00BF00";async function er(e){let t=["Tech","Work"],n={height:20*t.length+100,margin:{t:5},pad:0},o=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,ei],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:el.slice(2,13),y:t,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];await Plotly.newPlot(e,o,n,{displayModeBar:!1})}async function es(e){let t=["Health","Hobbies","Family","Magic"],n=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,ei],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:el.slice(2,13),y:t.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],o={height:20*t.length+100,margin:{t:5},pad:0};await Plotly.newPlot(e,n,o,{displayModeBar:!1})}$(document).ready(function(){"function"==typeof defer?defer(P):P();let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let o=["item1","item2","item3"];console.log("Random item:",t(o)),console.log("Shuffled items:",n([...o])),a().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{t as random_from_list,n as shuffle,o as append_randomizer_div,a as get_link_info,P as load_globals,e as MakeBackLinkHTML,z as CreateAutoComplete,s as initRecentAllPosts,A as add_random_prompts,U as add_sunburst,N as TreeNode,ee as load_enjoy2,et as load_7_habits,V as makePostPreviewHTML,en as load_ig66,eo as load_balance,X as load_random_eulogy};
//# sourceMappingURL=index.js.map
