module dashboard.campaign.widget.chart.meter.models {
	export interface IMeterModel {
		data: number;
		title: string;
		overallRange: IRange;
		ranges: ISection[];
	}

	export interface IRange{
		from: number;
		to: number;
	}
	export interface ISection extends IRange{
		name: string;
	}

	export interface IPoint{
		x: number;
		y: number;
	}
}