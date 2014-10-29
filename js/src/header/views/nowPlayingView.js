define(function(require){

    var _ = require('underscore'),
        Backbone = require('backbone'),
        $ = require('jquery'),
        $htmlTemplate = require('text!header/views/nowPlayingTemplate.html');

    return Backbone.View.extend({
        className:'now-playing',
        template: _.template($htmlTemplate),
        initialize:function(){
            console.log('init now playing view');
        },
        render:function(){
            this.$el.html(this.template({}));
            return this;
        }
    });


});