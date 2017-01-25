// this is based on jQuery.Markdown.js with some fixes
(function($){$.fn.extend({processMarkdown:function(options){var defaults={target_form:$(this).selector};options=$.extend(defaults,options);function markdownConvert(art_body){var md={options:{empty_mark:"\n"},vs:{},variable:{editbody:null,stack:{tag:[],text:[]},text:"",html:""},convert:{tags:{hr:{default_:function(){return"<hr />"}},a:{default_:function(href,v){return'<a href="'+href+'">'+v+'</a>'},title:function(href,v,title){return'<a href="'+href+'" title="'+title+'" target="_blank">'+v+'</a>'},target_blank:function(href,v){return'<a href="'+href+'" target="_blank">'+v+'</a>'}},img:{default_:function(src,alt){return'<img class="img-frame" style="max-width:100%;" src="'+src+'" alt="'+alt+'"/>'},title:function(src,alt,title){return'<img title="'+title+'" class="img-frame" style="max-width:100%;" src="'+src+'" alt="'+alt+'"/>'}},pre:{default_:function(lang,v){return'<pre class="brush: '+lang.toLowerCase()+';">'+v+'</pre>'}},empty:{default_:function(){return md.options.empty_mark}},th:{default_:function(v){return'<th>'+v+'</th>'},center:function(v){return'<th align="center">'+v+'</th>'},left:function(v){return'<th align="left">'+v+'</th>'},right:function(v){return'<th align="right">'+v+'</th>'}},td:{default_:function(v){return'<td>'+v+'</td>'},center:function(v){return'<td align="center">'+v+'</td>'},left:function(v){return'<td align="left">'+v+'</td>'},right:function(v){return'<td align="right">'+v+'</td>'}},notag:{default_:function(tag,v){return'<'+tag+'>'+v+'</'+tag+'>'}}},replacer:{strong:["\\\*\\\*([^*]+)\\\*\\\*"],em:["\\\*([^*]+)\\\*"],del:["~~([^~]+)~~"],code:["`([^`]+)`"]},push:function(tag,text){if(!md.convert.inStack(tag)){md.variable.stack.tag.push(tag)}if(!md.variable.stack.text[tag]){md.variable.stack.text[tag]=[]}if(typeof text!=='undefined'){md.variable.stack.text[tag].push(text)}return this},pushest:function(text){if(md.convert.inStack()){var maxi=md.variable.stack.tag.length-1;var tag=md.variable.stack.tag[maxi];return md.convert.push(tag,text)}return this},pop:function(called,arguments_){if(md.convert.inStack()){var tag=md.variable.stack.tag.pop(),text="",innerHtml="",args=(arguments_||[]);while(typeof(text=md.variable.stack.text[tag].shift())!=='undefined'){if(tag==="pre"&&args.length===0){args.push(text);continue}md.convert.text(md.convert.text()+text);if(tag==="pre"||tag==="blockquote"){md.convert.text(md.convert.text()+md.options.empty_mark)}}if(tag==="blockquote"){md.convert.text(markdownConvert(md.convert.text()))}if(typeof called==='undefined'){called='default_'}if(args.length===0&&!md.convert.tags[tag]){args.push(tag);tag="notag"}args.push(md.convert.text());innerHtml=md.convert.tags[tag][called].apply(this,args);$.each(md.convert.replacer,function(rep,regs){$(regs).each(function(i,exp){var regexp=new RegExp(exp,"g");innerHtml=innerHtml.replace(regexp,'<'+rep+'>$1</'+rep+'>')})});if(!md.convert.inStack()){md.convert.html(innerHtml)}md.convert.text("");return innerHtml}return this},_string:function(variable,string){if(typeof string==='undefined'){return md.variable[variable]}else{md.variable[variable]=string;return this}},text:function(text){return md.convert._string("text",text)},html:function(html){return md.convert._string("html",html)},inStack:function(tag){if(typeof tag==='undefined'){return(md.variable.stack.tag.length!==0)?true:false}if(tag==="h"&&md.convert.inStack()){var maxi=md.variable.stack.tag.length-1;if(md.variable.stack.tag[maxi].match(/^h[1-6]/)){return true}}return($.inArray(tag,md.variable.stack.tag)!==-1)?true:false}},check:{init:function(){md.vs={}},valid:function(callmethod){if(''!==md.convert.html()){return false}if(md.convert.inStack()&&!md.convert.inStack(callmethod)){return false}return true},_pre:function(i,v){return{"nowv":v,"prev":md.variable.editbody[i-1],"nexv":md.variable.editbody[i+1],"tag":"","args":false}},isset:function(v){return(md.options.empty_mark!==v&&""!==v)?true:false},wrapper:function(callmethod,args){md.check.init();if(md.check.valid(callmethod)){md.vs=md.check._pre.apply(this,args)}else{return false}md.check.tags[callmethod].apply(this);if(typeof md.vs.nexv==='undefined'){while(md.convert.inStack()){md.convert.pushest(md.convert.pop())}}},tags:{h:function(args){if(null!==md.vs.nowv.match(/^#{1,6}\s*/)){var tag="h"+md.vs.nowv.match(/^#{1,6}/)[0].length;var text=md.vs.nowv.replace(/^#{1,6}\s*/,"");md.convert.push(tag,text).pop()}else if(md.check.isset(md.vs.nowv)&&md.vs.nexv){if(md.convert.inStack("h")){md.convert.pop()}if(md.vs.nexv.match(/^=+$/)){md.convert.push("h1",md.vs.nowv)}if(md.vs.nexv.match(/^\-+$/)){md.convert.push("h2",md.vs.nowv)}}else if(md.convert.inStack("h")){md.convert.pop()}},hr:function(){var checker=function(mark){if(md.vs.nowv.indexOf(mark)===0){var regexp=new RegExp(((mark==="*")?"\\"+mark:mark),"g");if(""===md.vs.nowv.replace(regexp,"")){md.convert.push("hr").pop()}}};checker("-");checker("*");checker("_")},empty:function(){if(""===md.vs.nowv||md.vs.nowv.match(/^!?\[.*\]:.*/)){md.convert.push("empty").pop()}},pre:function(){if(md.vs.nowv.indexOf("```")!==-1){if(!md.convert.inStack("pre")){md.convert.push("pre",md.vs.nowv.replace(/`/g,""))}else{md.convert.pop()}}else if(md.convert.inStack("pre")){md.convert.pushest(md.vs.nowv)}},blockquote:function(args){var regexp=/^\s*(>|&gt;)\s?/;if(md.vs.nowv.match(regexp)){md.vs.nowv=md.vs.nowv.replace(regexp,"");md.convert.push("blockquote",md.vs.nowv)}else if(!md.check.isset(md.vs.nowv)){if(typeof md.vs.nexv!=='undefined'&&md.check.isset(md.vs.nexv)){if(!md.vs.nexv.match(regexp)){md.convert.pop()}}}else if(md.convert.inStack("blockquote")){md.convert.pushest(md.vs.nowv)}},ol:function(){var nv=md.vs.nowv;var nn=md.vs.nexv;if(nv.match(/^(\s{0,7})?[0-9]+[.]\s/)){if(!md.convert.inStack("ol")){md.convert.push("ol");nv=nv.replace(/^\s+/g,"")}}if(md.convert.inStack("ol")){if(nv.match(/^[0-9]+[.]\s/)||nv.match(/^[\*\+\-]\s/)){lipop();md.convert.push("li",nv.replace(/^\s{0,7}?[0-9]+[.]\s(.*)/,"$1").replace(/^[\*\+\-]\s(.*)/,"$1"))}else if(nv.match(/^\s+/)){nv=nv.replace(/^\s+/g,"");if(nv.match(/^[\*\+\-]\s/)){md.convert.pushest(nv);if(nn.match(/^[0-9]+[.]\s/)){lipop()}}else if(nv.match(/^.*/)){md.convert.pushest(nv)}else if(!md.check.isset(nv)){md.convert.pushest(nv)}}else if(!md.check.isset(nv)){if(!md.check.isset(nn)){md.convert.pushest(nv);return true}if(nn&&nn.match(/^\s+/)){if(!nn.match(/^\s{1,7}?[\*\+\-]\s/)){md.convert.pushest(nv);return true}}else if(nn){if(nn.match(/^[0-9]+[.]\s/)){md.convert.pushest(nv);return true}}lipop();md.convert.pop();md.addP=false}else{md.convert.pushest(nv)}}},ul:function(){var nv=md.vs.nowv;var nn=md.vs.nexv;if(nv.match(/^(\s{0,7})?[\*\+\-]\s/)){if(!md.convert.inStack("ul")){md.convert.push("ul");nv=nv.replace(/^\s+/g,"")}}if(md.convert.inStack("ul")){if(nv.match(/^[0-9]+[.]\s/)||nv.match(/^[\*\+\-]\s/)){lipop();md.convert.push("li",nv.replace(/^\s{0,7}?[0-9]+[.]\s(.*)/,"$1").replace(/^[\*\+\-]\s(.*)/,"$1"))}else if(nv.match(/^\s+/)){nv=nv.replace(/^\s+/g,"");if(nv.match(/^[0-9]+[.]\s/)){md.convert.pushest(nv);if(nn.match(/^[\*\+\-]\s/)){lipop()}}else if(nv.match(/^.*/)){md.convert.pushest(nv)}else if(!md.check.isset(nv)){md.convert.pushest(nv)}}else if(!md.check.isset(nv)){if(!md.check.isset(nn)){md.convert.pushest(nv);return true}if(nn&&nn.match(/^\s+/)){if(!nn.match(/^\s{1,7}?[0-9]+[.]\s/)){md.convert.pushest(nv);return true}}else if(nn){if(nn.match(/^[\*\+\-]\s/)){md.convert.pushest(nv);return true}}lipop();md.convert.pop();md.addP=false}else{md.convert.pushest(nv)}}},table:function(){var nv=md.vs.nowv;var nn=md.vs.nexv;if(nn&&nv.match(/\|/)&&nn.match(/:?-+:?[\s+]?\|/)){if(!md.convert.inStack("table")){md.convert.push("table").push("thead").push("tr");var trs=nn.replace(/^\|(.*)\|$/,"$1").split("|");md.aligns=[];$(trs).each(function(i,v){var repv=v.replace(/^\s+|\s+$/g,"");if(repv.match(/^:.*:$/)){md.aligns[i]="center"}else if(repv.match(/^:/)){md.aligns[i]="left"}else if(repv.match(/:$/)){md.aligns[i]="right"}else{md.aligns[i]="default_"}});var ths=nv.replace(/^\|(.*)\|$/,"$1").split("|");$(ths).each(function(i,v){md.convert.pushest(md.convert.push("th",v.replace(/^\s+|\s+$/g,"")).pop(md.aligns[i]))});md.convert.pushest((md.convert.pop()));md.convert.pushest((md.convert.pop()))}}else if(nn&&nv.match(/\|/)){if(!md.convert.inStack("tbody")){md.convert.push("tbody")}else{md.convert.push("tr");var tds=nv.replace(/^\|(.*)\|$/,"$1").split("|");$(tds).each(function(i,v){md.convert.pushest(md.convert.push("td",v.replace(/^\s+|\s+$/g,"")).pop(md.aligns[i]))});md.convert.pushest((md.convert.pop()))}}else if(md.convert.inStack("table")){md.convert.pushest((md.convert.pop()));md.convert.pop()}},p:function(){if((!md.vs.nowv.match(/^\s*?</)&&md.vs.nowv!=="\n")){if(!md.vs.nowv.match(/^\s*?</)){if(!md.convert.inStack("p")){md.convert.push("p")}var getTitle=function(src){var title=null;src=src.replace(/\\/g,"\\\\").replace(/\*/g,"\\*").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/\$/g,"\\$").replace(/\-/g,"\\-").replace(/\|/g,"\\|").replace(/\//g,"\\/");var matches=new RegExp("\\["+src+"\\]:","i");$.each(md.variable.editbody,function(i,v){if(v.match(matches)){if((uri=v.match(/\[.*\]:(.*)/))){uri=uri[1].replace(/^\s+/,"");src=uri.split(" ")[0];title=uri.match(/.*"(.*)"/);title=(title)?title[1]:null}}});return[src,title]};var createtags=function(src,alt,title){if(null!==md.vs.nowv.match(/!/)){return md.convert.push("img").pop((title?"title":"default_"),[src,alt,title])}else{return md.convert.push("a").pop((title?"title":"default_"),[src,alt,title])}};var alt,src,title_matches,title,a;while(null!==md.vs.nowv.match(/!?\[.*?\]\(.*?\)/)){var a_match=md.vs.nowv.match(/\[(.*?)\]\((.*?)\)/);var src_title=a_match[2].split(" ");title=src_title[1]&&src_title[1].replace(/"/g,"");a=createtags(src_title[0],a_match[1],title);}if(null!==md.vs.nowv.match(/!?\[.*?\]\[.*?\]/)){alt=md.vs.nowv.replace(/^.*?!?\[(.*?)\]\[.*?\].*/,"$1");src=md.vs.nowv.replace(/^.*?!?\[.*?\]\[(.*?)\].*/,"$1");title_matches=getTitle(src);src=title_matches[0];title=title_matches[1];a=createtags(src,alt,title);}if(null!==md.vs.nowv.match(/!?\[.*?\]/)){alt=md.vs.nowv.replace(/^.*?!?\[(.*?)\].*?/,"$1");src=alt;title_matches=getTitle(src);src=title_matches[0];title=title_matches[1];a=createtags(src,alt,title);}md.vs.nowv=md.vs.nowv.replace(/(.*)!(<img.+)/,"$1$2");if(typeof md.vs.nexv!=='undefined'){if(md.convert.inStack("p")){if(md.vs.nexv.match(/^=+$/)){md.convert.pop();md.convert.push("h1",md.vs.nowv);return true}if(md.vs.nexv.match(/^\-+$/)){md.convert.pop();md.convert.push("h2",md.vs.nowv);return true}}var convertedtext=markdownConvert(md.vs.nexv);if(""!==convertedtext&&"<p>"!==convertedtext.substr(0,3)){md.convert.pushest(md.vs.nowv).pop()}}if(typeof md.vs.nexv==='undefined'){md.convert.pushest(md.vs.nowv).pop()}else{md.convert.pushest(md.vs.nowv+'<br>')}}}},etc:function(){var innerHtml=md.vs.nowv;md.convert.html(innerHtml)}}}};var lipop=function(){var tag="li";if(md.convert.inStack(tag)){var textlength=getTextLength();var textlengthAddSpace=getTextLength(true);var converttext=getConvertText();if(textlength!==1&&textlength!==textlengthAddSpace){md.addP=true}md.convert.pop();var poped=markdownConvert(converttext);if(!md.addP){poped=poped.replace("<p>","").replace("</p>","")}md.convert.push(tag,poped);md.convert.pushest(md.convert.pop())}};var getConvertText=function(mode_length){var tag="li";var textlength=0;var converttext="";$(md.variable.stack.text[tag]).each(function(i,v){if(""!==v){textlength++}converttext+=v+md.options.empty_mark});return((mode_length)?textlength:converttext)};var getTextLength=function(isset_){tag="li";return((isset_)?getConvertText(true):md.variable.stack.text[tag].length)};md.variable.editbody=art_body.split(/\n/);var md_format="";$.each(md.variable.editbody,function(){var args=arguments;$.each(md.check.tags,function(tagname){md.check.wrapper(tagname,args)});md_format+=md.convert.html();md.convert.html("")});return md_format}return this.each(function(){var markdownconvert="";$.each($(this),function(i,v){v=($(v).val()||$(v).html());markdownconvert+=markdownConvert.apply(this,[v]);$(this).html(markdownconvert)});})}})})(jQuery);

/*! jquery.livequery - v1.3.6 - 2013-08-26 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?a(require("jquery")):a(jQuery)}(function(a,b){function c(a,b,c,d){return!(a.selector!=b.selector||a.context!=b.context||c&&c.$lqguid!=b.fn.$lqguid||d&&d.$lqguid!=b.fn2.$lqguid)}a.extend(a.fn,{livequery:function(b,e){var f,g=this;return a.each(d.queries,function(a,d){return c(g,d,b,e)?(f=d)&&!1:void 0}),f=f||new d(g.selector,g.context,b,e),f.stopped=!1,f.run(),g},expire:function(b,e){var f=this;return a.each(d.queries,function(a,g){c(f,g,b,e)&&!f.stopped&&d.stop(g.id)}),f}});var d=a.livequery=function(b,c,e,f){var g=this;return g.selector=b,g.context=c,g.fn=e,g.fn2=f,g.elements=a([]),g.stopped=!1,g.id=d.queries.push(g)-1,e.$lqguid=e.$lqguid||d.guid++,f&&(f.$lqguid=f.$lqguid||d.guid++),g};d.prototype={stop:function(){var b=this;b.stopped||(b.fn2&&b.elements.each(b.fn2),b.elements=a([]),b.stopped=!0)},run:function(){var b=this;if(!b.stopped){var c=b.elements,d=a(b.selector,b.context),e=d.not(c),f=c.not(d);b.elements=d,e.each(b.fn),b.fn2&&f.each(b.fn2)}}},a.extend(d,{guid:0,queries:[],queue:[],running:!1,timeout:null,registered:[],checkQueue:function(){if(d.running&&d.queue.length)for(var a=d.queue.length;a--;)d.queries[d.queue.shift()].run()},pause:function(){d.running=!1},play:function(){d.running=!0,d.run()},registerPlugin:function(){a.each(arguments,function(b,c){if(a.fn[c]&&!(a.inArray(c,d.registered)>0)){var e=a.fn[c];a.fn[c]=function(){var a=e.apply(this,arguments);return d.run(),a},d.registered.push(c)}})},run:function(c){c!==b?a.inArray(c,d.queue)<0&&d.queue.push(c):a.each(d.queries,function(b){a.inArray(b,d.queue)<0&&d.queue.push(b)}),d.timeout&&clearTimeout(d.timeout),d.timeout=setTimeout(d.checkQueue,20)},stop:function(c){c!==b?d.queries[c].stop():a.each(d.queries,d.prototype.stop)}}),d.registerPlugin("append","prepend","after","before","wrap","attr","removeAttr","addClass","removeClass","toggleClass","empty","remove","html","prop","removeProp"),a(function(){d.play()})});

// Reorder the Sidebar
var sidebar = $('.layout-sidebar-container');
sidebar.children().each(function(i,el){sidebar.prepend(el);});

$('.content').livequery( function(){
	var post    = $(this),
		content = $('span:not(.label)',post).first();

    // Convert Markdown
    content.each(function(){
    	var markdown = $(this).html();
    		markdown = markdown.replace(/^\s+/,''); // trim whitespace at begining
    		markdown = markdown.replace(/^\s+$/gm,"\n"); // trim empty lines
    		markdown = markdown.replace(/<\s*br\s*>/g,"\n"); // tidy up <br>
    		markdown = markdown.replace(/^##([\s\w])/gm,"###$1"); // Don't allow H2
    		markdown = markdown.replace(/^#([\s\w])/gm,"###$1"); // Don't allow H1
    	$(this).html(markdown).processMarkdown();
    });

    // External Links in new tab
    $("a[href^='http']",post).attr("target","_blank");
});

$('a.likeAnchor').livequery( function(){
	// Strip Like Button test to use FA-Heart instead
	$(this).html('');
});


$('.oembed_snippet').livequery( function(){
    var iframe = $(this).find('iframe').first();
    if (iframe.length > 0) {
        if (iframe.attr('src').match('vimeo') ||
            iframe.attr('src').match('youtu') ||
            iframe.attr('src').match('slideshare')) $(this).addClass('video');
    }
});
