
define(['underscore','backbone','appModule','sidebar/views/sidebarView'],
    function(_,Backbone,AppModule,SidebarView){

    return AppModule.extend({
        name:'Sidebar Module',
        start:function(options){

            if(options && options.router){
                this.router = options.router;
                this.router.on('route',this.onRoute,this);
            }

            this.sidebarView = new SidebarView();
            $(this.region).html(this.sidebarView.render().el);
        },
        onRoute:function(routeType){
            this.sidebarView.setRoute(routeType);
        }


    });


});