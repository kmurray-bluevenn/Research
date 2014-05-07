using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EmailVision.DataService.Thrift;
using AutoMapper;

namespace EmailVision.DataServicePOC.Common
{
	public static class Templates
	{
		public static DateTimeTDTO ToTDTO( this DateTime time )
		{
			return Mapper.Map<DateTimeTDTO>( time );
		}
	}
}
