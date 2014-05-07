/// <reference path="models/donutOptions.ts" />
/// <reference path="models/donutModel.ts" />
/// <reference path="../../core/application/scripts/BaseChart.ts" />
/// <reference path="../../core/3rdParty/definitions/jquery.d.ts" />
/// <reference path="../../core/3rdParty/definitions/d3.d.ts" />

module dashboard.campaign.widget.chart {
	export class Donut extends BaseChart {
		//#region Variables
		radius: number;
		color: D3.OrdinalScale;
		pie: D3.PieLayout;
		arc: D3.Arc;
		svg: any;
		svgChart: any;
		svgLabels: any;
		oldVals: donut.models.IDonutModel[];
		data: donut.models.IDonutModel[] = [];
		customOptions: donut.models.IDonutOptions;
		//#endregion Variables

		//#region Constructor
		constructor(options: donut.models.IDonutOptions, formatData: (data: any) => donut.models.IDonutModel[]) {
			super();
			this.formatData = formatData;
			this.customOptions = options;
		}
		//#endregion Constructor

		// Override initialise
		public initialise() : void {
			// width is *0.5 because we want to save half for the labels
			this.radius = Math.min(this.customOptions.width * 0.5, this.customOptions.height) / 2;
			this.color = d3.scale.category20();
			this.pie = d3.layout.pie().sort(null);
			var pieChart = this.customOptions.pieChart || false;
			var radius = pieChart ? 0 : this.radius * 0.35;
			this.arc = d3.svg.arc().innerRadius(radius).outerRadius(this.radius * 0.95);
		}

		public processData(message: string, data: any): void {
			this.data = this.formatData(data);
			if (typeof this.oldVals === "undefined")
				this.render(this.data);
			else
				this.update(this.data);
		}

		public render(data: donut.models.IDonutModel[]): void {
			this.svg = d3.select("#" + this.el)
				.append("svg")
				.attr("width", this.customOptions.width)
				.attr("height", this.customOptions.height);

			this.svgChart = this.svg
				.append("g")
				.attr("contains", "pieChart")
				.attr("transform", "translate(" + this.customOptions.width / 4 + "," + this.customOptions.height / 2 + ")");

			this.svgLabels = this.svg
				.append("g")
				.attr("contains", "labels")
				.attr("transform", "translate(" + this.customOptions.width / 2 + ",0)");

			this._addTextLabels();

			// Initially set the oldVals
			this.oldVals = this.data;

			// Draw them
			this.update(this.data);
		}

		update(data: donut.models.IDonutModel[]) {
			// Clear old selection down
			this.svgChart.selectAll("path").remove();

			// Create a couple of number arrays for the from and to values for the transition
			var oldMapped = this.oldVals.map((v) => { return v.value; });
			var dataMapped = this.data.map((v) => { return v.value; });

			// Create new selection
			var bob = this.svgChart.selectAll("path")
				.data(this.pie(oldMapped))
				.enter()
				.append("path");

			if (typeof this.customOptions.colours !== "undefined" && this.customOptions.colours.length >= this.data.length)
				bob = bob.attr("class", (d, i) => { return this.customOptions.colours[i]; });
			else
				bob = bob.attr("fill", (d, i) => { return this.color(i); });

			bob.attr("d", this.arc)
				.transition()
				.duration(this.customOptions.updateDuration)
				.attrTween("d", (a, index) => {
					var i = d3.interpolate(a, this.pie(dataMapped)[index]);
					return (t) => { return this.arc(i(t)); };
				});
				// Add the text and keys to the chart
			this._addTextLabels();

			// Store the new values as old ones for next possible transition
			this.oldVals = this.data;
		}

		public dispose(): void {
			// Unsubscribe from subs
		}

		_addTextLabels() {
			this.svgLabels.selectAll("text").remove();
			this.svgLabels.selectAll("rect").remove();
			var data = [];
			var numLines = this.data.length;
			var gap = this.customOptions.height / (numLines + 1);
			for (var i = 0; i < numLines; ++i)
				data.push({ nv: this.data[i], ypos: (i + 1) * gap });

			var boxWidth = gap / 2;

			var allItems = this.svgLabels.selectAll("g")
				.data(data)
				.enter()
				.append("rect");

			var boxWidth = gap / 2;
			allItems
				.attr("x", boxWidth)
				.attr("y", (a) => { return a.ypos - boxWidth * 0.75; })
				.attr("width", boxWidth)
				.attr("height", boxWidth);

			if (typeof this.customOptions.colours !== "undefined" && this.customOptions.colours.length >= this.data.length)
				allItems = allItems.attr("class", (d, i) => { return this.customOptions.colours[i]; });
			else
				allItems = allItems.attr("fill", (d, i) => { return this.color(i); });

			allItems = this.svgLabels.selectAll("g")
				.data(data)
				.enter()
				.append("text")
				.attr("x", boxWidth*2.2)
				.attr("y", (a) => { return a.ypos; })
				.text(function (a) {
					return a.nv.key + " ( " + a.nv.value + " )";
				});
		}
	}
}
