/// <reference path="../../3rdParty/definitions/pubsub.d.ts" />
/// <reference path="utils/logger.ts" />
/// <reference path="../../3rdParty/definitions/underscore.d.ts" />
/// <reference path="../../3rdParty/definitions/jquery.d.ts" />
/// <reference path="interfaces/dashboardInterfaces.ts" />

module dashboard {
	export class DataManager implements IDataManager {
		private activeCampaign: number;
		private timerId: number;
		private tokenCollection: {
			campaigns: string[];
			widgets: string[];
			charts: string[];
		};
		private _currentCampaign: number;
		private _applicationRestUrl: string = "http://localhost:45977/";
		private _baseUrl: string = "//localhost:11123/api/";

		constructor(private updateInterval: number) {
			_.bindAll(this, "getCampaignData");
			this.setupSubscriptions();
		}

		private getCampaignData(): void {
			// Clear down timeout incase we were initiated by moving to a different campaign
			window.clearTimeout(this.timerId);

			// Load data for campaign 'activeCampaign'
			this.load(this._getUrl("campaigndata", this.activeCampaign), (data: any) => {
				this.publish(SubscriptionType.Campaign, SubscriptionOperation.Update, data);
				// Reset the timer for the next lot of data
				this.timerId = window.setTimeout(this.getCampaignData, this.updateInterval);
			});
		}

		/// <summary>
		/// A way to keep all the urls in one place.
		/// The way it extracts them can be changed, but they should all come
		/// through here.
		/// </summary>
		private _getUrl(name: string, id?: number): string;
		private _getUrl(name: string, id?: string): string;
		private _getUrl(name: string, id?: any): string {
			var final = "";
			if (typeof id !== "undefined")
				final = "/" + id;
			switch (name.toLowerCase()) {
				case "campaigndata":
					return this._baseUrl + "campaigndata" + final;
				case "userdetails":
					return this._applicationRestUrl + "userdetails" + final;
				case "campaign":
					return this._applicationRestUrl + "campaign" + final;
				case "widget":
					return this._applicationRestUrl + "widget" + final;
				case "manifest":
					return this._applicationRestUrl + "manifest" + final;
			}
		}

		/// <summary>
		/// </summary>
		public setupSubscriptions(): void {
			// Every time we receive some data we want to reset the timer
			this.subscribe(SubscriptionType.Campaign, SubscriptionOperation.Update, (data: any) => {
				// Reset the timer for next update
				this.timerId = window.setTimeout(this.getCampaignData, this.updateInterval);
			});
		}

		/// <summary>
		/// </summary>
		public subscribe(subType: SubscriptionType, subOp: SubscriptionOperation, callback: (data: any) => void ): void {
			var subText: string = SubscriptionType['_map'][subType] + '.' + SubscriptionOperation['_map'][subOp];
			PubSub.subscribe(subText, callback);
		}

		private publish(subType: SubscriptionType, subOp: SubscriptionOperation, data: any): void {
			var subText: string = SubscriptionType['_map'][subType] + '.' + SubscriptionOperation['_map'][subOp];
			PubSub.publish(subText, data);
		}

		/// <summary>
		/// </summary>
		public setActiveCampaign(campaignId: number): void {
			this.activeCampaign = campaignId;
			this.getCampaignData();
		}

		public loadCampaignData(callback: (data: { id: number; name: string; }[]) => void ): void {
			this.load(this._getUrl("campaigndata"), callback);
		}

		/// <summary>
		/// </summary>
		public getWidgets(campaignId: number, addWidgetCallback: (widget: campaign.widget.IWidget) => void): void {
			this.load(this._getUrl("campaign", campaignId), (data: any) => {
				_.each(data.widgetIds, (widgetId) => {
					this.readWidget(widgetId, (widget: campaign.widget.IWidget) => {
						if (typeof widget === "undefined") {
							Logger.warn("Unable to create widget with id: "+widgetId);
							return;
						}
						addWidgetCallback(widget);
					});
				});
			});
		}

