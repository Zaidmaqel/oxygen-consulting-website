using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Data;
using OxygenMarketing.Models;

namespace OxygenMarketing.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly ApplicationDbContext _context;

        public SettingsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Dictionary<string, SiteSetting>> GetAllSettingsAsync()
        {
            return await _context.SiteSettings
                .AsNoTracking()
                .ToDictionaryAsync(s => s.Key, s => s);
        }

        public async Task<string> GetSettingValueAsync(string key, string culture, string defaultValue = "")
        {
            var setting = await _context.SiteSettings.FindAsync(key);
            if (setting == null) return defaultValue;

            var isArabic = culture.StartsWith("ar", StringComparison.OrdinalIgnoreCase);
            var val = isArabic ? setting.ValueAr : setting.ValueEn;
            return string.IsNullOrWhiteSpace(val) ? (setting.ValueAr ?? defaultValue) : val;
        }

        public async Task UpdateSettingsAsync(Dictionary<string, (string? Ar, string? En)> updates)
        {
            foreach (var kvp in updates)
            {
                var setting = await _context.SiteSettings.FindAsync(kvp.Key);
                if (setting != null)
                {
                    setting.ValueAr = kvp.Value.Ar;
                    setting.ValueEn = kvp.Value.En;
                }
                else
                {
                    _context.SiteSettings.Add(new SiteSetting
                    {
                        Key = kvp.Key,
                        ValueAr = kvp.Value.Ar,
                        ValueEn = kvp.Value.En
                    });
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}
