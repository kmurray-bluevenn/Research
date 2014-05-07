using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace ContentController.Controllers.Application
{
	public class UserDetailsController : ApiController
	{
		public UserDetails Get()
		{
			return new UserDetails { Id = 1, CurrentCampaign = 4601 };
		}
	}

	[DataContract(Name="userDetails")]
	public class UserDetails
	{
		[DataMember(Name = "id")]
		public int Id { get; set; }
		[DataMember(Name = "currentCampaign")]
		public int CurrentCampaign { get; set; }
	}
}
