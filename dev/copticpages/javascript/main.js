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
 		template: $('#search-listitem-template').remove().html(),
        className: 'listing',
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

 	});

 	App.Views.Search = Backbone.View.extend({
 		events : {
 			
 		},
 		initialize: function() { 				
 			var self = this;

 			$.getJSON('./data.json', function(data) {
 				self.model = new App.Collections.Business(data);
 				self.listingList = new App.Views.ListingList({model: self.model});
 				self.listingList.render();	
 			})
 		},
 		render: function() {
 			
 		}
 	}) 


 	App.Views.Main = Backbone.View.extend({
 		initialize: function() { 				
 			var search = new App.Views.Search();
 		},
 		render: function() {
 			
 		}
 	});

 	var main = new App.Views.Main();
});