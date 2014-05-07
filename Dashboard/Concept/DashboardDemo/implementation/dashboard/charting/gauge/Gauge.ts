/// <reference path="../../core/application/scripts/utils/logger.ts" />
/// <reference path="models/gaugeOptions.ts" />
/// <reference path="models/gaugeModel.ts" />
/// <reference path="../../core/application/scripts/BaseChartOptions.ts" />
/// <reference path="../../core/application/scripts/BaseChart.ts" />
/// <reference path="../../core/3rdParty/definitions/d3.d.ts" />


module dashboard.campaign.widget.chart {
	export class Gauge extends BaseChart {
		//#region Variables
		private el: string;
		private $el: D3.Selection;
		private raduis: number;
		private cx: number;
		private cy: number;
		private fontSize: number;
		private range: number;
		customOptions: gauge.models.IGaugeOptions;
		//#endregion Variables

		//#region constructor
		constructor(public selectorName: any, options: gauge.models.IGaugeOptions) {
			super();
			this.customOptions = options;
			this.el = selectorName;
			this.$el = d3.select(this.selectorName);

			if (this.customOptions.useParentDimensions)
				this.setDimensions();
			this.raduis = d3.min([this.calculatedWidth(), this.calculatedHeight()]) / 2;

			this.cx = this.calculatedWidth() / 2;
			this.cy = this.calculatedHeight() / 2;
			this.fontSize = Math.round(this.raduis / 9);
		}
		//#endregion constructor

		public initialise() {
		}

		//#region Draw
		public update(model: gauge.models.IGaugeModel): void {
			if (typeof model === "undefined")
				return;

			if (!this.$el.select("svg.loading").empty()) {
				this._handleLoading(true);
				this.render(model);
				return;
			}
			var chart = this.$el.selectAll("svg").selectAll("g.main");

			this._drawPointer(chart, model.data, model.overallRange.to);
		}

