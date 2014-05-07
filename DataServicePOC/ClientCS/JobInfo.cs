using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading;
using System.Windows.Forms;
using EmailVision.DataService.Thrift;
using EmailVision.DataServicePOC.Common;
using Thrift.Protocol;
using Thrift.Transport;

namespace EmailVision.DataServicePOC.ClientCS
{
	public partial class JobInfo : UserControl
	{
		private int m_JobNumber;
		private const int m_BatchSize = 1000;
		private int m_cnt;

		/// <summary>
		/// Logger instance for this class type
		/// </summary>
		private static NLog.Logger m_Logger = NLog.LogManager.GetCurrentClassLogger();
		
		public JobInfo(int cnt)
		{
			#region TraceBeginElement
			m_Logger.Trace( "Begin {0}", cnt );
			#endregion // TraceBeginElement

			m_cnt = cnt;
			InitializeComponent();
			System.Threading.ThreadPool.QueueUserWorkItem( new System.Threading.WaitCallback( Execute ) );

			#region TraceEndElement
			m_Logger.Trace( "End {0}", m_cnt );
			#endregion // TraceEndElement
		}

		private TTransport OpenTransport()
		{
			string host = "localhost";
			int port = 9090;
			TTransport transport = new TSocket( host, port );
			TBinaryProtocol binaryProtocol = new TBinaryProtocol( transport );

			try
			{
				if ( !transport.IsOpen )
				{
					transport.Open();
				}
			}
			catch ( TTransportException ttx )
			{
				Console.WriteLine( "Connect failed: " + ttx.Message );
				return null;
			}
			return transport;
		}
	
		private void Execute( object threadContext )
		{
			#region TraceBeginElement
			if ( m_Logger.IsTraceEnabled )
			{
				m_Logger.Trace( "Begin ", m_cnt );
			}
			#endregion // TraceBeginElement

			bool isFinished = false;

			progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.BackColor = Color.Black ) );
			ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.BackColor = Color.Black));

			TTransport trans = OpenTransport();

			try
			{
				if ( trans == null )
				{
					ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.Value = 100));
					progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.Value = 100));
					progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.BackColor = Color.Red));
					ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.BackColor = Color.Red));
				}

				TBinaryProtocol binaryProtocol = new TBinaryProtocol( trans );
				DataProvider.Client client = new DataProvider.Client( binaryProtocol );

				progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.BackColor = Color.LightBlue ) );
				ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.BackColor = Color.LightYellow ) );

				// Prepare some data
				m_JobNumber = client.PrepareDataJob( "Test", new List<string> { "FieldA", "FieldB" }, DateTime.Now.ToTDTO() );

				m_Logger.Trace("job {0} has job id {1}", m_cnt, m_JobNumber);
				if ( lblSubmitted.InvokeRequired )
				{
					lblSubmitted.Invoke( new MethodInvoker( () => lblSubmitted.Text = DateTime.Now.ToShortTimeString() ) );
				}
				else
				{
					lblSubmitted.Text = DateTime.Now.ToShortTimeString();
				}

				Application.DoEvents();

				// Monitor progress of prepare job
				ProgressTDTO progress = null;
				while ( !isFinished )
				{
					progress = client.GetJobProgress( m_JobNumber );

					ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.Value = progress.PercentComplete));
					if ( progress.State == ProgressStateEnumeration.Pending )
					{
						ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.BackColor = Color.LightYellow));
					}
					else if ( progress.State == ProgressStateEnumeration.Running )
					{
						ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.BackColor = Color.LightBlue));
					}
					else if ( progress.State == ProgressStateEnumeration.Errored )
					{
						ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.BackColor = Color.Red));
					}
					else if ( progress.State == ProgressStateEnumeration.Complete )
					{
						ProgressPreparation.Invoke( new MethodInvoker( () => ProgressPreparation.ForeColor = Color.LightGreen));
						isFinished = true;
					}
					Application.DoEvents();

					Thread.Sleep( 300 );
				}

				// Update the row label
				Int64 rowCount = -1;
				if ( progress != null )
				{
					rowCount = progress.NumberRows;
				}

				if ( lblRowCount.InvokeRequired )
				{
					lblRowCount.Invoke( new MethodInvoker( () => lblRowCount.Text = rowCount.ToString() ) );
				}
				else
				{
					lblRowCount.Text = rowCount.ToString();
				}

				// Get the data
				double percentConstant = rowCount / 100.0;
				progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.ForeColor = Color.Green ) );

				try
				{
					for ( Int64 i = 0; i < rowCount; i += m_BatchSize )
					{
						List<List<string>> dataRows = client.GetJobData( m_JobNumber, i, m_BatchSize );
						dataRows.Clear();
						int percentage = (int) Math.Ceiling( ( i + m_BatchSize ) / percentConstant );
						percentage = percentage > 100 ? 100 : percentage;
						progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.Value = percentage ) );
					}
				}
				catch ( Exception )
				{
					progressRetrieval.Invoke( new MethodInvoker( () => progressRetrieval.ForeColor = Color.Red ) );
				}

			}
			finally
			{
				if ( trans != null )
				{
					trans.Close();
				}
				#region TraceEndElement
				if ( m_Logger.IsTraceEnabled )
				{
					m_Logger.Trace( "End-  {0}", m_cnt);
				}
				#endregion // TraceEndElement
			}
		}

		private void BtnCancel_Click( object sender, EventArgs e )
		{
			TTransport trans = OpenTransport();
			TBinaryProtocol binaryProtocol = new TBinaryProtocol( trans );
			DataProvider.Client client = new DataProvider.Client( binaryProtocol );
			client.AbortJob( m_JobNumber );
		}

		private void btnExit_Click( object sender, EventArgs e )
		{
			TTransport trans = OpenTransport();
			TBinaryProtocol binaryProtocol = new TBinaryProtocol( trans );
			DataProvider.Client client = new DataProvider.Client( binaryProtocol );
			client.DeleteJob( m_JobNumber );
		}
	}
}
