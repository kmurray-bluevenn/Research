using ContentController.Models.Interfaces;

namespace ContentController.Models
{
	public interface IWidget
	{
		IManifest Manifest { get; set; }
		long Id { get; set; }
		int IndexOrder { get; set; }
		long[] ChartIds { get; set; }
		string Name { get; set; }
		int Width { get; set; }
		int Height { get; set; }
	}
}
