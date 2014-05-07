module dashboard.campaign.widget.chart.bar.models {
	export interface IBarModel {
		data: IKVP[];
		title: string;
		xName: string;
		yName: string;
	}

	export interface IKVP{
		key: string;
		value: number;
	}
}