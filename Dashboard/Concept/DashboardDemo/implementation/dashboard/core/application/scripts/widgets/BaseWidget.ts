/// <reference path="../../../3rdParty/definitions/jquery.d.ts" />
/// <reference path="../../../3rdParty/definitions/underscore-typed.d.ts" />
/// <reference path="../interfaces/dashboardInterfaces.ts" />
module dashboard.campaign.widget {
	export class BaseWidget implements IWidget {
		_initialised: bool = false;
		id: number;
		el: string;
		$el: JQuery;
		chartIds: number[];
		charts: chart.IBaseChart[] = [];
		indexOrder: number;
		dataManager: IDataManager;
		width: number;
		height: number;

		constructor(dataManager: IDataManager) {
			this.dataManager = dataManager;
		}

		public addCharts() {
			throw new Error('abstract method, override in derived class');
		}

		public initialise(el: string) {
			this.el = el;
			this.$el = $("#" + this.el);
			this._wirePubSub();
			this.addCharts();
			this._initialised = true;
		}

		public _wirePubSub() {
			this.dataManager.subscribe(SubscriptionType.Chart, SubscriptionOperation.Delete, this._deleteChart);
		}

		public _deleteChart(message: string, id: number) {
			// TODO: Delete the specified Chart from the internal array
		}

		/// <summary>
		/// Renders the current widget
		/// </summary>
		public render(): void {
		}

		/// <summary>
		/// Adds a new chart to the charts array
		/// </summary>
		public addChart(chart: chart.IBaseChart): void {
			// Make sure we don't duplicate any element ids
			var ticks = new Date().getTime();
			while (_.some(this.charts, (element: chart.IBaseChart) => { return element.el == "c" + ticks; }))
				ticks = new Date().getTime();

			chart.el = "c" + ticks;

			// Create a div for the chart
			this.$el.append("<div id='" + chart.el + "' class='chart'></div>");

			// Prepaire the chart and allow it to run it's initialise method
			chart._prepareChart();

			this.dataManager.subscribe(SubscriptionType.Campaign, SubscriptionOperation.Update, chart.processData);

			this.charts.push(chart);
			this._reOrderCharts();
		}

		/// <summary>
		/// Removes the specified chart from the charts array
		/// </summary>
		public removeChart(chart: chart.IBaseChart): void {
			if (typeof this.charts === "undefined" || this.charts.length == 0)
				return;

			var originalSize = this.charts.length;

			// Call the charts dispose method to allow it to unsubscribe to events etc.
			chart.dispose();
			this.charts = _.reject(this.charts, (element: chart.IBaseChart) => { return element === chart; });

			if (originalSize != this.charts.length)
				this._reOrderCharts();
		}

		private _reOrderCharts(): void {
			if (this.charts.length > 0) {
				// First re-order them by there own index
				this.charts = _.sortBy(this.charts, (element: widget.chart.IBaseChart) => { return element.indexOrder; });

				// Then re-number the order indexes incase some have been added or removed
				_.all(this.charts, (item: chart.IBaseChart, index?: number) => { item.indexOrder = index; });
			}
		}
	}
}