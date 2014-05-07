using ContentController.Models.Interfaces;

namespace ContentController.Models
{
	public class Manifest : IManifest
	{
		public string Name { get; set; }
		public long Version { get; set; }
		public IHeaderObject[] JavaScripts { get; set; }
		public IHeaderObject[] StyleSheets { get; set; }
	}

	public class HeaderObject : IHeaderObject
	{
		public string Name { get; set; }
		public string VersionId { get; set; }
	}
}