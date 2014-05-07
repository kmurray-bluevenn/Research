/// <reference path="Campaign.ts" />
/// <reference path="../../3rdParty/definitions/underscore-typed.d.ts" />
/// <reference path="interfaces/dashboardInterfaces.ts" />
/// <reference path="../../3rdParty/definitions/modernizr.d.ts" />
/// <reference path="../../3rdParty/definitions/jquery.d.ts" />
/// <reference path="utils/logger.ts" />


module dashboard {
	/// <summary>
	/// </summary>
	export class Dashboard implements IDashboard {
		private _baseUrl: string;
		private _dataUrls: {
			CampaignSummary: string;
			UserDetails: string;
		};
		private campaignIds: number[] = [];
		private campaigns: campaign.ICampaign[] = [];
		private $el: JQuery;
		private currentCampaignId: number;
		private userDetails: IUserDetails;
		private dataManager: IDataManager;
		// Need this following proxy as it is used as a callback and loses the correct 'this'
		private _activeCampaign: campaign.ICampaign;

		/// <summary>
		/// </summary>
		/// TODO: Is userId going to be supplied the oAuth?
		constructor(private el: string, private clientId: number, private updateInterval: number) {
			// Sort out handlers so they have the correct this pointer when they are called
			_.bindAll(this, "_initialise");

			if (el.length === 0) {
				Logger.error("No el passed in");
				return;
			}
			this.dataManager = new dashboard.DataManager(updateInterval);
			this.$el = $("#" + this.el);
			this._getUserDetails(this._initialise);
		}

		/// <summary>
		/// </summary>
		/// TODO: Is clientId going to be supplied the oAuth?
		public _initialise(): void {
			this._wirePubSub();
			this.dataManager.loadCampaignData((data: { id: number; name: string; }[]) => {
				_.each(data, (item) => {
					var campaign: campaign.ICampaign = this._splitDataToCampaign(item);
					this.campaignIds.push(campaign.id);
					this.campaigns.push(campaign);
				});
				this._setActiveCampaign(this.userDetails.currentCampaign);
				this._render();
			});
		}

		private _wirePubSub(): void {
			/// TODO: Send message to pubsub to clear all current subs
			this.dataManager.subscribe(SubscriptionType.Campaign, SubscriptionOperation.Delete, this._deleteCampaign);
		}

		public _deleteCampaign(message: string, id: number): void {
			// TODO: Delete the specified Campaign from the internal array
		}

		/// <summary>
		/// </summary>
		private _render(): void {
			// Render dashboard

			// Render current campaign
			// For now we will use a template
			var template = _.template("<div id='<%= campaign %>' class='campaign'></div>");

			var prevButton = false, nextButton = false;

			if (typeof this._activeCampaign !== "undefined") {
				if (this.campaigns[0] !== this._activeCampaign)
					prevButton = true;
				if (this.campaigns[this.campaigns.length - 1] !== this._activeCampaign)
					nextButton = true;

				$(".prevButton", this.$el).css("hidden", !prevButton);
				$(".nextButton", this.$el).css("hidden", !nextButton);

				this.$el.html(template({ campaign: this._activeCampaign.el }));
				this._activeCampaign.render();
			}
		}


		/// <summary>
		/// Loads in the user settings
		/// </summary>
		private _getUserDetails(callback: (dashboard: IDashboard) => void ): void {
			this.dataManager.loadUserDetails((data) => {
				this.userDetails = data;
				callback(this);
			});
		}

		/// <summary>
		/// </summary>
		private _createDataManager(): void {
			throw Error("Not implemented!");
		}

		/// <summary>
		/// Moves to the next campaign.
		/// If already at the end of the array, we won't move
		/// </summary>
		private _showNextCampaign(): void {
			var max: number = this.campaigns.length;
			var position: number = max;
			for (var i = 0; i < max ; i++) {
				if (this.userDetails.currentCampaign === this.campaigns[i].id) {
					position = i;
					i = max;
				}
			}
			if (position >= max)
				return;
			this._setActiveCampaign(this.campaigns[position + 1].id);
			this._render();
		}

		/// <summary>
		/// Moves to the previous campaign.
		/// If already at the start of the array, we won't move
		/// </summary>
		private _showPrevCampaign(): void {
			var position: number = -1;
			for (var i = 0, limit = this.campaigns.length; i < limit ; i++) {
				if (this.userDetails.currentCampaign === this.campaigns[i].id) {
					position = i;
					i = limit;
				}
			}
			if (position < 1)
				return;
			this._setActiveCampaign(this.campaigns[position - 1].id);
			this._render();
		}

		/// <summary>
		/// Splits the data to Campaign details
		/// </summary>
		// TODO: Confirm data will be in this format
		private _splitDataToCampaign(item: { id: number; name: string; }): campaign.ICampaign {
			// Make sure we don't duplicate any element ids
			var ticks = new Date().getTime();
			while (_.some(this.campaigns, (element: campaign.ICampaign) => { return element.el == "cpn" + ticks; }))
				ticks = new Date().getTime();

			return new campaign.Campaign("cpn" + ticks, this.dataManager, item.id, item.name);
		}

		/// <summary>
		/// Set the active Campaign to show to the user
		/// </summary>
		private _setActiveCampaign(id: number): void {
			if (id === -1) {
				var res = _.max(this.campaigns, (item: campaign.ICampaign) => item.id);
				id = res.id;
			}
			this.userDetails.currentCampaign = id;
			this.dataManager.setActiveCampaign(id);
			_.each(this.campaigns, (item: campaign.ICampaign) => {
				if (item.id == id) {
					item.isCurrent = true;
					this._activeCampaign = item;
				}
				else
					item.isCurrent = false;
			});
		}
	}
}