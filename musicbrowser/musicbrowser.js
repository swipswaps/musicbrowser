var currentFolder = '';
var currentHash = '###';
var jwPlayerId = 'jwp';
var prefix = 'index.php?path=';
var hotkeyModifier = false;

document.onkeydown = hotkey;

window.onload = function() {
  pollHash();
  setInterval(pollHash, 1000); 
}

function pollHash() {
  if (window.location.hash.replace(/^#/, '') == currentHash.replace(/^#/, '')) {
    return; // Nothing's changed since last polled. 
  }
  currentHash = window.location.hash;
  updateDirectory(currentHash.replace(/^#/, ''));
}

function changeDir(path) {
  updateDirectory(path);
  currentHash = '#' + decodeURIComponent(path);
  window.location.hash = currentHash;
}

function updateDirectory(path) {
  document.getElementById('content').innerHTML = "<div class=loading>loading...</div>";
  currentFolder = path;
  fetchContent(path);
  document.title = path.replace(/\+/g, ' ');
  document.getElementById('podcast').href =  prefix + path + '&stream=rss';
  document.getElementById('podcast').title = prefix + path.replace(/\+/g, ' ') + ' podcast';
}

function setStreamtype(path, streamtype) {
  fetchContent(path +  '&streamtype=' + streamtype); 
}

function setShuffle(path) {
  var shuffle = document.getElementById('shuffle').checked;
  fetchContent(path + '&shuffle=' + shuffle); 
}

function fetchContent(path) {
  var http = httpGet(prefix + path + "&content");
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      var result = eval("(" + http.responseText + ")");
      if (result.error != '') {
        showBox('<div class=error>' + result.error + '</div>');
      }
      document.getElementById('cover').innerHTML = result.cover;
      document.getElementById('breadcrumb').innerHTML = result.breadcrumb;
      document.getElementById('options').innerHTML = result.options;
      document.getElementById('content').innerHTML = result.content;
    }
  }
  http.send(null);
}

function httpGet(fullPath) {
  var http = false;
  if (navigator.appName.indexOf('Microsoft') != -1) {
    http = new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    http = new XMLHttpRequest();
  }
  http.open("GET", fullPath, true);
  return http;
}

function showCover(picture) {
  showBox('<img alt="" border=0 src="' + picture + '">');  
}

function showHelp() {
  showBox('Flash player hotkeys<br>'
      + '<b>p</b> - play or pause<br>'
      + '<b>b</b> - skip back<br>'
      + '<b>n</b> - skip next<br>'
      + '<b>a</b> - play everything in this folder<br>');  
}

function showBox(content) {
  document.getElementById('box').innerHTML 
    = '<a class=boxbutton href="javascript:hideBox()">×</a><div class=box>' + content + '</div>';  
}

function hideBox() {
  document.getElementById('box').innerHTML = '';
}

function hotkey(e) {
  var keycode;
  if (window.event) { keycode = window.event.keyCode; }
  else if (e) { keycode = e.which; }

  if (keycode == 224 || keycode == 16 || keycode == 17 || keycode == 18) {
    hotkeyModifier = true; // cmd, shift, ctrl, alt
  } else if (hotkeyModifier == true ) {
    hotkeyModifier = false; // modifier has been pressed
  } else {
    if (keycode == 80) jwPlayer().sendEvent('playpause'); // 'p'
    if (keycode == 66) jwPlayer().sendEvent('prev'); // 'b'
    if (keycode == 78) jwPlayer().sendEvent('next'); // 'n'
    if (keycode == 65) { // 'a'
      jwPlay(currentFolder, false);
      showBox("Playing all files in this folder");
      setTimeout(hideBox, 2000); 
    }
  }
}

function jwPlayer() {
  if (navigator.appName.indexOf("Microsoft") != -1) {
    return window[jwPlayerId];
  } else {
    return document[jwPlayerId];
  }
}

function jwPlay(path, shuffle) {
  var http = httpGet(prefix + path + "&verify");
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      var result = eval("(" + http.responseText + ")");
      if (result.error) {
        showBox('<div class=error>' + result.error + '</div>');
      } else {
        var shuffleText = "";
        if (shuffle) { shuffleText = "&shuffle=true"; }
        var theFile = "{file:encodeURI('" + prefix + path + shuffleText + "&stream=flash')}";
        jwPlayer().loadFile(eval("(" + theFile + ")")); 
      }
    }
  }
  http.send(null);
}

function jwObject() {
  var so = new SWFObject('mediaplayer.swf', jwPlayerId, '400', '150', '8', "#FFFFFF");
  so.addParam('allowscriptaccess', 'always');
  so.addParam('allowfullscreen', 'false');
  so.addVariable('height', '150');
  so.addVariable('width', '400');
  so.addVariable('file', '');
  so.addVariable('displaywidth', '0');
  so.addVariable('showstop', 'true');
  so.addVariable('autostart', 'true');
  so.addVariable('usefullscreen', 'false');
  so.addVariable('shuffle', 'false');
  so.addVariable('enablejs', 'true');
  so.addVariable('type', 'mp3');
  so.addVariable('repeat', 'list');
  so.addVariable('thumbsinplaylist', 'false');
  return so;
}

/**
 * SWFObject v1.5.1: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
if(typeof deconcept=="undefined"){var deconcept={};}if(typeof deconcept.util=="undefined"){deconcept.util={};}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil={};}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params={};this.variables={};this.attributes=[];if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10]||"";},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15]||"";},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=[];var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+(this.getAttribute("style")||"")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+(this.getAttribute("style")||"")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;