---
layout: post
title: NaN and typeof
summary: An in-depth look at the NaN property, and why it is considered a number type.
disqus_title: typeof_null
disqus_identifer: 1000104
tags: Numbers, NaN, Infinity, typeof, IEEE
category: javascript
syntax: true
---

*After writing the [previous post]({{page.previous.url}}) in which I attempted to explain <code>typeof null</code>, a few people had [questioned](http://news.ycombinator.com/item?id=4144679) <code>NaN</code>'s behavior with the same operator (i.e., <code>typeof NaN</code>).  Therefore, I've decided to write a similar post about this familiar, but often misunderstood, property.*

---

First, <code>NaN</code> is not a keyword (unlike <code>true</code>, <code>false</code>, <code>null</code>, etc..), **it is a property of the global object**.  The value of <code>NaN</code> is the same as the value of <code>Number.NaN</code>:

{% highlight js linenos=table %}
NaN; // NaN
Number.NaN; // NaN
{% endhighlight %}

<pre class="brush: js">
NaN; // NaN
Number.NaN; // NaN
</pre>

There are several ways in which <code>NaN</code> can happen:

1. Division of zero by zero
2. Dividing an infinity by an infinity
3. Multiplication of an infinity by a zero
4. Any operation in which <code>NaN</code> is an operand
5. Converting a non-numeric string or <code>undefined</code> into a number

<aside>
  If you're interested in why <code>0/0 = NaN</code>, read this <a href="http://www.newton.dep.anl.gov/askasci/math99/math99259.htm" target="_blank">discussion</a>.  Even mathematicians are undecided.
</aside>

## Why does <code>typeof NaN</code> return <code>"number"</code>?

<pre class="brush: js">
typeof NaN; // "number"
</pre>

The ECMAScript standard states that Numbers should be IEEE-754 floating point data. This includes <code>Infinity</code>, <code>-Infinity</code>, and also <code>NaN</code>.

By definition, <code>NaN</code> is the return value from operations which have an **undefined numerical result**.  Hence why, in JavaScript, aside from being part of the global object, it is also part of the Number object: <code>Number.NaN</code>. **It is still a numeric data type**, but it is undefined as a [real number](http://en.wikipedia.org/wiki/Real_number).

<aside>
  <code>NaN</code> also represents any number outside of the ECMAScript <a href="http://bclary.com/2004/11/07/#a-8.5" target="_blank">domain of definition.</a>
</aside>

### Computer arithmetic is limited

Consider the following operation:

<pre class="brush: js">
(3.2317006071311 * 10e616) / (3.2317006071311 * 10e616); // NaN
</pre>

As <a href="http://en.wikipedia.org/wiki/Real_number" target="_blank">Wikipedia</a> states, *computer arithmetic cannot directly operate on real numbers, but only on a finite subset of rational numbers, limited by the number of bits used to store them*.  In ordinary arithmetic, 3.2317006071311 * 10<sup>616</sup> is a real finite number, but, by ECMAScript standards, it is simply too large (i.e, considerably greater than <code>Number.MAX_VALUE</code>), and is therefore represented as <code>Infinity</code>.  Attempting to divide an infinity by an infinity yields <code>NaN</code>.  Of course, in ordinary arithmetic, since both operands are finite, the operation clearly equals 1.

In this case, the <code>NaN</code> is in place of a real number that it could not compute (i.e, 1) due to the size of the operands.  It would seem counter-intuitive if <code>typeof NaN</code> were to return something other than <code>"number"</code>.  After all, in this example, <code>NaN</code> simply represents a value which could not be determined by computer arithmetic.

<aside>
  The value 3.2317006071311 * 10<sup>616</sup> was computed by taking <code>Number.MAX_VALUE</code> and squaring it manually, in ordinary arithmetic.
</aside>

## <code>NaN</code> is unordered

According to the IEEE 754 floating-point standard, comparison with <code>NaN</code> always returns an unordered result.  That is, <code>NaN</code> is not equal to, greater than, or less than anything, **including itself**:

<pre class="brush: js">
NaN &lt; 1;    // false
NaN &gt; 1;    // false
NaN == NaN; // false
// But we can still check for NaN:
isNaN(NaN); // true
</pre>

This is why you cannot determine whether a given value is <code>NaN</code> by comparing it to <code>NaN</code>, and instead you must use the <code>isNaN()</code> function.

<aside>
  The <em>division of zero by a zero</em> <a href="http://www.newton.dep.anl.gov/askasci/math99/math99259.htm" target="_blank">discussion</a> illustrates why <code>NaN != NaN</code>: it is false to say that "every number <em>x</em> is equal to every number <em>x</em>".  Since the value cannot be determined, it follows that the comparison cannot be determined, and thus the sentence is instrinsically and mathematically false.
</aside>

It is not surprising, then, that the native implementation of the function <code>isNaN()</code> could be simply replaced with:

<pre class="brush: js">
// Native implementation
function isNaN(x) {
  // Coerce into number
  x = Number(x);
  // if x is NaN, NaN != NaN is true, otherwise it's false
  return x != x;
}
</pre>

<aside>
  The native implementation of <code>isNaN()</code> returns <code>true</code> even if the value is <code>undefined</code>, or if the value cannot be coerced into a primitive number data type.
</aside>

Of course, I wouldn't recommend replacing the native implementation.  However, there are some libraries out there which introduce their own. For example, <a href="http://underscorejs.org/" target="blank">Underscore</a>'s implementation is as follows:

<pre class="brush: js">
_.isNaN = function(obj) {
  // `NaN` is the only value for which `===` is not reflexive.
  return obj !== obj;
};
</pre>

But, its behavior is not same as the native <code>isNaN()</code> function:

<pre class="brush: js">
var x; 	          // undefined
isNaN(x);         // true
isNaN(undefined); // true
isNaN("a");       // true
</pre>

compared to Underscore's:

<pre class="brush: js">
var x; 	            // undefined
_.isNaN(x);         // false
_.isNaN(undefined); // false
_.isNaN("a");       // false
</pre>

I can't be certain, but I suppose Underscore included this implementation because you might be interested in checking that the value is indeed <code>NaN</code>, since the **only** value that satisfies an unequality check against itself is <code>NaN</code>.

### Booleans are NOT <code>NaN</code>s

Consider the following code:

<pre class="brush: js">
isNaN(true);  // false
isNaN(false); // false
</pre>

This is because booleans are considered and implemented as numerical values with a single binary digit (i.e., bit), thus they are coerced into their respective bit representations:

<pre class="brush: js">
Number(true);  // 1
Number(false); // 0
</pre>

---

### Resources

1. [ECMAScript Language Specification - NaN](http://bclary.com/2004/11/07/#a-4.3.23)
2. [MDN - NaN](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/NaN)
3. [Wikipedia - NaN](http://en.wikipedia.org/wiki/NaN)
4. [Wikipedia - Indeterminate Forms](http://en.wikipedia.org/wiki/Indeterminate_form)
5. [Wikipedia - Real number](http://en.wikipedia.org/wiki/Real_number)
6. [Wikipedia - IEEE floating point](http://en.wikipedia.org/wiki/IEEE_754-2008)
7. [IEEE Standard 754 Floating Point Numbers](http://steve.hollasch.net/cgindex/coding/ieeefloat.html)