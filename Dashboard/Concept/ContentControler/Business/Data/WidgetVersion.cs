//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ContentController.Business.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class WidgetVersion
    {
        public WidgetVersion()
        {
            this.HeaderObjects = new HashSet<HeaderObject>();
        }
    
        public int Id { get; set; }
        public int Widget_Id { get; set; }
        public int Version { get; set; }
        public bool HeadVersion { get; set; }
    
        public virtual Widget Widget { get; set; }
        public virtual ICollection<HeaderObject> HeaderObjects { get; set; }
    }
}