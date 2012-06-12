---
layout: post
title: Named Function Expressions and the IE dilemma
summary: Explaning the problems with named function expressions in IE
disqus_title: nfe
disqus_identifer: 1000101
tags: javascript, functions, expressions
category: javascript
css:
  - /css/pygments.css
---

Every once in a while I come across the following syntax:

{% highlight javascript %}
(function f(){})();         // instead of: (function (){})();

var x = (function y(){})(); // instead of: var x = (function (){})();

var z = function w(){};     // instead of: var z = function (){};
{% endhighlight %}

All of the above are examples of *Named Function Expressions* (NFEs), that is, they are *Function Expressions* with an identifier (`f`, `y`, and `w` respectively).

<!--
<aside>
   <a href="http://bclary.com/2004/11/07/#a-13" title="ECMAScript - Functions">Here's</a> the ECMAScript definition of a Function Expressions
</aside>
-->

NFEs differ from their nameless counterparts in two ways: (1) they provide you visibility on the callstack during debugging, and (2) they give you the ability to recurse via the inner scope:

{% highlight javascript %}
(function f(){
  // Recurse on f
  f();
})();
{% endhighlight %}

Both of these points are quite helpful.  However, there's a few problems with NFEs in certain browsers.  For the purpose of this article, I'll deal with IE <= 8.

### Problems

**1. The function expression identifier leaks into the enclosing scope**

{% highlight javascript %}
(function f(){})();
typeof f; // 'function'

var x = function y(){};
typeof y; // 'function'
{% endhighlight %}

According to the specifications, the identifier of NFEs should **only** be available to its inner scope.  However, in IE <= 8, it's available to the outer scope.  Aside from leaks, it's dangerous and a debugging nightmare as it now pollutes another scope.

**2. NFEs are treated as both function declarations and function expressions**

{% highlight javascript %}
typeof g; // --> 'function'
var f = function g(){};
{% endhighlight %}

In IE, the function declaration is hoisted to the top of the scope, thus giving you access to the declared function well before the assignment.  Aside from completely violating ECMAscript specifications, it's also dangerous as you can potentially invoke functions which were never meant to exist.

**3. NFEs create two distinct objects**

{% highlight javascript %}
var f = function g(){};
f === g; // --> false
{% endhighlight %}

Oddly enough, IE creates two distinct objects in memory.  Augmenting one won't augment the other.  Similarly, setting `f` to `null` or `undefined` will not make the same changes to `g` (or vice-versa); therefore, if memory consuption is an issue, you'd have to explicitly break reference to both functions in order for IE's Garbage Collection to free-up resources.

**4. Function declarations are parsed sequentially, regardless of block execution**

{% highlight javascript %}
var f = function g() {
  return true;
};
if (false) {
  // But.. this should never execute?
  f = function g(){
    return false;
  };
}
// Oh yes it does…
g(); // --> false
{% endhighlight %}

Well, it's obvious why that's bad. If you're going to set the value of a variable, conditionally, to a function; the function declared last will win.  Of course, part of the problem is that we're attempting to use `g` instead of `f`, which is clearly bad programming practice.

#### Resources

1. [ECMAScript Language Specification - Function Definition](http://bclary.com/2004/11/07/#a-13)
2. [MDN - Function](https://developer.mozilla.org/en/JavaScript/Reference/Operators/function)