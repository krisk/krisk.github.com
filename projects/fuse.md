---
layout: project
title: Fuse.js
project: fuse
summary: Lightweight fuzzy-search, in JavaScript
keywords: Fuzzy-search, string algorithm, list, search
disqus_title: fuse
disqus_identifer: 1000001
javascript:
  - http://code.jquery.com/jquery.min.js
  - /javascript/projects/fuse.min.js
  - /javascript/examples/fuse.js
css:
  - /css/project.css
  - /css/pygments.css
  - /css/examples/fuse.css
---

### Lightweight fuzzy-search, in JavaScript.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/kirorisk)

<a href="https://twitter.com/fusejs" class="twitter-follow-button" data-show-count="false" data-size="large">Follow @fusejs</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Download:

<ul class="download-list">
  <li><a href="https://raw.github.com/krisk/fuse/master/src/fuse.js">fuse.js</a> - (9 kb) development</li>
  <li><a href="https://raw.github.com/krisk/fuse/master/src/fuse.min.js">fuse.min.js</a> - (1.58 kb) production</li>
</ul>

## Why?

If you need a lightweight, fast way to search through a list of items, and allow mispellings, then Fuse.js is for you.  Forget all server-side logic.  This is done all in JavaScript.  Check out the demo, and look at the examples below.

### Try it out!

Given [this list of books](http://www.kiro.me/data/books.json), try searching by misspelling the title or author's name:

<input id="inputSearch" placeholder="Search..." />
<input id="author" type="checkbox" class="fuse-checkbox" />
<label for="author" >Author</label>

<input id="title" type="checkbox" checked="true" class="fuse-checkbox" />
<label for="title">Title</label>

<input id="case" type="checkbox" class="fuse-checkbox" />
<label for="case">Case sensitive</label>

The results are sorted by score. That is, the ones that match the strongest are first.

<ul id="results">
</ul>

## Usage

Suppose you have the following data structure:

{% highlight js %}
// List of books
var books = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
},{
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
},{
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];
{% endhighlight %}

### Example 1

Search and return a result list of identifiers

{% highlight js %}
var options = {
  keys: ['author', 'title'],   // keys to search in
  id: 'id'                     // return a list of identifiers only
}
var f = new Fuse(books, options);
var result = f.search('brwn'); // Fuzzy-search for pattern 'brwn'

// Output:
==> [2, 3]; // The list of identifiers
{% endhighlight %}

### Example 2

Search and return a result list of records

{% highlight js %}
var options = {
  keys: ['author', 'title']
}
var f = new Fuse(books, options);
var result = f.search('brwn');

// Output:
==>
[{
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
},{
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}]; // List of the items
{% endhighlight %}

### Example 3

Search over a flat array, and return the indices

{% highlight js %}
var books = ["Old Man's War", "The Lock Artist", "HTML5", "Right Ho Jeeves", "The Code of the Wooster", "Thank You Jeeves", "The DaVinci Code", "Angels & Demons", "The Silmarillion", "Syrup", "The Lost Symbol", "The Book of Lies", "Lamb", "Fool", "Incompetence", "Fat", "Colony", "Backwards, Red Dwarf", "The Grand Design", "The Book of Samson", "The Preservationist", "Fallen", "Monster 1959"];

var f = new Fuse(books);
var result = f.search('Falen');

// Output:
==> [21, 15, 16]; // List of the indices
{% endhighlight %}

### Example 4

Fuse also allows for deep key search:

{% highlight js %}
// List of books
var books = [{
  id: 1,
  title: 'The Great Gatsby',
  author: {
    firstName: 'F. Scott',
    lastName: 'Fitzgerald'
  }
},{
  title: 'The DaVinci Code',
  author: {
    firstName: 'Dan',
    lastName: 'Brown'
  }
}];

var options = {
  keys: ['author.firstName']
}
var f = new Fuse(books, options);
var result = f.search('brwn');

// Output:
==>
[{
  title: 'The DaVinci Code',
  author: {
    firstName: 'Dan',
    lastName: 'Brown'
  }
}];
{% endhighlight %}

#### Options

[See here](https://github.com/krisk/Fuse#options "Fuse options") for all available options.

### Limitations

This isn't meant to work across hundreds of thousands, or millions of records. If you have that many records at once on the client, then you probably have bigger problems to worry about. To give you an idea of performance, searching over 2 keys in 20,000 records takes approximately 1 second. Still, 20k records is an awful lot. Ideally, a client-side fuzzy-search solution is only acceptable if the record-set is small, and the pattern string and keys' short.

Note: the pattern string cannot exceed 32 characters.

### How does it do it?

Currently, it uses a full [Bitap algorithm](http://en.wikipedia.org/wiki/Bitap_algorithm "Bitap algorithm - wiki"), leveraging a modified version of the [Diff, Match & Patch](http://code.google.com/p/google-diff-match-patch/ "Diff, Match & Patch") tool by Google.

### Want to see more?

Check out [this test page](http://kiro.me/exp/fuse.html).

### To do

Currently planning to make it faster, and work for larger sets of data.  Let me know your thoughts, ideas, or anything else.

{% include browser_support.md %}

{% include problems.md %}

- - -
