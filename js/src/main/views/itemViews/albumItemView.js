
define(function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        $htmlTemplate = require('text!main/views/itemViews/albumItemTemplate.html');

    var HOVER_DELAY = 50;

    return Backbone.View.extend({
        tagName:'div',
        className:'albumItem',
        template: _.template($htmlTemplate),
        events:{
            'mouseenter':'onMouseEnter',
            'mouseleave':'onMouseLeave'
        },
        initialize:function(){
            this.artistMode = false;
            this.hoverTimer;
        },
        render:function(){
            this.$el.html(this.template(this.model));
            this.$('img').on('load',function(){
                $(this).css('opacity',1);
            });
            this.$title = this.$el.find('.title');
            this.$play = this.$el.find('.play');
            this.$add = this.$el.find('.add');
            this.$overlay = this.$el.find('.overlay');
            return this;
        },
        onMouseEnter:function(){
            var self = this;
            this.hoverTimer = setTimeout(function(){
                self.$title.css('bottom',-30);
                self.$play.css('margin-left',40);
                self.$add.css('margin-right',40);
                self.$overlay.css('bottom',0);
            },HOVER_DELAY);
        },
        onMouseLeave:function(){
            clearTimeout(this.hoverTimer);
            this.$title.css('bottom',10);
            this.$play.css('margin-left',-100);
            this.$add.css('margin-right',-100);
            this.$overlay.css('bottom',-220);
        }
    });
});