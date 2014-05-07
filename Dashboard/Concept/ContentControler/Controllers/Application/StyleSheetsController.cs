using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;

namespace ContentController.Controllers.Application
{
	public class StyleSheetsController : ApiController
	{
		//
		// GET: /StyleSheets/

		/// <summary>
		/// Gets the specified id.
		/// </summary>
		/// <param name="id">The id of the item to get details about from the datastore</param>
		/// <returns></returns>
		public HttpResponseMessage Get(string id)
		{
			var result = new HttpResponseMessage(HttpStatusCode.OK);
			result.Content = new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes(" .droparea {"
				+ " width: 500px;"
				 + " height: 400px;"
				 + " background: #b8e1fc; /* Old browsers */"
				 + " background: -moz-linear-gradient(top, #b8e1fc 0%, #a9d2f3 10%, #90bae4 25%, #90bcea 37%, #90bff0 50%, #6ba8e5 51%, #a2daf5 83%, #bdf3fd 100%); /* FF3.6+ */"
				 + " background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#b8e1fc), color-stop(10%,#a9d2f3), color-stop(25%,#90bae4), color-stop(37%,#90bcea), color-stop(50%,#90bff0), color-stop(51%,#6ba8e5), color-stop(83%,#a2daf5), color-stop(100%,#bdf3fd)); /* Chrome,Safari4+ */"
				 + " background: -webkit-linear-gradient(top, #b8e1fc 0%,#a9d2f3 10%,#90bae4 25%,#90bcea 37%,#90bff0 50%,#6ba8e5 51%,#a2daf5 83%,#bdf3fd 100%); /* Chrome10+,Safari5.1+ */"
				 + " background: -o-linear-gradient(top, #b8e1fc 0%,#a9d2f3 10%,#90bae4 25%,#90bcea 37%,#90bff0 50%,#6ba8e5 51%,#a2daf5 83%,#bdf3fd 100%); /* Opera 11.10+ */"
				 + " background: -ms-linear-gradient(top, #b8e1fc 0%,#a9d2f3 10%,#90bae4 25%,#90bcea 37%,#90bff0 50%,#6ba8e5 51%,#a2daf5 83%,#bdf3fd 100%); /* IE10+ */"
				 + " background: linear-gradient(to bottom, #b8e1fc 0%,#a9d2f3 10%,#90bae4 25%,#90bcea 37%,#90bff0 50%,#6ba8e5 51%,#a2daf5 83%,#bdf3fd 100%); /* W3C */"
				 + " filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b8e1fc', endColorstr='#bdf3fd',GradientType=0 ); /* IE6-9 */"
				 + " -moz-border-radius: 15px;"
				 + " border-radius: 15px;}"
			)));
			result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/css");
			return result;
		}

	}
}
