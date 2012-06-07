---
layout: project
title: AQ
project: aq
summary: Automated QUnit test framework
keywords: QUnit, automation, test, node.js
disqus_title: aq
disqus_identifer: 1000003
css:
  - /css/project.css
  - /css/pygments.css
  - /css/examples/fuse.css
---

## What is it?

*(Note: this is still a work in progress. Nonetheless, the base functioality is there, and works)*

AQ allows you to automate your [QUnit](http://docs.jquery.com/QUnit) tests, leveraging Node.js.

To get started, create a Node.js server.

## Install

Use npm to install AQ, and update the package:

{% highlight javascript %}
npm install aq
npm update
{% endhighlight %}

Then, in your node server file:

{% highlight javascript %}
aq = require('aq'),

app = http.createServer( function( request, response ) {
  // ..whatever you use to serve content
} ).listen( port );

// AQ options
var options = {
    // Display test results on the terminal
    log: true,

    // Name of the folder where the unit test files reside
    testFolder: 'unit-tests',

    // Directory
    dir: path.normalize(__dirname + '/test/unit-tests/'),

    // The test page
    page: '/test/index.html'
  };

// Let AQ listen to the server
aq = aq.listen(app, options);
{% endhighlight %}

## Creating the tests

### The test page

Before you can automate your tests, you first need a page where the tests can run in.

In your test page (perhaps index.html), include AQ and socket.io:

{% highlight html %}
<script src="/socket.io/socket.io.js"></script>
<script src="/aq/aq.js"></script>
{% endhighlight %}

Additionally, there has to be a target container called `aq-container` where AQ can load the proper unit test into.

{% highlight html %}
<div id="aq-container"></div>
{% endhighlight %}

AQ will begin testing only when explicitly told.  You can do this by calling `AQ.start()`, in the test page:

{% highlight javascript %}
window.AQ.start();
{% endhighlight %}

### Struture of a Unit Test file

Each unit test file within the unit test filder should be an HTML file containing a global `run` function.  This function **must** exist so the test harness can execute the tests defined therein properly.

{% highlight html %}
<!-- Maybe some DOM here -->
<script>
    // global function needed by AQ
  function run() {

    // All QUnit tests, modules, etc.. go here.
    test('some test', function() {
      ok(true, 'always true');
    }

  }
</script>
{% endhighlight %}

### How does it all work?

When the server starts, AQ scans the specified directory where the unit tests are contained.  Each file name is then returned to the client side.  The content of each test file is loaded via an AJAX request, and inserted into `aq-container`.  Once iserted, the `run` function is called, and the tests are executed.  Upon completion of the tests, the next unit test file is loaded.

All tests results (and final results) are passed to the server.

## Running the tests

### Run all tests in the unit test folder

{% highlight javascript %}
node server.js
{% endhighlight %}

### Command line options:

#### Specify the browser

By default, the unit tests will run on all the browsers specified in `config.js`.  To specify the browser, you can use the `-b` option

{% highlight javascript %}
node server.js -b chrome
{% endhighlight %}

#### Keep browser open

By default, after all the unit tests have completed running on a browser, that browser session will close.  You can choose to keep the browser open with the `-k` option

{% highlight javascript %}
node server.js -k true
{% endhighlight %}

#### How to specify which unit tests to run

Insert the unit tests to run after `--`

{% highlight javascript %}
node server.js -- test1.html test2.html
{% endhighlight %}

## Events

### On the client

AQ provides a `beforeTestRun` event which is executed after a unit test file is loaded.  If this is event is bound, **no test will run unless an explicit call to `AQ.run` is made.**  For example, in the test page:

{% highlight javascript %}
window.AQ.start();

$(window.AQ).on('beforeTestRun', function() {
  // .. do some setup before the test
  window.AQ.run(); // Run the tests
});
{% endhighlight %}

### On the server

On the server side, once AQ is listening, you can bind onto certain events:

{% highlight javascript %}
aq = aq.listen(app, options);

/**
* Triggers when a new unit test file is executing
*
* @param filename {String} name of the file
*/
aq.on('test-executing', function(filename) {
  console.log(filename);
});

/**
* Triggers when a file containing unit tests has completed
*
* @param data {Object} object literal containing:
*  failed: {Int} - number of tests that failed
*  passed: {Int} - number of tests that passed
*  total: {Int} -  number of tests run
*  details: {Array} - list of all tests that failed and their details
*/
aq.on('test-done', function(data) {
  console.log(data);
});

/**
* Triggers when all the unit test files have been executed
*
* @param data {Object} object literal containing:
*  failed: {Int} - number of tests that failed
*  passed: {Int} - number of tests that passed
*  total: {Int} - number of tests run
*/
aq.on('done', function(data) {
  console.log(data);
});
{% endhighlight %}

{% include problems.md %}

- - -