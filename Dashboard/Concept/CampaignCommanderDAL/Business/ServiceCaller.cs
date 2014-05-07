using System;
using System.Collections.Generic;
using System.Linq;
using CampaignCommanderDAL.Models;
using ccsoap.ccsoapref;

namespace CampaignCommanderDAL.Business
{
    public class ServiceCaller: IDisposable
    {
        private readonly CcmdServiceService _service = new CcmdServiceService();
        private string _token;
        private bool _isOpen = false;

        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceCaller"/> class.
        /// </summary>
        public ServiceCaller()
        {
            // The caller has to call OpenAPIConnection separately
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceCaller"/> class and attempts to open the api connection.
        /// </summary>
        /// <param name="username">The username.</param>
        /// <param name="password">The password.</param>
        /// <param name="apiKey">The API key.</param>
        public ServiceCaller(string username, string password, string apiKey)
        {
            OpenAPIConnection(username, password, apiKey);
        }

	    /// <summary>
	    /// Opens the API connection.
	    /// </summary>
	    /// <param name="username">The username.</param>
	    /// <param name="password">The password.</param>
	    /// <param name="apiKey">The API key.</param>
	    /// <returns></returns>
	    public void OpenAPIConnection(string username, string password, string apiKey)
        {
            try {
                _token = _service.openApiConnection(username, password, apiKey);
                _isOpen = true;
            }
            catch {
            }
        }

        /// <summary>
        /// Closes the API connection.
        /// </summary>
        public void CloseAPIConnection()
        {
            if ( !_isOpen )
                return;
            _service.closeApiConnection(_token);
            _isOpen = false;
        }

        /// <summary>
        /// Gets a collection of campaign summaries.
        /// </summary>
        /// <param name="campaignId">A campaign to get, or -1 for all found</param>
        /// <param name="page">The page.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <returns></returns>
        /// <exception cref="System.InvalidOperationException">You must open the connection before calling this method</exception>
        public List<CampaignSummary> GetCampaignSummarys(long campaignId = -1, int page = 1, int pageSize = 100)
        {
            if (!_isOpen)
                throw new InvalidOperationException("You must open the connection before calling this method");

            var listOptions = new APICampaignListOptions {
                page = page,
                pageSize = pageSize,
                pageSizeSpecified = true
            };

            // Check to see if we only want one returned
            if (campaignId != -1)
                listOptions.search = new APICampaignSearchCriteria {campaignId = campaignId, campaignIdSpecified = true};

            var campaigns = _service.getCampaignSummaryList(_token, listOptions);

            return campaigns.campaignSummaryList.Select(item =>
                new CampaignSummary {
                    Id = item.campaignId,
                    Name = item.name,
                    SendDate = item.sendDate,
                    Status = item.status
                }
            ).ToList();
        }

        /// <summary>
        /// Gets a collection of campaign snapshots.
        /// </summary>
        /// <param name="campaignIds">The campaign ids.</param>
        /// <returns></returns>
        /// <exception cref="System.InvalidOperationException">You must open the connection before calling this method</exception>
        public List<CampaignSnapshot> GetCampaignSnapshots(long[] campaignIds)
        {
            if ( !_isOpen )
                throw new InvalidOperationException("You must open the connection before calling this method");

            return campaignIds.Select(id => _service.getCampaignSnapshot(_token, id)).Select(snapshot => new CampaignSnapshot {
                BeginDate = snapshot.beginDate,
                CampaignId = snapshot.campaignId,
                EndDate = snapshot.endDate,
                Bounce = snapshot.nbBounce,
                Complaint = snapshot.nbComplaint,
                Conversion = snapshot.nbConversion,
                Delivered = snapshot.nbDelivered,
                Filtered = snapshot.nbFiltered,
                HardBounce = snapshot.nbHardBounce,
                Selected = snapshot.nbSelected,
                SoftBounce = snapshot.nbSoftBounce,
                UniqueClick = snapshot.nbUniqueClick,
                UniqueOpen = snapshot.nbUniqueOpen,
                Unsubscribe = snapshot.nbUnsubscribe
            }).ToList();
        }

        /// <summary>
        /// Gets a collection of campaign reports.
        /// </summary>
        /// <param name="campaignIds">The campaign ids.</param>
        /// <returns></returns>
        /// <exception cref="System.InvalidOperationException">You must open the connection before calling this method</exception>
        public List<CampaignReport> GetCampaignReports(long[] campaignIds)
        {
            if ( !_isOpen )
                throw new InvalidOperationException("You must open the connection before calling this method");

            return campaignIds.Select(id => _service.getCampaignReport(_token, id)).Select(report => new CampaignReport {
                BeginDate = report.beginDate,
                CampaignId = report.campaignId,
                EndDate = report.endDate,
                InitDuration = report.initDuration,
                MessageId = report.messageId,
                BadEmail = report.nbBadEmail,
                Conversion = report.nbConversion,
                Error = report.nbError,
                Join = report.nbJoin,
                Message = report.nbMessage,
                Multiple = report.nbMultiple,
                Open = report.nbOpen,
                Opened = report.nbOpened,
                Response = report.nbResponse,
                Selected = report.nbSelected,
                Single = report.nbSingle,
                Skipped = report.nbSkipped,
                SoftError = report.nbSoftError,
                TotalClick = report.nbTotalClick,
                UniqueClick = report.nbUniqueClick,
                Unjoined = report.nbUnjoined,
                PassThruFlg = report.passThruFlg
            }).ToList();
        }

        public List<long> ListCampaigns()
        {
            return _service.getLastCampaigns(_token, 1000).ToList();
        } 
        #region Implementation of IDisposable

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            CloseAPIConnection();
        }

        #endregion
    }
}
