$(function() {
	
    var App = {
        Models: {},
        Views: {},
        Collections: {},
        Routers: {},
        init: function() {
        }
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

 	App.Views.Profile = Backbone.View.extend({
        initialize: function () {
            this.template = $('#profile-template').remove().html();   
        },
        render: function() {
            this.el = $(this.el).html(Mustache.to_html(this.template, this.model.toJSON()));
            return this;
        }
 	});

 	App.Views.Search = Backbone.View.extend({
        initialize: function() { 				
 			var self = this;
 			
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
 		render: function() {
 			return this;
 		}
 	}) 

 	App.Views.Main = Backbone.View.extend({});
 	var main = new App.Views.Main();


    var VIEW_CONTAINER = $('#view-container');

    AppRouter = Backbone.Router.extend({
        routes: {
          '/search': 'loadSearch',
          '/profile/:name': 'loadBusiness'
        }
        , loadSearch: function () {
            var self = this;
            VIEW_CONTAINER.load('./views/search.html', function() {
                var search = new App.Views.Search();
                search.render();
            });
        }
        , loadBusiness : function(name) {
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

            VIEW_CONTAINER.load('./views/profile.html', function() {
                var model = new App.Models.Business(m),
                    profile = new App.Views.Profile({model: model});

                profile.render().el.appendTo(VIEW_CONTAINER);
            });
        }
    });

    var app = new AppRouter();

    Backbone.history.start();


    //$('#menu > li').bind('click', function() {
    //app.navigate($(this).data('name'), true);
    //});
});