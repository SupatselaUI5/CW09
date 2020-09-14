sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	return Controller.extend("gdsd.CW09.controller.TaskDetails", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("TaskDetails").attachPatternMatched(this._onObjectMatched, this);
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oODataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
		},
		_onObjectMatched: function (oEvent) {
			var TaskJsonModel = sap.ui.getCore().getModel("TaskJsonModel");
			this.getView().setModel(TaskJsonModel);
			this.oModelProperty = TaskJsonModel.getProperty("/" + window.decodeURIComponent(oEvent.getParameter("arguments").taskPath));
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").taskPath)
			});
			this.SWBP = oEvent.getParameter("arguments").BPNo; //this.onResetFields();
			this.onResetFields();
		},
		/**
		 *@memberOf gdsd.CW09.controller.TaskDetails
		 */
		action: function (oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function (oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function (prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		},

		onResetFields: function () {
			this.byId("ZV20").setValue(null);
			this.byId("ZV21").setValue(null);
			this.byId("ZV22").setValue(null);
			this.byId("ZV23").setValue(null);
			this.byId("ZV24").setValue(null);
			this.byId("ZV25").setValue(null);
			this.byId("ZV26").setValue(null);
			this.byId("ZV27").setValue(null);
			this.byId("ZV28").setValue(null);
			this.byId("ZV29").setValue(null);
			this.byId("ZV30").setValue(null);
			this.byId("ZV31").setValue(null);
			this.byId("ZV32").setValue(null);
			this.byId("ZV33").setValue(null);
		},

		onSuccessMessageBoxPress: function () {
			MessageBox.success("Assessment " + this.oModelProperty.ObjectId + " has been successfully submitted", {
				onClose: function (sAction) {
					this.Router.navTo("WorkSpace");
				}
			}).bind(this);
		},

		onErrorMessageBoxPress: function () {
			MessageBox.error("Error submitting assessment please try again or contact support for assisstance");
		},

		onSubmit: function () {
			this.getView().setBusy(true);
			var oEntry = {};
			oEntry.BpNo = this.SWBP;
			oEntry.Guid = this.oModelProperty.Guid;
			oEntry.ObjectId = this.oModelProperty.ObjectId;
			oEntry.Zv20 = this.byId("ZV20").getValue();
			oEntry.Zv21 = this.byId("ZV21").getValue();
			oEntry.Zv22 = this.byId("ZV22").getValue();
			oEntry.Zv23 = this.byId("ZV23").getValue();
			oEntry.Zv24 = this.byId("ZV24").getValue();
			oEntry.Zv25 = this.byId("ZV25").getValue();
			oEntry.Zv26 = this.byId("ZV26").getValue();
			oEntry.Zv27 = this.byId("ZV27").getValue();
			oEntry.Zv28 = this.byId("ZV28").getValue();
			oEntry.Zv29 = this.byId("ZV29").getValue();
			oEntry.Zv30 = this.byId("ZV30").getValue();
			oEntry.Zv31 = this.byId("ZV31").getValue();
			oEntry.Zv32 = this.byId("ZV32").getValue();
			oEntry.Zv33 = this.byId("ZV33").getValue();
			var sPath = "/GetIndividualAssessmentSet(Guid='" + this.oModelProperty.Guid + "',BpNo='" + this.SWBP + "',ObjectId='" + this.oModelProperty
				.ObjectId +
				"')";

			this._oODataModel.update(sPath, oEntry, {
				success: function (oData) {
					this.getView().setBusy(false);
					this.onSuccessMessageBoxPress();

				}.bind(this),
				error: function (results) {
					this.getView().setBusy(false);
					this.onErrorMessageBoxPress();

				}.bind(this)
			});
		}
	});
});