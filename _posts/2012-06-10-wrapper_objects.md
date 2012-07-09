---
layout: post
title: The Wrapper Object
summary: A look at the wrapper object created during type coercion.
disqus_title: wrapper_object
disqus_identifer: 1000102
tags: functions, Strings, Numbers, type coercion, wrapper object
category: javascript
syntax: true
---

### All primitives have no properties. Strings are primitives; therefore, Strings have no properties.

[Inference](http://en.wikipedia.org/wiki/Inference) at its finest.

Remember that a primitive data type is a non-composite building block.  Essentially, it is a value, and as such it has no properties.

Yes.  Even in JavaScript, strings are considered primitive data types - they are **not** objects.  However, consider the following code:

<pre class="brush: js">
var str = 'hello';
console.log(str.toUpperCase()); // --> HELLO
</pre>

It appears that `str` clearly has a `toUpperCase` property.  Was our inference incorrect? Specifically, *if strings are not objects, why do they have properties like `toUpperCase`, `toLowerCase`, etc...?*

Short answer: JavaScript promptly coerces between primitives and objects.

Long answer: **whenever you try to access a property of a string `str`, JavaScript coerces the string value to an object, by `new String(str)`.**  This object is called a **wrapper object**.  It inherits all string methods, and is used to resolve the property reference. Once the property has been resolved, the wrapper object is discarded.

(Note: the same concept applies to numbers and booleans)

This is essentially the reason why the following piece of code yields an `undefined`:

<pre class="brush: js">
var str = 'hello';
str.custom = 1;
console.log(str.custom); // -> undefined
</pre>

Let's look at it in detail:

#### Step 1

<pre class="brush: js">
var str = 'hello';
str.custom = 1;
</pre>

JavaScript creates a wrapper `String` object, sets its `custom` property to `1`, and then discards it.  Basically, it runs something like the following code:

<pre class="brush: js">
var str = 'hello';
var temp = new String(str); // wrapper object
temp.custom = 1;
// end of the line for temp
</pre>

The exact way it deals with it is really implementation specific, and you shouldn't have to think about it.  Either way, if you examine `temp` in Firebug, Chrome Developer Toolbar, or whatever debugging tool you use, you'll see something like the following:

<pre class="brush: js">
String:
  0: "h"
  1: "e"
  2: "l"
  3: "l"
  4: "o"
  length: 5
  custom: 1
</pre>

As you can see, the `custom` property is set onto the `temp` wrapper object.

#### Step 2

<pre class="brush: js">
console.log(str.custom);
</pre>

Once again, JavaScript creates a wrapper `String` object from the original, unmodified string value and then tries to read `custom`. This property, of course, does not exist, and the expression evaluates to `undefined`.  Again, the wrapper object is then discarded.

---

Similarly, given all the info above, we can now see how

<pre class="brush: js">
var str = 'hello';
var upper = str.toUpperCase();
console.log(upper); // --> HELLO
</pre>

basically translates to

<pre class="brush: js">
var upper = (new String(str)).toUpperCase().
</pre>

### Coercion as necessary

JavaScript coerces wrapper objects into the wrapped primitive values as necessary.  The `==` equality will treat a value and its wrapper object as equal, while the `===` strict equality operator will treat them as different entities.

<pre class="brush: js">
var a = 'hello';             // primitive
var b = new String('hello'); // wrapper object

typeof a;  // "string"
typeof b;  // "object"

a == b  // true
a === b // false
</pre>

#### Numbers

Same principle applies to numbers.

<pre class="brush: js">
var x = 1;
var y = new Number(1);

typeof x;  // "number"
typeof y;  // "object"

x == y  // true
x === y // false
</pre>

When it comes to numbers, however, JavaScript gives you more liberty.  For starters, you can create your own "number"-like objects, and let type coercion resolve any numerical operation for you.  For example:

<pre class="brush: js">
var x = {
  num: 2,
  valueOf: function() {
    return this.num * 2;
  }
}

var y = {
  num: 3,
  valueOf: function() {
    return this.num * 2;
  }
}

console.log(x + y); // 10
</pre>

As you can see from the above code, I did not explicitly convert `x` and `y` to numbers, yet I was able to add them.  This is because the addition coerced them into their primitive values.  Basically, behind the scenes, JavaScript did the following:

<pre class="brush: js">
var temp = Number(x) + Number(y);
console.log(temp); // 10
</pre>

Remember that calling the `Number` constructor without the `new` operation basically attempts to convert a value into its primitive representation.  The same goes for `String` and `Boolean` (though `Boolean` is a little problematic - we'll deal with it in a later post perhaps).

Having said that, JavaScript knows what the primitive value of my number-like object is because it looks for and executes the `valueOf` method.  As long as you have this method in your object (and assuming it returns a number), your object can be mathematically operated on (though, you should be warned, the `Number` object of course has more methods than just `valueOf`, such as `toExponential`, `toFixed`, `toLocaleString`, `toPrecision`, and `toString`).

---

### Resources

1. [ECMAScript Language Specification - Strings](http://bclary.com/2004/11/07/#a-4.3.16)
2. [MDN - Strings](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String)

