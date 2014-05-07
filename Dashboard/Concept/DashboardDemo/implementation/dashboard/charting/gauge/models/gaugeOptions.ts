/// <reference path="../../../core/application/scripts/BaseChartOptions.ts" />
/// <reference path="../../../core/3rdParty/definitions/d3.d.ts" />
module dashboard.campaign.widget.chart.gauge.models {
	export interface IGaugeOptions {
		width: number;
		height: number;
		margin: IMargin;
		useParentDimensions: bool;
		updateSpeed: number;
		minorTicks: ITick;
		majorTicks: ITick;
		labelDetails: ILabel;
	}

	export interface ITick extends ILabel{
		numberOfTicks: number;
		showTick: bool;
	}

	export interface ILabel{
		showLabel: bool;
	}

	export class GaugeOptions extends BaseChartOptions implements IGaugeOptions {
		useParentDimensions: bool = false;
		updateSpeed: number = 3000;
		labelDetails: ILabel = {showLabel: true};
		minorTicks: ITick = { numberOfTicks:2, showLabel:true, showTick: true};
		majorTicks: ITick = { numberOfTicks: 10, showLabel: true, showTick: true};
		constructor(width: number, height: number, public margin: IMargin) {
			super(width, height, margin);
		}
	}
}