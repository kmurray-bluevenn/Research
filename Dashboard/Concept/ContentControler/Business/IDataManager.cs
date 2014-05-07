using ContentController.Models;

namespace ContentController.Business
{
	public interface IDataManager
	{
		ICampaign GetCampaignById(long id);
		IWidget GetWidgetById(long id);
		IChart GetChartById(long id);
	}
}
