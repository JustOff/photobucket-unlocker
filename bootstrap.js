"use strict";

const {interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");

let Observer = {
	observe: function(subject, topic, data) {
		try {
			if (topic == 'http-on-modify-request' && subject instanceof Ci.nsIHttpChannel) {
				if (subject.URI.host.match(/\.photobucket\.com$/)) {
					let user;
					if ((user = /albums\/[^\/]+\/([^\/]+)\//.exec(subject.URI.spec)) !== null) {
						let url = subject.URI.QueryInterface(Ci.nsIURL);
						if (url.query.indexOf("hotlinkfix") == -1) {
							let query, date = new Date().getTime();
							if (url.query == "") {
								query = "?hotlinkfix=" + date;
							} else {
								query = url.query + "&hotlinkfix=" + date;
							}
							subject.redirectTo(Services.io.newURI(subject.URI.spec + query, null, null));
						} else {
							subject.setRequestHeader("Referer", subject.URI.scheme + '://photobucket.com/gallery/user/' + user[1] + '/media/', false);
						}
					}
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
