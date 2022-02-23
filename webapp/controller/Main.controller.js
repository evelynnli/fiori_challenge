sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "T180/fiorichallenge/model/models",
    "sap/ui/core/Fragment"
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(Controller, JSONModel, models, Fragment) {
    "use strict";

    return Controller.extend("T180.fiorichallenge.controller.Main", {
        onInit: function() {

        },

        onAfterRendering: function() {

            // Instantiate the Asset Review Model from the models.js template
            this.getView().setModel(new JSONModel(models.createAssetReviewModelTemplate()), "AssetReviewModel");

            // Example; setting the 'CurrentDate' property in the Asset Review model
            this.getView().getModel("AssetReviewModel").setProperty("/CurrentDate", new Date());
            var Reviews = this.getView().getModel("AssetReviewModel")
            //add model to store data new added review form popup
            //console.log(.oData.Reviews.length)
            var numberOfReviews = Reviews.oData.Reviews.length
            this.getView().getModel("AssetReviewModel").setProperty("/totalReviews",numberOfReviews)
            this.getView().setModel(new JSONModel(), "NewReviewModel");
           
        },

        closeDialog: function() {
            this.byId("addReviewDialog").close();
        },

        onAddReview: function() {
            //method to add new review 
            var oView = this.getView();
            //using standard fragment method to load the add new review popup
            if (!this.addReviewDialog) {
                this.addReviewDialog = Fragment.load({
                    id: oView.getId(),
                    name: "T180.fiorichallenge.view.AddReview",
                    controller: this
                }).then(function(oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this.addReviewDialog.then(function(oDialog) {
                oDialog.open();
            });
        },
        /* 
        Method to save review added from the add review popup fragment 
        */
        onPressSaveReview: function(oEvent) {
            // get the model bind for new Review 
            var oModel = this.getView().getModel("NewReviewModel");

            //get the data from new review model
            var aData = oModel.getData();

            //add asset and review name

            aData.AssetName = this.byId("idAssetSelect").getSelectedKey();
            aData.ReviewerName = this.byId("idReviewerSelect").getSelectedKey();

            //get the AssetReviewModel, this model is bound to the table 
            var oAssetReviewModel = this.getView().getModel("AssetReviewModel");

            //get the data from AssetReviewModel model

            var aAssetData = oAssetReviewModel.getData();

            //get review data
            var aAssetReviewsData = aAssetData.Reviews;

            //push the new added data to AssetReviewData, so that new review gets added in table 

            aAssetReviewsData.push(aData);

            //set this data to model so that table gets updated

            oAssetReviewModel.setData(aAssetData);

            //close the popup
            this.closeDialog();
        },

        //method to call on selection of row of table
        onTableRowSelected: function(oEvent) {
            //get context of selected line item
            var oContext = oEvent.getSource().getBindingInfo("text").binding.getContext();

            //get path from context
            var sPath = oContext.getPath();

            //get data for selected line item 
            var selectedLineData = this.getView().getModel("AssetReviewModel").getObject(sPath);

            //calculate average of all ratings
            selectedLineData.average = (selectedLineData.Durability + selectedLineData.Longevity + selectedLineData.Suitability +
                selectedLineData.Value) / 4;

            //set data of current line item as chart model to display the chart popup
            this.getView().setModel(new JSONModel(selectedLineData), "chart");
            this.openChartPopover(oEvent);
        },

        onExit: function() {
            if (this._oPopover) {
                this._oPopover.destroy();
            }
        },

        openChartPopover: function(oEvent) {

            // create popover
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("T180.fiorichallenge.view.Chart", this);
                this.getView().addDependent(this._oPopover);
            }

            this._oPopover.openBy(oEvent.getSource());
        }

    });
});