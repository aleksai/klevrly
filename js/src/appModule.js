
define(['backbone','underscore'],function(Backbone,_){

    function AppModule(application,options){
        this.eventBus = application.eventBus;
        _(this).extend(options);

        this.publish = function(eventName,options){
            this.eventBus.trigger(eventName,options);
        };

        this.subscribe = function(eventName,callback){
            this.eventBus.on(eventName,callback);
        }
    }

    AppModule.extend = Backbone.Model.extend;
    return AppModule;

});