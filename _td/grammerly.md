---
title: Grammerly
permalink: /grammerly
layout: post
---

<script src="https://unpkg.com/@grammarly/editor-sdk?clientId=client_AMv8Ek2YNBrCaW2gfCXEa5"> </script>

<!--
    Need OAuth tokens to support autocomplete (as only a pro feature)
<grammarly-editor-plugin config.autocomplete="on" >
-->
<grammarly-editor-plugin config.activiation="immediate">
<div class="mb-3">
    <textarea class="form-control" id="grammerlyinput" rows="10">Try some poorly written text. Theyre dog is blue</textarea>
</div>
</grammarly-editor-plugin>
