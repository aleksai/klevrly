define(
    ['backbone', 'underscore'],
    function(Backbone, _) {
        "use strict";

        var noop = function() {};

        var Component = Backbone.View.extend({
            _rendered: false,
            constructor: function() {
                this._children = [];
                Backbone.View.apply(this, arguments);
                if (this.options.renderTo) {
                    this.renderTo = this.options.renderTo;
                    delete this.options.renderTo;
                }

            },

            addChild: function(child) {
                this._children.push(child);
                child.parent = this;
                if(this.isRendered()) {
                    this.renderChild(child);
                }
            },

            removeChild: function(child) {
                this._children = _(this._children).without(child);
                child.parent = null;
                child.remove();
            },

            eachChild: function(fn, context) {
                _(this._children).each(fn, context || this);
            },

            getChildAt: function(index) {
                return this._children[index];
            },

            getChildIndex: function(child) {
                return _(this._children).indexOf(child);
            },

            isRendered: function() {
                return this._rendered;
            },

            _onRender: noop,

            render: function() {
                if(this._rendered) {
                    return;
                }

                this._onRender();
                this._rendered = true;
                this.trigger('render', this);

                this.eachChild(this.renderChild);

                this._afterRender();
                this.trigger('render:after', this);

                return this;
            },

            renderChild: function(child) {
                if(child.isRendered && child.isRendered()) {
                    return;
                }
                child.render();
                this._onRenderChild(child);
            },

            _onRenderChild: function(child) {
                if (!child.renderTo) {
                    this.$el.append(child.el);
                } else {
                    this.$(child.renderTo).html(child.el);
                }
            },

            _afterRender: noop,

            _onRemove: noop,

            remove: function() {
                this._onRemove();
                this.trigger('remove', this);

                this.eachChild(function(child) {
                    child.remove();
                });
                this.$el.off();
                Backbone.View.prototype.remove.call(this);

                this._afterRemove();
                this.trigger('remove:after', this);
            },

            _afterRemove: noop,

            broadcast: function() {
                var eventArgs = arguments;
                this.trigger.apply(this, eventArgs);
                this.eachChild(function(child) {
                    child.broadcast.apply(child, eventArgs);
                })
            },

            bubble: function() {
                this.trigger.apply(this, arguments);
                if(this.parent) {
                    this.parent.bubble.apply(this.parent, arguments);
                }
            }
        });

        return Component;
    }
);/**
 * Created by airaguha on 8/10/14.
 */
