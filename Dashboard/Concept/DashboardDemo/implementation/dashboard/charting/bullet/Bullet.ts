/// <reference path="models/bulletModel.ts" />
/// <reference path="models/bulletOptions.ts" />
/// <reference path="../../core/application/scripts/BaseChart.ts" />
/// <reference path="../../core/3rdParty/definitions/d3.d.ts" />

module dashboard.campaign.widget.chart {
	export class Bullet extends BaseChart {
		//#region Variables
		customOptions: bullet.models.IBulletOptions;
		private el: string;
		private $el: JQuery;
		private __chart__: any;
		private x1: D3.LinearScale;
		private x0: D3.LinearScale;
		private w1: Function;
		private w0: Function;
		private haveRendered: bool = false;
		//#endregion Variables

		//#region Constructor
		constructor(selectorName: string, options: bullet.models.IBulletOptions, formatData: (data: any) => any) {
			super();
			this.formatData = formatData;
			this.customOptions = options;
			this.el = selectorName;
			this.$el = $("#" + this.el);
			if (this.useParentDimensions)
				this.setDimensions();
		}
		//#endregion Constructor

		public processData(message: string, data: any): void {
			this.data = this.formatData(data);
			if (!this.haveRendered) {
				this.haveRendered = true;
				this.render(this.data);
			}
			this.update(this.data);
		}

		public initialise() {
			// Noting to do here, but required as is abstract in base
		}

		public dispose(): void {
			// Unsubscribe from subs
		}

		//#region Draw
		public render(model: bullet.models.IBulletModel): void {
			if (typeof model === "undefined") {
				this._handleLoading(false);
				return;
			}

			this._sortData(model);

			// Compute the new x-scale.
			this._setX1(this._maxValue(model.ranges, model.markers, model.measures));
			this._setX0();

			// Stash the new scale.
			this.__chart__ = this.x1;

			// Derive width-scales from the x-scales.
			this.w1 = this._bulletWidth(this.x1);
			this.w0 = this._bulletWidth(this.x0);

			var svg = d3.select("#" + this.el).selectAll("svg")
							.data([model])
							.enter().append("svg")
							.attr("class", "bullet")
							.attr("width", this.customOptions.width)
							.attr("height", this.customOptions.height)
							.append("g")
							.attr("transform", "translate(" + this.customOptions.margin.left + "," + this.customOptions.margin.top + ")");

			if (typeof model.ranges !== "undefined")
				this._drawRanges(svg, model.ranges);

			if (typeof model.measures !== "undefined")
				this._drawMeasures(svg, model.measures);

			if (typeof model.markers !== "undefined")
				this._drawMarkers(svg, model.markers);

			this._drawTitle(svg);

			this._drawTicks(svg);
		}

		public update(model: bullet.models.IBulletModel): void {
			if (typeof model === "undefined")
				return;

			if (!d3.select("#" + this.el).select("svg.loading").empty()) {
				this._handleLoading(true);
				this.render(model);
				return;
			}

			this._sortData(model);
			var svg = d3.select("#" + this.el).selectAll("svg").data([model]).select("g");

			// Compute the new x-scale.
			this._setX1(this._maxValue(model.ranges, model.markers, model.measures));
			this._setX0();

			// Stash the new scale.
			this.__chart__ = this.x1;
			// Derive width-scales from the x-scales.
			this.w0 = this._bulletWidth(this.x0);
			this.w1 = this._bulletWidth(this.x1);

			if (typeof model.ranges !== "undefined")
				this._drawRanges(svg, model.ranges);

			if (typeof model.measures !== "undefined")
				this._drawMeasures(svg, model.measures);

			if (typeof model.markers !== "undefined")
				this._drawMarkers(svg, model.markers);

			this._drawTitle(svg);
			this._drawTicks(svg);
		}

		private _handleLoading(remove: bool): void {
			if (remove) {
				d3.select("#" + this.el).select("svg.loading").remove();
				return;
			}
			var loadingArea = d3.select("#" + this.el).append("svg")
				.attr("class", "loading")
				.attr("width", this.customOptions.width)
				.attr("height", this.customOptions.height);

			loadingArea.append("text").text("Loading")
				.attr("x", this.calculatedWidth() / 2)
				.attr("y", this.calculatedHeight() / 2);
		}

