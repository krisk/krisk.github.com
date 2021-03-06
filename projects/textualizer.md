---
layout: project
title: Textualizer
project: textualizer
summary: Textualizer is a jQuery plugin that lets you transition through blurbs of text
keywords: jQuery, jQuery plugin, text animation, text transition
disqus_title: textualizer
disqus_identifer: 1000000
javascript:
  - http://code.jquery.com/jquery.min.js
  - /javascript/projects/textualizer.min.js
  - /javascript/examples/textualizer.js
css:
  - /css/project.css
  - /css/pygments.css
  - /css/examples/textualizer.css
---

<div id="txtlzr">&nbsp;</div>

Download:

<ul class="download-list">
  <li><a href="https://raw.github.com/krisk/textualizer/master/textualizer.js">textualizer.js</a> - (12.67 kb) development</li>
  <li><a href="https://raw.github.com/krisk/textualizer/master/textualizer.min.js">textualizer.min.js</a> - (4.83 kb) production</li>
</ul>

### Usage

{% highlight js %}
var list = ['first blurb', 'second blurb', 'third blurb'];  // list of blurbs

var txt = $('#txtlzr');  // The container in which to render the list

var options = {
  duration: 1000,          // Time (ms) each blurb will remain on screen
  rearrangeDuration: 1000, // Time (ms) a character takes to reach its position
  effect: 'random',        // Animation effect the characters use to appear
  centered: true           // Centers the text relative to its container
}

txt.textualizer(list, options); // textualize it!
txt.textualizer('start'); // start
{% endhighlight %}

### Animation effects

Textualizer currently has the following effects: `fadeIn`, `slideLeft`, `slideTop`, and `random`.  You can choose which effect to use by setting the `effect` option.

### API

<ul id="api">
  <li>
    <code>.textualizer('pause')</code>
    <p>Pauses all animation at the next blurb. That is, once all characters have finished moving to their position, the animation will pause.</p>
  </li>
  <li>
    <code>.textualizer('stop')</code>
    <p>Stops the animation, and removes the blurbs.</p>
  </li>
  <li>
    <code>.textualizer('destroy')</code>
    <p>Destroy and disposes of the textualizer instance.</p>
  </li>
</ul>

### Events

<ul id="api">
  <li>
    <code>.on('textualizer.changed')</code>
    <p>Triggers when a blurb has completed animating, before switching to the next blurb in the list.</p>
    <br/>
{% highlight js %}
txt.on('textualizer.changed', function(event, args) {
  // check if it's the last index in the array
  if (args.index === LAST_INDEX) {
    txt.textualizer('pause');
  }
});

txt.textualizer('start');
{% endhighlight %}
  </li>
</ul>

{% include browser_support.md %}

{% include problems.md %}

- - -