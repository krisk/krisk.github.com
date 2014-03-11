---
layout: post
title: Inheriting from instances
summary: Answering a question on StackOverflow - "how can I extend a class defined behind a closure in JavaScript?"
disqus_title: closure_inheritance
disqus_identifer: 1000105
tags: functions, closures, inheritance
category: javascript
css:
  - /css/pygments.css
---

*Recently, I find myself perusing [StackOverflow's JavaScript questions](http://stackoverflow.com/questions/tagged/javascript?sort=newest), often finding some of particular interest. Ergo, perhaps I'll include a few posts, beginning with this, about specific SO Q&A.*

---

In reference to this, [question](http://stackoverflow.com/q/22254590/1487730), suppose you have the following structure:

``` js
var ShapeFactory = (function() {
  var Shape = function() {};
  Shape.prototype = {
    area: function() {}
  };
  return {
    createShape: function() {
      return new Shape();
    }
  }
})();
```

<aside>
  The above is an interesting example of a revealing module pattern merged with the factory pattern.  It can be [useful](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).
</aside>

### Is there a way to define `Rectangle` wrapped in `RectangleFactory`, that inherits from `Shape` wrapped in `ShapeFactory`?

Specifically, the question is asking how to achieve this:


``` js
var RectangleFactory = (function() {
  var Rectangle = function() {};

  // Inherit from Shape...
  Rectangle.prototype = ...

  return {
    createRectangle: function() {
      return new Rectangle();
    }
  }
})();
```

### Solution

``` js
var ShapeFactory = (function() {
  ...
  // 1) Need to re assign Shape to prototype.constructor
  Shape.prototype.constructor = Shape;
  ...
})();

var RectangleFactory = (function() {
  // 2) Bootstrapping:
  // Capture the instance, as we'll need it to set up the prototype
  var baseInstance = new FactoryClassA.createThingA();
  // Capture the constructor
  var baseConstructor = baseInstance.constructor;
  // Keep a reference to the base prototype
  var baseProto = baseConstructor.prototype;

  // Or, in ES5+:
  // var baseProto = Object.getPrototypeOf(baseInstance);
  // var baseConstructor = baseProto.constructor;

  var Rectangle = function() {
    // Call base constructor
    baseProto.constructor.apply(this, arguments);
  };
  // 3) Set up the inheritance chain
  Rectangle.prototype = baseInstance;
  Rectangle.prototype.constructor = Rectangle;

  Rectangle.prototype.area = function() {
    // Call base method
    baseProto.area.call(this);
  };

  return {
    createRectangle: function() {
      return new Rectangle();
    }
  }
})();

var square = RectangleFactory.createRectangle();

square instanceof Rectangle // true
square instanceof Shape // true.
```

<aside>
  For a quick refresh on the ES5 syntax, read [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
</aside>

### So what just happened?

**1) Don't remove the constructor (or at least set it to what you expect it to be)**

In `ShapeFactory`, this line is necessary:

``` js
Shape.prototype.constructor = Shape;
```

Note that every prototype in JS is automatically created with a reference to its constructor. For example, when you do:

``` js
function T(){}
```

`T.prototype` already has a property called `constructor` which points back to `T`.

However, in the initial implementation of `ShapeFactory`, the entire prototype was reset, by doing `Shape.prototype = { ... }`. Therefore, the reference to its constructor was lost. In 99% of cases it is ok, and won't have any negative side effects (which is probably why most developers tend to forget it). However, in the case of inheritance, it is most often necessary.

**2) Bootstrapping**

``` js
var baseInstance = new FactoryClassA.createShape();
var baseConstructor = baseInstance.constructor;
var baseProto = baseConstructor.prototype;
```

Observe the last two lines, as they are pivotal to achieving inheritance in this design pattern.

First, since `Shape`'s constructor is accessible via the prototype, which we achieved by doing `Shape.prototype.constructor = Shape`, then it means that given an instance of `Shape`, we can directly retrieve its constructor (with `baseInstance.constructor`). Since the constructor is the function itself, and since every function has a reference to its prototype, we can keep a reference of `Shape.prototype` with `baseConstructor.prototype`.

**3) Set up the inheritance chain**

``` js
Rectangle.prototype = baseInstance;
Rectangle.prototype.constructor = Rectangle;
```

The last line above is quite important, as it tells the prototype what its constructor is, otherwise it would still point to `Shape`.

### Alternatives

You can probably see how the above can get quite tedious, a little grotesque, and repetitive. Ergo, you might want to consider an inheritance library like [Fiber.js](https://github.com/linkedin/Fiber) which follows a similar pattern, without the hassle.
