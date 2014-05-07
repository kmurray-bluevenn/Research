/// <reference path="models/lineModel.ts" />
/// <reference path="models/lineOptions.ts" />
/// <reference path="../../core/application/scripts/BaseChartOptions.ts" />
/// <reference path="../../core/application/scripts/BaseChart.ts" />
/// <reference path="../../core/3rdParty/definitions/d3.d.ts" />

module dashboard.campaign.widget.chart {
	export class Line extends BaseChart {
		//#region Variables
		private el: string;
		private $el: D3.Selection;
		private xScale: D3.LinearScale;
		private yScale: D3.LinearScale;
		private xAxis: D3.Axis;
		private yAxis: D3.Axis;
		private line: D3.Line;
		private area: D3.Area;
		customOptions: line.models.ILineOptions;

		private _data: any;
		//#endregion Variables

		//#region constructor
		constructor(public selectorName: any, options: line.models.ILineOptions) {
			super();
			this.customOptions = options;
			this.el = selectorName;
			this.$el = d3.select(selectorName);

			if (this.customOptions.useParentDimensions)
				this.setDimensions();
		}
		//#endregion constructor

		//#region Draw
		public update(model: line.models.ILineModel): void {
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


			if (this.customOptions.lineDetails.display) {
				this._updateLines(chart, model);
			}
			if (this.customOptions.circleDetails.display) {
				this._updateCircles(chart, model);
			}
			if (this.customOptions.areaDetails.display) {
				this._updateAreas(chart, model);
			}

			this._updateAxis(chart);
		}

		public render(model: line.models.ILineModel) {
			if (typeof model === "undefined") {
				this._handleLoading(false);
				return;
			}

			var chart = this.$el
				.append("svg")
				.attr("class", "linechart")
				.attr("width", this.customOptions.width)
				.attr("height", this.customOptions.height)
				.append("g")
				.attr("class", "main")
				.attr("transform", "translate(" + this.customOptions.margin.left + "," + this.customOptions.margin.top + ")");

			this._setX(model);
			this._setY(model);

		
			if (this.customOptions.lineDetails.display) {
				this._setLine();
				this._drawLines(chart, model);
			}
			if (this.customOptions.circleDetails.display) {
				this._drawCircles(chart, model);
			}
			if (this.customOptions.areaDetails.display) {
				this._setArea();
				this._drawAreas(chart, model);
			}

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
			chart.selectAll("g.x").transition().duration(this.customOptions.updateSpeed).ease("in-out").call(this.xAxis);
			chart.selectAll("g.y").transition().duration(this.customOptions.updateSpeed).ease("in-out").call(this.yAxis);
		}

		private _drawCircles(chart: D3.Selection, model: line.models.ILineModel): void {
			var self = this;
			var circles = chart.selectAll(".circles")
				.data(model.data)
				.enter()
				.append("g")
				.attr("class", function (d: line.models.IData) { return "circles " + d.key.replace(/ /g, ''); })
				.selectAll("circles")
				.data(function (d) { return d.data; })
				.enter()
				.append("circle")
				.attr("class", "circle")
				.attr("r", 0)
				.attr("cy", function (d) { return self.yScale(d.value); })
				.attr("cx", function (d) { return self.xScale(d.key); });

			circles.transition().duration(this.customOptions.updateSpeed)
				.attr("r", this.customOptions.circleDetails.radius);
		}

		private _updateCircles(chart: D3.Selection, model: line.models.ILineModel): void {
			var self = this;
			var circleArea = chart.selectAll(".circles")
				.data(model.data);
			var circles = circleArea.selectAll("circle.circle")
					.data(function (d) { return d.data; });

			circles.transition().duration(this.customOptions.updateSpeed).attr("cy", function (d) { return self.yScale(d.value); })
				.attr("cx", function (d) { return self.xScale(d.key); });

			circles.enter().append("circle")
				.attr("class", "circle")
				.attr("r", 0)
				.attr("cy", function (d) { return self.yScale(d.value); })
				.attr("cx", function (d) { return self.xScale(d.key); })
				.transition().duration(this.customOptions.updateSpeed)
				.attr("r", this.customOptions.circleDetails.radius);

			circles.exit().remove().transition().duration(this.customOptions.updateSpeed).attr("r", 0);
			circleArea.exit().remove().transition().delay(this.customOptions.updateSpeed);
		}

		private _drawLines(chart: D3.Selection, model: line.models.ILineModel): void {
			var self = this;
			var pathLines = chart.selectAll(".lines")
				.data(model.data)
				.enter()
				.append("g")
				.attr("class", "lines");

			var lines = pathLines.append("path")
			.attr("class", function (d: line.models.IData) { return "line " + d.key.replace(/ /g, ''); })
			.attr("d", function (d: line.models.IData) { return self.line(d.data) });
		}

		private _updateLines(chart: D3.Selection, model: line.models.ILineModel): void {
			var self = this;
			var pathLines = chart.selectAll("g.lines")
				.data(model.data);

			var lines = pathLines.selectAll("path");
			lines.transition().duration(this.customOptions.updateSpeed).ease("in-out").attr("d", function (d: line.models.IData) { return self.line(d.data) });

			pathLines.enter()
			 .append("g")
			 .attr("class", "lines")
			 .append("path")
			 .attr("class", function (d: line.models.IData) { return "line " + d.key.replace(/ /g, ''); })
			 .transition().duration(this.customOptions.updateSpeed).ease("in")
			.attr("d", function (d: line.models.IData) { return self.line(d.data) })

			pathLines.exit().remove().transition().delay(this.customOptions.updateSpeed);
		}

