using System.Collections.Generic;
using System.Linq;
using ContentController.Models;
using ContentController.Models.Interfaces;

namespace ContentController.Business
{
	public class DataManager : IDataManager
	{
		//private data.ContentEntities _db;

		/// <summary>
		/// Gets the campaign by id.
		/// </summary>
		/// <param name="id">The id.</param>
		/// <returns></returns>
		public ICampaign GetCampaignById(long id)
		{
			var campaign = LoadCampaign(id);
			return campaign;
		}

		/// <summary>
		/// Gets the widget by id.
		/// </summary>
		/// <param name="id">The id.</param>
		/// <returns></returns>
		public IWidget GetWidgetById(long id)
		{
			var widget = LoadWidget(id);
			return widget;
		}

		/// <summary>
		/// Gets the chart by id.
		/// </summary>
		/// <param name="id">The id.</param>
		/// <returns></returns>
		public IChart GetChartById(long id)
		{
			var chart = LoadChart(id);
			return chart;
		}

		#region Temporary data access

		private static ICampaign LoadCampaign(long id)
		{
			// TODO: This is getting test data, it will eventually come from a database
			// We only have 8 samples, so we'll return id mod 8
			id = id % 8;
			if ( id == 0 )
				id = 8;
			return GetSampleCampaigns().SingleOrDefault(item => item.Id == id);
		}

		private static IWidget LoadWidget(long id)
		{
			// TODO: This is getting test data, it will eventually come from a database
			// We only have 8 samples, so we'll return id mod 8
			id = id % 8;
			if ( id == 0 )
				id = 8;
			return GetSampleWidgets().SingleOrDefault(item => item.Id == id);
		}

		private static IChart LoadChart(long id)
		{
			// TODO: This is getting test data, it will eventually come from a database
			// We only have 8 samples, so we'll return id mod 8
			id = id % 8;
			if ( id == 0 )
				id = 8;
			return GetSampleCharts().SingleOrDefault(item => item.Id == id);
		}

		private static IEnumerable<ICampaign> GetSampleCampaigns()
		{
			// TODO: This is sample data, can be removed when using database
			var items = new List<ICampaign> {
				new Campaign {Id = 1, Name = "Some Campaign 1", WidgetIds = new long[] {1, 2, 3, 4}},
				new Campaign {Id = 2, Name = "Some Campaign 2", WidgetIds = new long[] {5, 6, 7, 8}},
				new Campaign {Id = 3, Name = "Some Campaign 3", WidgetIds = new long[] {9, 10}},
				new Campaign {Id = 4, Name = "Some Campaign 4", WidgetIds = new long[] {1, 2, 3, 4}},
				new Campaign {Id = 5, Name = "Some Campaign 5", WidgetIds = new long[] {1, 2, 3, 4, 5}},
				new Campaign {Id = 6, Name = "Some Campaign 6", WidgetIds = new long[] {2, 3, 4}},
				new Campaign {Id = 7, Name = "Some Campaign 7", WidgetIds = new long[] {5, 6, 7, 8}},
				new Campaign {Id = 8, Name = "Some Campaign 8", WidgetIds = new long[] {3, 1, 5}}
			};

			return items;
		}

		private static IEnumerable<IWidget> GetSampleWidgets()
		{
			// TODO: This is sample data, can be removed when using database
			var items = new List<IWidget> {
				new Widget {Id = 1, Width = 800, IndexOrder = 1, ChartIds = new long[] {1, 2, 3, 4}, Manifest = GetSampleManifest(1)},
				new Widget {Id = 2, Width = 800, Height = 400, IndexOrder = 2, ChartIds = new long[] {5, 6, 7, 8}, Manifest = GetSampleManifest(2)},
				new Widget {Id = 3, IndexOrder = 3, ChartIds = new long[] {1, 2}, Manifest = GetSampleManifest(3)},
				new Widget {Id = 4, Width = 600, Height = 400, IndexOrder = 4, ChartIds = new long[] {1, 2, 3, 4, 5}, Manifest = GetSampleManifest(4)},
				new Widget {Id = 5, Width = 500, Height = 500, IndexOrder = 5, ChartIds = new long[] {6, 7, 8}, Manifest = GetSampleManifest(5)},
				new Widget {Id = 6, Width = 800, Height = 600, IndexOrder = 6, ChartIds = new long[] {2, 4, 6, 8}, Manifest = GetSampleManifest(6)},
				new Widget {Id = 7, Width = 800, IndexOrder = 7, ChartIds = new long[] {1, 3, 5, 7, 8}, Manifest = GetSampleManifest(7)},
				new Widget {Id = 8, Width = 800, IndexOrder = 8, ChartIds = new long[] {1, 2, 3, 4, 5, 6, 7, 8}, Manifest = GetSampleManifest(8)}
			};
			return items;
		}

		private static IEnumerable<IChart> GetSampleCharts()
		{
			// TODO: This is sample data, can be removed when using database
			var items = new List<IChart> {
				new Chart {Id = 1, IndexOrder = 1, Width = 300, Height = 150, Manifest = GetSampleManifest(1)},
				new Chart {Id = 2, IndexOrder = 2, Width = 200, Height = 100, Manifest = GetSampleManifest(2)},
				new Chart {Id = 3, IndexOrder = 3, Width = 400, Height = 50, Manifest = GetSampleManifest(3)},
				new Chart {Id = 4, IndexOrder = 4, Width = 500, Height = 100, Manifest = GetSampleManifest(4)},
				new Chart {Id = 5, IndexOrder = 5, Width = 400, Height = 100, Manifest = GetSampleManifest(5)},
				new Chart {Id = 6, IndexOrder = 6, Width = 300, Height = 150, Manifest = GetSampleManifest(6)},
				new Chart {Id = 7, IndexOrder = 7, Width = 400, Height = 80, Manifest = GetSampleManifest(7)},
				new Chart {Id = 8, IndexOrder = 8, Manifest = GetSampleManifest(8)}
			};
			return items;
		}

		private static IManifest GetSampleManifest(long id)
		{
			// TODO: This is getting test data, it will eventually come from a database
			return new Manifest {
				Version = id,
				Name = "Sample",
				//JavaScripts = new IHeaderObject[] { new HeaderObject { Name = "sample1", URL = "http://localhost:45977/Javascripts/Sample_1.js" } },
				//StyleSheets = new IHeaderObject[] { new HeaderObject { Name = "sample1", URL = "http://localhost:45977/StyleSheets/Sample_1.css" } }
				JavaScripts = new IHeaderObject[] { new HeaderObject { Name = "sample1", VersionId = "12."+id } },
				StyleSheets = new IHeaderObject[] { new HeaderObject { Name = "sample1", VersionId = "15."+id } }
			};
		}

		#endregion
	}
}