using System.Web.Http;
using CampaignCommanderDAL.Business;
using CampaignCommanderDAL.Models;
using CampaignCommanderRestService.Business;

namespace CampaignCommanderRestService.Controllers
{
	public class CampaignReportController : ApiController
	{
		// GET api/campaignreport/5
		public CampaignReport Get(int id)
		{
			using ( var cc = new CCService() ) {
				var campaignReports = cc.Service.GetCampaignReports(new long[] { id });
				return campaignReports.Count == 1 ? campaignReports[0] : null;
			}
		}

		//// GET api/campaignreport
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
