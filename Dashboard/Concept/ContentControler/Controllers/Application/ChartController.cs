using System.Web.Http;
using ContentController.Business;
using ContentController.Models;

namespace ContentController.Controllers.Application
{
	public class ChartController : ApiController
	{
		private readonly IDataManager _dataManager;

		public ChartController(IDataManager dataManager)
		{
			_dataManager = dataManager;
		}

		// GET api/chart/123
		public IChart Get(int id)
		{
			return _dataManager.GetChartById(id);
		}
	}
}
