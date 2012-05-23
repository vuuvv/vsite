YUI.add('accordion', function(Y) {

var Lang = Y.Lang,
	Node = Y.Node,
	Anim = Y.Anim,
	Easing = Y.Easing,
	WidgetStdMod = Y.WidgetStdMod,
	AccName = "accordion",
	AccItemName = "accordion-item",
	getCN = Y.ClassNameManager.getClassName,

	C_ITEM = "yui3-accordion-item";

Y.Accordion = Y.Base.create(AccName, Y.Widget, [], {
	initializer: function(config) {
		console.log("initializer");
	},

	destructor: function() {
		console.log("initializer");
	},

	renderUI: function() {
		var srcNode, itemsDom;
		srcNode = this.get("srcNode");

		itemsDom = srcNode.all("> ." + C_ITEM);
		itemsDom.each(function(itemNode, index, itemsDom) {
			var newItem;

			newItem = new Y.AccordionItem({
				srcNode: itemNode,
				id: itemNode.get("id")
			});
			this.addItem(newItem);
		}, this);
	},

	bindUI: function() {
		console.log("bind ui");
	},

	syncUI: function() {
		console.log("sync ui");
	},

	addItem: function(item) {
		var items = this.get("items");
		items.push(item);
	}
}, {
	NAME: AccName,

	ATTRS: {
		items: {
			value: [],
			readOnly: true,
			validator: Lang.isArray
		}
	}
});

Y.AccordionItem = Y.Base.create(AccItemName, Y.Widget, [WidgetStdMod], {
	initializer: function(config) {
	},

	destructor: function() {
	},

	renderUI: function() {
	},

	bindUI: function() {
	}

});

}, '1.0', {requires: ['widget', 'widget-stdmod']});