		/// <summary>
		/// </summary>
		public createWidget(widget: campaign.widget.IWidget): number {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public readWidget(widgetId: number, callback: (widget: campaign.widget.IWidget) => void ): void {
			if (typeof callback === "undefined") {
				// TODO: Log no callback specified
				return;
			}
			var widget = eval("dashboard.campaign.widget.Widget_" + this._zeroPad(widgetId, 3)); // 3 being max num of zero's
			if (typeof widget === "undefined") {
				callback(widget); // Return back with undefined so routine can check for last element loaded and render all
				return;
			}

			widget = new widget(this); // Make instance of widget class
			this.load(this._getUrl("widget", widgetId), (data: any) => {
				// Set the widget properties
				widget.width = data.width;
				widget.height = data.height;
				widget.id = data.id;
				widget.indexOrder = data.indexOrder;
				widget.chartIds = data.chartIds;
				widget.dataManager = this;

				// Return it to be rendered etc...
				callback(widget);
			});
		}

		/// <summary>
		/// </summary>
		public updateWidget(widget: campaign.widget.IWidget): bool {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public deleteWidget(widgetId: number): bool {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public getCharts(widgetId: number): number[] {
			var charts: number[];
			this.load(this._getUrl("widget", widgetId), (data: any) => { charts = data.chartIds; } );
			return charts;
		}

		/// <summary>
		/// </summary>
		public createChart(chart: campaign.widget.chart.IBaseChart): number {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public readChart(chartId: number): campaign.widget.chart.IBaseChart {
			var chart: campaign.widget.chart.IBaseChart;

			return chart;
		}

		/// <summary>
		/// </summary>
		public updateChart(chart: campaign.widget.chart.IBaseChart): bool {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public deleteChart(chartId: number): bool {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public createUserDetails(userDetails: IUserDetails): number {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public readUserDetails(userDetailsId: number): IUserDetails {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public updateUserDetails(userDetails: IUserDetails): bool {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// </summary>
		public deleteUserDetails(userDetailsId: number): bool {
			throw Error("Not implemented!");
		}

		private _zeroPad(num: number, width: number): string {
			// From: http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
			var str = num + '';
			return str.length >= width ? str : new Array(width - str.length + 1).join('0') + str;
		}

		public load(url: string, fnSuccess: (data: any) => void, fnError?: (status: string, errorThrown: string) => void): void {
			$.ajax({
				url: url,
				dataType: "json",
				success: fnSuccess,
				error: (xhr: any, status: string, error: string) => {
					if (typeof fnError !== "undefined")
						fnError(status, error);
				}
			});
		}

		public loadManifest(name: string): void {
			this.load(this._getUrl("manifest", name), (data: IManifest) => {
					if (data && data.javaScripts)
						_.forEach(data.javaScripts, (item) => this._loadManifestItem(item, "js"));
					if (data && data.styleSheets)
						_.forEach(data.styleSheets, (item) => this._loadManifestItem(item, "css"));
				}
			);
		}

		private _loadManifestItem(data: IHeaderObject, type: string) {
			var headerElement;
			var name: string = type + data.name;
			if (type === "js") {
				if (document.querySelector("#" + name)) {
					document.querySelector("#" + name)
						.setAttribute("data-count", "" + parseInt(document.querySelector("#" + name)
						.getAttribute("data-count")) + 1);
				}
				else {
					headerElement = document.createElement('script');
					headerElement.setAttribute('type', 'text/javascript');
					headerElement.setAttribute('src', data.url);
					headerElement.setAttribute('data-count', 1);
					headerElement.setAttribute('id', name);
				}
			}
			if (type == "css") {
				if (document.querySelector("#" + name)) {
					document.querySelector("#" + name)
						.setAttribute("data-count", "" + parseInt(document.querySelector("#" + name)
						.getAttribute("data-count")) + 1);
				}
				else {
					headerElement = document.createElement('link');
					headerElement.setAttribute('type', 'text/css');
					headerElement.setAttribute('href', data.url);
					headerElement.setAttribute("rel", "stylesheet")
					headerElement.setAttribute('data-count', 1);
					headerElement.setAttribute('id', name);
				}
			}

			if (typeof headerElement != "undefined")
				document.getElementsByTagName("head")[0].appendChild(headerElement);
		}

		public loadUserDetails(callback: (data: any) => void ): void {
			this.load(this._getUrl("userdetails"), callback);
		}
	}
}