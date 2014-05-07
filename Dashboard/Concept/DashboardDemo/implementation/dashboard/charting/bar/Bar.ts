/// <reference path="models/barOptions.ts" />
/// <reference path="models/barModel.ts" />
/// <reference path="../../core/application/scripts/BaseChartOptions.ts" />
/// <reference path="../../core/application/scripts/BaseChart.ts" />
/// <reference path="../../core/3rdParty/definitions/d3.d.ts" />


module dashboard.campaign.widget.chart {
	export class Bar extends BaseChart {
		//#region Variables
		private el: string;
		private $el: D3.Selection;
		private xScale: D3.OrdinalScale;
		private yScale: D3.LinearScale;
		private xAxis: D3.Axis;
		private yAxis: D3.Axis;
		private line: D3.Line;
		private area: D3.Area;
		customOptions: bar.models.IBarOptions;
		//#endregion Variables

		//#region constructor
		constructor(public selectorName: any, options: bar.models.IBarOptions) {
			super();
			this.customOptions = options;
			this.el = selectorName;
			this.$el = d3.select(this.selectorName);

			if (this.customOptions.useParentDimensions)
				this.setDimensions();
		}
		//#endregion constructor

		public initialise() {
		}
		//#region Draw
		public update(model: bar.models.IBarModel): void {
			if (typeof model === "undefined")
				return;

			if (!this.$el.select("svg.loading").empty()) {
				this._handleLoading(true);
				this.render(model);
				return;
			}

			this._setX(model);
			this._setY(model);

			var chart = this.$el
				.selectAll("g.main");

			this._updateBars(chart.selectAll("g.rectGroup"), model)
			this._updateAxis(chart);
		}

		public render(model: bar.models.IBarModel): void {
			if (this.useParentDimensions)
				this.setDimensions();

			if (typeof model === "undefined") {
				this._handleLoading(false);
				return;
			}
			this._setX(model);
			this._setY(model);

			var chart = this.$el
			.append("svg")
			.attr("class", "linechart")
			.attr("width", this.customOptions.width)
			.attr("height", this.customOptions.height)
			.append("g")
				.attr("class", "main")
			.attr("transform", "translate(" + this.customOptions.margin.left + "," + this.customOptions.margin.top + ")");

			this._drawBars(chart, model);
			this._drawAxis(chart, model.xName, model.yName);
		}

		private _drawAxis(chart: D3.Selection, xLabel: string, yLabel: string): void {
			var self = this;

			var x = chart.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + this.calculatedHeight() + ")")
				.call(this.xAxis);

			var y = chart.append("g")
				.attr("class", "y axis")
				.call(this.yAxis);

