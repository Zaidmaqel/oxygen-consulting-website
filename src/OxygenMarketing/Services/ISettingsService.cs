using System.Collections.Generic;
using System.Threading.Tasks;
using OxygenMarketing.Models;

namespace OxygenMarketing.Services
{
    public interface ISettingsService
    {
        Task<Dictionary<string, SiteSetting>> GetAllSettingsAsync();
        Task<string> GetSettingValueAsync(string key, string culture, string defaultValue = "");
        Task UpdateSettingsAsync(Dictionary<string, (string? Ar, string? En)> updates);
    }
}
