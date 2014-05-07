using System.Collections.Generic;
using System.Web.Http;
using CampaignCommanderDAL.Business;
using CampaignCommanderDAL.Models;
using CampaignCommanderRestService.Business;

namespace CampaignCommanderRestService.Controllers
{
	public class CampaignsController : ApiController
	{
		public IEnumerable<long> Get()
		{
			using ( var cc = new CCService() ) {
				return cc.Service.ListCampaigns();
			}
		}
	}
}
