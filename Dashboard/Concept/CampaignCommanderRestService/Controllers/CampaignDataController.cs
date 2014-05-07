using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using CampaignCommanderDAL.Business;
using CampaignCommanderDAL.Models;
using CampaignCommanderRestService.Business;
using CampaignCommanderRestService.models;

namespace CampaignCommanderRestService.Controllers
{
	public class CampaignDataController : ApiController
	{
		// GET api/campaignreport
		public IEnumerable<CampaignData> Get()
		{
			using ( var cc = new CCService() ) {
				return cc.Service.GetCampaignSummarys().Select(item => new CampaignData { Id = item.Id, Name = item.Name }).ToList();
			}
		}

		// GET api/campaignreport/5
		public object Get(int id)
		{
			var rand = new Random((int)DateTime.Now.Ticks);

			return new {
				campaignId = 1,
				campaignName = string.Format("Campaign-{0} - random ref:{1}", id, rand.Next(1000)),
				bar1 = new[] {
					new {key = "something1", value = rand.Next(10) + 1},
					new {key = "something2", value = rand.Next(10) + 1},
					new {key = "something3", value = rand.Next(10) + 1},
					new {key = "something4", value = rand.Next(10) + 1},
					new {key = "something5", value = rand.Next(10) + 1}
				},
				bar2 = new[] {
					new {key = "more1", value = rand.Next(1000)},
					new {key = "more2", value = rand.Next(1000)},
					new {key = "more3", value = rand.Next(1000)},
					new {key = "more4", value = rand.Next(1000)}
				},
				pie1 = new[] {
					new {key = "pieDat1", value = rand.Next(100) + 1},
					new {key = "pieDat2", value = rand.Next(100) + 1},
					new {key = "pieDat3", value = rand.Next(100) + 1},
					new {key = "pieDat4", value = rand.Next(100) + 1}
				},
				line1 = new object[] {
					new {
						key = "stuff1", value = new[] {
							new {key = DateTime.Now.AddDays(-14), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-13), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-12), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-11), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-10), value = rand.Next(100) + 1}
						}
					},
					new {
						key = "stuff2", value = new[] {
							new {key = DateTime.Now.AddDays(-9), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-8), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-7), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-6), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-5), value = rand.Next(100) + 1}
						}
					},
					new {
						key = "stuff3", value = new[] {
							new {key = DateTime.Now.AddDays(-4), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-3), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-2), value = rand.Next(100) + 1},
							new {key = DateTime.Now.AddDays(-1), value = rand.Next(100) + 1},
							new {key = DateTime.Now, value = rand.Next(100) + 1}
						}
					}
				}
			};
		}
	}
}
