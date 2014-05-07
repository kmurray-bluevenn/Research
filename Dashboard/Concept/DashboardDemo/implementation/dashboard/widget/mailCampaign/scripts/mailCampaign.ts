/// <reference path="../../../core/application/scripts/interfaces/IWidgetHandler.ts" />
/// <reference path="../../../core/3rdParty/definitions/underscore.d.ts" />
/// <reference path="interfaces.ts" />

module dashboard.widget {
    export class CampaignMailWidget implements dashboard.interfaces.IWidgethandler {
        private el: string;
        private header: string;
        private content: string;
        private controls: campaignMailWidget.interfaces.IDetails[];
        private data: any[];
        private Options = {
            show_Sent: true,
            show_Delivered: true,
            show_Opened: true,
            show_Clicked: true,
            show_Bounce: true,
            show_Unsub: true,
            show_Spam: true,
            name: "Campaign Mail Widget"
        };

        // Options will be the user defined options for this webpart.
        constructor (selectorName: string, options: any) {
            if ($(selectorName).length == 0)
                throw new Error(selectorName + ": doesn't exist");

            $.extend(this.Options, options);

            this.el = selectorName;
            this.content = "content";
            this.controls = [];
        }

        public Render() {
            this._registerSubscriptions();
            this._designDrawSpace();

        }

        public Dispose() {
            this._unsubscribe();
        }


        private _designDrawSpace() {
            var divheight;
            var divwidth;

            var $container = $(this.el);
            var $head = $("<div>").addClass("header");
            var $content = $("<div>").addClass("content");
            var $breaker = $("<hr />").addClass("rule");
            var $options = {};
            var $button = $("<a>").addClass("optionButton").attr("style", "display:none");

            //Header
            $head.append($("<label>").text(this.Options.name));
            $head.append($button);
            $head.append();
            $container.hover((e) =>  { $button.show(); }, (e) => { $button.hide(); });
            $container.append($head);
            $container.append($content);

            divwidth = Math.floor($container.width());
            divheight = Math.floor(($(this.el).height() - $head.height() - $breaker.height() - parseInt($container.css("padding-top")) - parseInt($container.css("padding-top"))) / this._getDataCounter());


            if (this.Options.show_Sent) {
            	this.controls.push({ selectorName: ".sent", dataName: "sent", control: new dashboard.campaign.widget.chart.Bullet({}) });
            	$content.append($("<div>").addClass("chartcolumn sent").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
            if (this.Options.show_Delivered) {
            	this.controls.push({ selectorName: ".delivered", dataName: "delivered", control: new dashboard.campaign.widget.chart.Bullet({}) });
                $content.append($("<div>").addClass("chartcolumn delivered").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
            if (this.Options.show_Opened) {
            	this.controls.push({ selectorName: ".opened", dataName: "opened", control: new dashboard.campaign.widget.chart.Bullet({ tickPostfix: "%" }) });
                $content.append($("<div>").addClass("chartcolumn opened").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
            if (this.Options.show_Clicked) {
            	this.controls.push({ selectorName: ".clicked", dataName: "clicked", control: new dashboard.campaign.widget.chart.Bullet({}) });
                $content.append($("<div>").addClass("chartcolumn clicked").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
            if (this.controls.length > 0)
                $content.append($breaker);

            if (this.Options.show_Bounce) {
            	this.controls.push({ selectorName: ".bounce", dataName: "bounce", control: new dashboard.campaign.widget.chart.Bullet({}) });
                $content.append($("<div>").addClass("chartcolumn bounce").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
            if (this.Options.show_Unsub) {
            	this.controls.push({ selectorName: ".unsubscribe", dataName: "unsubscribe", control: new dashboard.campaign.widget.chart.Bullet({}) });
                $content.append($("<div>").addClass("chartcolumn unsubscribe").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
            if (this.Options.show_Spam) {
            	this.controls.push({ selectorName: ".spam", dataName: "spam", control: new dashboard.campaign.widget.chart.Bullet({}) });
                $content.append($("<div>").addClass("chartcolumn spam").attr("style", "width:" + divwidth + "px;height:" + divheight + "px"));
            }
        }

        public start(incomingData): void {
            this.controls.forEach(function (c) {
                c.control.Render((_.where(incomingData, { name: c.dataName }))[0].blob, c.selectorName);
            });
        }
        public letterBox(incomingData): void {
            this.controls.forEach(function (c) {
                c.control.Render((_.where(incomingData, { name: c.dataName }))[0].blob, c.selectorName);
            });
        }


        //TODO: Come up with a nicer way of doing this
        _getDataCounter(): number {
            var counter = 0;
            for (var item in this.Options) {
                if (item.substring(0, 5) == "show_" && this.Options[item] === true)
                    counter++;
            }
            return counter;
        }

        _buildOptions() {
        }

        //Placeholders
        private _registerSubscriptions() {
        }

        private _unsubscribe() {
            //Tell the MCP that we no longer want we asked for
        }
    }



}