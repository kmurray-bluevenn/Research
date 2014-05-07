using System;
using EmailVision.DataService.Thrift;
using EmailVision.DataServicePOC.Common;
using Thrift.Server;
using Thrift.Transport;

namespace EmailVision.DataServicePOC.ServerCS
{
	class Program
	{
		static void Main( string[] args )
		{
			try
			{
				AutoMapperConfiguration.Initialise();

				bool useBufferedSockets = false, useFramed = false;
				int port = 9090;
				if ( args.Length > 0 )
				{
					port = int.Parse( args[0] );

					if ( args.Length > 1 )
					{
						if ( args[1] == "raw" )
						{
							// as default
						}
						else if ( args[1] == "buffered" )
						{
							useBufferedSockets = true;
						}
						else if ( args[1] == "framed" )
						{
							useFramed = true;
						}
						else
						{
							// Fall back to the older boolean syntax
							bool.TryParse( args[1], out useBufferedSockets );
						}
					}
				}

				// Processor
				DataProviderImpl testHandler = new DataProviderImpl();
				DataProvider.Processor testProcessor = new DataProvider.Processor( testHandler );

				// Transport
				TServerSocket tServerSocket = new TServerSocket( port, 0, useBufferedSockets );

				// Simple Server
				TServer serverEngine;
				//if ( useFramed )
				//    serverEngine = new TSimpleServer( testProcessor, tServerSocket, new TFramedTransport.Factory() );
				//else
			//	    serverEngine = new TSimpleServer( testProcessor, tServerSocket );

				// ThreadPool Server
				 serverEngine = new TThreadPoolServer(testProcessor, tServerSocket);

				// Threaded Server
				// serverEngine = new TThreadedServer(testProcessor, tServerSocket);

				//testHandler.server = serverEngine;

				// Run it
				Console.WriteLine( "Starting the server on port " + port +
					( useBufferedSockets ? " with buffered socket" : "" ) +
					( useFramed ? " with framed transport" : "" ) +
					"..." );
				serverEngine.Serve();
			}
			catch ( Exception x )
			{
				Console.Error.Write( x );
			}
			Console.WriteLine( "done." );
		}
	}
}
