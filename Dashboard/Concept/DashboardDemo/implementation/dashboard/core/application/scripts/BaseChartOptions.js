var dashboard;
(function (dashboard) {
    (function (charting) {
        var BaseChartOptions = (function () {
            function BaseChartOptions(width, height, margin) {
                this.width = width;
                this.height = height;
                this.margin = margin;
            }
            return BaseChartOptions;
        })();
        charting.BaseChartOptions = BaseChartOptions;        
    })(dashboard.charting || (dashboard.charting = {}));
    var charting = dashboard.charting;
})(dashboard || (dashboard = {}));
