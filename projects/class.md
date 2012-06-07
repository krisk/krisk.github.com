---
layout: project
title: Class.js
project: class
summary: Class.js is a lightweight JavaScript prototypal inheritance model
keywords: JavaScript inheritance, prototypal, extend
disqus_title: class
disqus_identifer: 1000002
javascript:
  - https://raw.github.com/krisk/class/master/class.js
css:
  - /css/project.css
  - /css/pygments.css
  - /css/examples/fuse.css
---

### Lightweight JavaScript prototypal inheritance

Download:

<ul class="download-list">
  <li><a href="https://raw.github.com/krisk/class/master/class.js">class.js</a> - (2.41 kb) development</li>
  <li><a href="https://raw.github.com/krisk/class/master/class.min.js">class.min.js</a> - (498 bytes) production</li>
</ul>

*(Note: I realize "Class" isn't a very original name, so if you have any suggestions, let me know! Yes indeed, credit will be given)*

This inheritiance model, I think, is best explained with code.

Let's define an `Animal` class:

{% highlight javascript %}
// Animal base class
var Animal = Class.extend(function(base) {
    return {
        // The `init` method serves as the constructor.
        init: function() {

            // Insert private functions here
            function private1(){}
            function private2(){}

            // Insert priviledged functions here
            this.privileged1 = function(){}
            this.privileged2 = function(){}
        },
        // Insert public functions here
        public1: function(){}
    }
});
{% endhighlight %}

`Class.extend` expects a function that returns an object literal. That object literal is used to construct the prototype. The `init` method in the object literal acts as the constructor, which is invoked when an instance is created. That is:

{% highlight javascript %}
var animal = new Animal(); // Create a new Animal instance
{% endhighlight %}

`init` is invoked automatically.

### Inheriting

Now, suppose I want to create a `Dog` class. Since a dog is essentially an animal, then it should inherit from `Animal`. Note that every class definition has access to the parent's prototype via the `base` argument (or whatever you named it).

{% highlight javascript %}
// Extend the Animal class.
var Dog = Animal.extend(function(base) {
    return {
        init: function(prop) {
            // Call the base init.
            base.init.call(this);
        },
        // Override base class `public1`
        public1: function(){},
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
{% endhighlight %}

Create an instance of `Dog`:

{% highlight javascript %}
var husky = new Dog();
husky.scare(); // "Dog::I scare you'"
{% endhighlight %}

### Decorating

The ability to decorate instances is quite powerful. As an example:

{% highlight javascript %}
var Domesticated = function(obj, base) {
    // Override the instance' scare method
    obj.scare = function(){
        console.log('Domesticated::sorry, we dont scare');
    }

    // Add a method
    obj.kneel = function(){}

    // Bind some custom events
    $(obj).on('barking', function() {});
};
{% endhighlight %}

From the above, you can see that a decorator is merely a function that expects an instance and the base prototype, both of which are provided by the Class library. Within this function, you can override, augment, bind... - that is, decorate, the instance as you please.

So, back to our husky example. To decorate the instance, use `decorate`:

{% highlight javascript %}
husky.decorate(Domesticated);
husky.scare(); // "Domesticated::sorry, we don't scare"
{% endhighlight %}

That's it.  You're done.

{% include problems.md %}

- - -