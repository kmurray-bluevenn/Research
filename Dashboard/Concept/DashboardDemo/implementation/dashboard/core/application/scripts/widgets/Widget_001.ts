/// <reference path="BaseWidget.ts" />
/// <reference path="../../../../charting/bullet/Bullet.ts" />
/// <reference path="../../../../charting/donut/Donut.ts" />
/// <reference path="../interfaces/dashboardInterfaces.ts" />

module dashboard.campaign.widget {
	export class Widget_001 extends BaseWidget implements IWidget {
		public addCharts() {
			var opt = new chart.donut.models.DonutOptions(300, 150);
			opt.colours = ["colour1", "colour2", "colour3", "colour4"];// CSS colours
			this.addChart(new chart.Donut(opt, (data: any) => { return data.pie1; }));

			this.addChart(new chart.Bullet("bchart", new chart.bullet.models.BulletOptions(
				400, 50, new chart.models.Margin(5, 5, 5, 5), false, true, true, true, "", 400),
				(data: any) => {
					return {
						title: "Bullet Test:",
						subtitle: "Demo data",
						ranges: [{ label: "range 1", value: 100 }, { label: "range 2", value: 100 }],
						measures: [{ label: "measure1", value: data.pie1[0].value }, { label: "measure2", value: data.pie1[1].value }],
						markers: [{ label: "marker1", value: 50 }]
					};
				}));
			this.addChart(new chart.Donut(new chart.donut.models.DonutOptions(300, 150), (data: any) => { return data.pie1; }));
		}
	}
}