		private _drawRanges(svg: any, ranges: any[]): void {
			var self = this;

			// Update the range rects.
			var range = svg.selectAll("rect.range")
							.data(ranges);

			range.enter().append("rect")
							.attr("class", function (d, i) { return "range s" + i; })
							.attr("width", this.w0)
							.attr("height", this.calculatedHeight())
							.attr("x", function (d) { return self.customOptions.reverse ? self.x0(self._elementValue(d)) : 0 })
							.transition()
							.duration(this.customOptions.updateDuration)
							.attr("width", this.w1)
							.attr("x", function (d) { return self.customOptions.reverse ? self.x1(self._elementValue(d)) : 0 });

			range.transition()
							.duration(this.customOptions.updateDuration)
							.attr("x", function (d) { return self.customOptions.reverse ? self.x1(self._elementValue(d)) : 0 })
							.attr("width", this.w1)
							.attr("height", this.calculatedHeight());

			if (this.customOptions.showRangeLabel && typeof ranges[0] !== "number") {
				range.selectAll("title").remove();
				range.append("svg:title").text(function (d) { return d.label; });
			}
		}

		private _drawMeasures(svg: any, measures: any[]): void {
			var self = this;

			var measure = svg.selectAll("rect.measure")
											.data(measures);

			measure.enter().append("rect")
							.attr("class", function (d, i) { return "measure s" + i; })
							.attr("width", this.w0)
							.attr("height", this.calculatedHeight() / 3)
							.attr("x", function (d) { return self.customOptions.reverse ? self.x0(self._elementValue(d)) : 0 })
							.attr("y", this.calculatedHeight() / 3)
							.transition()
							.duration(this.customOptions.updateDuration)
							.attr("width", this.w1)
							.attr("x", function (d) { return self.customOptions.reverse ? self.x1(self._elementValue(d)) : 0 });

			measure.transition()
							.duration(this.customOptions.updateDuration)
							.attr("width", this.w1)
							.attr("height", this.calculatedHeight() / 3)
							.attr("x", function (d) { return self.customOptions.reverse ? self.x1(self._elementValue(d)) : 0 })
							.attr("y", this.calculatedHeight() / 3);
			if (this.customOptions.showMeasureLabel && typeof measures[0] !== "number") {
				measure.selectAll("title").remove();
				measure.append("svg:title").text(function (d) { return d.label; });
			}
		}

		private _drawMarkers(svg: any, markers: any[]): void {
			var self = this;
			var marker = svg.selectAll("line.marker")
					 .data(markers);

			marker.enter().append("line")
							.attr("class", "marker")
							.attr("x1", function (d) { return self.x0(self._elementValue(d)); })
							.attr("x2", function (d) { return self.x0(self._elementValue(d)); })
							.attr("y1", this.calculatedHeight() / 6)
							.attr("y2", this.calculatedHeight() * 5 / 6)
							.transition()
							.duration(this.customOptions.updateDuration)
							.attr("x1", function (d) { return self.x1(self._elementValue(d)); })
							.attr("x2", function (d) { return self.x1(self._elementValue(d)); });

			marker.transition()
							.duration(this.customOptions.updateDuration)
							.attr("x1", function (d) { return self.x1(self._elementValue(d)); })
							.attr("x2", function (d) { return self.x1(self._elementValue(d)); })
							.attr("y1", this.calculatedHeight() / 6)
							.attr("y2", this.calculatedHeight() * 5 / 6);

			if (this.customOptions.showMarkerLabel && typeof markers[0] !== "number") {
				marker.selectAll("title").remove();
				marker.append("svg:title").text(function (d) { return d.label; });
			}
		}

		private _drawTitle(svg: any): void {
			svg.selectAll("g.titles").remove();
			var title = svg.append("g").attr("class", "titles");
			title.append("text")
							.attr("class", "title")
							.attr("x", "0")
							.attr("y", "0")
							.text(function (d) { return d.title; });

			title.append("text")
							.attr("class", "subtitle")
							.style("text-anchor", "end")
							.attr("x", this.calculatedWidth())
							.attr("y", "0")
							.text(function (d) { return d.subtitle; });
		}

