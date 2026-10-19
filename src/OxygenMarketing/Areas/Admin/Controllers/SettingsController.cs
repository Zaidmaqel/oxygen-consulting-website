using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OxygenMarketing.Services;

namespace OxygenMarketing.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/settings")]
    public class SettingsController : Controller
    {
        private readonly ISettingsService _settingsService;

        public SettingsController(ISettingsService settingsService)
        {
            _settingsService = settingsService;
        }

        // GET: /admin/settings
        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var settings = await _settingsService.GetAllSettingsAsync();
            return View(settings);
        }

        // POST: /admin/settings
        [HttpPost("")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Dictionary<string, string> valuesAr, Dictionary<string, string> valuesEn)
        {
            var updates = new Dictionary<string, (string? Ar, string? En)>();

            foreach (var key in valuesAr.Keys)
            {
                var ar = valuesAr.GetValueOrDefault(key);
                var en = valuesEn.GetValueOrDefault(key);
                updates[key] = (ar, en);
            }

            await _settingsService.UpdateSettingsAsync(updates);
            TempData["AdminSuccess"] = "Settings updated successfully / تم تحديث إعدادات الموقع بنجاح.";
            return RedirectToAction(nameof(Index));
        }
    }
}
