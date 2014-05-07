/// <reference path="http://code.jquery.com/jquery-1.9.1.js" />
/// <reference path="http://ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1.js" />

$(function run() {
    var self = this;

    this.viewModel = {
        campaigns: ko.observableArray(),
        summary: ko.observableArray(["Summary"]),
        snapshot: ko.observableArray(["Snapshot"]),
        report: ko.observableArray(["Report"]),
        getSummary: function (data, event) {
            // Quick and dirty to get id from campaign string
            var id = parseInt(data.split(" ")[0]);
            $.ajax({
                dataType: "json",
                url: "//localhost:11123/api/campaignsummary/" + id,
                success: function (dataItem) {
                    var array = [];
                    $.each(dataItem, function (k, v) { array.push(k + ': ' + v); });
                    self.viewModel.summary(array);
                }
            });
            $.ajax({
                dataType: "json",
                url: "//localhost:11123/api/campaignsnapshot/"+id,
                success: function (dataItem) {
                    var array = [];
                    $.each(dataItem, function (k, v) { array.push(k + ': ' + v); });
                    self.viewModel.snapshot(array);
                }
            });
            $.ajax({
                dataType: "json",
                url: "//localhost:11123/api/campaignreport/" + id,
                success: function (dataItem) {
                    var array = [];
                    $.each(dataItem, function (k, v) { array.push(k + ': ' + v); });
                    self.viewModel.report(array);
                }
            });
        }
    };

    ko.applyBindings(this.viewModel);

    $.ajax({
        dataType: "json",
        url: "//localhost:11123/api/campaignsummary",
        success: function (data) { self.viewModel.campaigns(data); }
    });
});
