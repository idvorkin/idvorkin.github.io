function e(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function t(e){let t=e.length,n;for(;0!=t;)n=Math.floor(Math.random()*t),t--,[e[t],e[n]]=[e[n],e[t]];return e}async function n(e,t){let n=$(e);if(1!=n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async function(e){if("A"!=e.target.tagName){let e=$(await t());n.empty().append(e)}})}let o=null;async function a(e){if(null!=o)return o;let t=(e||window.location.href).includes("https://idvork.in");var n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return o=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function i(){console.log("\uD83D\uDD0D updateRecentPosts function called");let e=document.getElementById("recent-posts");if(console.log("\uD83D\uDD0D recent-posts container element:",e),!e){console.error("❌ recent-posts container not found in DOM");return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let t=await fetch("/back-links.json"),n=await t.json();if(console.log("\uD83D\uDD0D Received data from back-links.json:",n),console.log("\uD83D\uDD0D Keys in data:",Object.keys(n)),!n.url_info){console.error("❌ Missing url_info in data structure"),e.innerHTML="<p>Error: Could not load recent posts data.</p>";return}let o=n.url_info;console.log("\uD83D\uDD0D Number of entries in urlInfoMap:",Object.keys(o).length);let a=Object.entries(o).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""}));console.log("\uD83D\uDD0D Transformed pages array, length:",a.length);let i=a.filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim());console.log("\uD83D\uDD0D Filtered real pages, length:",i.length),console.log("\uD83D\uDD0D First 3 real pages:",i.slice(0,3));let l=i.sort((e,t)=>e.last_modified&&t.last_modified?(console.log("\uD83D\uDD0D Comparing last_modified dates:",e.url,e.last_modified,"vs",t.url,t.last_modified),new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime()):t.doc_size-e.doc_size);console.log("\uD83D\uDD0D Sorted pages, first 5:",l.slice(0,5).map(e=>({url:e.url,title:e.title,last_modified:e.last_modified})));let r=l.slice(0,5);if(0===r.length){console.warn("⚠️ No recent pages found after filtering and sorting"),e.innerHTML="<p>No recent posts found.</p>";return}let s=`
      <ul>
        ${r.map(e=>`
          <li>
            <a href="${e.url}">${e.title}</a> - 
            ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
          </li>
        `).join("")}
      </ul>
    `;console.log("\uD83D\uDD0D Updating recent-posts content with HTML",s.substring(0,100)+"..."),e.innerHTML=s,console.log("✅ Recent posts updated successfully")}catch(t){console.error("❌ Error loading recent posts:",t),e.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}async function l(){console.log("\uD83D\uDD0D updateRecentPosts function called");let e=document.getElementById("last-modified-posts");if(console.log("\uD83D\uDD0D recent-posts container element:",e),!e){console.error("❌ recent-posts container not found in DOM");return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let t=await a();console.log("\uD83D\uDD0D Number of entries in urlInfoMap:",Object.keys(t).length);let n=Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""}));console.log("\uD83D\uDD0D Transformed pages array, length:",n.length);let o=n.filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim());console.log("\uD83D\uDD0D Filtered real pages, length:",o.length);let i=o.sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size);if(0===i.length){console.warn("⚠️ No pages found after filtering and sorting"),e.innerHTML="<p>No modified posts found.</p>";return}let l=i.slice(15),r={};i.slice(0,15).forEach(e=>{if(!e.last_modified)return;let t=new Date(e.last_modified),n=`${t.toLocaleString("default",{month:"long"})} ${t.getFullYear()}`;r[n]||(r[n]=[]),r[n].push(e)});let s="";if(Object.entries(r).forEach(([e,t])=>{s+=`
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
      `}),l.length>0){let e={};l.forEach(t=>{if(!t.last_modified)return;let n=new Date(t.last_modified),o=`${n.toLocaleString("default",{month:"long"})} ${n.getFullYear()}`;e[o]||(e[o]=[]),e[o].push(t)});let t="";Object.entries(e).forEach(([e,n])=>{t+=`
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
            <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${l.length} more)
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
    `,console.log("\uD83D\uDD0D Updating recent-posts content with HTML",s.substring(0,100)+"..."),e.innerHTML=s;let c=document.getElementById("remaining-posts-toggle");c&&c.addEventListener("click",function(){let e=document.getElementById("remaining-posts-content"),t=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",t.classList.add("open")):(e.style.display="none",t.classList.remove("open"))}),console.log("✅ Recent posts updated successfully")}catch(t){console.error("❌ Error loading recent posts:",t),e.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function r(){console.log("\uD83D\uDD0D initRecentAllPosts called"),"loading"===document.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),document.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),l()})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),l()),console.log("\uD83D\uDD0D initRecentAllPosts completed initial setup")}let s=!0;function c(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");s?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function d(){let e=$("#right-sidebar"),t=$("#main-content");e.removeClass(),e.addClass("col-4 pl-0"),t.removeClass(),t.addClass("col-8 pr-0");let n=$("#id-ui-toc-dropdown");n.removeClass(),n.addClass("d-none")}function u(e,t){let n=$(`#${e}`);n.html(""),new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),a=$('<a class="expand-toggle" href="#">Collapse all</a>'),i=$('<a class="back-to-top" href="#">Top of page</a>'),l=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),r=$('<a class="go-to-bottom" href="#">Pin ToC</a>');c(),a.click(e=>{e.preventDefault(),e.stopPropagation(),s=!s,c()}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),l.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),r.click(e=>d()),o.append(a).append(i).append(l),t&&o.append(r),n.append(o)}function p(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}async function g(e){let t=new URL(document.URL).pathname,n=e[t]?.incoming_links,o=e[t]?.outgoing_links;if(!n&&!o){console.log(`No backlinks for the page ${t}`);return}let a=$("#links-to-page");if(!a){console.log("No back_link_location");return}a.append(`
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
`);let i=a.find("#incoming");var l=(t,n)=>Number(e[n].doc_size)-Number(e[t].doc_size);if(n)for(var r of n.sort(l)){let t=e[r];i.append(p(t))}let s=[];for(var r of o)e[r]&&s.push(r);let c=a.find("#outgoing");if(s)for(let t of s.sort(l)){let n=e[t];c.append(p(n))}console.log("Added Graph");let d=a.find("#graph"),u=t.replace(/\//g,"");d.append(`<a href='/graph#${u}'>${t} (${u}) </a>`)}function m(e,t){return`<span class='text-danger'>Error: Invalid link for ${e.attr("href")} ${t} </span>`}async function f(){var e;g(await a()),e=await b(),$.makeArray($(".summary-link")).forEach(t=>{let n=$(t);try{console.log(n.attr("href"));let t=n.attr("href");if(void 0!=e.redirects[t]&&(t=e.redirects[t]),void 0==e.url_info[t]){n.html(m(n,"not found in url info"));return}n.html(function(e,t){let n=`(From:<a href='${t.url}'> ${t.title}</a>)`;return`<div>
        <i> ${t.description}</i> ${n}
    </div>`}(0,e.url_info[t]))}catch(e){n.html(m(n,e))}})}let h=null;async function b(){if(null!=h)return h;let e=window.location.href.includes("https://idvork.in");var t="";return t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json",h=await $.getJSON(t)}function D(){let e=Mousetrap();e.bind("s",e=>void $("#autocomplete-search-box-button").click()),e.bind("t",e=>d()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n="http://localhost:4000",o=e.includes(t),a=e;a=o?e.replace(t,n):e.replace(n,t),window.location.href=a})()),e.bind("a",e=>location.href="/all"),e.bind("m",e=>location.href="/toc"),e.bind("6",e=>location.href="/ig66");let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function y(){$(f),$(D),console.log("\uD83D\uDE80 About to call initRecentPosts from main.ts"),console.log("\uD83D\uDD0D initRecentPosts called"),"loading"===document.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),document.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),i()})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),i()),console.log("\uD83D\uDD0D initRecentPosts completed initial setup"),console.log("✅ Called initRecentPosts from main.ts"),document.getElementById("last-modified-posts")&&(console.log("\uD83D\uDE80 About to call initRecentAllPosts from main.ts"),r(),console.log("✅ Called initRecentAllPosts from main.ts")),$(function(){u("ui-toc",!0),u("ui-toc-affix",!1)})}let{autocomplete:w,getAlgoliaResults:v}=window["@algolia/autocomplete-js"];function _({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;e.anchor&&(t+=`#${e.anchor}`);let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,a=n?.content?.value??"";return`
           <span onClick="window.location='${t}';">
              <b> <a href="${t}">${o}</a></b> <span>${a}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function k(){let t=e(Object.entries(await a()).map(e=>e[1]));return{title:t.title,url:t.url,description:t.description}}async function M(e=4){try{let t=await a();return Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function x(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>k()))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function T(e=4){return{sourceId:"recent_posts",getItems:async()=>await M(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function L(e,t,n,o,a,i=3,l=4,r=3){let s=algoliasearch(e,t),c=await x(r),d=await T(l),u=o.startsWith("#")?o:`#${o}`;if(0===$(u).length){console.log("No autocomplete element found","autocomplete_id",o);return}return w({container:u,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let t=0===e.length;t&&(e=" ");let o=function(e,t,n,o=3,a=!1){let i="NOT tags:family-journal";return a&&(i=""),{sourceId:"featured_posts",getItems:()=>v({searchClient:e,queries:[{indexName:t,query:n,filters:i,params:{hitsPerPage:o,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}),templates:{item:_,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(s,n,e,t?i:10,a);return t?[o,d,c]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}class P{constructor({name:e,value:n=25,children:o=[]}){this.name=e,this.children=t(o),this.value=n}}function C(){let t=j();for(let o of t.keys())!function(t,o){let a=$('<div class="alert alert-primary" role="alert"/>');$(t).after(a),n(a,()=>`<span>${e(o)}</span>`)}(o,t.get(o))}function j(){let e=$("h3").first(),t=e,n=[],o=new Map;for(let a=e;0!=a.length;a=$(a).next()){if("H3"==a.prop("tagName")){o.set(t,n),t=a,n=[];continue}"UL"==a.prop("tagName")&&(n=Array.from($(a).find("li")).map(e=>$(e).text()))}return o.set(t,n),o}function*E(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function H(){return new Map(Array.from(j().entries()).map(([e,t],n)=>[e.text(),t]))}function z(t,n,o){let[a,i]=Array.from(E(n)).find(([e,n])=>e.name==t);return e(Array.from(E(a)).map(([e,t])=>e).filter(e=>o.has(e.name)).map(e=>o.get(e.name).map(t=>`${e.name}: ${t}`)).flat())}async function O(e,t,n){let o=function(e){let t=Array.from(E(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n);var a={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(a,o),delete a.values;let i=await Plotly.newPlot(e,[a],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1}),l=e=>{console.log("set_random_prompt_text",e),$(`#${t}`).text(e)};$(`#${t}`).first().click(()=>{l(z($("#sunburst text:first").text(),n,H()))}),i.on("plotly_sunburstclick",e=>{l(z(e.points[0].label,n,H()))})}function R(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),a=new Date(e.published),i=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][a.getMonth()]} ${a.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!=e.thumbnail?(console.log(e.title),console.log(a),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${i}
      </div>`)):t.append(i),t.html()}function S(t){if(console.log("Processing",t.length,"posts"),!t){console.log("No posts being imported");return}n("#random-post",()=>R(e(t))),n("#achievment",()=>R(e(t.filter(e=>e.title.toLowerCase().includes("achievement"))))),n("#random-recent",()=>R(e(t.filter(e=>e.tags.includes("family-journal")))))}function I(){$.getJSON("/ig66/ig66-export.json",S)}function A(t){$.getJSON("/eulogy.json",o=>(function(t,o){if(!o){console.log("No roles being imported");return}console.log("Processing",o.roles.length,"roles"),n(t,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(e(o.roles)))})(t,o))}class N{get_tree(){return new P({name:"7H ",children:[new P({name:""}),new P({name:"Be Proactive"}),new P({name:"Begin with the end in mind"}),new P({name:"First things First"}),new P({name:"Think Win/Win"}),new P({name:"First Understand"}),new P({name:"Synergize"}),new P({name:"Sharpen the Saw"})]})}}class F{get_tree(){let e=new P({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new P({name:"Magic",children:[new P({name:"Card Magic"}),new P({name:"Coin Magic"}),new P({name:"Band Magic"})]}),n=new P({name:"Hobbies",children:[new P({name:"Biking"}),new P({name:"Tech"}),new P({name:"Juggling"})]}),o=new P({name:"Relationships",children:[new P({name:"Zach"}),new P({name:"Amelia"}),new P({name:"Tori"}),new P({name:"Friends"})]}),a=new P({name:"Joy",children:[new P({name:"Balloons"}),new P({name:"Joy to Others"})]});return new P({name:"Invest in",children:[e,t,n,o,a]})}}function B({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,a="audio_player_"+Math.floor(1e10*Math.random()),i=e.replace(/\//g,"_");return`
    <div>
        <audio id='${a}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${a}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function J(){let t=e(Object.entries(await a()).map(e=>e[1]));return B({url:t.url,title:t.title,description:t.description})}function U(){A("#e1"),A("#e2"),A("#e3")}function W(){O("sunburst","sunburst_text",new F().get_tree()),C(),I(),A("#random-eulogy-role"),n("#random-blog-posts",J)}function q(){O("sunburst","sunburst_text",new N().get_tree()),C()}function G(){I()}function Y(){X("balance-heatmap-rest"),Z("balance-heatmap-work"),Q("balance-radar-map-ideal")}let K=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];async function Q(e){Plotly.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1})}let V="#00BF00";async function Z(e){let t=["Tech","Work"],n={height:20*t.length+100,margin:{t:5},pad:0},o=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,V],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:K.slice(2,13),y:t,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];await Plotly.newPlot(e,o,n,{displayModeBar:!1})}async function X(e){let t=["Health","Hobbies","Family","Magic"],n=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,V],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:K.slice(2,13),y:t.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],o={height:20*t.length+100,margin:{t:5},pad:0};await Plotly.newPlot(e,n,o,{displayModeBar:!1})}$(document).ready(function(){"function"==typeof defer?defer(y):y();let n=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>n()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let o=["item1","item2","item3"];console.log("Random item:",e(o)),console.log("Shuffled items:",t([...o])),a().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{e as random_from_list,t as shuffle,n as append_randomizer_div,a as get_link_info,y as load_globals,p as MakeBackLinkHTML,L as CreateAutoComplete,r as initRecentAllPosts,W as load_enjoy2,q as load_7_habits,B as makePostPreviewHTML,G as load_ig66,Y as load_balance,U as load_random_eulogy};
//# sourceMappingURL=index.js.map
