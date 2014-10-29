define(function(require){

    var _ = require('underscore'),
        Backbone = require('backbone'),
        $ = require('jquery'),
        $htmlTemplate = require('text!main/views/itemViews/chartTrackItemTemplate.html');

    var HOVER_DELAY = 150;

    return Backbone.View.extend({
        className:'track-chart-item',
        template: _.template($htmlTemplate),
        events:{
            'mouseenter':'onMouseEnter',
            'mouseleave':'onMouseLeave',
            'click':'playTrack'
        },
        initialize:function(){
            this.hoverTimer;
        },
        render:function(){
            this.$el.html(this.template(this.model));
            this.$('img').on('load',function(){
                $(this).css('opacity',1);
            });
            return this;
        },
        onMouseEnter:function(){
            var self = this;
            this.hoverTimer = setTimeout(function(){
                self.$el.addClass('onHover');
            },HOVER_DELAY);
        },
        onMouseLeave:function(){
            clearTimeout(this.hoverTimer);
            this.$el.removeClass('onHover');
        },
        playTrack:function(evt){
            var $itemClicked = $(evt.target);
            if(!$itemClicked.hasClass('no-click')){

                var options = {
                    type: 'album',
                    trackModel:this.model,
                    trackNumber:this.model.get('trackNumber')-1,
                    albumModel:this.album
                };
                this.bubble('playItem',options);
            }
        }
    });


});