"use strict";

const {interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

let Observer = {
	observe: function(subject, topic, data) {
		try {
			if (topic == 'http-on-modify-request' && subject instanceof Ci.nsIHttpChannel) {
				if (subject.URI.host.match(/\.photobucket\.com$/)) {
					subject.setRequestHeader("Referer", subject.URI.spec, false);
				}
			}
		} catch (e) {}
	},

	register: function() {
		Services.obs.addObserver(this, "http-on-modify-request", false);
	},

	unregister: function() {
		Services.obs.removeObserver(this, "http-on-modify-request", false);
	}
};

function startup(data, reason) {
	Observer.register();
};

function shutdown() {
	Observer.unregister();
};

function install() { };
function uninstall() { };
