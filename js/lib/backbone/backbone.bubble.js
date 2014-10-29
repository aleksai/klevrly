(function(View) {
  
  // override default _configure to add children to parent
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 
          'tagName', 'events', 'parent'];
    
  _.extend(View.prototype, {
    
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
    
      // check if parent was passed
      var parent = this.parent;
      if (parent) {
        // add this child to parent
        _.isArray(parent.children) || (parent.children = []);
        parent.children.push(this);
      }
      this.options = options;
    },
    
    // args: [eventName, callback_arg0, callback_arg1, etc.]
    _trigger: function(args) {
      // trigger the event
      this.trigger.apply(this, args);
      
      var eventName = _.first(args);
      
      // find the event (function or function name) and call it
      var key = this.events && this.events[eventName];
      var callback = _.isString(key) ? this[key] : key;
      callback && callback.apply(this, _.rest(args));
      
      // for chaining
      return this;
    },
    
    bubble:  function(eventName) {
      var args = Array.prototype.slice.call(arguments);
      
      // save reference to parent in case view is closed
      var parent = this.parent;
      
      this._trigger(args);
    
      // bubble the event up the view hierarchy
      parent && parent.bubble.apply(parent, args);
      
      // for chaining
      return this;
    },
    
    broadcast: function(eventName) {
      var args = Array.prototype.slice.call(arguments);
      
      // save reference to children in case view is closed
      var children = this.children;
      this._trigger(args);
      
      // broadcast event down the view hierarchy
      _.each(children || [], function(child) {
        child.broadcast.apply(child, args);
      });
      
      // for chaining
      return this;
    },
    
    close: function(ev) {
      // Handle preventing default click if it was a DOM event
      ev && ev.preventDefault && ev.preventDefault();
    
      // Close all view children to prevent memory leaks
      if (_.isArray(this.children)) {
        _.invoke(this.children, 'close');
        delete this.children;
      }
    
      // delete references (cant hurt)
      delete this.parent;
      
      // remove events
      this.off();
    
      // remove view itself from DOM
      this.remove();
    }
    
  });
  
})(Backbone.View);
