using ContentController.Models.Interfaces;

namespace ContentController.Models
{
	public interface IChart
	{
		IManifest Manifest { get; set; }
		long Id { get; set; }
		int IndexOrder { get; set; }
		int Width { get; set; }
		int Height { get; set; }
	}
}
