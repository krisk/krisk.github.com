---
layout: project
title: Fiber.js
project: fiber
summary: Fiber.js is a lightweight JavaScript prototypal inheritance model
keywords: JavaScript inheritance, prototypal, extend
disqus_title: fiber
disqus_identifer: 1000002
javascript:
  - https://raw.github.com/krisk/fiber/master/fiber.js
css:
  - /css/project.css
  - /css/pygments.css
---

### Lightweight JavaScript prototypal inheritance

Download:

<ul class="download-list">
  <li><a href="https://raw.github.com/krisk/fiber/master/fiber.js">fiber.js</a> - (3.07 kb) development</li>
  <li><a href="https://raw.github.com/krisk/fiber/master/fiber.min.js">fiber.min.js</a> - (1.03 bytes) production</li>
</ul>

## Inheritance

### Usage

`[[constructor]].extend( function )`

#### Example

{% highlight js %}
// Animal base class
var Animal = Fiber.extend(function() {
    return {
        // The `init` method serves as the constructor.
        init: function() {
            // Private
            function private1(){}
            function private2(){}

            // Privileged
            this.privileged1 = function(){}
            this.privileged2 = function(){}
        },
        // Public
        method1: function(){}
    }
});
{% endhighlight %}

The `init` method acts as the constructor, which is invoked when an instance is created:

{% highlight js %}
var animal = new Animal(); // Create a new Animal instance
{% endhighlight %}

`init` is invoked automatically.

### Inheritance

{% highlight js %}
// Extend the Animal class.
var Dog = Animal.extend(function() {
    return {
        // Override base class `method1`
        method1: function(){
            console.log('dog::method1');
        },
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
{% endhighlight %}

Create an instance of `Dog`:

{% highlight js %}
var husky = new Dog();
husky.scare(); // "Dog::I scare you'"
{% endhighlight %}

#### Accessing parent prototype

Every class definition has access to the parent's prototype via the first argument passed into the function:

{% highlight js %}
// Extend the Animal class.
var Dog = Animal.extend(function( base ) {
    return {
        // Override base class `method1`
        method1: function(){
            // Call the parent method
            base.method1.call(this);
        },
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
{% endhighlight %}

## Mixin

Mixins are a way to add functionality to a Fiber definition.  Basically, they address the problem of "multiple inheritance".  [Read more.](http://www.joezimjs.com/javascript/javascript-mixins-functional-inheritance/)

### Usage

`Fiber.mixin( object, function1, function2, ... )`

{% highlight js %}
var Foo = Fiber.extend(function(base) {
    return {
        method1: function(){}
    }
});

var f = new Foo();
f.method1();

var mix1 = function(base) {
    return  {
        method2: function() {}
    }
}

Fiber.mixin(Foo, mix1);

f.method2();
{% endhighlight %}

## Decorators

With decorators you can dynamically attach additional properties to an instance.  [Read more.](http://en.wikipedia.org/wiki/Decorator_pattern)

### Usage

`Fiber.decorate( instance, decorator_1, ... , decorator_n )`

{% highlight js %}
function CarWithPowerWindows(base) {
    return {
        roll: function() {}
    }
}

Fiber.decorate(myCar, CarWithPowerWindows);
{% endhighlight %}

## Proxy

### Usage

`Fiber.proxy( base, instance )`

{% highlight js %}
// Extend the Animal class;
var Dog = Animal.extend(function(base) {
    return {
        init: function() {
            this.base = Fiber.proxy(base, this);
            this.base.init();
        }
    }
});
{% endhighlight %}

## noConflict

### Usage

`Fiber.noConflict()`

Returns a reference to the Fiber object, and sets the `Fiber` variable to its previous owner.

{% include problems.md %}

- - -