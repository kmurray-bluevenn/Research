//-----------------------------------------------------------------------------
// © 2012 smartFOCUS Ltd
//-----------------------------------------------------------------------------
//
//	Component	:	smartFOCUS
//
//-----------------------------------------------------------------------------
//	Version History
//	---------------
//	Date		Author		Xref.		Notes
//	----		------		-----		-----
//	17/12/2012	J.Hague 	WI3349		First release
//
//-----------------------------------------------------------------------------
// Namespace references
// --------------------
using System;
using AutoMapper;
using EmailVision.DataService.Thrift;

namespace EmailVision.DataServicePOC.Common
{
	/// <summary>
	/// This class creates the mapping configuration within the scope of this service.
	/// Used by AutoMapper when mapping from DTOs server objects and visa versa.
	/// </summary>
	/// <remarks>The configuration is expensive and should only be called once in the
	/// lifetime of the service</remarks>
	public class AutoMapperConfiguration
	{
		
		/// <summary>
		/// Initialises the AutoMapper configuration
		/// </summary>
		/// <remarks>Defines the mapping rules used by AutoMapper object to object mapping</remarks>
		public static void Initialise()
		{
			if ( !IsLoaded )
			{
				lock ( Mapper.Engine )
				{
					Mapper.CreateMap<DateTime, DateTimeTDTO>()
						.ForMember( d => d.__isset, a => a.Ignore() );
					Mapper.CreateMap<DateTimeTDTO, DateTime>()
						.ForMember( d => d.Date, a => a.Ignore() )
						.ForMember( d => d.DayOfWeek, a => a.Ignore() )
						.ForMember( d => d.DayOfYear, a => a.Ignore() )
						.ForMember( d => d.Kind, a => a.Ignore() )
						.ForMember( d => d.Ticks, a => a.Ignore() )
						.ForMember( d => d.TimeOfDay, a => a.Ignore() )
						;
					Mapper.AssertConfigurationIsValid();
				}

				// Set as loaded
				IsLoaded = true;
			}
		}

		/// <summary>
		/// Gets or sets the mapper loaded flag
		/// </summary>
		/// <remarks>
		/// Set once the mapper has loaded
		/// </remarks>
		public static bool IsLoaded
		{
			get;
			set;
		}
	}
}
