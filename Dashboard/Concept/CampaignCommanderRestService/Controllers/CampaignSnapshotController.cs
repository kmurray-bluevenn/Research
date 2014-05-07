using System.Web.Http;
using CampaignCommanderDAL.Business;
using CampaignCommanderDAL.Models;
using CampaignCommanderRestService.Business;

namespace CampaignCommanderRestService.Controllers
{
	public class CampaignSnapshotController : ApiController
	{
		// GET api/campaignreport/5
		public CampaignSnapshot Get(int id)
		{
			using ( var cc = new CCService() ) {
				var campaignSnapshots = cc.Service.GetCampaignSnapshots(new long[] { id });
				return campaignSnapshots.Count == 1 ? campaignSnapshots[0] : null;
			}
		}

		// GET api/campaignreport
		//public IEnumerable<string> Get()
		//{
		//    return new string[] { "value1", "value2" };
		//}

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
