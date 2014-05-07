using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace EmailVision.DataServicePOC.ClientCS
{
	public partial class MainForm : Form
	{
		private JobInfo m_LastAddedJob = null;

		public MainForm()
		{
			InitializeComponent();
			listView1.Scrollable = true;
			
		}

		private void BtnAddJob_Click( object sender, EventArgs e )
		{
			JobInfo j = new JobInfo( listView1.Controls.Count );
			Point pos = new Point(0,0);
			if ( m_LastAddedJob != null )
			{
				pos.Y = m_LastAddedJob.Location.Y + m_LastAddedJob.Height + 2;
			}

			j.Location = pos;
			listView1.Controls.Add( j );
			m_LastAddedJob = j;

		}
	}
}