		private _drawTicks(svg: any): void {
			// Compute the tick format.
			var format = this.x1.tickFormat(8);
			var height = this.calculatedHeight();

			// Update the tick groups.
			var tick = svg.selectAll("g.tick")
							.data(this.x1.ticks(8), function (d) {
								return this.textContent || format(d);
							});

			// Initialize the ticks with the old scale, x0.
			var tickEnter = tick.enter().append("g")
							.attr("class", "tick")
							.attr("transform", this._bulletTranslate(this.x0))
							.style("opacity", 1e-6);

			tickEnter.append("line")
							.attr("y1", height)
							.attr("y2", height * 7 / 6);

			var self = this;
			tickEnter.append("text")
							.attr("text-anchor", "middle")
							.attr("dy", "1em")
							.attr("y", height * 7 / 6)
							.text(function (d) { return format(d) + "" + self.customOptions.tickPostfix; })

			// Transition the entering ticks to the new scale, x1.
			tickEnter.transition()
							.duration(this.customOptions.updateDuration)
							.attr("transform", this._bulletTranslate(this.x1))
							.style("opacity", 1);

			// Transition the updating ticks to the new scale, x1.
			var tickUpdate = tick.transition()
							.duration(this.customOptions.updateDuration)
							.attr("transform", this._bulletTranslate(this.x1))
							.style("opacity", 1);

			tickUpdate.select("line")
							.attr("y1", height)
							.attr("y2", height * 7 / 6);

			tickUpdate.select("text")
							.attr("y", height * 7 / 6);

			// Transition the exiting ticks to the new scale, x1.
			tick.exit()
							.transition()
							.duration(this.customOptions.updateDuration)
							.attr("transform", this._bulletTranslate(this.x1))
							.style("opacity", 1e-6)
							.remove();

			d3.timer.flush();
		}
		//#endregion Draw

		//#region Data methods
		private _sortData(model: bullet.models.IBulletModel): void {
			if (typeof model.ranges !== "undefined")
				model.ranges.sort(this._elementSort);
			if (typeof model.markers !== "undefined")
				model.markers.sort(this._elementSort);
			if (typeof model.measures !== "undefined")
				model.measures.sort(this._elementSort);
		}

		private _maxValue(range, marker, measure): number {
			var maxRange = [];
			if (typeof range !== "undefined" && typeof range[0] !== "undefined")
				maxRange.push(this._elementValue(range[0]));
			if (typeof marker !== "undefined" && typeof marker[0] !== "undefined")
				maxRange.push(this._elementValue(marker[0]));
			if (typeof measure !== "undefined" && typeof measure[0] !== "undefined")
				maxRange.push(this._elementValue(measure[0]));

			if (maxRange.length === 0)
				return 0;

			return Math.max.apply(null, maxRange);
		}

		private _elementValue(x: number): number;
		private _elementValue(x: any):number {
			if (typeof x === "number")
				return x;
			return x.value;
		}
		//#endregion Data methods

		//#region Chart methods
		private _elementSort(a, b): number {
			return d3.descending(((typeof a === "number") ? a : a.value), ((typeof b === "number") ? b : b.value));
		}

		private _bulletWidth(x): Function {
			var x0 = x(0);
			var self = this;
			return (d) => Math.abs(x(self._elementValue(d)) - x0);
		}

		private _bulletTranslate(x): Function {
			var self = this;
			return (d) => "translate(" + x(self._elementValue(d)) + ",0)";
		}

		public _setX1(maxValue: number): void {
			this.x1 = d3.scale.linear()
							.domain([0, maxValue])
							.range(this.customOptions.reverse ? [this.calculatedWidth(), 0] : [0, this.calculatedWidth()]);
		}

		public _setX0(): void {
			this.x0 = this.__chart__ || d3.scale.linear()
							.domain([0, Infinity])
							.range(this.x1.range());
		}
		//#endregion Chart methods
	}
}
