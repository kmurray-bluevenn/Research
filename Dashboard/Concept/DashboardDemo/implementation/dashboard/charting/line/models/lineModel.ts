module dashboard.campaign.widget.chart.line.models {
	export interface ILineModel {
		data: IData[];
		key: string;
		title: string;
		xName: string;
		yName: string;
	}

	export interface IData{
		key: any;
		data: IKVP[];
	}

	export interface IKVP{
		key: any;
		value: number;
	}
}