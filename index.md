---
layout: post
title: Igor's Blog
no-render-title: true
---

<style>
</style>

<script type="module">
    // Search box is hidden, on main page make it visible by setting display to block
    $("#autocomplete-search-box").css("display","block")
    defer(()=>{
    console.log("Deffered Click")
    $("#autocomplete-search-box-button").click()
  })
</script>
