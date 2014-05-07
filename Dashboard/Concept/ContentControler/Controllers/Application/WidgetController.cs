using System.Web.Http;
using ContentController.Business;
using ContentController.Models;

namespace ContentController.Controllers.Application
{
	public class WidgetController : ApiController
	{
		private readonly IDataManager _dataManager;

		public WidgetController(IDataManager dataManager)
		{
			_dataManager = dataManager;
		}

		// GET api/widget/123
		public IWidget Get(int id)
		{
			return _dataManager.GetWidgetById(id);
		}
	}
}
