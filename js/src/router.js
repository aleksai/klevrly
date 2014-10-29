define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            '/projects': 'showProjects',
            '/users': 'showUsers',
            'home':'home',
            'artist/:artistname(/:mbid)':'artist',
            'album/:artist/:album(/:id)':'album',
            'tag/:tagname':'tag',
            'search/:query':'search',
            'charts/:type':'charts',

            // Default
            '*actions': 'defaultAction'
        },
        home:function(){
            this.trigger('home','test options');
        },
        artist:function(artistname,mbid){
            this.trigger('artist',artistname,mbid);

        },
        album:function(artist,album,id){
            this.trigger('album',artist,album,id);

        },
        tag:function(tagname){
            this.trigger('tag',tagname);
        },
        search:function(query){
            this.trigger('search',query);
        },
        charts:function(chartType){
            this.trigger('charts',chartType);
        }
    });

    return AppRouter;

});