			if (this.customOptions.Axis.yAxis.displayLabel && (typeof yLabel !== "undefined"))
				y.append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yLabel);
			if (this.customOptions.Axis.xAxis.displayLabel && (typeof xLabel !== "undefined"))
				x.append("text").attr("x", this.calculatedWidth()).attr("y", -10).attr("dy", ".71em").style("text-anchor", "end").text(xLabel);
		}

		private _updateAxis(chart: D3.Selection): void {
			chart.selectAll("g.x").transition().duration(this.customOptions.updateSpeed).ease("out").call(this.xAxis);
			chart.selectAll("g.y").transition().duration(this.customOptions.updateSpeed).ease("in-out").call(this.yAxis);
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
					.attr("x", this.calculatedWidth() / 2)
					.attr("y", this.calculatedHeight() / 2);
			}
		}

		private _drawBars(chart: D3.Selection, model: bar.models.IBarModel) {
			var self = this;

			chart = chart.append("g").attr("class", "rectGroup");

			var bar = chart.selectAll(".bar")
				.data(model.data)

			bar.enter().append("rect")
				.attr("class", function (d: bar.models.IKVP) { return "bar " + d.key; })
				.attr("x", function (d: bar.models.IKVP) { return self.xScale(d.key); })
				.attr("width", this.xScale.rangeBand())
				.attr("y", self.calculatedHeight())
				.attr("height", 0)
				.transition().duration(this.customOptions.updateSpeed)
				.attr("y", function (d: bar.models.IKVP) { return self.yScale(d.value); })
				.attr("height", function (d: bar.models.IKVP) { return self.calculatedHeight() - self.yScale(d.value); });
		}

		private _updateBars(chart: D3.Selection, model: bar.models.IBarModel) {
			var self = this;

			var bar = chart.selectAll("rect").data(model.data);

			bar.transition().duration(this.customOptions.updateSpeed)
				.attr("x", function (d: bar.models.IKVP) { return self.xScale(d.key); })
				.attr("y", function (d: bar.models.IKVP) { return self.yScale(d.value); })
				.attr("height", function (d: bar.models.IKVP) { return self.calculatedHeight() - self.yScale(d.value); })
				.attr("width", this.xScale.rangeBand());

			bar.enter().append("rect")
				.attr("class", "bar")
				.attr("x", function (d: bar.models.IKVP) { return self.calculatedWidth(); })
				.attr("width", 0)
				.attr("y", self.calculatedHeight())
				.attr("height", 0)
				.transition().duration(this.customOptions.updateSpeed)
				.attr("y", function (d: bar.models.IKVP) { return self.yScale(d.value); })
				.attr("height", function (d: bar.models.IKVP) { return self.calculatedHeight() - self.yScale(d.value); })
				.attr("width", this.xScale.rangeBand()).attr("x", function (d: bar.models.IKVP) { return self.xScale(d.key); });

			bar.exit()
				.transition()
				.duration(this.customOptions.updateSpeed)
				.attr("height", 0)
				.attr("width", 0)
				.attr("y", this.calculatedHeight())
				.attr("x", this.calculatedWidth())
				.remove();



		}
		//#endregion Draw

		//#region Chart methods
		private _setX(model: bar.models.IBarModel): void {
			var self = this;

			this.xScale = d3.scale.ordinal().rangeRoundBands([0, this.calculatedWidth()], .1);

			this.xScale.domain(model.data.map(function (d) { return d.key; }));

			this.xAxis = d3.svg.axis().scale(this.xScale).orient(this.customOptions.Axis.xAxis.orient.toLowerCase());
			if (typeof this.customOptions.Axis.xAxis.formatMethod !== "undefined" && this.customOptions.Axis.xAxis.formatMethod !== "") {
				if (typeof this.customOptions.Axis.xAxis.isDateBased !== "undefined" && this.customOptions.Axis.xAxis.isDateBased) {
					this.xAxis.tickFormat(function (d) { return self.customOptions.Axis.xAxis.formatMethod(new Date(d)); });
				}
				else {
					if (typeof this.customOptions.Axis.xAxis.formatMethod !== "undefined")
						this.xAxis.tickFormat(function (d) { return self.customOptions.Axis.xAxis.formatMethod; });
				}
			}
		}

		private _setY(model: bar.models.IBarModel): void {
			this.yScale = d3.scale.linear()
			.range([this.calculatedHeight(), 0]);
			this.yScale.domain([
			0,
				d3.max(model.data, (obj: bar.models.IKVP) => { return obj.value; })]);
			this.yAxis = d3.svg.axis().scale(this.yScale).orient(this.customOptions.Axis.yAxis.orient.toLowerCase());

			if (typeof this.customOptions.Axis.yAxis.formatMethod !== "undefined" && this.customOptions.Axis.yAxis.formatMethod !== "") {
				if (typeof this.customOptions.Axis.yAxis.isDateBased !== "undefined" && this.customOptions.Axis.yAxis.isDateBased) {
					this.yAxis.tickFormat(function (d) { return this.customOptions.Axis.yAxis.formatMethod(new Date(d)); });
				}
				else {
					if (typeof this.customOptions.Axis.yAxis.formatMethod !== "undefined")
						this.yAxis.tickFormat(function (d) { return this.customOptions.Axis.yAxis.formatMethod; });
				}
			}
		}
		//#endregion Chart methods
	}
}