using System;

namespace CampaignCommanderDAL.Models
{
    [Serializable]
    public class CampaignSummary
    {
        public long Id;
        public string Status;
        public DateTime SendDate;
        public string Name;
    }
}