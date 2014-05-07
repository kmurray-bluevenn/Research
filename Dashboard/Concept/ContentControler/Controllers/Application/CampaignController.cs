using System;
using System.Collections.Generic;
using System.Web.Http;
using ContentController.Business;
using ContentController.Models;

namespace ContentController.Controllers.Application
{
	public class CampaignController : ApiController
	{
		private readonly IDataManager _dataManager;

		public CampaignController(IDataManager dataManager)
		{
			_dataManager = dataManager;
		}

		//public IEnumerable<long> Get()
		//{
		//	throw new Exception();
		//}

		// GET api/campaign/123
		public ICampaign Get(int id)
		{
			return _dataManager.GetCampaignById(id);
		}
	}
}
