using Newtonsoft.Json;

namespace ContentController.Models.Interfaces
{
	public interface IManifest
	{
		[JsonProperty("name")]
		string Name { get; set; }

		[JsonProperty("version")]
		long Version { get; set; }

		[JsonProperty("javaScripts")]
		IHeaderObject[] JavaScripts { get; set; }

		[JsonProperty("styleSheets")]
		IHeaderObject[] StyleSheets { get; set; }
	}

	public interface IHeaderObject
	{
		[JsonProperty("name")]
		string Name { get; set; }

		[JsonProperty("versionId")]
		string VersionId { get; set; }
	}
}
