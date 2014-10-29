define(['underscore','backbone','jquery'],function(_,Backbone,$){
    
    return Backbone.View.extend({
        tagName:'div',
        className:'searchSuggest',
        events:{
            
        },
        initialize:function(){
            
        },
        render:function(){
            this.$el.html('search suggest');
        }
    });
    
});