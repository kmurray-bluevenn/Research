using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using EmailVision.DataServicePOC.Common;

namespace EmailVision.DataServicePOC.ClientCS
{
	class Program
	{
		static void Main( string[] args )
		{
			AutoMapperConfiguration.Initialise();

			MainForm f = new MainForm();
			Application.Run( f );
		}
	}
}
