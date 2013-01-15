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
  - https://raw.github.com/krisk/fuse/master/fuse.js
  - /javascript/examples/fuse.js
css:
  - /css/project.css
  - /css/pygments.css
  - /css/examples/fuse.css
---

### Lighweight fuzzy-search, in JavaScript.

Download:

<ul class="download-list">
  <li><a href="https://raw.github.com/krisk/fuse/master/fuse.js">fuse.js</a> - (9 kb) development</li>
  <li><a href="https://raw.github.com/krisk/fuse/master/fuse.min.js">fuse.min.js</a> - (1.58 kb) production</li>
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

#### Options
<ul id="api">
  <li>
    <code>keys</code>
    <p>List of keys (properties) that will be searched.</p>
  </li>
  <li>
    <code>id</code>
    <p>The string name of the identifier key. If specified, the returned result will be a list of the items' identifiers, otherwise it will be a list of the items.</p>
  </li>
  <li>
    <code>threshold</code>
    <p>A decimal value indicating at which point the match algorithm gives up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.</p>
  </li>
  <li>
    <code>caseSensitive</code>
    <p>A boolean value indicating whether comparisons should be case sensitive.  False by default.</p>
  </li>
</ul>

### Limitations

This isn't meant to work across hundreds of thousands, or millions of records. If you have that many records at once on the client, then you probably have bigger problems to worry about. To give you an idea of performance, searching over 2 keys in 20,000 records takes approximately 1 second. Still, 20k records is an awful lot. Ideally, a client-side fuzzy-search solution is only acceptable if the record-set is small, and the pattern string and keys' short.

The pattern string cannot exceed 32 characters.

### How does it do it?

Currently, it uses a full [Bitap algorithm](http://en.wikipedia.org/wikIi/Bitap_algorithm "Bitap algorithm - wiki"), leveraging a modified version of the [Diff, Match & Patch](http://code.google.com/p/google-diff-match-patch/ "Diff, Match & Patch") tool by Google.

### To do

Currently planning to make it faster, and work for larger sets of data.  Let me know your thoughts, ideas, or anything else.

{% include browser_support.md %}

{% include problems.md %}

- - -
