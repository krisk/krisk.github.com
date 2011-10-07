$(function() {
	
    String.format = function() {
      var s = arguments[0];
      for (var i = 0; i < arguments.length - 1; i++) {       
        var reg = new RegExp("\\{" + i + "\\}", "gm");             
        s = s.replace(reg, arguments[i + 1]);
      }
      return s;
    }

    var App = {
        Models: {},
        Views: {},
        Collections: {},
        Router: null,
        Main: null
    };
    
	// MODELS
 	App.Models.Business = Backbone.Model.extend({
        defaults : {
            name: '', 
            phone: null,
            catchPhrase: null,
            streeAddress: null,
            postalCode: null,
            email: null,
            website: null,
            contact: null
        }
 	});

 	// COLLECTIONS
 	App.Collections.Business = Backbone.Collection.extend({
  		model: App.Models.Business
	});

 	// VIEWS
    var SearchMethods = {
        initialize: function (){
            $el = $(this.el);
            this.termTextBox = $el.find('#search-type');
            this.locationTextBox = $el.find('#search-location');
        },
        searchQuery: function(e, args) {
            var term = this.termTextBox.val(),
                location = this.locationTextBox.val(),
                query = '/search';

            if (term) {
                query += '/' + term;
                if (location) {
                    query += '/' + location;
                }
            }
            return query;
        }
    }  
    
    App.Views.Home = Backbone.View.extend({
        el: '#home-view',
        events: {
            'click #home-view #search-button': 'onSearchButtonClicked'
        },
        initialize: function () {
            SearchMethods.initialize.apply(this, arguments);
        },
        onSearchButtonClicked: function(e, args) {
            e.preventDefault();
            var query = SearchMethods.searchQuery.apply(this, arguments);
            App.Router.navigate(query, true);
        },
        render: function() {
            return this;
        }
    });

 	App.Views.Profile = Backbone.View.extend({
        el: '#profile-view',
        initialize: function () {
            this.template = $('#profile-template').remove().html();   
        },
        render: function() {
            $(this.el).html(Mustache.to_html(this.template, this.model.toJSON()));
            return this;
        }
 	});

 	App.Views.Search = Backbone.View.extend({
        el: '#search',
        events : {
          'click .button-glossy': 'onSearchButtonClicked' 
        },
        initialize: function() {
 			var self = this;

            SearchMethods.initialize.apply(this, arguments);

            if (this.options.term) {
                this.termTextBox.val(this.options.term);
            }
            if (this.options.location) {
                this.locationTextBox.val(this.options.location);
            }

 			// Find the location of the user
            /*
 			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var coords = position.coords;
					var address = position.address;
					$('#search-location').val(address.city + ', ' + address.country + ', ' + address.postalCode);
				});
			}
            */

			$("#search-filter").stickyPanel();

 			$.getJSON('./data.json', function(data) {
 				self.model = new App.Collections.Business(data);
 				self.listingList = new App.Views.ListingList({model: self.model});
 				self.listingList.render();	
 			})
 		},
        onSearchButtonClicked: function(e, args) {
            e.preventDefault();
            var query = SearchMethods.searchQuery.apply(this, arguments);
            App.Router.navigate(query);
            this.search();
        },
        search: function() {
            console.log('search!');
        },
 		render: function() {
 			return this;
 		}
 	});

    App.Views.Listing = Backbone.View.extend({
        tagName: 'li',
        className: 'listing',
        initialize: function () {
            if (!App.Views.Listing.prototype.template) {
                App.Views.Listing.prototype.template = $('#search-listitem-template').remove().html();   
            }
        },
        render: function() {
            $(this.el).html(Mustache.to_html(this.template, this.model.toJSON()));
            return this;
        }
    });

    App.Views.ListingList = Backbone.View.extend({
        tagName: 'ul',
        className: 'listings',
        initialize: function() {
             _.bindAll(this, 'addOne');
            this.model
                .bind('add', this.addOne, this)
                .bind('reset', this.addAll, this);
             
            this.addAll();
        },
        addOne: function(business) {
            var listing = new App.Views.Listing({model: business});
            $(this.el).append(listing.render().el);
        },
        addAll: function() {
            this.model.each(this.addOne);
        },
        render: function() {
            $(this.el).appendTo($('#search-body'));
            return this;
        }
    });


    /* Main APP */
    var main = Backbone.View.extend({  
        el: $('#view-container'),
        initialize: function () {    
            $('#menu > li').bind('click', function() {
                App.Router.navigate($(this).data('name'), true);
            });
        }
    });
    
    /* ROUTING */
    var router = Backbone.Router.extend({
        routes: {
            '': 'home',
            '/search': 'search',
            '/search/:term': 'search',
            '/search/:term/:location': 'search',
            '/profile/:name': 'profile'
        },
        home: function() {
            App.Main.el.load('./views/home.html', function() {
                var home = new App.Views.Home();
                home.render();
            });
        },
        search: function (term, location) {
            App.Main.el.load('./views/search.html', function() {
                var search = new App.Views.Search({term: term, location: location});
                search.render();
            });
        },
        profile : function(name) {
            var m = {
                  "name":"Dental hell",
                  "profile": "dental_hell",
                  "catchphrase": "Caring and gentle comprehensive dentistry by people who get to know you",
                  "phone":"111-111-1111",
                  "streetAddress":"3343 Eglinton Ave West, Mississauga, ON",
                  "postalCode":"L5M7W8",
                  "email":"kirollos@gmail.com",
                  "website":"kiro.me",
                  "img":"one.jpg"
            }

            App.Main.el.load('./views/profile.html', function() {
                var model = new App.Models.Business(m),
                    profile = new App.Views.Profile({model: model});

                profile.render();
            });
        }
    });

    App.Router = new router();
    App.Main = new main();

    Backbone.history.start();
});