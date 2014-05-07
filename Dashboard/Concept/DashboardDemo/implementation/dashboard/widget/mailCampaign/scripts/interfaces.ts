/// <reference path="../../../charting/bullet/Bullet.ts" />
/// <reference path="../../../charting/bullet/models/Interfaces.ts" />


module dashboard.campaign.widget.campaignMailWidget.interfaces {
    export interface IDetails {
        selectorName: string;
        dataName: string;
        control: dashboard.campaign.widget.chart.Bullet;
    }

    export interface IOptions {
        showSent: bool;
        showDelivered: bool;
        showOpened: bool;
        showClicked: bool;
        showBounce: bool;
        showUnsub: bool;
        showSpam: bool;
        name: string;
    }
}