
namespace c_glib TTest
namespace csharp EmailVision.DataService.Thrift
namespace * EmailVision.DataService.Thrift

/*
* The representation of job data This can be translated to
* rows of field data
*/
typedef list<list<string>> JobDataRows

/*
* Base exception thrown from the Data Service
*/
exception DataServiceException 
{
  1: i32 errorCode,
  2: string message
}

/**
 * Enumeration detailing the job progress
 */
enum ProgressStateEnumeration
{
  Pending = 0,
  Running = 1,
  Complete = 2,
  Errored = 3  
}

/*
* DateTimeDTO used to strongly type date and time across boundary
* This must be configured in UTC
*/
struct DateTimeTDTO
{
	1: i16 Year,
	2: i16 Month,
	3: i16 Day,
	4: i16 Hour,
	5: i16 Minute,
	6: i16 Second,
	7: i16 MilliSecond
}

struct ProgressTDTO
{
  1: ProgressStateEnumeration State,
  2: DateTimeTDTO StartDate,
  3: i16 PercentComplete,
  4: i64 NumberRows,
  5: string Message
}

service DataProvider
{
	/**
	* Informs the DataService to start preparing data 
	* @param string containerName - the name of the data container containing the fields
	* @param list<string> fieldNames - collection of field name to prepard data for
	* @param string startTime - The time to prepare data from - in UTC
	* @return i32 - returns the job number
	*/
  i32 PrepareDataJob(1: string containerName, 2: list<string> fieldNames, 3: DateTimeTDTO startTime) throws(1: DataServiceException err1),

  /*
  * Gets the progress of a job previously submitted via PrepareDataJob
  * @param i32 jobNumber - the job number to retrieve
  * @return ProgressTDTO - The progress of the job
  */
  ProgressTDTO GetJobProgress(1: i32 jobNumber) throws(1: DataServiceException err1),

  /*
  * Gets rows from a complete data job
  * @param i32 jobNumber - the job number to retrieve
  * @param i64 startRow - the row to return data from
  * @param i32 numberOfRows - the number of rows to return data for
  * @return list<list<string> - returns a collection of a collection of field data
  */
  JobDataRows GetJobData(1: i32 jobNumber, 2: i64 startRow, 3: i32 numberOfRows) throws(1: DataServiceException err1),

  /*
  * Aborts a job. No job data will be retrievable
  * @param i32 jobNumber - The job number to delete
  */
  void AbortJob(1: i32 jobNumber)

  /*
  * Deletes a job and all associated data from the server
  * @param i32 jobNumber - The job number to delete
  */
  void DeleteJob(1: i32 jobNumber)
}