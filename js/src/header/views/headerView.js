
define(['jquery','underscore','backbone','text!header/views/headerTemplate.html'],function($,_,Backbone,headerTemplate){

    /*var _ = require('underscore'),
        $ = require('jquery'),
        Backbone = require('backbone'),
        $html = require('text!header/views/headerTemplate.html');*/

    return Backbone.View.extend({
        tagName:'div',
        id:'headerInnerWrap',
        template: _.template(headerTemplate),
        events:{
            'submit #searchForm':'onSearchClick'
        },
        initialize:function(){

        },
        render:function(){
            this.$el.html(this.template({}));
            this.$searchInput = this.$el.find('#searchInput');
            return this;
        },
        onSearchClick:function(e){
            e.preventDefault();
            var query = this.$searchInput.val();
            this.trigger('search:submit',query)

        }

    });


});