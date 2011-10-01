rails.handleRemote(link);
return false;
} else if (link.data('method')) {
rails.handleMethod(link);
return false;
}
});
$(rails.formSubmitSelector).live('submit.rails', function(e) {
var form = $(this),
remote = form.data('remote') !== undefined,
blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);
if (!rails.allowAction(form)) return rails.stopEverything(e);
// skip other logic when required values are missing or file upload is present
if (blankRequiredInputs && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
return rails.stopEverything(e);
}
if (remote) {
if (nonBlankFileInputs) {
return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
}
// If browser does not support submit bubbling, then this live-binding will be called before direct
// bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
if (!$.support.submitBubbles && rails.callFormSubmitBindings(form) === false) return rails.stopEverything(e);
rails.handleRemote(form);
return false;
} else {
// slight timeout so that the submit button gets properly serialized
setTimeout(function(){ rails.disableFormElements(form); }, 13);
}
});
$(rails.formInputClickSelector).live('click.rails', function(event) {
var button = $(this);
if (!rails.allowAction(button)) return rails.stopEverything(event);
// register the pressed submit button
var name = button.attr('name'),
data = name ? {name:name, value:button.val()} : null;
button.closest('form').data('ujs:submit-button', data);
});
$(rails.formSubmitSelector).live('ajax:beforeSend.rails', function(event) {
if (this == event.target) rails.disableFormElements($(this));
});
$(rails.formSubmitSelector).live('ajax:complete.rails', function(event) {
if (this == event.target) rails.enableFormElements($(this));
});
})( jQuery );
/*
* jQuery history plugin
*
* The MIT License
*
* Copyright (c) 2006-2009 Taku Sano (Mikage Sawatari)
* Copyright (c) 2010 Takayuki Miwa
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/
(function($) {
var locationWrapper = {
put: function(hash, win) {
(win || window).location.hash = this.encoder(hash);
},
get: function(win) {
var hash = ((win || window).location.hash).replace(/^#/, '');
try {
return $.browser.mozilla ? hash : decodeURIComponent(hash);
}
catch (error) {
return hash;
}
},
encoder: encodeURIComponent
};
var iframeWrapper = {
id: "__jQuery_history",
init: function() {
var html = '<iframe id="'+ this.id +'" style="display:none" src="javascript:false;" />';
$("body").prepend(html);
return this;
},
_document: function() {
return $("#"+ this.id)[0].contentWindow.document;
},
put: function(hash) {
var doc = this._document();
doc.open();
doc.close();
locationWrapper.put(hash, doc);
},
get: function() {
return locationWrapper.get(this._document());
}
};
function initObjects(options) {
options = $.extend({
unescape: false
}, options || {});
locationWrapper.encoder = encoder(options.unescape);
function encoder(unescape_) {
if(unescape_ === true) {
return function(hash){ return hash; };
}
if(typeof unescape_ == "string" &&
(unescape_ = partialDecoder(unescape_.split("")))
|| typeof unescape_ == "function") {
return function(hash) { return unescape_(encodeURIComponent(hash)); };
}
return encodeURIComponent;
}
function partialDecoder(chars) {
var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
return function(enc) { return enc.replace(re, decodeURIComponent); };
}
}
var implementations = {};
implementations.base = {
callback: undefined,
type: undefined,
check: function() {},
load: function(hash) {},
init: function(callback, options) {
initObjects(options);
self.callback = callback;
self._options = options;
self._init();
},
_init: function() {},
_options: {}
};
implementations.timer = {
_appState: undefined,
_init: function() {
var current_hash = locationWrapper.get();
self._appState = current_hash;
self.callback(current_hash);
setInterval(self.check, 100);
},
check: function() {
var current_hash = locationWrapper.get();
if(current_hash != self._appState) {
self._appState = current_hash;
self.callback(current_hash);
}
},
load: function(hash) {
if(hash != self._appState) {
locationWrapper.put(hash);
self._appState = hash;
self.callback(hash);
}
}
};
implementations.iframeTimer = {
_appState: undefined,
_init: function() {
var current_hash = locationWrapper.get();
self._appState = current_hash;
iframeWrapper.init().put(current_hash);
self.callback(current_hash);
setInterval(self.check, 100);
},
check: function() {
var iframe_hash = iframeWrapper.get(),
location_hash = locationWrapper.get();
if (location_hash != iframe_hash) {
if (location_hash == self._appState) { // user used Back or Forward button
self._appState = iframe_hash;
locationWrapper.put(iframe_hash);
self.callback(iframe_hash);
} else { // user loaded new bookmark
self._appState = location_hash;
iframeWrapper.put(location_hash);
self.callback(location_hash);
}
}
},
load: function(hash) {
if(hash != self._appState) {
locationWrapper.put(hash);
iframeWrapper.put(hash);
self._appState = hash;
self.callback(hash);
}
}
};
implementations.hashchangeEvent = {
_init: function() {
self.callback(locationWrapper.get());
$(window).bind('hashchange', self.check);
},
check: function() {
self.callback(locationWrapper.get());
},
load: function(hash) {
locationWrapper.put(hash);
}
};
var self = $.extend({}, implementations.base);
if($.browser.msie && ($.browser.version < 8 || document.documentMode < 8)) {
self.type = 'iframeTimer';
} else if("onhashchange" in window) {
self.type = 'hashchangeEvent';
} else {
self.type = 'timer';
}
$.extend(self, implementations[self.type]);
$.history = self;
})(jQuery);
jQuery(function () {
// Settings
var viewportTop = 80,
scrollTime = 600,
openTime = 600,
completeTime = 1200,
siteName = "Kisko Labs",
scrollElement = "html,body";
// Initialize waypoints
$("#wrapper > section").waypoint({ offset: viewportTop });
// Detect iOS and Android
if((!navigator.userAgent.match(/iPhone/i)) && (!navigator.userAgent.match(/iPod/i)) && (!navigator.userAgent.match(/iPad/i)) && (!navigator.userAgent.match(/Android/i))) {
// Sticky nav for desktop
$("#nav").stickyPanel();
// Do stuff when waypoints are reached
$("body").delegate("#wrapper > section", "waypoint.reached", function (event, direction) {
var $active = $(this);
if (direction === 'up') {
$active = $active.prev();
}
if (!$active.length) { $active.end(); }
$(".section-active").removeClass("section-active");
$active.addClass("section-active");
$(".selected").removeClass("selected");
$("a[href=#"+$active.attr("id")+"]").addClass("selected");
});
}
// Smooth scrolling for internal links
$("a[href^='#']").click(function (event) {
event.preventDefault();
var $this = $(this),
target = this.hash,
$target = $(target);
$(scrollElement).stop().animate({
"scrollTop": $target.offset().top
}, scrollTime, "swing", function () {
window.location.hash = target;
});
});
$.history.init(function(hash){
if(hash == "") {
$(scrollElement).stop().animate({
"scrollTop": 0
}, scrollTime, "swing", function () {
window.location.hash = "home";
});
} else {
var hashTarget = $("#" + hash),
$target = $(hashTarget);
$(scrollElement).stop().animate({
"scrollTop": hashTarget.offset().top
}, scrollTime, "swing", function () {
window.location.hash = hash;
});
}
},
{ unescape: ",/" }
);
// Bigger links
$("#services .col4").click(function (event) {
event.preventDefault();
window.location = $(this).find("a").attr("href");
});
$("#blog").delegate("article", "click", function (event) {
event.preventDefault();
window.location = $(this).find("a").attr("href");
});
// Hover class
$("#services .col4").mouseover(function () {
$(this).addClass("over");
});
$("#services .col4").mouseout(function () {
$(this).removeClass("over");
});
$("#blog").delegate("article", "mouseover", function () {
$(this).addClass("over");
});
$("#blog").delegate("article", "mouseout", function () {
$(this).removeClass("over");
});
// Fit Text
$("#home h1").fitText(0.9);
// Load images
function loadImages() {
if ($(this).parent("#project_sb")) {
if ($(".project_sb .slides img").length === 0) {
$(".project_sb .slides").append("<img src='/images/work/splendidbacon1.jpg' /><img src='/images/work/splendidbacon2.jpg' /><img src='/images/work/splendidbacon3.jpg' /><img src='/images/work/splendidbacon4.jpg' />");
}
}
if ($(this).parent("#project_bs")) {
if ($(".project_bs .slides img").length === 0) {
$(".project_bs .slides").append("<img src='/images/work/bookspottings1.jpg' />");
}
}
if ($(this).parent("#project_vb")) {
if ($(".project_vb .slides img").length === 0) {
$(".project_vb .slides").append("<img src='/images/work/venturebonsai1.jpg' /><img src='/images/work/venturebonsai2.jpg' /><img src='/images/work/venturebonsai3.jpg' /><img src='/images/work/venturebonsai4.jpg' />");
}
}
if ($(this).parent("#project_mt")) {
if ($(".project_mt .slides img").length === 0) {
$(".project_mt .slides").append("<img src='/images/work/mealtracker1.jpg' /><img src='/images/work/mealtracker2.jpg' /><img src='/images/work/mealtracker3.jpg' /><img src='/images/work/mealtracker4.jpg' />");
}
}
}
// Open a project
$("#work .block").click(function (event) {
event.preventDefault();
var getProject = $(this).parent().attr("id");
$(".openproject."+getProject+" .slides").cycle("destroy");
// If there isn't a open project, open one
if(!($(".openproject").hasClass("active"))) {
$(".openproject."+getProject).fadeIn(openTime).animate({height: "800px"}, openTime).addClass("active");
loadImages();
// Slideshow
$(".openproject."+getProject+" .slides").cycle({
fx:"fade",
timeout:0,
pager:".openproject."+getProject+" .pagination",
slideExpr:"img"
});
// Refresh waypoints after animate completes
setTimeout(function () {
$("#wrapper > section").waypoint({ offset: viewportTop });
}, completeTime);
document.title = siteName+" - "+$(".openproject."+getProject+" h3").text();
// Else close the open one first and then open another
} else {
$(".openproject.active").fadeOut(openTime).removeClass("active").animate({height: "0"}, openTime);
$(".openproject."+getProject).fadeIn(openTime).addClass("active").animate({height: "800px"}, openTime);
loadImages();
// Slideshow
$(".openproject."+getProject+" .slides").cycle({
fx:"fade",
timeout:0,
pager:".openproject."+getProject+" .pagination",
slideExpr:"img"
});
document.title = siteName+" - "+$(".openproject."+getProject+" h3").text();
}
});
// Close project
$("#work .close").click(function (event) {
event.preventDefault();
$(".openproject.active").fadeOut(openTime).removeClass("active").animate({height: "0"}, openTime);
// Refresh waypoints after document height change
setTimeout(function () {
$("#wrapper > section").waypoint({ offset: viewportTop });
}, completeTime);
document.title = siteName;
});
// Blog Feeds
// http://blog.kiskolabs.com/rss
$.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=44e34d50aa0b9697c7c9f04084b688f2&_render=json&_callback=?",
function (data) {
$.each(data.value.items, function (i, item) {
if (i < 3) {
var article = $("<article />"),
link = $("<a />").html(item.title).attr("href", item.link),
h4 = $("<h4 />").html(link),
p = $("<p />"),
tmp = $("<div />").html(item.description);
p.html($(tmp).find("p").first());
p.find("a").each( function (i, elem) {
text = $(elem).html();
$(elem).replaceWith(text);
});
article.html(h4).append(p);
$("#dev_blog .readmore").before(article);
}
});
}
);
// http://feeds.feedburner.com/lahtolaukaus?format=xml
$.getJSON("http://pipes.yahoo.com/pipes/pipe.run?_id=95ac83e0d236c55aec1b33c7d101d65f&_render=json&_callback=?",
function (data) {
$.each(data.value.items, function (i, item) {
if (i < 3) {
var article = $("<article />"),
link = $("<a />").html(item.title).attr("href", item.link),
h4 = $("<h4 />").html(link),
p = $("<p />"),
tmp = $("<div />").html(item.content.content);
p.html($(tmp).find("p").first());
p.find("a").each( function (i, elem) {
text = $(elem).html();
$(elem).replaceWith(text);
});
article.html(h4).append(p);
$("#lahtolaukaus .readmore").before(article);
}
});
}
);
// Ajax success
$("#contact_form").bind("ajax:success", function () {
$("section#contact").addClass("formsent");
$("#confirmation").text("Thank you for contacting us! We'll respond in few days if needed.");
});
// Ajax before send
$("#contact_form").bind("ajax:beforeSend", function () {
$("#contact_form").find(".error").removeClass("error");
$("#contact_form").find("ul.messages").remove();
});
// Ajax error
$("#contact_form").bind("ajax:error", function (event, data) {
if (data.status == 422) {
$.each(JSON.parse(data.responseText), function (field, errors) {
var $element = $("#message_" + field).parent();
$element.addClass("error");
$element.append('<ul class="messages"><li>' + errors[0] + '</li></ul>');
});
}
});
});
