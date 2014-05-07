using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CampaignCommanderDAL.Business;
using CampaignCommanderDAL.Models;
using CampaignCommanderRestService.Business;

namespace CampaignCommanderRestService.Controllers
{
	public class CampaignSummaryController : ApiController
	{
		// GET api/campaignreport
		public IEnumerable<string> Get()
		{
			using ( var cc = new CCService() ) {
				return cc.Service.GetCampaignSummarys().Select(item => string.Format("{0} - {1}", item.Id, item.Name)).ToList();
			}
		}

		// GET api/campaignreport/5
		public CampaignSummary Get(int id)
		{
			using ( var cc = new CCService() ) {
				var campaignSummaries = cc.Service.GetCampaignSummarys(id);
				return campaignSummaries.Count == 1 ? campaignSummaries[0] : null;
			}
		}

		//// POST api/campaignreport
		//public void Post([FromBody]string value)
		//{
		//}

		//// PUT api/campaignreport/5
		//public void Put(int id, [FromBody]string value)
		//{
		//}

		//// DELETE api/campaignreport/5
		//public void Delete(int id)
		//{
		//}
	}
}