		private _drawAreas(chart: D3.Selection, model: line.models.ILineModel): void {
			var self = this;
			var areas = chart.selectAll(".areas")
				.data(model.data)
				.enter()
				.append("g")
				.attr("class", "areas");

			areas.append("path")
			.attr("class", function (d: line.models.IData) { return "area " + d.key.replace(/ /g, ''); })
			.attr("d", function (d) { return self.area(d.data); });
		}

		private _updateAreas(chart: D3.Selection, model: line.models.ILineModel): void {
			var self = this;
			var pathAreas = chart.selectAll("g.areas")
				.data(model.data);

			var areas = pathAreas.selectAll("path");
			areas.transition().duration(this.customOptions.updateSpeed).ease("in-out").attr("d", function (d: line.models.IData) { return self.area(d.data) });

			pathAreas.enter()
			 .append("g")
			 .attr("class", "areas")
			 .append("path")
			 .attr("class", function (d: line.models.IData) { return "area " + d.key.replace(/ /g, ''); })
			 .transition().duration(this.customOptions.updateSpeed).ease("in")
			 .attr("d", function (d: line.models.IData) { return self.area(d.data) });

			pathAreas.exit().remove().transition().delay(this.customOptions.updateSpeed);
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
		//#endregion Draw

		//#region Chart Methods
		private _setX(model: line.models.ILineModel): void {
			var self = this;

			this.xScale = d3.scale.linear();
			this.xScale.range([0, this.calculatedWidth()]);
			if (this.customOptions.Axis.xAxis.isDateBased) {
				this.xScale.domain([d3.min(model.data, function (obj) { return d3.min(obj.data, function (v) { return v.key; }); }),
				d3.max(model.data, function (obj) { return d3.max(obj.data, function (v) { return v.key; }); })]);
			}
			else
				this.xScale.domain([0, d3.max(model.data, function (obj) { return d3.max(obj.data, function (v) { return v.key; }); })]);

			this.xAxis = d3.svg.axis().scale(this.xScale).orient(this.customOptions.Axis.xAxis.orient.toLowerCase());
			if (typeof this.customOptions.Axis.xAxis.formatMethod !== "undefined" ) {
				if (typeof this.customOptions.Axis.xAxis.isDateBased !== "undefined" && this.customOptions.Axis.xAxis.isDateBased) {
					this.xAxis.tickFormat(function (d) { return self.customOptions.Axis.xAxis.formatMethod(new Date(d)); });
				}
				else {
					this.xAxis.tickFormat(function (d) { return d3.format(self.customOptions.Axis.xAxis.formatMethod); });
				}
			}
		}

		private _setY(model: line.models.ILineModel): void {
			var self = this;
			this.yScale = d3.scale.linear()
				.range([this.calculatedHeight(), 0]);
			this.yScale.domain([
				d3.min(model.data, function (obj) { return d3.min(obj.data, function (v) { return v.value; }); }),
				d3.max(model.data, function (obj) { return d3.max(obj.data, function (v) { return v.value; }); })]);
			this.yAxis = d3.svg.axis().scale(this.yScale).orient(this.customOptions.Axis.yAxis.orient.toLowerCase());

			if (typeof this.customOptions.Axis.yAxis.formatMethod !== "undefined") {
				if (typeof this.customOptions.Axis.yAxis.isDateBased !== "undefined") {
					this.yAxis.tickFormat(function (d) { return self.customOptions.Axis.yAxis.formatMethod(new Date(d)); });
				}
				else {
					this.yAxis.tickFormat(function (d) { return self.customOptions.Axis.yAxis.formatMethod; });
				}		
			}
		}

		private _setLine(): void {
			var self = this;
			this.line = d3.svg.line()
				.interpolate("linear")
				.x(function (d: line.models.IKVP) { return self.xScale(d.key); })
				.y(function (d: line.models.IKVP) { return self.yScale(d.value); });
		}

		private _setArea(): void {
			var self = this;
			this.area = d3.svg.area()
				.x(function (d: line.models.IKVP) { return self.xScale(d.key); })
				.y1(function (d: line.models.IKVP) { return self.yScale(d.value); })
				.y0(this.calculatedHeight());
		}
		//#endregion Chart Methods

		//#region Data Methods
		private _elementValue(x: number): number;
		private _elementValue(x: line.models.IKVP): number;
		private _elementValue(x: any): number {
			if (typeof x === "number")
				return x;
			return x.value;
		}

		private _elementKey(x: number): string;
		private _elementKey(x: string): string;
		private _elementKey(x: line.models.IKVP): string;
		private _elementKey(x: any): string {
			if (typeof x === "number" || typeof x === "string")
				return x.toString();
			return x.key;
		}

		private _maxValue(data: line.models.IKVP[]): number;
		private _maxValue(data: number[]): number;
		private _maxValue(data: any[]): number {
			if (typeof data !== "undefined" && data.length == 0)
				return 0;
			var self = this;
			return Math.max.apply(Math, data.map((d) => { return self._elementValue(d); }));
		}

		private _elementSort(a: line.models.IKVP, b: line.models.IKVP);
		private _elementSort(a: number, b: number);
		private _elementSort(a: any, b: any) {
			return d3.descending(((typeof a === "number") ? a : a.value), ((typeof b === "number") ? b : b.value));
		}

		private _bulletTranslate(x: line.models.IKVP);
		private _bulletTranslate(x: number);
		private _bulletTranslate(x: any) {
			var self = this;
			return (d) => { return "translate(" + self.xScale(self._elementValue(d)) + ",0)"; };
		}
		//#endregion Data Methods
	}
}