
define(['jquery','underscore','backbone','text!main/views/itemViews/genreItemTemplate.html'],function($,_,Backbone,albumItemTemplate){

    return Backbone.View.extend({
        tagName:'div',
        className:'genreItem',
        template: _.template(albumItemTemplate),
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template(this.model));

            return this;
        }

    });


});