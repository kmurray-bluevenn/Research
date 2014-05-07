﻿using System.Web.Http;

namespace CampaignCommanderRestService.App_Start
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute( "DefaultApi", "api/{controller}/{id}", new { id = RouteParameter.Optional } );
        }
    }
}
