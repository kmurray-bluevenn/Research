using System;

namespace CampaignCommanderDAL.Models
{
    [Serializable]
    public class CampaignReport
    {
        public DateTime BeginDate;
        public long CampaignId;
        public DateTime EndDate;
        public long InitDuration;
        public long MessageId;
        public long BadEmail;
        public long Conversion;
        public long Error;
        public long Join;
        public long Message;
        public long Multiple;
        public long Open;
        public long Opened;
        public long Response;
        public long Selected;
        public long Single;
        public long Skipped;
        public long SoftError;
        public long TotalClick;
        public long UniqueClick;
        public long Unjoined;
        public bool PassThruFlg;
    }
}