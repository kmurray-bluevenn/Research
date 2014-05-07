/// <reference path="../../3rdParty/definitions/underscore-typed.d.ts" />
/// <reference path="interfaces/dashboardInterfaces.ts" />

module dashboard.campaign.widget.chart {
	// Class
	export class BaseChart implements IBaseChart {
		public el: string;
		public $el: JQuery;
		public id: number;
		public token: string;
		public data: any;
		public indexOrder: number;
		public useParentDimensions: bool = false;
		public customOptions: IBaseChartOptions;
		public hasInitialised: bool = false;
		public formatData: (data: any) => any;

		public calculatedWidth(): number {
			return this.customOptions.width - this.customOptions.margin.left - this.customOptions.margin.right;
		}

		public calculatedHeight(): number {
			return this.customOptions.height - this.customOptions.margin.top - this.customOptions.margin.bottom;
		}

		public setDimensions(): void {
			this.customOptions.width = parseInt($(this.el).css("width").match(/\d+/g)[0]);
			this.customOptions.height = parseInt($(this.el).css("height").match(/\d+/g)[0]);
		}

		public _prepareChart(): void {
			_.bindAll(this, "_prepareChart", "initialise", "processData", "render", "update", "formatData", "dispose");

			// Maybe useParentDimensions should be set at a different time?
			if (this.customOptions.width == undefined && this.customOptions.width == undefined)
				this.useParentDimensions = true;

			this.$el = $("#" + this.el);

			if (!this.hasInitialised)
				this.initialise();

			this.hasInitialised = true;
		}

		//#region abstract methods

		public initialise() {
			// You should subscribe in here and prepare any one time calculated variables
			throw new Error('initialise is an abstract method, override in derived class');
		}

		// Called when data gets published
		public processData(message: string, data: any): void {
			// You should call formatData and then call render or update in here
			// so you may want to display a loading as well
			throw new Error('processData is an abstract method, override in derived class');
		}

		// Called to render the chart
		public render(data: any): void {
			// You should render your chart in here, not assuming valid data
			// so you may want to display a loading as well
			throw new Error('render is an abstract method, override in derived class');
		}

		// Called when an update to the chart is required
		public update(data: any): void {
			// This should be in your subscriptions and called when the data changes
			throw new Error('update is an abstract method, override in derived class');
		}

		public dispose(): void {
			throw new Error('dispose is an abstract method, override in derived class');
		}

		//#endregion
	}
}
