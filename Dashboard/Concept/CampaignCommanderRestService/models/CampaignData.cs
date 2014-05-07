using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using Newtonsoft.Json;

namespace CampaignCommanderRestService.models
{
	[DataContract(Name="campaign")]
	public class CampaignData
	{
		[DataMember(Name="id")]
		public long Id { get; set; }

		[DataMember(Name = "name")]
		public string Name { get; set; }
	}
}