using ContentController.Models.Interfaces;
using Newtonsoft.Json;

namespace ContentController.Models
{
	public class Widget : IWidget
	{
		[JsonProperty("manifest")]
		public IManifest Manifest { get; set; }
		[JsonProperty("id")]
		public long Id { get; set; }
		[JsonProperty("indexOrder")]
		public int IndexOrder { get; set; }
		[JsonProperty("chartIds")]
		public long[] ChartIds { get; set; }
		[JsonProperty("name")]
		public string Name { get; set; }
		[JsonProperty("width")]
		public int Width { get; set; }
		[JsonProperty("height")]
		public int Height { get; set; }
	}
}