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
  - https://raw.github.com/krisk/textualizer/master/textualizer.js
  - /javascript/examples/textualizer.js
css:
  - /css/project.css
  - /css/pygments.css
  - /css/examples/textualizer.css
---

<div id="txtlzr">&nbsp;</div>

<div id="download">
  <a href="https://raw.github.com/krisk/textualizer/master/textualizer.js">textualizer.js <span>(12.67 kb)</span></a>
  <a href="https://raw.github.com/krisk/textualizer/master/textualizer.min.js">textualizer.min.js <span>(4.83 kb)</span></a>
</div>

### Usage

{% highlight javascript %}
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

{% include browser_support.md %}

{% include problems.md %}

- - -