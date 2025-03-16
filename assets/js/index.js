function e(e){let t=`<a href=${e.url}>${e.title}</a>`;return`
<div>
    <div class="link-box description truncate-css"> ${t}:<span class="link-description"> ${e.description} <span></div>
</div>`}function t(e){if(0!==e.length)return e[Math.floor(Math.random()*e.length)]}function n(e){let t=e.length,n;for(;0!=t;)n=Math.floor(Math.random()*t),t--,[e[t],e[n]]=[e[n],e[t]];return e}async function o(e,t){let n=$(e);if(1!=n.length){console.log(`append_randomizer_div ${e} not present`);return}let o=$(await t());n.empty().append(o),n.click(async function(e){if("A"!=e.target.tagName){let e=$(await t());n.empty().append(e)}})}let a=null;async function i(e){if(null!=a)return a;let t=(e||window.location.href).includes("https://idvork.in");var n="https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True";t||(n="/back-links.json");try{let e=await fetch(n);return a=(await e.json()).url_info}catch(e){return console.error("Error fetching link info",e),{}}}async function l(e="/back-links.json"){if("/test-missing-url-info"===e)throw Error("Missing url_info in data structure");try{return await i(e)}catch(e){throw Error("Missing url_info in data structure")}}async function r(){return[...Object.entries(await l()).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim())].sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size)}async function s(e="recent-posts"){console.log("\uD83D\uDD0D updateRecentPosts function called");let t=document.getElementById(e);if(console.log("\uD83D\uDD0D recent-posts container element:",t?"found":"not found"),!t){console.error(`\u{274C} ${e} container not found in DOM`);return}try{var n;console.log("\uD83D\uDD0D Fetching back-links.json...");let e=await r();console.log("\uD83D\uDD0D Sorted pages, first 5:",e.slice(0,5).map(e=>({url:e.url,title:e.title,last_modified:e.last_modified})));let o=(n=function(e,t=5){return e.slice(0,t)}(e),0===n.length?"<p>No recent posts found.</p>":`
    <ul>
      ${n.map(e=>`
        <li>
          <a href="${e.url}">${e.title}</a> - 
          ${e.description.split("\n")[0].substring(0,100)}${e.description.length>100?"...":""}
        </li>
      `).join("")}
    </ul>
  `);console.log("\uD83D\uDD0D Updating recent-posts content with HTML",o.substring(0,100)+"..."),t.innerHTML=o,console.log("✅ Recent posts updated successfully")}catch(e){console.error("❌ Error loading recent posts:",e),t.innerHTML="<p>Error loading recent posts. Please try again later.</p>"}}function c(e){let t={};return e.forEach(e=>{if(!e.last_modified)return;let n=new Date(e.last_modified),o=`${n.toLocaleString("default",{month:"long"})} ${n.getFullYear()}`;t[o]||(t[o]=[]),t[o].push(e)}),t}function d(e){let t="";return Object.entries(e).forEach(([e,n])=>{t+=`
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
    `}),t}async function u(e="last-modified-posts",t=15,n=document){console.log("\uD83D\uDD0D updateRecentPosts function called");let o=n.getElementById(e);if(console.log("\uD83D\uDD0D recent-posts container element:",o),!o){console.error(`\u{274C} ${e} container not found in DOM`);return}try{console.log("\uD83D\uDD0D Fetching back-links.json...");let e=await r(),a=function(e,t=15){if(0===e.length)return"<p>No modified posts found.</p>";let n=e.slice(0,t),o=e.slice(t),a=d(c(n));if(o.length>0){var i,l;a+=(i=d(c(o)),l=o.length,`
    <div class="remaining-posts-section">
      <h2 id="remaining-posts-toggle" class="remaining-toggle">
        <span class="toggle-icon">\u{25B6}</span> Remaining Modified Files (${l} more)
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
  `+a}(e,t);console.log("\uD83D\uDD0D Updating recent-posts content with HTML",a.substring(0,100)+"..."),o.innerHTML=a,function(e="remaining-posts-toggle",t="remaining-posts-content",n=document){let o=n.getElementById(e);if(!o){console.log(`Toggle element with ID ${e} not found`);return}o.addEventListener("click",function(){let e=n.getElementById(t);if(!e){console.log(`Content element with ID ${t} not found`);return}let o=this.querySelector(".toggle-icon");"none"===e.style.display?(e.style.display="block",o?.classList.add("open")):(e.style.display="none",o?.classList.remove("open"))})}("remaining-posts-toggle","remaining-posts-content",n),console.log("✅ Recent posts updated successfully")}catch(e){console.error("❌ Error loading recent posts:",e),o.innerHTML="<p>Error loading modified posts. Please try again later.</p>"}}function p(e="last-modified-posts",t=document){console.log("\uD83D\uDD0D initRecentAllPosts called"),"loading"===t.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),t.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),u(e,15,t)})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),u(e,15,t)),console.log("\uD83D\uDD0D initRecentAllPosts completed initial setup")}console.log("Load force graph in TS v 0.9");let g=!0;function f(){let e=$(".ui-toc-dropdown .toc"),t=$(".expand-toggle");if(0===e.length||0===t.length){console.warn("TOC or toggle elements not found for expand/collapse");return}g?(e.addClass("expand"),t.text("Collapse all")):(e.removeClass("expand"),t.text("Expand all"))}function m(){let e=$("#right-sidebar"),t=$("#main-content");e.length>0&&(e.removeClass(),e.addClass("col-4 pl-0")),t.length>0&&(t.removeClass(),t.addClass("col-8 pr-0"));let n=$("#id-ui-toc-dropdown");n.length>0&&(n.removeClass(),n.addClass("d-none"))}function h(e,t){let n=$(`#${e}`);if(0===n.length){console.warn(`Target element #${e} not found for TOC generation`);return}if(n.html(""),0===$("#content-holder").length){console.warn("Content holder not found for TOC generation");return}new window.Toc("content-holder",{level:3,top:-1,class:"toc",ulClass:"nav",targetId:e}),"undefined"===n.text()&&n.html("");let o=$('<div class="toc-menu"></div'),a=$('<a class="expand-toggle" href="#">Collapse all</a>'),i=$('<a class="back-to-top" href="#">Top of page</a>'),l=$('<a class="go-to-bottom" href="#">Bottom of page</a>'),r=$('<a class="go-to-bottom" href="#">Pin ToC</a>');f(),a.click(e=>{e.preventDefault(),e.stopPropagation(),g=!g,f()}),i.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,0)}),l.click(e=>{e.preventDefault(),e.stopPropagation(),window.scrollTo(0,document.body.scrollHeight)}),r.click(e=>m()),o.append(a).append(i).append(l),t&&o.append(r),n.append(o)}async function b(t){let n=new URL(document.URL).pathname,o=t[n]?.incoming_links,a=t[n]?.outgoing_links;if(!o&&!a){console.log(`No backlinks for the page ${n}`);return}let i=$("#links-to-page");if(!i||0===i.length){console.log("No back_link_location");return}i.append(`
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
`);let l=i.find("#incoming");var r=(e,n)=>Number(t[n].doc_size)-Number(t[e].doc_size);if(o)for(var s of o.sort(r)){let n=t[s];l.append(e(n))}let c=[];for(var s of a)t[s]&&c.push(s);let d=i.find("#outgoing");if(c)for(let n of c.sort(r)){let o=t[n];d.append(e(o))}console.log("Added Graph");let u=i.find("#graph"),p=n.replace(/\//g,"");u.append(`<a href='/graph#${p}'>${n} (${p}) </a>`)}function y(e,t){return`<span class='text-danger'>Error: Invalid link for ${e.attr("href")} ${t} </span>`}async function D(){var e;b(await i()),e=await v(),$.makeArray($(".summary-link")).forEach(t=>{let n=$(t);try{console.log(n.attr("href"));let t=n.attr("href");if(void 0!=e.redirects[t]&&(t=e.redirects[t]),void 0==e.url_info[t]){n.html(y(n,"not found in url info"));return}n.html(function(e,t){let n=`(From:<a href='${t.url}'> ${t.title}</a>)`;return`<div>
        <i> ${t.description}</i> ${n}
    </div>`}(0,e.url_info[t]))}catch(e){n.html(y(n,e))}})}let w=null;async function v(){if(null!=w)return w;let e=window.location.href.includes("https://idvork.in");var t="";return t=e?"https://raw.githubusercontent.com/idvorkin/idvorkin.github.io/master/back-links.json?flush_cache=True":"/back-links.json",w=await $.getJSON(t)}function _(){let e=Mousetrap();e.bind("s",e=>void $("#autocomplete-search-box-button").click()),e.bind("t",e=>m()),e.bind("p",e=>(function(){let e=window.location.href,t="https://idvork.in",n="http://localhost:4000",o=e.includes(t),a=e;a=o?e.replace(t,n):e.replace(n,t),window.location.href=a})()),e.bind("a",e=>location.href="/all"),e.bind("m",e=>location.href="/toc"),e.bind("6",e=>location.href="/ig66");let t=`
Try these shortcuts:
  s - search
  / - start chatting with others
  t - force sidebar
  p - swap prod and test
  z - surprise me
  a - all posts
  m - global toc
  6 - family journal
  `;e.bind("?",e=>alert(t))}function k(){console.log("\uD83D\uDD04 Replacing List Placeholders in Tables"),function(e){Object.entries(e).forEach(([e,t])=>{let n=$(`a[href=${e}]`).first();if(!n.length)return;let o=$(t).clone();o.children().length>0&&o.children().first().remove(),n.replaceWith(o),$(t).remove()})}(function(){let e={};return $("ul").each((t,n)=>{let o=n.firstElementChild;if(!o)return;let a=o.textContent;a&&a.startsWith("l")&&(isNaN(parseInt(a.substring(1)))||(e[a]=n))}),e}())}function M(){$(D),$(_),$(document).ready(k),console.log("\uD83D\uDE80 About to call initRecentPosts from main.ts"),function(e="recent-posts"){console.log("\uD83D\uDD0D initRecentPosts called"),"loading"===document.readyState?(console.log("\uD83D\uDD0D Document still loading, adding DOMContentLoaded listener"),document.addEventListener("DOMContentLoaded",()=>{console.log("\uD83D\uDD0D DOMContentLoaded event fired, calling updateRecentPosts()"),s(e)})):(console.log("\uD83D\uDD0D Document already loaded, calling updateRecentPosts() immediately"),s(e)),console.log("\uD83D\uDD0D initRecentPosts completed initial setup")}(),console.log("✅ Called initRecentPosts from main.ts"),document.getElementById("last-modified-posts")&&(console.log("\uD83D\uDE80 About to call initRecentAllPosts from main.ts"),p(),console.log("✅ Called initRecentAllPosts from main.ts")),$(function(){h("ui-toc",!0),h("ui-toc-affix",!1)})}let{autocomplete:x,getAlgoliaResults:T}=window["@algolia/autocomplete-js"];function P({item:e,createElement:t}){return t("div",{dangerouslySetInnerHTML:{__html:function(e){try{let t=e.url;e.anchor&&(t+=`#${e.anchor}`);let n=e._highlightResult;n||console.log("No Highlight",e);let o=n.title.value,a=n?.content?.value??"";return`
           <span onClick="window.location='${t}';">
              <b> <a href="${t}">${o}</a></b> <span>${a}</span>
           </span>
        `}catch(t){console.log("Error in hitTemplate",t,e)}return"invalid HTML"}(e)}})}async function C(){let e=t(Object.entries(await i()).map(e=>e[1]));return{title:e.title,url:e.url,description:e.description}}async function L(e=4){try{let t=await i();return Object.entries(t).map(([e,t])=>({url:e,title:t.title||e,description:t.description||"",doc_size:t.doc_size||0,last_modified:t.last_modified||""})).filter(e=>e.description&&""!==e.description.trim()&&e.title&&""!==e.title.trim()).sort((e,t)=>e.last_modified&&t.last_modified?new Date(t.last_modified).getTime()-new Date(e.last_modified).getTime():t.doc_size-e.doc_size).slice(0,e)}catch(e){return console.error("❌ Error loading recent posts:",e),[]}}async function E(e=3){return{sourceId:"random_posts",async getItems(){let t=Array(e).join("_").split("_");return await Promise.all(t.map(async e=>C()))},getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Random posts ...</i>"}})}}}async function R(e=4){return{sourceId:"recent_posts",getItems:async()=>await L(e),getItemUrl:({item:e})=>e.url,templates:{item:({item:e,createElement:t})=>t("div",{dangerouslySetInnerHTML:{__html:`
            <span onClick="window.location='${e.url}';" >
           <b> <a href="${e.url}">${e.title}</a></b>
            <span>${e.description}</span>
            </span>
            `}}),header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Recent posts ...</i>"}})}}}async function O(e,t,n,o,a,i=3,l=4,r=3){let s=algoliasearch(e,t),c=await E(r),d=await R(l),u=o.startsWith("#")?o:`#${o}`;if(0===$(u).length){console.log("No autocomplete element found","autocomplete_id",o);return}return x({container:u,placeholder:"Search Igor's Musings ...",getSources:function({query:e}){let t=0===e.length;t&&(e=" ");let o=function(e,t,n,o=3,a=!1){let i="NOT tags:family-journal";return a&&(i=""),{sourceId:"featured_posts",getItems:()=>T({searchClient:e,queries:[{indexName:t,query:n,filters:i,params:{hitsPerPage:o,highlightPreTag:"<span style='background:yellow'>",highlightPostTag:"</span>"}}]}),templates:{item:P,header:({createElement:e})=>e("div",{dangerouslySetInnerHTML:{__html:"<i style='color:grey'>Featured posts ...</i>"}})},getItemUrl({item:e}){let t=e.url;return e.anchor&&(t+=`#${e.anchor}`),t}}}(s,n,e,t?i:10,a);return t?[o,d,c]:[o]},debug:!1,openOnFocus:!0,detachedMediaQuery:""})}class H{constructor({name:e,value:t=25,children:o=[]}){this.name=e,this.children=n(o),this.value=t}}function I(){let e=S();for(let n of e.keys())!function(e,n){let a=$('<div class="alert alert-primary" role="alert"/>');$(e).after(a),o(a,()=>`<span>${t(n)}</span><span style="float: right; cursor: pointer;" title="Click for another prompt">\u{1F504}</span>`)}(n,e.get(n))}function S(){let e=$("h3").first(),t=e,n=[],o=new Map;for(let a=e;0!=a.length;a=$(a).next()){if("H3"==a.prop("tagName")){o.set(t,n),t=a,n=[];continue}"UL"==a.prop("tagName")&&(n=Array.from($(a).find("li")).map(e=>$(e).text()))}return o.set(t,n),o}function*j(e){if(!e)return;let t=[];for(t.push([e,null]);t.length>0;){let[e,n]=t.shift();for(let n of e.children??[])t.push([n,e]);yield[e,n]}}function z(){return new Map(Array.from(S().entries()).map(([e,t],n)=>[e.text(),t]))}function A(e,n,o){let[a,i]=Array.from(j(n)).find(([t,n])=>t.name==e);return t(Array.from(j(a)).map(([e,t])=>e).filter(e=>o.has(e.name)).map(e=>o.get(e.name).map(t=>`${e.name}: ${t}`)).flat())}async function N(e,t,n){let o=function(e){let t=Array.from(j(e)).map(([e,t])=>[e.name,t?.name]);return{ids:t.map(([e,t])=>e),labels:t.map(([e,t])=>e),parents:t.map(([e,t])=>t)}}(n);var a={type:"sunburst",outsidetextfont:{size:20,color:"#377eb8"},hoverinfo:"none",marker:{line:{width:2}},maxdepth:2,displayModeBar:!1};Object.assign(a,o),delete a.values;let i=await Plotly.newPlot(e,[a],{margin:{l:0,r:0,b:0,t:0},sunburstcolorway:["#636efa","#ef553b","#00cc96"]},{displayModeBar:!1}),l=e=>{console.log("set_random_prompt_text",e),$(`#${t}`).text(e)};$(`#${t}`).first().click(()=>{l(A($("#sunburst text:first").text(),n,z()))}),i.on("plotly_sunburstclick",e=>{l(A(e.points[0].label,n,z()))})}function B(e){let t=$("<div/>"),n=`<h4> <a href='${e.url}'}>${e.title}</a></h4>`;t.append(n);let o=e.thumbnail.replace("s72-c","s320"),a=new Date(e.published),i=`
    <div> ${["January","February","March","April","May","June","July","August","September","October","November","December"][a.getMonth()]} ${a.getFullYear()} - ${e.excerpt}
    </div>
   `;return""!=e.thumbnail?(console.log(e.title),console.log(a),t.append(`
      <div style='overflow:auto'>

      <a href='${e.url}'}><img class="img-fluid" style='float:left; margin-right:10px' src='${o}'/></a>
      ${i}
      </div>`)):t.append(i),t.html()}function F(e){if(console.log("Processing",e.length,"posts"),!e){console.log("No posts being imported");return}o("#random-post",()=>B(t(e))),o("#achievment",()=>B(t(e.filter(e=>e.title.toLowerCase().includes("achievement"))))),o("#random-recent",()=>B(t(e.filter(e=>e.tags.includes("family-journal")))))}function J(){$.getJSON("/ig66/ig66-export.json",F)}function U(e){$.getJSON("/eulogy.json",n=>(function(e,n){if(!n){console.log("No roles being imported");return}console.log("Processing",n.roles.length,"roles"),o(e,()=>(function(e){let t=e.title.replace(/ /g,"%20"),n=["igor","ammon"],o=n[Math.floor(Math.random()*n.length)];return`
  <div>
    <audio id="eulogy-player">
      <source src="https://github.com/idvorkin/blob/raw/master/read_eulogy/${o}/${t}.mp3" type="audio/mp3">
    </audio>
  <b>${e.title} <a class='lead' onclick="toggle_play_pause('eulogy-player')">\u{1F508}</a></b> - ${e.summary}
  </div>
  `})(t(n.roles)))})(e,n))}class W{get_tree(){return new H({name:"7H ",children:[new H({name:""}),new H({name:"Be Proactive"}),new H({name:"Begin with the end in mind"}),new H({name:"First things First"}),new H({name:"Think Win/Win"}),new H({name:"First Understand"}),new H({name:"Synergize"}),new H({name:"Sharpen the Saw"})]})}}class q{get_tree(){let e=new H({name:"Health",children:[{name:"Physical"},{name:"Emotional"},{name:"Cognative"}],value:31}),t=new H({name:"Magic",children:[new H({name:"Card Magic"}),new H({name:"Coin Magic"}),new H({name:"Band Magic"})]}),n=new H({name:"Hobbies",children:[new H({name:"Biking"}),new H({name:"Tech"}),new H({name:"Juggling"})]}),o=new H({name:"Relationships",children:[new H({name:"Zach"}),new H({name:"Amelia"}),new H({name:"Tori"}),new H({name:"Friends"})]}),a=new H({name:"Joy",children:[new H({name:"Balloons"}),new H({name:"Joy to Others"})]});return new H({name:"Invest in",children:[e,t,n,o,a]})}}function G({url:e,title:t,description:n}){let o=`<a href='${e}'}>${t}</a>`,a="audio_player_"+Math.floor(1e10*Math.random()),i=e.replace(/\//g,"_");return`
    <div>
        <audio id='${a}'>
          <source src="https://github.com/idvorkin/blob/raw/master/url_info_voices/igor/${i}.mp3" type="audio/mp3">
        </audio>
      ${o}:  <b><a class='lead' onclick="toggle_play_pause('${a}')">\u{1F508}</a></b> ${n}
    </div>
  `}async function Y(){let e=t(Object.entries(await i()).map(e=>e[1]));return G({url:e.url,title:e.title,description:e.description})}function Q(){U("#e1"),U("#e2"),U("#e3")}function V(){N("sunburst","sunburst_text",new q().get_tree()),I(),J(),U("#random-eulogy-role"),o("#random-blog-posts",Y)}function Z(){N("sunburst","sunburst_text",new W().get_tree()),I()}function K(){J()}function X(){ea("balance-heatmap-rest"),eo("balance-heatmap-work"),et("balance-radar-map-ideal")}let ee=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];async function et(e){"undefined"!=typeof Plotly?Plotly.newPlot(e,[{type:"scatterpolar",r:[8,8,8,5,8,8,8],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Goal",fill:"toself"},{type:"scatterpolar",r:[7,7,5,5,5,9,7],theta:["Work","Tech","Health","Hobbies","Relationships","Magic","Work"],name:"2020 Actual",fill:"toself"}],{polar:{radialaxis:{visible:!0,range:[0,10]}},showlegend:!0},{displayModeBar:!1}):console.warn("Plotly is not defined, skipping chart rendering")}let en="#00BF00";async function eo(e){let t=["Tech","Work"],n={height:20*t.length+100,margin:{t:5},pad:0},o=[{colorscale:[[0,"darkblue"],[.4,"blue"],[.5,en],[.6,"darkred"],[1,"red"]],zmin:0,zmax:10,x:ee.slice(2,13),y:t,z:[[7,4,7,8,2,4,2,3,2,8],[10,7,5,5,3,5,6,6,7,5]],type:"heatmap"}];"undefined"!=typeof Plotly?await Plotly.newPlot(e,o,n,{displayModeBar:!1}):console.warn("Plotly is not defined, skipping chart rendering")}async function ea(e){let t=["Health","Hobbies","Family","Magic"],n=[{colorscale:[[0,"red"],[.4,"darkred"],[.5,en],[.6,"blue"],[1,"darkblue"]],zmin:0,zmax:10,x:ee.slice(2,13),y:t.reverse(),z:[[4,4,3,4,5,3,2,2,3,2],[4,4,3,4,5,4,4,2,4,5],[2,3,3,4,1,5,4,3,2,4],[5,5,5,4,5,5,4,5,4,5]].reverse(),type:"heatmap"}],o={height:20*t.length+100,margin:{t:5},pad:0};"undefined"!=typeof Plotly?await Plotly.newPlot(e,n,o,{displayModeBar:!1}):console.warn("Plotly is not defined, skipping chart rendering")}$(document).ready(function(){"function"==typeof defer?defer(M):M();let e=()=>{let e=$("#search-box");e.length>0&&e.focus()};"undefined"!=typeof Mousetrap&&Mousetrap.bind("s",()=>e()),$("#toc-content").length>0&&console.log("TOC initialized"),$("#search-box").length>0&&console.log("Search initialized");let o=["item1","item2","item3"];console.log("Random item:",t(o)),console.log("Shuffled items:",n([...o])),i().then(e=>{console.log("Links loaded, count:",Object.keys(e).length)}),console.log("Blog JavaScript initialized")});export{t as random_from_list,n as shuffle,o as append_randomizer_div,i as get_link_info,M as load_globals,e as MakeBackLinkHTML,O as CreateAutoComplete,p as initRecentAllPosts,I as add_random_prompts,N as add_sunburst,H as TreeNode,V as load_enjoy2,Z as load_7_habits,G as makePostPreviewHTML,K as load_ig66,X as load_balance,Q as load_random_eulogy};
//# sourceMappingURL=index.js.map
