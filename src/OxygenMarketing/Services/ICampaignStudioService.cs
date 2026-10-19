using System.Threading.Tasks;
using OxygenMarketing.ViewModels;

namespace OxygenMarketing.Services
{
    /// <summary>
    /// Service interface for Campaign Studio calculations.
    /// Encapsulates all estimation algorithms outside of controllers and client-side JavaScript.
    /// </summary>
    public interface ICampaignStudioService
    {
        /// <summary>
        /// Computes estimated budget ranges, reach projections, and conversation volumes
        /// based on user configuration and verified historical performance benchmarks.
        /// </summary>
        Task<CampaignStudioEstimateResult> CalculateEstimateAsync(CampaignStudioEstimateRequest request);
    }
}
