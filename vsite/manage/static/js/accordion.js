YUI.add('accordion', function(Y) {

var Lang = Y.Lang,
	Node = Y.Node,
	Anim = Y.Anim,
	Easing = Y.Easing,
	WidgetStdMod = Y.WidgetStdMod,
	AccName = "accordion",
	AccItemName = "accordion-item",
	getCN = Y.ClassNameManager.getClassName;

Y.Accordion = Y.Base.create(AccName, Y.Widget, [], {
	initializer: function(config) {
		console.log("initializer");
	},

	destructor: function() {
		console.log("initializer");
	},

	renderUI: function() {
		console.log("render ui");
	},

	bindUI: function() {
		console.log("bind ui");
	},

	syncUI: function() {
		console.log("sync ui");
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
