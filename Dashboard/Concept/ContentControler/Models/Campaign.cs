using Newtonsoft.Json;

namespace ContentController.Models
{
	public class Campaign : ICampaign
	{
		[JsonProperty("id")]
		public long Id { get; set; }
		[JsonProperty("widgetIds")]
		public long[] WidgetIds { get; set; }
		[JsonProperty("name")]
		public string Name { get; set; }
	}
}
