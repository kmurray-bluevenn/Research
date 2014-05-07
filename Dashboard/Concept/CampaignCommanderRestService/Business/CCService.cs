using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CampaignCommanderDAL.Business;

namespace CampaignCommanderRestService.Business
{
	// Simple wrapper to save having to specify the credentials all the time.
	public class CCService : IDisposable
	{
		public ServiceCaller Service = new ServiceCaller(@"EMVPAUL_API", @"mf7!lAIYFogo", @"CdX7CrFjwGe_sHVxb-MfkvCKfktrQNy6k06CLPYGaPG421EPR5hi");

		public void Dispose()
		{
			Service.CloseAPIConnection();
		}
	}
}