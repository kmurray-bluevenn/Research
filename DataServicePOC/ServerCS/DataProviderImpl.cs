using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EmailVision.DataService.Thrift;
using AutoMapper;
using System.Threading;

namespace EmailVision.DataServicePOC.ServerCS
{
	class DataProviderImpl : DataProvider.Iface
	{

		Dictionary<int, Job> jobs = new Dictionary<int, Job>();


		public int PrepareDataJob( string containerName, List<string> fieldNames, DateTimeTDTO startTime )
		{
			Console.WriteLine( "Called PrepareDataJob with args " + containerName );

			int jobNumber = jobs.Count;
			Job newJob = new Job { Fields = fieldNames, StartTime = Mapper.Map<DateTime>( startTime ), State = ProgressStateEnumeration.Pending, Data = new List<List<string>>(), PercentComplete = 0 };
			System.Threading.ThreadPool.QueueUserWorkItem( new WaitCallback( PopulateJobData ), newJob );
			jobs[jobNumber] = newJob;
			return jobNumber;
		}

		public ProgressTDTO GetJobProgress( int jobNumber )
		{
			Console.WriteLine( "Called GetJobProgress with args " + jobNumber );

			if ( !jobs.ContainsKey( jobNumber ) )
			{
				throw new DataServiceException { Message = "No job recognised for that job ID" };
			}

			Job job = jobs[jobNumber];
			ProgressTDTO progressDTO = new ProgressTDTO { NumberRows = 0, Message = job.Message,  PercentComplete = job.PercentComplete, StartDate = Mapper.Map<DateTimeTDTO>( jobs[jobNumber].StartTime ), State = job.State };

			if ( job.State == ProgressStateEnumeration.Complete )
			{
				progressDTO.NumberRows = job.Data.Count;
			}

			return progressDTO;
		}

		public List<List<string>> GetJobData( int jobNumber, long startRow, int numberOfRows )
		{
			Console.WriteLine( "Called GetJobData with args " + jobNumber + " " + startRow + " " + numberOfRows );

			if ( !jobs.ContainsKey( jobNumber ) )
			{
				throw new DataServiceException { Message = "No job recognised for that job ID" };
			}
			if ( numberOfRows < 0 )
			{
				throw new DataServiceException { Message = "Invalid number of rows requested" };
			}
			if ( startRow < 0 )
			{
				throw new DataServiceException { Message = "Invalid startRow requested" };
			}

			Job job = jobs[jobNumber];

			if ( startRow + numberOfRows > job.Data.Count )
			{
				numberOfRows = job.Data.Count - (Int32)startRow;
			}

			List<List<string>> dataSubset = job.Data.GetRange((Int32) startRow, numberOfRows );
			return dataSubset;
		}

		private void PopulateJobData( object threadContext )
		{
			Job job = threadContext as Job;

			//delay for a while to queue up the job
			Thread.Sleep( 3000 );

			job.State = ProgressStateEnumeration.Running;

			// Create the data
			Random rnd = new Random( (int) DateTime.Now.Ticks );

			Int32 numberRows = rnd.Next( Int16.MaxValue, 5000000 );
			Int32 numberCols = job.Fields.Count;

			Console.WriteLine( "Creating job with " + numberRows + " rows" );

			for ( int currentRow = 1; currentRow <= numberRows; ++currentRow )
			{
				if ( currentRow % 1000 == 0 )
				{
					Thread.Sleep( 1 );
				}

				if ( job.AbortJob )
				{
					job.Message = "Job Aborted";
					job.State = ProgressStateEnumeration.Errored;
					break;
				}

				List<string> rowData = new List<string>();

				for ( int colNum = 0; colNum < numberCols; ++colNum )
				{
					rowData.Add( "1" );
				}

				job.Data.Add( rowData );
				job.PercentComplete = (Int16) ( ( currentRow / numberRows ) * 100 );
			}

			if ( job.State != ProgressStateEnumeration.Errored )
			{
				job.Message = "Job Complete";
				job.State = ProgressStateEnumeration.Complete;
			}
		}

		#region Iface Members

		public void AbortJob( int jobNumber )
		{
			if ( !jobs.ContainsKey( jobNumber ) )
			{
				throw new DataServiceException { Message = "No job recognised for that job ID" };
			}

			Job job = jobs[jobNumber];
			job.AbortJob = true;
		}

		public void DeleteJob( int jobNumber )
		{
			if ( !jobs.ContainsKey( jobNumber ) )
			{
				throw new DataServiceException { Message = "No job recognised for that job ID" };
			}
			Job job = jobs[jobNumber];

			if ( job.State == ProgressStateEnumeration.Pending || job.State == ProgressStateEnumeration.Running )
			{
				job.AbortJob = true;
			}
			jobs.Remove( jobNumber );
		}

		#endregion
	}

	class Job
	{
		public List<string> Fields { get; set; }
		public DateTime StartTime { get; set; }
		public ProgressStateEnumeration State { get; set; }
		public List<List<string>> Data { get; set; }
		public Int16 PercentComplete { get; set; }
		public string Message { get; set; }
		public bool AbortJob { get; set; }
	}
}
