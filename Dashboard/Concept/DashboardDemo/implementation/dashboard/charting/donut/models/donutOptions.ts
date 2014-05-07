/// <reference path="../../../core/application/scripts/BaseChartOptions.ts" />

module dashboard.campaign.widget.chart.donut.models {
	export interface IDonutOptions {
		pieChart: bool;
		updateDuration: number;
		width: number;
		height: number;
		margin: IMargin;
		colours: string[];
	}

	export class DonutOptions extends BaseChartOptions implements IDonutOptions {
		pieChart: bool = false;
		updateDuration: number = 400; // Time to transition to new data when it becomes available
		colours: string[];

		constructor(public width: number, public height: number) {
			super(width, height, null);
		}
	}
}
