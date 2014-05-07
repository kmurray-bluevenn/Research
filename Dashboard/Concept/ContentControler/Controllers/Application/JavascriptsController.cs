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
	public class JavascriptsController : ApiController
	{
		//
		// GET: /Javascripts/

		/// <summary>
		/// Gets the specified id.
		/// </summary>
		/// <param name="id">The id of the item to get details about from the datastore</param>
		/// <returns></returns>
		public HttpResponseMessage Get(string id)
		{
			var result = new HttpResponseMessage(HttpStatusCode.OK);
			result.Content = new StreamContent(new MemoryStream(Encoding.UTF8.GetBytes("(function () {"
			+ " var div = document.createElement('div'); "
			+ " div.setAttribute('class', 'droparea'); "
			+ " document.getElementById('target').appendChild(div);	 	})();"
			)));
			result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/javascript");
			return result;
		}

	}
}
