---
title: Life in Weeks
layout: post
datafile: life-in-weeks
start_date: 1978-06-06
end_year: 2078
permalink: /weeks
---

<style>
.life-in-weeks h2 {
	margin-top: 0;
}
.life-in-weeks .border-tertiary {
	border-color: #eee;
	color: #666;
}
.life-in-weeks .border-tertiary a {
	color: #666;
}
.life-in-weeks .week a {
	text-decoration: none;
}
.life-in-weeks .future-date {
	background-color: #eee;
}
.float-left{
    float: left!important;
}
</style>

{% assign data   = site.data[page.datafile] %}
{% assign start_date = page.start_date %}
{% assign split_start = start_date | split: "-" %}
{% assign start_year = split_start[0] %}
{% assign start_month = split_start[1] %}
{% assign start_day = split_start[2] %}

<script>console.log("{{page.datafile }}");</script>
<script>console.log({{site.data | json }});</script>
<!--
<script>console.log({{data | json }});</script>
-->

{% assign end_year = page.end_year %}
{% assign year_border_class = "future-date"%}

My life, where each week I've been alive is a little box. When meaningful things happen (for both better and worse) I make a note of it so I can remember how much of life is influenced by these factors. This is a brilliant idea from this [guy](https://busterbenson.com/life-in-weeks).

<div class="life-in-weeks">
<div class="row justify-content-center">
    	<div class="col">
    		{% for year in (start_year..end_year) %}
    			{% capture this_year = year %}{{ year }}-{{ start_month }}-{{ start_day }}{% endcapture %}
    			{% capture next_year = year %}{{ year | plus: 1 }}-{{ start_month }}-{{ start_day }}{% endcapture %}
    			{% assign age = year | minus: start_year %}
    			{% assign age_modulo = age | modulo: 10 %}
    			{% if age_modulo == 0  %}
    		    <br clear="all" />
    		    <a name="decade-{{ age }}"></a>
    		    <div class="row text-left display-block w-100 mt-4">
    			    <div class="col sticky-top mt-1" style="top: 60px; background-color: #fff;"><h2 class="mt-0">
    			    </h2></div>
    			  	</div>
    			{% endif %}

    	    <div class="border border-gray {{ year_border_class }} float-left text-truncate"
    	    		 style="height: 2em; max-height: 2em; padding: 2px 5px; margin: 2px;"
    	    		 data-toggle="popover"
    	    		 data-placement="right"
    	    		 data-trigger="hover"
    	    		 data-content="">
    	      {% unless page.suppress_age %}{{ age }} in {% endunless %}{{ year }}
    	    </div>

    	    {% for week in (0..53) %}
    		    {% assign week_border_class = "border-tertiary" %}
    		    {% assign week_modifier = 604800 | times: week %}
    		    {% assign this_week_date = this_year | date: "%s" | plus: week_modifier | date: "%Y-%m-%d" %}
    		    {% assign end_year_date = this_week_date | date: "%s" | plus: week_modifier | date: "%Y-%m-%d" %}

    	    	<div data-date="{{ this_week_date }}" class="week border {{ week_border_class }} float-left text-center text-truncate"
    	    			 style="height: 2em; max-height: 2em; padding: 2px 5px; margin: 2px;">
    	    		{% for day in (0..6) %}
    				    {% assign day_modifier = 86400 | times: day %}
    	    			{% assign specific_date = this_week_date | date: "%s" | plus: day_modifier | date: "%Y-%m-%d" %}
    	    			{% if specific_date < next_year %}
    							{% for event in data[specific_date] %}
    								<a {% if event.link %}href="{{ event.link }}"{% endif %} title="{{ specific_date | date: "%b %-d, %Y" }}" target="_new" {% if event.desc %}data-toggle="popover" data-placement="auto"{% endif %} title="{{ specific_date }}" data-trigger="hover" data-content="{{ event.desc }}">{{ event.name }}</a>
    							{% endfor %}
    						{% endif %}
    	    		{% endfor %}
    	    	</div>
    	    {% endfor %}
    		{% endfor %}
    	</div>
    </div>

</div> <!-- End life in weeks -->

<script>
    console.log("+Adding onReady");
	defer(function () {
	  $(function () {
			var today = new Date();
			$( ".week" ).each(function( index ) {
			  if (today < Date.parse($( this ).attr('data-date'))) {
			  	$( this ).addClass('future-date');
			  }
			});
	  })
	});
</script>
