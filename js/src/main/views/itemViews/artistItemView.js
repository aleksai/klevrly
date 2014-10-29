
define(function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        BaseView = require('components/baseView'),
        $htmlTemplate = require('text!main/views/itemViews/artistItemTemplate.html');

    return BaseView.extend({
        tagName:'div',
        className:'artistItem',
        template: _.template($htmlTemplate),
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template(this.model));
            this.$('img').hide();
            this.$('img').on('load',function(){
                $(this).fadeIn();   //TODO - add a class to sue CSS animations
            });
            return this;
        }
    });
});