// 2.1.7 (2017-04-03)
(function(exports,undefined){"use strict";var modules={};function require(ids,callback){var module,defs=[];for(var i=0;i<ids.length;++i){module=modules[ids[i]]||resolve(ids[i]);if(!module){throw"module definition dependecy not found: "+ids[i]}defs.push(module)}callback.apply(null,defs)}function define(id,dependencies,definition){if(typeof id!=="string"){throw"invalid module definition, module id must be defined and be a string"}if(dependencies===undefined){throw"invalid module definition, dependencies must be specified"}if(definition===undefined){throw"invalid module definition, definition function must be specified"}require(dependencies,function(){modules[id]=definition.apply(null,arguments)})}function defined(id){return!!modules[id]}function resolve(id){var target=exports;var fragments=id.split(/[.\/]/);for(var fi=0;fi<fragments.length;++fi){if(!target[fragments[fi]]){return}target=target[fragments[fi]]}return target}function expose(ids){var i,target,id,fragments,privateModules;for(i=0;i<ids.length;i++){target=exports;id=ids[i];fragments=id.split(/[.\/]/);for(var fi=0;fi<fragments.length-1;++fi){if(target[fragments[fi]]===undefined){target[fragments[fi]]={}}target=target[fragments[fi]]}target[fragments[fragments.length-1]]=modules[id]}if(exports.AMDLC_TESTS){privateModules=exports.privateModules||{};for(id in modules){privateModules[id]=modules[id]}for(i=0;i<ids.length;i++){delete privateModules[ids[i]]}exports.privateModules=privateModules}}var __moxman_util_Loader="moxman/util/Loader",__moxman_Env="moxman/Env",__moxman_util_I18n="moxman/util/I18n",__moxman_Loader="moxman/Loader",__moxman_interop_TinyMcePlugin="moxman/interop/TinyMcePlugin",__moxman_interop_CkEditorPlugin="moxman/interop/CkEditorPlugin";define(__moxman_util_Loader,[],function(){"use strict";var idCount=0,loadedUrls={};function noop(){}function appendToHead(node){document.getElementsByTagName("head")[0].appendChild(node)}var Loader={maxLoadTime:5,load:function(urls,loadedCallback,errorCallback){var cssFiles=urls.css||[],jsFiles=urls.js||[];function loadNextScript(){if(jsFiles.length){Loader.loadScript(jsFiles.shift(),loadNextScript,errorCallback)}else{loadNextCss()}}function loadNextCss(){if(cssFiles.length){Loader.loadCss(cssFiles.shift(),loadNextCss,errorCallback)}else{loadedCallback()}}loadNextScript()},loadScript:function(url,loadedCallback,errorCallback){var key,script;function done(){loadedUrls[url]=true;loadedCallback()}if(loadedUrls[url]){loadedCallback();return}loadedCallback=loadedCallback||noop;errorCallback=errorCallback||noop;script=document.createElement("script");script.type="text/javascript";if(typeof url=="object"){for(key in url){script.setAttribute(key,url[key])}}else{script.src=url}if("onload"in script){script.onload=done;script.onerror=errorCallback}else{script.onreadystatechange=function(){var state=script.readyState;if(state=="complete"||state=="loaded"){done()}};script.onerror=errorCallback}appendToHead(script)},loadCss:function(url,loadedCallback,errorCallback){var doc=document,link,style,startTime;function done(){loadedUrls[url]=true;loadedCallback()}if(loadedUrls[url]){loadedCallback();return}loadedCallback=loadedCallback||noop;errorCallback=errorCallback||noop;function isOldWebKit(){var webKitChunks=navigator.userAgent.match(/WebKit\/(\d*)/);return!!(webKitChunks&&webKitChunks[1]<536)}function waitForWebKitLinkLoaded(){var styleSheets=doc.styleSheets,file,i=styleSheets.length,owner;while(i--){file=styleSheets[i];owner=file.ownerNode?file.ownerNode:file.owningElement;if(owner&&owner.id===link.id){done();return}}if((new Date).getTime()-startTime<Loader.maxLoadTime*1e3){window.setTimeout(waitForWebKitLinkLoaded,0)}else{errorCallback()}}function waitForGeckoLinkLoaded(){try{var cssRules=style.sheet.cssRules;done();return cssRules}catch(ex){}if((new Date).getTime()-startTime<Loader.maxLoadTime*1e3){window.setTimeout(waitForGeckoLinkLoaded,0)}else{errorCallback()}}link=doc.createElement("link");link.rel="stylesheet";link.type="text/css";link.href=url;link.id="u"+idCount++;startTime=(new Date).getTime();if("onload"in link&&!isOldWebKit()){link.onload=done;link.onerror=errorCallback}else{if(navigator.userAgent.indexOf("Firefox")>0){style=doc.createElement("style");style.textContent='@import "'+url+'"';waitForGeckoLinkLoaded();appendToHead(style);return}waitForWebKitLinkLoaded()}appendToHead(link)}};return Loader});define(__moxman_Env,[],function(){var nav=navigator,userAgent=nav.userAgent,webkit,ie,mac,android,iDevice,phone,tablet;function matchMediaQuery(query){return"matchMedia"in window?matchMedia(query).matches:false}webkit=/WebKit/.test(userAgent);ie=!webkit&&/MSIE/gi.test(userAgent)&&/Explorer/gi.test(nav.appName);ie=ie&&/MSIE (\w+)\./.exec(userAgent)[1];mac=userAgent.indexOf("Mac")!=-1;android=/Android/.test(userAgent);iDevice=/(iPad|iPhone)/.test(userAgent);phone=matchMediaQuery("only screen and (max-device-width: 480px)")&&(android||iDevice);tablet=matchMediaQuery("only screen and (min-width: 800px)")&&(android||iDevice);return{apiPageName:"api.php",ie:ie,ie7:!("createRange"in document)&&"all"in document&&!window.opera&&!document.documentMode,mac:mac,phone:phone,tablet:tablet,desktop:!phone&&!tablet}});define(__moxman_util_I18n,[],function(){"use strict";function resolve(id){var target=window;var fragments=id.split(/\//);for(var fi=0;fi<fragments.length;++fi){if(!target[fragments[fi]]){return}target=target[fragments[fi]]}return target}var I18n=resolve("moxman/util/I18n");if(I18n){return I18n}var data={};return{add:function(code,items){for(var name in items){data[name]=items[name]}},translate:function(text,defaultText){if(typeof text=="undefined"){return text}if(typeof text!="string"&&"raw"in text){return text.raw}if(text.push){var values=text.slice(1);text=(data[text[0]]||text[0]).replace(/\{([^\}]+)\}/g,function(match1,match2){return values[match2]})}return data[text]||defaultText||text},data:data}});define(__moxman_Loader,[__moxman_util_Loader,__moxman_Env,__moxman_util_I18n],function(ResourceLoader,Env,I18n){var exports=this||window;function createThrobber(){var blocker=document.createElement("div"),throbber=document.createElement("div"),styleElm=document.createElement("style"),dot,head,i;blocker.id="moxman-modal-block";blocker.className="moxman-reset moxman-fade";throbber.className="moxman-reset moxman-loader-throbber";styleElm=document.createElement("style");styleElm.type="text/css";function getAnim(sec){var line="moxman-loader-scale 0.75s "+sec+" infinite cubic-bezier(.2, .68, .18, 1.08);";return"-webkit-animation: "+line+"animation: "+line}var animKeyFramesCss="keyframes moxman-loader-scale {"+"0% {"+"-webkit-transform: scale(1);"+"transform: scale(1);"+"opacity: 1;"+"}"+"45% {"+"-webkit-transform: scale(0.1);"+"transform: scale(0.1);"+"opacity: 0.7;"+"}"+"80% {"+"-webkit-transform: scale(1);"+"transform: scale(1);"+"opacity: 1;"+"}"+"}";var css=".moxman-reset {"+"margin: 0; padding: 0; border: 0; outline: 0;"+"vertical-align: top; background: transparent;"+"font-size: @font-size; position: static;"+"width: auto; height: auto;"+"white-space: nowrap; cursor: inherit;"+"-webkit-tap-highlight-color: transparent;"+"line-height: normal; font-weight: normal;"+"text-align: left; float: none;"+"-moz-box-sizing: content-box;"+"-webkit-box-sizing: content-box;"+"box-sizing: content-box;"+"direction: ltr;"+"max-width: none;"+"}"+".moxman-fade {"+"opacity: 0;"+"filter: alpha(opacity=30);"+"transition: opacity 0.15s linear;"+"}"+".moxman-in {"+"opacity: 0.3;"+"}"+"#moxman-modal-block {"+"position: fixed;"+"left: 0; top: 0;"+"width: 100%; height: 100%;"+"background: #000;"+"}"+"@-webkit-"+animKeyFramesCss+"@"+animKeyFramesCss+".moxman-loader-throbber {"+"position: fixed;"+"top: 50%; left: 50%;"+"width: 60px; height: 60px;"+"margin-top: -30px;"+"margin-left: -30px;"+"}"+".moxman-loader-throbber > div:nth-child(1) {"+getAnim("-0.24s")+"}"+".moxman-loader-throbber > div:nth-child(2) {"+getAnim("-0.12s")+"}"+".moxman-loader-throbber > div:nth-child(3) {"+getAnim("-0s")+"}"+".moxman-loader-throbber > .moxman-loader-throbber-dot {"+"background-color: #000;"+"width: 15px;"+"height: 15px;"+"border-radius: 100%;"+"margin: 2px;"+"-webkit-animation-fill-mode: both;"+"animation-fill-mode: both;"+"display: inline-block;"+"}";if(styleElm.styleSheet){styleElm.styleSheet.cssText=css}else{styleElm.appendChild(document.createTextNode(css))}head=document.getElementsByTagName("head")[0];if(head.firstChild){head.insertBefore(styleElm,head.firstChild)}else{head.appendChild(styleElm)}blocker.style.zIndex=16777215;throbber.style.zIndex=16777215;document.body.appendChild(blocker);document.body.appendChild(throbber);for(i=0;i<3;i++){dot=document.createElement("div");dot.className="moxman-reset moxman-loader-throbber-dot";throbber.appendChild(dot)}setTimeout(function(){blocker.className+=" moxman-in"},0);return{hide:function(){throbber.parentNode.removeChild(throbber);styleElm.parentNode.removeChild(styleElm)}}}if("toJSON"in Object.prototype){alert("MoxieManager detected an old prototype.js version that breaks compatibility.");return}function loadAndRender(view){return function(settings){var langCode,cacheSuffix=Env.cacheSuffix,throbber;function appendCacheSuffix(url){if(cacheSuffix){cacheSuffix=cacheSuffix.replace(/^[?& ]+/,"");if(cacheSuffix){url+=(url.indexOf("?")===-1?"?":"&")+cacheSuffix}}return url}settings=settings||{};if(!Env.baseUrl){var scripts=document.getElementsByTagName("script");for(var i=0;i<scripts.length;i++){var src=scripts[i].src;if(/(^|\/)moxman\./.test(src)){cacheSuffix=Env.cacheSuffix||src.split("?")[1];Env.baseUrl=src.substring(0,src.lastIndexOf("/"))+"/..";Env.apiPageUrl=Env.baseUrl+"/"+Env.apiPageName;break}}}langCode=settings.language||Env.language;if(!moxman.ui){if(throbber){return}throbber=createThrobber();ResourceLoader.load({js:[appendCacheSuffix(Env.baseUrl+"/js/moxman.api.min.js"),Env.apiPageUrl+"?action=language"+(langCode?"&code="+langCode:"")],css:[appendCacheSuffix(Env.baseUrl+"/skins/"+(settings.skin||"lightgray")+"/skin"+(Env.ie7?".ie7":"")+".min.css")]},function(){throbber.hide();moxman.ui.FloatPanel.zIndex=(settings.zIndex||moxman.ui.FloatPanel.zIndex)+65535;moxman.Dialogs.loaded(Env);moxman.Dialogs[view](settings)})}else{moxman.Dialogs[view](settings)}}}var Loader={browse:loadAndRender("browse"),upload:loadAndRender("upload"),edit:loadAndRender("edit"),zip:loadAndRender("zip"),createDir:loadAndRender("createDir"),createDoc:loadAndRender("createDoc"),view:loadAndRender("view"),rename:loadAndRender("rename")};exports.moxman=exports.moxman||{};for(var name in Loader){exports.moxman[name]=Loader[name]}exports.moxman.addI18n=I18n.add;return Loader});define(__moxman_interop_TinyMcePlugin,[__moxman_Loader,__moxman_Env],function(Loader,Env){if(!window.tinymce){return{}}tinymce.PluginManager.add("moxiemanager",function(editor,url){var editorSettings=editor.settings;Env.baseUrl=url;Env.apiPageUrl=url+"/"+Env.apiPageName;Env.language=editorSettings.language;Env.cacheSuffix=editorSettings.cache_suffix;function convertUrl(url){return editor.convertURL(url,null,null)}function getMime(fileName){var mimes={mp4:"video/mp4",m4v:"video/mp4",ogv:"video/ogg",webm:"video/webm"};return mimes[fileName.substr(fileName.lastIndexOf(".")+1).toLowerCase()]}function getBrowseSettings(type){var browseSettings={};tinymce.each(editorSettings,function(value,key){if(key.indexOf("moxiemanager_")===0){browseSettings[key.substring(13)]=value}});var typeSettings=editorSettings["moxiemanager_"+type+"_settings"];if(typeSettings){tinymce.each(typeSettings,function(value,key){key=key.replace(/moxiemanager_/g,"");browseSettings[key]=value})}return browseSettings}editorSettings.file_browser_callback=function(id,value,type,win){var zIndex=editor.windowManager.zIndex,url;if(tinymce.ui.FloatPanel){zIndex=tinymce.ui.FloatPanel.currentZIndex}if(tinymce.trim(value).length>0){url=editor.documentBaseURI.toAbsolute(value)}Loader.browse(tinymce.extend({zIndex:zIndex,url:url,document_base_url:editorSettings.document_base_url,view:type=="image"||type=="media"?"thumbs":"files",multiple:false,oninsert:function(args){var fieldElm=win.document.getElementById(id);fieldElm.value=convertUrl(args.focusedFile.meta.url);if("createEvent"in document){var evt=document.createEvent("HTMLEvents");evt.initEvent("change",false,true);fieldElm.dispatchEvent(evt)}else{fieldElm.fireEvent("onchange")}}},getBrowseSettings(type)))};function replace(template,data,escapeFuncs){if(typeof template!="string"){return template(data,escapeFuncs)}function resolve(data,path){var i,res;for(i=0,res=data,path=path.split(".");i<path.length;i++){res=res[path[i]]}return res}template=""+template.replace(/\{\$([^\}]+)\}/g,function(match,variableName){var i,parts=variableName.split("|"),value=resolve(data,parts[0]);if(typeof value=="undefined"){return""}if(parts.length==1&&escapeFuncs&&escapeFuncs.xmlEncode){value=escapeFuncs.xmlEncode(value)}for(i=1;i<parts.length;i++){value=escapeFuncs[parts[i]](value,data,variableName)}return value});template=template.replace(/\{\=([\w]+)([^\}]+)\}/g,function(match,funcName,args){return resolve(escapeFuncs,funcName)(data,funcName,args)});return template}editor.addCommand("mceInsertFile",function(){var selection=editor.selection,lastRng;lastRng=selection.getRng();function processTemplate(template,file){return replace(template,file,{urlencode:function(value){return encodeURIComponent(value)},xmlEncode:function(value){return tinymce.DOM.encode(value)},sizeSuffix:function(value){if(value==-1){return""}if(value>1048576){return Math.round(value/1048576,1)+" MB"}if(value>1024){return Math.round(value/1024,1)+" KB"}return value+" b"}})}var zIndex=editor.windowManager.zIndex;if(tinymce.ui.FloatPanel){zIndex=tinymce.ui.FloatPanel.currentZIndex}Loader.browse(tinymce.extend({zIndex:zIndex,document_base_url:editorSettings.document_base_url,oninsert:function(args){var html="";tinymce.each(args.files,function(file,i){selection.setRng(lastRng);if(i>0){html+=" "}if(/\.(gif|jpe?g|png)$/i.test(file.name)){html+=processTemplate(editor.getParam("moxiemanager_image_template",'<img src="{$meta.url}" '+'width="{$meta.width}" height="{$meta.height}">'),file)}else if(/\.(mp4|ogv|webm)$/i.test(file.name)){var videoTemplate="<video controls>";if(file.meta.alt_img){videoTemplate='<video controls poster="{$meta.alt_img}">'}if(file.meta.url){file.meta.url=convertUrl(file.meta.url);videoTemplate+='<source src="{$meta.url}" type="'+getMime(file.meta.url)+'" />'}if(file.meta.alt_url){file.meta.alt_url=convertUrl(file.meta.alt_url);videoTemplate+='<source src="{$meta.alt_url}" type="'+getMime(file.meta.alt_url)+'" />'}if(file.meta.alt_img){file.meta.alt_img=convertUrl(file.meta.alt_img);videoTemplate+='<img src="{$meta.alt_img}" />'}videoTemplate+="</video>";html+=processTemplate(editor.getParam("moxiemanager_video_template",videoTemplate),file)}else{if(!selection.isCollapsed()){editor.execCommand("mceInsertLink",file.meta.url);return false}html+=processTemplate(editor.getParam("moxiemanager_file_template",'<a href="{$url}">{$name}</a>'),file)}});selection.setRng(lastRng);editor.execCommand("mceInsertContent",false,html)}},getBrowseSettings()))});if(tinymce.Env){editor.addButton("insertfile",{icon:"browse",title:"Insert file",cmd:"mceInsertFile"})}else{editor.addButton("insertfile",{image:url+"/skins/lightgray/img/insertfile.gif",title:editor.getLang("moxiemanager_insert","Insert file"),cmd:"mceInsertFile"})}});var langCode=tinymce.settings?tinymce.settings.language:"auto";if(langCode&&langCode!="en"){tinymce.ScriptLoader.load((tinymce.PluginManager.urls.moxiemanager||tinymce.baseURL+"/plugins/moxiemanager")+"/"+Env.apiPageName+"?action=language&tinymce=true&code="+langCode)}});define(__moxman_interop_CkEditorPlugin,[__moxman_Loader,__moxman_Env],function(Loader,Env){if(!window.CKEDITOR){return{}}CKEDITOR.plugins.add("moxiemanager",{init:function(editor){editor.config.filebrowserBrowseUrl="/dummy";Env.baseUrl=editor.plugins.moxiemanager.path;Env.apiPageUrl=Env.baseUrl+Env.apiPageName;function createBrowseCall(element){return function(){var target,field,browseConfig,key;target=(element.filebrowser.target||element.filebrowser).split(":");field=this.getDialog().getContentElement(target[0],target[1]);browseConfig={zIndex:1048575,url:field.getValue(),multiple:false,oninsert:function(args){field.setValue(args.focusedFile.meta.url)}};for(key in editor.config){if(key.indexOf("moxiemanager_")===0){browseConfig[key.substr(13)]=editor.config[key]}}Loader.browse(browseConfig)}}function attachMoxieManager(contents){if(!contents){return}for(var i=0;i<contents.length;i++){var element=contents[i];if(!element){return}attachMoxieManager(element.children||element.elements);if(element.filebrowser){element.onClick=createBrowseCall(element);element.hidden=false}}}CKEDITOR.on("dialogDefinition",function(evt){attachMoxieManager(evt.data.definition.contents)})}})});expose([__moxman_util_Loader,__moxman_Env,__moxman_util_I18n,__moxman_Loader,__moxman_interop_TinyMcePlugin,__moxman_interop_CkEditorPlugin])})(window);