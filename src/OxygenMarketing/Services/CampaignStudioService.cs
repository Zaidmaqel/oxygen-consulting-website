using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Data;
using OxygenMarketing.ViewModels;

namespace OxygenMarketing.Services
{
    /// <summary>
    /// Implementation of the Campaign Studio calculation engine.
    /// Derives projections proportionally from empirical benchmarks recorded in the database
    /// (e.g. clothing case: $700 -> 100k reach, 3.5k conversations, $0.20 CPC;
    /// real estate case: $1500 -> 170k reach, 3.0k conversations, $0.50 CPC).
    /// </summary>
    public class CampaignStudioService : ICampaignStudioService
    {
        private readonly ApplicationDbContext _context;

        public CampaignStudioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CampaignStudioEstimateResult> CalculateEstimateAsync(CampaignStudioEstimateRequest? request)
        {
            // 1. Guard against null or empty input by initializing safe defaults
            var platforms = request?.Platforms ?? new List<string>();
            var services = request?.Services ?? new List<string>();
            var goal = (request?.Goal ?? "messages").ToLowerInvariant().Trim();

            // Distinct and sanitized lists
            var cleanPlatforms = platforms.Where(p => !string.IsNullOrWhiteSpace(p)).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            var cleanServices = services.Where(s => !string.IsNullOrWhiteSpace(s)).Distinct(StringComparer.OrdinalIgnoreCase).ToList();

            // Default fallback if nothing selected
            int platformCount = Math.Max(cleanPlatforms.Count, 1);
            int serviceCount = Math.Max(cleanServices.Count, 1);

            // 2. Fetch baseline benchmarks from Case Studies in DB (or fallback constants)
            decimal avgCpc = 0.35m;
            decimal reachPerDollar = 125m; // ~125 impressions/reach per $1 spent based on ($700 -> 100k & $1500 -> 170k)
            decimal conversationsPerDollar = 3.5m; // ~3.5 conversations per $1 on messaging campaigns

            try
            {
                var cases = await _context.CaseStudies
                    .Where(c => c.IsActive && c.Budget.HasValue && c.Reach.HasValue && c.Budget.Value > 0)
                    .ToListAsync();

                if (cases.Count > 0)
                {
                    var totalBudget = cases.Sum(c => c.Budget!.Value);
                    var totalReach = cases.Sum(c => c.Reach!.Value);
                    var totalConversations = cases.Where(c => c.Conversations.HasValue).Sum(c => c.Conversations!.Value);
                    var validCpcCases = cases.Where(c => c.Cpc.HasValue && c.Cpc.Value > 0).ToList();

                    if (totalBudget > 0 && totalReach > 0)
                    {
                        reachPerDollar = (decimal)totalReach / totalBudget;
                    }

                    if (totalBudget > 0 && totalConversations > 0)
                    {
                        conversationsPerDollar = (decimal)totalConversations / totalBudget;
                    }

                    if (validCpcCases.Count > 0)
                    {
                        avgCpc = validCpcCases.Average(c => c.Cpc!.Value);
                    }
                }
            }
            catch
            {
                // If database is not ready or during in-memory isolated tests without DB, fallback gracefully
            }

            // 3. Platform Base Investment Factor
            // Each platform requires tailored formatting, creative variants, and algorithmic distribution
            decimal platformBaseMin = 250m * platformCount;
            decimal platformBaseMax = 420m * platformCount;

            // 4. Service Multipliers
            // Strategy/consulting and paid ads require active optimization; creative content requires asset production
            decimal serviceCostMin = 0m;
            decimal serviceCostMax = 0m;

            foreach (var s in cleanServices)
            {
                switch (s.ToLowerInvariant())
                {
                    case "paid_ads":
                    case "ads":
                    case "campaigns":
                        serviceCostMin += 250m;
                        serviceCostMax += 450m;
                        break;
                    case "content_creation":
                    case "content":
                        serviceCostMin += 300m;
                        serviceCostMax += 500m;
                        break;
                    case "account_management":
                    case "management":
                        serviceCostMin += 200m;
                        serviceCostMax += 350m;
                        break;
                    case "analytics_reporting":
                    case "analytics":
                        serviceCostMin += 150m;
                        serviceCostMax += 250m;
                        break;
                    default:
                        serviceCostMin += 150m;
                        serviceCostMax += 250m;
                        break;
                }
            }

            // If no services were explicitly picked, supply standard baseline service package
            if (cleanServices.Count == 0)
            {
                serviceCostMin = 200m;
                serviceCostMax = 350m;
            }

            decimal totalBudgetMin = Math.Round(platformBaseMin + serviceCostMin, 0);
            decimal totalBudgetMax = Math.Round(platformBaseMax + serviceCostMax, 0);

            // 5. Goal Adjustment Multipliers
            decimal reachMultiplier = 1.0m;
            decimal conversationMultiplier = 1.0m;

            switch (goal)
            {
                case "awareness":
                    // Brand awareness maximizes impressions and reach, lower direct conversation conversions
                    reachMultiplier = 1.45m;
                    conversationMultiplier = 0.40m;
                    break;
                case "sales":
                case "conversion":
                    // High intent / e-commerce sales targeting has narrower, higher-intent reach and higher CPC
                    reachMultiplier = 0.85m;
                    conversationMultiplier = 0.90m;
                    break;
                case "messages":
                default:
                    // Direct messaging engagement campaigns (the core WhatsApp/Messenger strength of Oxygen)
                    reachMultiplier = 1.05m;
                    conversationMultiplier = 1.25m;
                    break;
            }

            // 6. Compute Reach & Conversations ranges
            long reachMin = (long)Math.Round(totalBudgetMin * reachPerDollar * reachMultiplier * 0.85m);
            long reachMax = (long)Math.Round(totalBudgetMax * reachPerDollar * reachMultiplier * 1.20m);

            int convMin = (int)Math.Round(totalBudgetMin * conversationsPerDollar * conversationMultiplier * 0.80m);
            int convMax = (int)Math.Round(totalBudgetMax * conversationsPerDollar * conversationMultiplier * 1.25m);

            // Ensure sensible non-zero boundaries
            if (reachMin < 15000) reachMin = 15000;
            if (reachMax <= reachMin) reachMax = reachMin + 25000;
            if (convMin < 250) convMin = 250;
            if (convMax <= convMin) convMax = convMin + 500;

            // 7. Formulate bilingual summary for contact form
            var platformListStr = cleanPlatforms.Count > 0 ? string.Join(", ", cleanPlatforms) : "Custom";
            var serviceListStr = cleanServices.Count > 0 ? string.Join(", ", cleanServices) : "Standard Marketing Suite";

            string summaryEn = $"Custom Package: Platforms [{platformListStr}], Services [{serviceListStr}], Goal [{goal.ToUpper()}]. Est. Budget: ${totalBudgetMin:N0} - ${totalBudgetMax:N0}";
            string summaryAr = $"باقة مخصصة: المنصات [{platformListStr}]، الخدمات [{serviceListStr}]، الهدف [{goal}]. الميزانية التقديرية: ${totalBudgetMin:N0} - ${totalBudgetMax:N0}";

            return new CampaignStudioEstimateResult
            {
                BudgetMin = totalBudgetMin,
                BudgetMax = totalBudgetMax,
                ReachMin = reachMin,
                ReachMax = reachMax,
                ConversationsMin = convMin,
                ConversationsMax = convMax,
                SummaryTextEn = summaryEn,
                SummaryTextAr = summaryAr,
                DisclaimerAr = "تقديرات استرشادية مبنية على حملات سابقة ولا تشكل ضماناً تعاقدياً.",
                DisclaimerEn = "Estimates based on past campaigns, not a guarantee."
            };
        }
    }
}
