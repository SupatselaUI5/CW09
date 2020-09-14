sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("gdsd.CW09.controller.WorkSpace", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdsd.CW09.view.WorkSpace
		 */
		onInit: function () {
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
			this.Router = sap.ui.core.UIComponent.getRouterFor(this);
			this.Router.getRoute("WorkSpace").attachPatternMatched(this._onObjectMatched, this);
			this.onBindSWBP();

		},

		_onObjectMatched: function (oEvent) {
			this.onBindSWBP();
		},

		onSearch: function (oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("DescriptionA", FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}

			// update list binding
			var oList = this.byId("TaskList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		onSelectionChange: function (oEvent) {
			var oList = oEvent.getSource();
			var oLabel = this.byId("idFilterLabel");
			var oInfoToolbar = this.byId("idInfoToolbar");

			// With the 'getSelectedContexts' function you can access the context paths
			// of all list items that have been selected, regardless of any current
			// filter on the aggregation binding.
			var aContexts = oList.getSelectedContexts(true);

			// update UI
			var bSelected = (aContexts && aContexts.length > 0);
			var sText = (bSelected) ? aContexts.length + " selected" : null;
			oInfoToolbar.setVisible(bSelected);
			oLabel.setText(sText);
		},

		onBindSWBP: function () {
			sap.ui.core.BusyIndicator.show();
			this._oODataModel.read("/GET_BPSet", {
				//User details retrieved successfully
				success: (function (oData) {
					var BPJsonModel = new sap.ui.model.json.JSONModel({
						data: oData.results[0]
					});
					this.byId("objHeaderSW").setModel(BPJsonModel);
					this.byId("objHeaderSW").bindElement({
						path: "/data"
							// use OData parameters here if needed
					});
					this.SWBP = oData.results[0].But000.Partner;
					var filterVal = "BpNo eq '" + this.SWBP + "'";
					this.getTaskData(filterVal);
				}).bind(this),
				error: (function (e, x, r) {
					// console.log("Error " + e);
				})
			});
		},

		getTaskData: function (filter) {
			// var filterVal = "BpNo eq '0000000114'";
			var oList = this.byId("TaskList");
			this._oODataModel.read("/GetIndividualAssessmentSet", { // sPath - path of your Entityset
				urlParameters: {
					"$filter": filter
				},
				success: function (data, response) {
					var TaskJsonModel = new sap.ui.model.json.JSONModel(data);
					oList.setModel(TaskJsonModel);
					sap.ui.getCore().setModel(TaskJsonModel, "TaskJsonModel");
					sap.ui.core.BusyIndicator.hide();
					//your code for manipulation of the data received 
				}.bind(this), // if you want to use the current controller instance within this function
				error: function (response) {
						// for handling the error received
					}.bind(this) // if you want to use the current controller instance within this function
			});
		},

		onTaskPress: function (oEvent) {
			var oItem = oEvent.getSource();
			this.Router.navTo("TaskDetails", {
				taskPath: window.encodeURIComponent(oItem.getBindingContext().getPath().substr(1)),
				BPNo: this.SWBP
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdsd.CW09.view.WorkSpace
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdsd.CW09.view.WorkSpace
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdsd.CW09.view.WorkSpace
		 */
		//	onExit: function() {
		//
		//	}

	});

});