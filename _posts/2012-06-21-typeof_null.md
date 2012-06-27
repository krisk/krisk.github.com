---
layout: post
title: Null and typeof
summary: Demystifying typeof null, once and for all.
disqus_title: typeof_null
disqus_identifer: 1000103
tags: javascript, functions, Strings, Numbers, typeof, IEEE
category: javascript
css:
  - /css/pygments.css
---

The <code>typeof</code> operator can be a little counter-intuitive.  However, regardless of the confusion it may cause, the way it works is extremely straightforward: *return the type string of a given reference according to the table specified in [ECMA-262](http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262%205th%20edition%20December%202009.pdf)*:

<img class="es-table" src="/images/posts/typeof_table.png" />

## Implementation

The actual implementation varies depending on which engine you are running.  The V8 (behind Chrome and Node.js) implementation of the <code>typeof</code> operator (written in C++), is as follows (I've added a few comments for clarification):

{% highlight javascript %}
// Returns the type string of a value; see ECMA-262, 11.4.3
RUNTIME_FUNCTION(MaybeObject*, Runtime_Typeof) {
  NoHandleAllocation ha;

  Object* obj = args[0];
  if (obj->IsNumber()) return isolate->heap()->number_symbol();
  HeapObject* heap_obj = HeapObject::cast(obj);

  // typeof an undetectable object is 'undefined'
  if (heap_obj->map()->is_undetectable()) {
    return isolate->heap()->undefined_symbol();
  }

  InstanceType instance_type = heap_obj->map()->instance_type();
  if (instance_type < FIRST_NONSTRING_TYPE) {
    // return "string"
    return isolate->heap()->string_symbol();
  }

  switch (instance_type) {
    // oddbal types: true, false, null, undefined
    case ODDBALL_TYPE:
      // true, false
      if (heap_obj->IsTrue() || heap_obj->IsFalse()) {
        // return "boolean"
        return isolate->heap()->boolean_symbol();
      }
      // null
      if (heap_obj->IsNull()) {
        return FLAG_harmony_typeof
            // return "null"
            ? isolate->heap()->null_symbol()
            // return "object"
            : isolate->heap()->object_symbol();
      }
      ASSERT(heap_obj->IsUndefined());
      // return "undefined"
      return isolate->heap()->undefined_symbol();
    case JS_FUNCTION_TYPE:
    case JS_FUNCTION_PROXY_TYPE:
      // return "function"
      return isolate->heap()->function_symbol();
    default:
      // For any kind of object not handled above, the spec rule for
      // host objects gives that it is okay to return "object"
      return isolate->heap()->object_symbol();
  }
}
{% endhighlight %}

<aside>
  You can find the full file <a href="http://code.google.com/searchframe#W9JxUuHYyMg/trunk/src/runtime.cc&q=typeof%20null%20package:v8%5C.googlecode%5C.com" target="_blank">here</a>
</aside>

## Why does <code>typeof null </code> return <code>"object"</code>?

{% highlight javascript %}
// What's happening here?
typeof null === "object"; // true
{% endhighlight %}

The answer might disappoint some, but the truth is simply because the table above says to do so.

The reasoning behind this is that <code>null</code>, in contrast with <code>undefined</code>, was (and still is) often used where objects appear.  In other words, <code>null</code> is often used to signify an empty reference to an object. When [Brendan Eich](http://en.wikipedia.org/wiki/Brendan_Eich) created JavaScript, he followed the same paradigm, and it made sense (arguably) to return <code>"object"</code>.  In fact, the ECMAScript specification defines the <code>null</code> as the *primitive value that represents the intentional absence of any object value* (ECMA-262, 11.4.11).

There have been discussions in the ECMAScript working group (between Brendan Eich, Douglas Crockford, and a few other other individuals) proposing the following change:

{% highlight javascript %}
typeof null === "null"; // true
{% endhighlight %}

<aside>
  For the interested, you can read the <a href="http://wiki.ecmascript.org/doku.php?id=discussion:typeof" target="_blank">discussion</a> and <a href="http://wiki.ecmascript.org/doku.php?id=proposals:typeof" target="_blank">proposal</a>
</aside>

However, as Douglas Crockford [pointed out](http://wiki.ecmascript.org/doku.php?id=proposals:typeof), *"I think it is too late to fix <code>typeof</code>. The change proposed for <code>typeof null</code> will break existing code."*  By "existing code" he means many incorrect implementations of type checks on the web, such as:

{% highlight javascript %}
// This is extremely bad
function isNull(a) {
  return typeof a == 'object' && !a;
}
{% endhighlight %}

Because of this, it was decided to leave <code>typeof</code> alone.

## Back to V8

If you actually read each line of the V8 <code>typeof</code> operator implementation in <code>RUNTIME_FUNCTION</code> above, you might have noticed that <code>FLAG_harmony_typeof</code> check:

{% highlight javascript %}
// null
if (heap_obj->IsNull()) {
  return FLAG_harmony_typeof
      // return "null"
      ? isolate->heap()->null_symbol()
      // return "object"
      : isolate->heap()->object_symbol();
}
{% endhighlight %}

Assuming you have the V8 Canary build on your machine, you can run it with the <code>--harmony-typeof</code> flag, which would essentially set the <code>FLAG_harmony_typeof</code> to <code>true</code>.  Now, any <code>typeof null</code> check is going to return <code>"null"</code>.