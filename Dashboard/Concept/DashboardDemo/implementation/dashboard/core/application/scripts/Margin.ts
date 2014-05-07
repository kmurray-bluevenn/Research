/// <reference path="interfaces/dashboardInterfaces.ts" />

module dashboard.campaign.widget.chart.models {
	export class Margin implements IMargin {
		constructor(public top = 0, public bottom = 0, public left = 0, public right = 0) {
		}
	}
}