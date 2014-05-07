/// <reference path="../../../3rdParty/definitions/jquery.d.ts" />
module dashboard {
	export enum SubscriptionType {
		Campaign,
		Widget,
		Chart
	}

	export enum SubscriptionOperation {
		Create,
		Read,
		Update,
		Delete
	}

	export interface ISubscribeData {
		name: string;
		id: number;
	}

	export interface IDashboard {
		el: string;
		$el: JQuery;
		campaignIds: number[];
		campaigns: campaign.ICampaign[];
		currentCampaignId: number;
		userDetails: IUserDetails;
		dataManager: IDataManager;

		_initialise(clientId: number): void;
		_render(): void;
		_getUserDetails(callback: () => void ): any;
		_createDataManager(): void;
		_showNextCampaign(): void;
		_showPrevCampaign(): void;
	}

	export module campaign {
		export interface ICampaign {
			_initialised: bool;
			el: string;
			$el: JQuery;
			id: number;
			widgets: widget.IWidget[];
			dataManager: IDataManager;
			isCurrent: bool;
			name: string;

			initialise(callback: () => void): void;
			render(): void;
			setUpdateTime(seconds: number): void;
			nextSelected(): void;
			prevSelected(): void;
		}

		export module widget {
			export interface IWidget {
				_initialised: bool;
				el: string;
				$el: JQuery;
				id: number;
				chartIds: number[];
				charts: chart.IBaseChart[];
				indexOrder: number;
				dataManager: IDataManager;
				width: number;
				height: number;

				initialise(el: string): void;
				render(): void;
				addChart(chart: chart.IBaseChart): void;
				removeChart(chart: chart.IBaseChart): void;
			}

			export module chart {
				export interface IBaseChartOptions {
					width: number;
					height: number;
					margin: IMargin;
				}

				export interface IBaseChart {
					el: string;
					id: number;
					token: string;
					data: any;
					indexOrder: number;
					useParentDimensions: bool;
					customOptions: IBaseChartOptions;

					_prepareChart(): void;
					processData(message: string, data: any): void;
					dispose(): void;
				}

				export interface IAxis {
					xAxis: IAxisDetails;
					yAxis: IAxisDetails;
				}

				export interface IAxisDetails {
					orient: string;
					isDateBased: bool;
					formatMethod: any;
					displayLabel: bool;
				}
			}
		}
	}

	export interface IDataManager {
		setActiveCampaign(campaignId: number): void;

		subscribe(subType: SubscriptionType, subOp: SubscriptionOperation, callback: (messgae: string, data: any) => void ): void;

		getWidgets(campaignId: number, addWidgetCallback: (widget: campaign.widget.IWidget) => void): void;
		createWidget(widget: campaign.widget.IWidget): number;
		readWidget(widgetId: number, callback: (widget: campaign.widget.IWidget) => void ): void;
		updateWidget(widget: campaign.widget.IWidget): bool;
		deleteWidget(widgetId: number): bool;

		getCharts(widgetId: number): number[];
		createChart(chart: campaign.widget.chart.IBaseChart): number;
		readChart(chartId: number): campaign.widget.chart.IBaseChart;
		updateChart(chart: campaign.widget.chart.IBaseChart): bool;
		deleteChart(chartId: number): bool;

		createUserDetails(userDetails: IUserDetails): number;
		readUserDetails(userDetailsId: number): IUserDetails;
		updateUserDetails(userDetails: IUserDetails): bool;
		deleteUserDetails(userDetailsId: number): bool;

		loadManifest(name): void;
		loadCampaignData(callback: (data: { id: number; name: string; }[]) => void ): void;
		loadUserDetails(callback: (data: any) => void ): void;

		load(url: string, success: (data: any) => void ): void;
	}

	export interface IUserDetails {
		id: number;
		currentCampaign: number;
	}

	export interface IMargin {
		top: number;
		bottom: number;
		left: number;
		right: number;
	}

	export interface IManifest{
	    name: string;
	    version: string;
	    javaScripts: IHeaderObject[];
	    styleSheets: IHeaderObject[];
	}

	export interface IHeaderObject{
	    name: string;
	    url: string;
	}
}
