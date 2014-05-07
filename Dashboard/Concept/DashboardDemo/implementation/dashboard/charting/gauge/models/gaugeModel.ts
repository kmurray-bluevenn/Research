module dashboard.campaign.widget.chart.gauge.models {
	export interface IGaugeModel {
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