
module dashboard.campaign.widget.chart.bullet.models {
	export interface IBulletModel {
		ranges: any[];
		measures: any[];
		markers: any[];
		title: string;
		subtitle: string;
	}

	export interface IRange{
		label: string;
		value: number;
	}
}