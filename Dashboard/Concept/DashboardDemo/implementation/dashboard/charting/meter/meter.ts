/// <reference path="../../core/application/scripts/utils/logger.ts" />
/// <reference path="models/meterOptions.ts" />
/// <reference path="models/meterModel.ts" />
/// <reference path="../../core/application/scripts/BaseChartOptions.ts" />
/// <reference path="../../core/application/scripts/BaseChart.ts" />
/// <reference path="../../core/3rdParty/definitions/d3.d.ts" />


module dashboard.campaign.widget.chart {
    export class Meter extends BaseChart {
        //#region Variables
        private el: string;
        private $el: D3.Selection;
        private raduis: number;
        private cx: number;
        private cy: number;
        private fontSize: number;
        private range: number;
        customOptions: meter.models.IMeterOptions;


        private minAngle: number = -90;
		private maxAngle: number = 90;
		private arc: D3.Arc;
        //#endregion Variables

        //#region constructor
        constructor (public selectorName: any, options: meter.models.IMeterOptions) {
            super();
            this.customOptions = options;
            this.el = selectorName;
            this.$el = d3.select(this.selectorName);

            if (this.customOptions.useParentDimensions)
                this.setDimensions();
            this.raduis = d3.min([this.calculatedWidth(), this.calculatedHeight()]) / 2;

            //this.cx = this.calculatedWidth() / 2;
            //this.cy = this.calculatedHeight() / 2;
            //this.fontSize = Math.round(this.raduis / 9);
            this.range = this.maxAngle - this.minAngle;
        }
        //#endregion constructor

        public initialise() {
        }

        //#region Draw
        public update(model: meter.models.IMeterModel): void {
            if (typeof model === "undefined")
                return;

            if (!this.$el.select("svg.loading").empty()) {
                this._handleLoading(true);
                this.render(model);
                return;
            }
            var chart = this.$el.selectAll("svg").selectAll("g.main");


        }

        public render(model: meter.models.IMeterModel): void {
            if (this.useParentDimensions)
                this.setDimensions();

            if (typeof model === "undefined") {
                this._handleLoading(false);
                return;
            }

            var chart = this.$el
            .append("svg")
            .attr("class", "meterchart")
            .attr("width", this.customOptions.width)
            .attr("height", this.customOptions.height)
            .append("g")
            .attr("class", "main")
            .attr("transform", "translate(" + this.customOptions.margin.left + "," + this.customOptions.margin.top + ")");
        }

        private _handleLoading(remove: bool): void {
            if (remove) {
                this.$el.select("svg.loading").remove();
            }
            else {
                var loadingArea = this.$el.append("svg")
                    .attr("class", "loading")
                    .attr("width", this.customOptions.width)
                    .attr("height", this.customOptions.height);

                loadingArea.append("text").text("Loading")
                    .attr("x", this.cx)
                    .attr("y", this.cy);
            }
        }


        //#region Chart Methods
        private _deg2rad(deg) {
            return deg * Math.PI / 180;
        }

        private _setArc(){
            this.arc = d3.svg.arc
        }
        //#endregion Chart Methods
    }
}