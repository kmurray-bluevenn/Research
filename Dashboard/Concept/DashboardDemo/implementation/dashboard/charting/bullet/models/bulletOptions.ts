/// <reference path="../../../core/application/scripts/BaseChartOptions.ts" />
module dashboard.campaign.widget.chart.bullet.models {
	export interface IBulletOptions {
		reverse: bool;
		showMeasureLabel: bool;
		showRangeLabel: bool;
		showMarkerLabel: bool;
		tickPostfix: string;
		updateDuration: number;
		width: number;
		height: number;
		margin: IMargin;
	}

	export class BulletOptions extends BaseChartOptions implements IBulletOptions {
		constructor(width: number, height: number, public margin: IMargin, public reverse: bool = false, public showMeasureLabel: bool = false, public showRangeLabel: bool = false, public showMarkerLabel: bool = false, public tickPostfix: string = "", public updateDuration: number = 400) {
			super(width, height, margin);
		}
	}
}
