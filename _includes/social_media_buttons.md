<div id="share">
  <ul id="share-button-list">
    <!--Facebook -->
    <li>
      <div class="fb-like" data-send="false" data-layout="button_count" data-show-faces="false"></div>
    </li>
    <!--LinkedIn -->
    <li>
      <script type="IN/Share" data-counter="right"></script>
    </li>
    <!--Twitter -->
    <li>
      <a href="https://twitter.com/share" class="twitter-share-button">Tweet</a>
    </li>
    <!-- G+ -->
    <li>
      <g:plusone size="medium"></g:plusone>
    </li>
    <!-- SU -->
    <li>
      <su:badge layout="1"></su:badge>
    </li>
    <!-- Hacker News -->
    <li>
      <a href="http://news.ycombinator.com/submitlink?u=http://{{ page.url }}&t={{ page.title }}" target="_blank" title="Submit {{ page.title }} to Hacker News">
        <img src="/images/y-comb.gif" />
      </a>
    </li>
  </ul>

  <div id="fb-root"></div>

  <script>
    //Facebook
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=399955583389436";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // LinkedIn
    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = '//platform.linkedin.com/in.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    //Twitter
    !function(d,s,id){
      var js,fjs=d.getElementsByTagName(s)[0];
      if(!d.getElementById(id)){
        js=d.createElement(s);
        js.id=id;
        js.src="//platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js,fjs);
      }}(document,"script","twitter-wjs");

    // G+
    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // SU
    (function() {
      var li = document.createElement('script'); li.type = 'text/javascript'; li.async = true;
      li.src = 'https://platform.stumbleupon.com/1/widgets.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(li, s);
    })();
  </script>

</div>