		public render(model: gauge.models.IGaugeModel): void {
			if (this.useParentDimensions)
				this.setDimensions();

			if (typeof model === "undefined") {
				this._handleLoading(false);
				return;
			}
			this.range = model.overallRange.to - model.overallRange.from;

			var chart = this.$el
			.append("svg")
			.attr("class", "linechart")
			.attr("width", this.customOptions.width)
			.attr("height", this.customOptions.height)
			.append("g")
			.attr("class", "main")
			.attr("transform", "translate(" + this.customOptions.margin.left + "," + this.customOptions.margin.top + ")");

			this._drawCircles(chart);
			this._drawBands(chart, model);
			this._drawTicks(chart, model.overallRange);
			this._drawPointer(chart, model.data, model.overallRange.to);
			this._drawCenter(chart, model.title, model.overallRange);
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

		private _drawCircles(chart: D3.Selection) {
			chart = chart.append("g").attr("class", "circles");

			chart.append("circle")
				.attr("class", "outer")
				.attr("cx", this.cx)
				.attr("cy", this.cy)
				.attr("r", this.raduis);

			chart.append("circle")
					.attr("class", "inner")
					.attr("cx", this.cx)
					.attr("cy", this.cy)
					.attr("r", 0.9 * this.raduis);
		}

		private _drawBands(chart: D3.Selection, model: gauge.models.IGaugeModel) {
			var self = this;
			chart = chart.append("g").attr("class", "ranges");
			model.ranges.forEach(function (d) {
				self._drawBand(chart, d.from, d.to,  d.name);
			});
		}

		private _drawBand(chart: D3.Selection, start: number, end: number, type: string) {
			var self = this;
			if (0 >= end - start) return;

			chart.append("path")
					.attr("class", type)
					.attr("d", d3.svg.arc()
						.startAngle(this._valueToRadians(start))
						.endAngle(this._valueToRadians(end))
						.innerRadius(0.65 * this.raduis)
						.outerRadius(0.85 * this.raduis))
					.attr("transform", function () { return "translate(" + (self.calculatedWidth() / 2) + ", " + (self.calculatedHeight() / 2) + ") rotate(270)" });
		}

		private _drawTicks(chart: D3.Selection, overAllRange: gauge.models.IRange) {
			var majorLayer = chart.append("g").attr("class", "majorlayer");
			var minorLayer = chart.append("g").attr("class", "minorlayer");
			var majorSize = this.range / (this.customOptions.majorTicks.numberOfTicks);
			for (var i = overAllRange.from; i <= overAllRange.to; i += majorSize) {

				if (this.customOptions.minorTicks.showTick) {
					var minor = majorSize / this.customOptions.minorTicks.numberOfTicks;
					var limit = Math.min(i + majorSize, overAllRange.to);

					if (this.customOptions.majorTicks.showTick === false)
						limit++;
					for (var ix = i + minor; ix < limit; ix += minor) {
						var point1 = this._valueToPoint(ix, 0.75);
						var point2 = this._valueToPoint(ix, 0.85);

						minorLayer.append("line")
							.attr("class", "minorticks")
							.attr("x1", point1.x)
							.attr("y1", point1.y)
							.attr("x2", point2.x)
							.attr("y2", point2.y);
					}
				}

				if (this.customOptions.majorTicks.showTick) {
					var point1 = this._valueToPoint(i, 0.7);
					var point2 = this._valueToPoint(i, 0.85);

					majorLayer.append("line")
						.attr("class", "majorticks")
						.attr("x1", point1.x)
						.attr("y1", point1.y)
						.attr("x2", point2.x)
						.attr("y2", point2.y)
				}
			}
			if (this.customOptions.majorTicks.showLabel) {
				var point = this._valueToPoint(overAllRange.from, 0.63);
				majorLayer.append("svg:text")
						.attr("x", point.x)
						.attr("y", point.y)
						.attr("dy", this.fontSize / 3)
						.attr("text-anchor", majorSize == overAllRange.from ? "start" : "end")
						.text(overAllRange.from)
						.style("font-size", this.fontSize + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");

				point = this._valueToPoint(overAllRange.to, 0.63);
				majorLayer.append("svg:text")
						.attr("x", point.x)
						.attr("y", point.y)
						.attr("dy", this.fontSize / 3)
						.attr("text-anchor", majorSize == overAllRange.from ? "start" : "end")
						.text(overAllRange.to)
						.style("font-size", this.fontSize + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");
			}
		}

		private _drawPointer(chart: D3.Selection, value: number, to: number): void {
			var pointerLayer = chart.selectAll("g.pointerlayer");
			var valueLayer = chart.selectAll("g.valuelayer");
			if (pointerLayer.empty()) {
				pointerLayer = chart.append("g").attr("class", "pointerlayer");
				valueLayer = chart.append("g").attr("class", "valuelayer");
			}

			var point = this.range / 13;
			var head = this._valueToPoint(value, 0.85);
			var head1 = this._valueToPoint(value - point, 0.12);
			var head2 = this._valueToPoint(value + point, 0.12);

			var tailValue = value - (this.range * (1 / (270 / 360)) / 2);
			var tail = this._valueToPoint(tailValue, 0.28);
			var tail1 = this._valueToPoint(tailValue - point, 0.12);
			var tail2 = this._valueToPoint(tailValue + point, 0.12);

			var data = [head, head1, tail2, tail, tail1, head2, head];

			var line = d3.svg.line()
							.x(function (d) { return d.x })
							.y(function (d) { return d.y })
							.interpolate("monotone");

			var pointer = pointerLayer.selectAll("path").data([data]);

			pointer.enter().append("path")
				.attr("d", line);

			pointer.transition().duration(this.customOptions.updateSpeed).ease("circle").attr("d", function (d) { return line(d); });

			var amountLabel = pointerLayer.selectAll("text").data([value]);

			amountLabel.text((d) => Math.round(d));
			amountLabel.enter().append("svg:text")
									.attr("x", this.cx)
									.attr("y", this.cy - this.raduis / 4 - this.fontSize)
									.attr("dy", this.fontSize / 2)
									.attr("text-anchor", "middle")
									.text(Math.round(value))
									.style("font-size", this.fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px");
		}

		private _drawCenter(chart: D3.Selection, title: string, range: gauge.models.IRange): void {
			var layer = chart.append("g").attr("class", "centrelayer");
			layer.append("circle")
				.attr("class", "center")
				.attr("cx", this.cx)
				.attr("cy", this.cy)
				.attr("r", this.raduis * 0.12);

			if (this.customOptions.labelDetails.showLabel) {
				if (typeof title !== "undefined" && title !== "") {

					layer.append("text")
						.attr("x", this.cx)
						.attr("y", this.cy + (this.fontSize * 5))
						.attr("dy", this.fontSize / 2)
						.attr("text-anchor", "middle")
						.text(title)
						.style("font-size", this.fontSize + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");
				}
			}
		}
		//#endregion Draw

		//#region Chart methods

		private _valueToRadians(value: number): number {
			return this._valueToDegrees(value) * Math.PI / 180;
		}

		private _valueToDegrees(value: number): number {
			return value / this.range * 270 - 45;
		}

		private _valueToPoint(value: number, factor: number) {
			var point: gauge.models.IPoint =
			{
				x: this.cx - this.raduis * factor * Math.cos(this._valueToRadians(value)),
				y: this.cy - this.raduis * factor * Math.sin(this._valueToRadians(value))
			}

			return point;
		}
		//#endregion Chart methods
	}
}