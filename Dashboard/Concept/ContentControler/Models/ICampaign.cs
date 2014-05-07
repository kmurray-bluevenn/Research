namespace ContentController.Models
{
	public interface ICampaign
	{
		long Id { get; set; }
		long[] WidgetIds { get; set; }
		string Name { get; set; }
	}
}
