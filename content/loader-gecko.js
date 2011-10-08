"use strict";
/*
 * loader-gecko.js
 * FoxTrick loader for Gecko platform
 */

if (!Foxtrick)
	var Foxtrick = {};
if (!Foxtrick.loader)
	Foxtrick.loader = {};
Foxtrick.loader.gecko = {};

// invoked after the browser chrome is loaded
// variable *document* is predeclared and used here but means the
// browser chrome (XUL document)
Foxtrick.loader.gecko.browserLoad = function(ev) {
	Foxtrick.entry.init();

	// calls module.onLoad() after the browser window is loaded
	for (var i in Foxtrick.modules) {
		var module = Foxtrick.modules[i];
		if (typeof(module.onLoad) === "function") {
			try {
				module.onLoad(document);
			}
			catch (e) {
				Foxtrick.log("Error caught in module ", module.MODULE_NAME, ":", e);
			}
		}
	}

	var appcontent = document.getElementById("appcontent");
	if (appcontent) {
		// listen to page loads
		appcontent.addEventListener("DOMContentLoaded", function(ev) {
			FoxtrickUI.update();
			Foxtrick.entry.docLoad(ev.originalTarget);
		}, true);
		appcontent.addEventListener("unload", Foxtrick.loader.gecko.docUnload, true);

		// add listener to tab focus changes
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
		var browserEnumerator = wm.getEnumerator("navigator:browser");
		var browserWin = browserEnumerator.getNext();
		var tabbrowser = browserWin.getBrowser();
		tabbrowser.tabContainer.onselect = Foxtrick.loader.gecko.tabFocus;
	}
};

// invoked when a tab is focused
Foxtrick.loader.gecko.tabFocus = function(ev) {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator);
	var browserEnumerator = wm.getEnumerator("navigator:browser");
	var browserWin = browserEnumerator.getNext();
	var tabbrowser = browserWin.getBrowser();
	var currentBrowser = tabbrowser.getBrowserAtIndex(ev.target.selectedIndex);
	var doc = currentBrowser.contentDocument;

	Foxtrick.entry.run(doc, true); // recheck css

	// calls module.onTabChange() after the tab focus is changed
	for (var i in Foxtrick.modules) {
		var module = Foxtrick.modules[i];
		if (typeof(module.onTabChange) === "function") {
			try {
				module.onTabChange(doc);
			}
			catch (e) {
				Foxtrick.log("Error caught in module ", module.MODULE_NAME, ": ", e);
			}
		}
	}
	Foxtrick.log.flush(doc);
};


// invoked when an HTML document is unloaded
Foxtrick.loader.gecko.docUnload = function(ev) {
	// do nothing
};

// fennec browser load. starts the content instances for fennec (one per tab. persistant)
if (Foxtrick.platform == "Fennec") {
	Foxtrick.log('tab load')
	sandboxed.extension.sendRequest({ req : "tabLoad" },
		function (data) {

			Foxtrick.entry.setRetrievedLocalResources(data);
//			Foxtrick.entry.init();

			addEventListener("DOMContentLoaded", function(ev){
				FoxtrickUI.update();
				Foxtrick.entry.docLoad(ev.originalTarget);
			}, false);
		}
	);
}

