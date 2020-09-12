/*global QUnit*/

sap.ui.define([
	"gdsd/CW09/controller/TaskDetails.controller"
], function (Controller) {
	"use strict";

	QUnit.module("TaskDetails Controller");

	QUnit.test("I should test the TaskDetails controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});