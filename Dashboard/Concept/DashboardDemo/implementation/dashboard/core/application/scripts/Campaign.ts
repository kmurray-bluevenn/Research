/// <reference path="../../3rdParty/definitions/underscore-typed.d.ts" />
/// <reference path="DataManager.ts" />
/// <reference path="../../3rdParty/definitions/pubsub.d.ts" />
/// <reference path="interfaces/dashboardInterfaces.ts" />

module dashboard.campaign {
	export class Campaign implements ICampaign {
		private _initialised: bool = false;
		private widgets: widget.IWidget[] = [];
		private isCurrent: bool = false;
		$el: JQuery;

		constructor(public el: string, public dataManager: IDataManager, public id: number, public name: string) {
			// Sort out handlers so they have the correct this pointer when they are called
			_.bindAll(this, "render");
		}

		/// Get all data for this campaign from the dataManager
		private initialise(): void {
			this._wirePubSub();
			this.dataManager.getWidgets(this.id, (widget: widget.IWidget) => {
				this._addWidget(widget);
			});
			this._initialised = true;
		}

		private _wirePubSub() {
			this.dataManager.subscribe(SubscriptionType.Widget, SubscriptionOperation.Delete, this._deleteWidget);
		}

		private _addWidget(widget: widget.IWidget): void;
		private _addWidget(widget: number): void;
		private _addWidget(widget: any): void
		{
			var widgetToAdd: widget.IWidget = widget;
			if (typeof widget === "number") {
				this.dataManager.readWidget(widget, (widget: widget.IWidget) => { this._addWidget(widget); });
				return;
			}
			this.widgets.push(widgetToAdd);

			// Make sure we don't duplicate any element ids
			var ticks = new Date().getTime();
			while (_.some(this.widgets, (element: widget.IWidget) => { return element.el == "widget" + ticks; }))
				ticks = new Date().getTime();

			var widgetEl: string = "widget" + ticks;

			// Create a div for the chart
			this.$el.append("<div class='widget' id='" + widgetEl + "'></div>");

			widgetToAdd.initialise(widgetEl);
		}

		private _deleteWidget(message: string, id: number) {
			// TODO: Delete the specified widget from the internal array
		}

		public render(): void {
			if (typeof this.$el === "undefined")
				this.$el = $("#" + this.el);

			if (!this._initialised)
				this.initialise();

			this.$el.html("<div class='title'>" + this.name + "</div>");
			_.each(this.widgets, (widget: widget.IWidget) => {
				widget.render();
			});
		}

		public setUpdateTime(seconds: number): void { }

		public nextSelected(): void { }

		public prevSelected(): void { }
	}
}