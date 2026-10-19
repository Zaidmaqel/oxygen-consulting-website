using System.Collections.Generic;

namespace OxygenMarketing.ViewModels
{
    /// <summary>
    /// Input parameters selected by the user in the interactive Campaign Studio.
    /// </summary>
    public class CampaignStudioEstimateRequest
    {
        /// <summary>
        /// Selected social media platform names (e.g. Instagram, Facebook, TikTok).
        /// </summary>
        public List<string> Platforms { get; set; } = new();

        /// <summary>
        /// Selected service keys (e.g. content_creation, account_management, paid_ads, analytics_reporting).
        /// </summary>
        public List<string> Services { get; set; } = new();

        /// <summary>
        /// Core marketing objective: "awareness", "messages", or "sales".
        /// </summary>
        public string Goal { get; set; } = "messages";
    }

    /// <summary>
    /// Calculated estimates returned by the Campaign Studio algorithm.
    /// All figures are illustrative ranges based on empirical case study averages.
    /// </summary>
    public class CampaignStudioEstimateResult
    {
        public decimal BudgetMin { get; set; }
        public decimal BudgetMax { get; set; }
        public long ReachMin { get; set; }
        public long ReachMax { get; set; }
        public int ConversationsMin { get; set; }
        public int ConversationsMax { get; set; }

        public string DisclaimerAr { get; set; } = "تقديرات استرشادية مبنية على حملات سابقة ولا تشكل ضماناً تعاقدياً.";
        public string DisclaimerEn { get; set; } = "Estimates based on past campaigns, not a guarantee.";

        /// <summary>
        /// Human-readable summary of the chosen bundle for pre-filling the contact form.
        /// </summary>
        public string SummaryTextEn { get; set; } = string.Empty;
        public string SummaryTextAr { get; set; } = string.Empty;
    }
}
