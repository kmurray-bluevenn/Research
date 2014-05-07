/// <reference path="../../../core/3rdParty/definitions/d3.d.ts" />
/// <reference path="../../../core/application/scripts/BaseChartOptions.ts" />
module dashboard.campaign.widget.chart.line.models {
	export interface ILineOptions {
		width: number;
		height: number;
		margin: IMargin;
		updateSpeed: number;
		useParentDimensions: bool;
		Axis: IAxis;
		circleDetails: ICircleSetup;
		lineDetails: ILineSetup;
		areaDetails: IAreaSetup;
	}


	export interface ILineBase {
		display: bool;
	}
	export interface ICircleSetup extends ILineBase {
		radius: number;
	}
	export interface IAreaSetup extends ILineBase {
	}
	export interface ILineSetup extends ILineBase {
	}

	export class LineOptions extends BaseChartOptions implements ILineOptions {
		updateSpeed: number = 3000;
		useParentDimensions: bool = false;
		Axis: IAxis = {
			xAxis: { orient: "bottom", isDateBased: true, formatMethod: d3.time.format("%Y %B"), displayLabel: true  },
			yAxis: { orient: "Left", isDateBased: false, formatMethod: undefined, displayLabel: true }
		};
		circleDetails: ICircleSetup = { display: true, radius: 5 };
		lineDetails: ILineSetup = { display: true   };
		areaDetails: IAreaSetup = { display: false  };

		constructor(width: number, height: number, public margin: IMargin) {

			super(width, height, margin);
		}
	}
}
