define(function(require){

    var _ = require('underscore'),
        Backbone = require('backbone');

    var BaseView = Backbone.View.extend({
        constructor:function(){
            this.childViews = [];
            Backbone.View.apply(this, arguments);
        },
        addChild:function(view){
            view.parent = this;
            this.childViews.push(view);
        },
        removeChildViews:function(){
            var self = this;
            _.each(this.childViews,function(view){
                view.remove();
            });
            this.childViews.length=0;
        },
        remove:function(){
            // COMPLETELY UNBIND THE VIEW
            this.undelegateEvents();
            this.$el.removeData().unbind();

            // Remove view from DOM
            Backbone.View.prototype.remove.call(this);
        }

    });

    return BaseView;
});