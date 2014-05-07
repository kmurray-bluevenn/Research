using System;

namespace CampaignCommanderDAL.Models
{
    [Serializable]
    public class CampaignSnapshot
    {
        public DateTime BeginDate;
        public long CampaignId;
        public DateTime EndDate;
        public long Bounce;
        public long Complaint;
        public long Conversion;
        public long Delivered;
        public long Filtered;
        public long HardBounce;
        public long Selected;
        public long SoftBounce;
        public long UniqueClick;
        public long UniqueOpen;
        public long Unsubscribe;
    }
}