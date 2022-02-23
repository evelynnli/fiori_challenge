/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"T180/fiori_challenge/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
