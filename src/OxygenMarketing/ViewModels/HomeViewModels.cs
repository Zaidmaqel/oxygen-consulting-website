using System.Collections.Generic;
using OxygenMarketing.Models;

namespace OxygenMarketing.ViewModels
{
    public class HomeViewModel
    {
        public List<Service> Services { get; set; } = new();
        public List<CaseStudy> FeaturedCases { get; set; } = new();
        public Dictionary<string, string> Settings { get; set; } = new();
        public ContactFormViewModel ContactForm { get; set; } = new();
    }

    public class PortfolioViewModel
    {
        public List<CaseStudy> CaseStudies { get; set; } = new();
        public List<string> Sectors { get; set; } = new();
        public string? SelectedSector { get; set; }
    }

    public class CaseStudyDetailViewModel
    {
        public CaseStudy CaseStudy { get; set; } = new();
        public List<CaseStudy> RelatedCases { get; set; } = new();
    }
}
