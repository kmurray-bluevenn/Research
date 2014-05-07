/// <reference path="../../../core/application/scripts/BaseChartOptions.ts" />
/// <reference path="../../../core/3rdParty/definitions/d3.d.ts" />
module dashboard.campaign.widget.chart.bar.models {
	export interface IBarOptions {
		width: number;
		height: number;
		margin: IMargin;
		useParentDimensions: bool;
		Axis: IAxis;
		updateSpeed: number;
	}

	export class BarOptions extends BaseChartOptions implements IBarOptions {
		useParentDimensions: bool = false;
		updateSpeed: number = 3000;
		Axis: IAxis = {
			xAxis: { orient: "bottom", isDateBased: false, formatMethod: undefined /*d3.time.format("%j %b")*/, displayLabel: true },
			yAxis: { orient: "Left", isDateBased: false, formatMethod: undefined, displayLabel: true  }
		};
		constructor(width: number, height: number, public margin: IMargin) {
			super(width, height, margin);
		}
	}
}