using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using ContentController.Business;
using Ninject;
using Ninject.Web.Common;

namespace ContentController
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
	public class MvcApplication : NinjectHttpApplication
    {
        protected override IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());
            RegisterServices(kernel);
            GlobalConfiguration.Configuration.DependencyResolver = new LocalNinjectDependencyResolver(kernel);
            return kernel;
        }

        protected override void OnApplicationStarted()
        {
            base.OnApplicationStarted();
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
						WebApiConfig.Register(GlobalConfiguration.Configuration);
						//FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            var xml = GlobalConfiguration.Configuration.Formatters.XmlFormatter;
            xml.UseXmlSerializer = true;
        }

        private static void RegisterServices(IKernel kernel)
        {
	        kernel.Bind<IDataManager>().To<DataManager>();
        }
    }
}