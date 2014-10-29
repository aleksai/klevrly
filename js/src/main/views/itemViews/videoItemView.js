
define(['jquery','underscore','backbone','text!main/views/itemViews/videoItemTemplate.html'],function($,_,Backbone,videoItemTemplate){

    return Backbone.View.extend({
        tagName:'div',
        className:'videoItem',
        events:{
            'mouseenter .thumbnail':'onMouseEnter',
            'mouseleave':'onMouseLeave',
            'click .play':'playVideo',
            'click .overlay':'playVideo',
            'click .title':'playVideo'
        },
        template: _.template(videoItemTemplate),
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template(this.model));
            this.$('img').hide();
            this.$('img').on('load',function(){
                $(this).fadeIn();

            });

            this.$overlay = this.$el.find('.overlay');
            this.$play = this.$el.find('.play');
            this.$add = this.$el.find('.add');
            this.$duration = this.$el.find('.duration');
            return this;
        },
        onMouseEnter:function(){
            this.$overlay.css('bottom',0);
            this.$play.css('opacity',1.0);
        },
        onMouseLeave:function(){
            this.$overlay.css('bottom',-60);
            this.$play.css('opacity',0.6);

        },
        playVideo:function(){
            var options = {
                type:'video',
                videoModel:this.model,
                startAt:0
            };
            this.bubble('playItem',options);
        }
    });
});