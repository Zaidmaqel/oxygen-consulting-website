using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using OxygenMarketing.Data;
using OxygenMarketing.Models;
using OxygenMarketing.Resources;
using OxygenMarketing.Services;
using OxygenMarketing.ViewModels;

namespace OxygenMarketing.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ICampaignStudioService _studioService;
        private readonly IContactService _contactService;
        private readonly ISettingsService _settingsService;
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly ILogger<HomeController> _logger;

        public HomeController(
            ApplicationDbContext context,
            ICampaignStudioService studioService,
            IContactService contactService,
            ISettingsService settingsService,
            IStringLocalizer<SharedResource> localizer,
            ILogger<HomeController> logger)
        {
            _context = context;
            _studioService = studioService;
            _contactService = contactService;
            _settingsService = settingsService;
            _localizer = localizer;
            _logger = logger;
        }

        private string CurrentCulture =>
            HttpContext.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "ar";

        // GET: /
        public async Task<IActionResult> Index()
        {
            var services = await _context.Services
                .Where(s => s.IsActive)
                .OrderBy(s => s.SortOrder)
                .ToListAsync();

            var featuredCases = await _context.CaseStudies
                .Where(c => c.IsActive && c.IsFeatured)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();

            var rawSettings = await _settingsService.GetAllSettingsAsync();
            var settingsDict = rawSettings.ToDictionary(
                k => k.Key,
                v => (CurrentCulture.StartsWith("ar") ? v.Value.ValueAr : v.Value.ValueEn) ?? v.Value.ValueAr ?? ""
            );

            var model = new HomeViewModel
            {
                Services = services,
                FeaturedCases = featuredCases,
                Settings = settingsDict,
                ContactForm = new ContactFormViewModel()
            };

            return View(model);
        }

        // GET: /Home/About
        public async Task<IActionResult> About()
        {
            var rawSettings = await _settingsService.GetAllSettingsAsync();
            ViewBag.Settings = rawSettings;
            return View();
        }

        // GET: /Home/Services
        public async Task<IActionResult> Services()
        {
            var services = await _context.Services
                .Where(s => s.IsActive)
                .OrderBy(s => s.SortOrder)
                .ToListAsync();

            return View(services);
        }

        // GET: /Home/Portfolio
        public async Task<IActionResult> Portfolio(string? sector)
        {
            var query = _context.CaseStudies.Where(c => c.IsActive);

            var isAr = CurrentCulture.StartsWith("ar");
            var allSectors = await query
                .Select(c => isAr ? c.IndustryAr : c.IndustryEn)
                .Distinct()
                .ToListAsync();

            if (!string.IsNullOrWhiteSpace(sector))
            {
                query = query.Where(c => c.IndustryAr == sector || c.IndustryEn == sector);
            }

            var cases = await query.OrderBy(c => c.SortOrder).ToListAsync();

            var model = new PortfolioViewModel
            {
                CaseStudies = cases,
                Sectors = allSectors,
                SelectedSector = sector
            };

            return View(model);
        }

        // GET: /Home/CaseStudy/5
        public async Task<IActionResult> CaseStudy(int id)
        {
            var item = await _context.CaseStudies.FirstOrDefaultAsync(c => c.Id == id && c.IsActive);
            if (item == null)
            {
                return NotFound();
            }

            var related = await _context.CaseStudies
                .Where(c => c.Id != id && c.IsActive)
                .Take(2)
                .ToListAsync();

            var vm = new CaseStudyDetailViewModel
            {
                CaseStudy = item,
                RelatedCases = related
            };

            return View(vm);
        }

        // GET: /Home/Contact
        public async Task<IActionResult> Contact()
        {
            var rawSettings = await _settingsService.GetAllSettingsAsync();
            ViewBag.Settings = rawSettings;
            ViewBag.Services = await _context.Services.Where(s => s.IsActive).OrderBy(s => s.SortOrder).ToListAsync();
            return View(new ContactFormViewModel());
        }

        // POST: /Home/Contact
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Contact(ContactFormViewModel model)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

            if (!ModelState.IsValid)
            {
                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return Json(new ContactSubmissionResult
                    {
                        Success = false,
                        Message = CurrentCulture.StartsWith("ar") ? "يرجى التحقق من الحقول المدخلة." : "Please check the entered fields.",
                        Errors = errors
                    });
                }

                var rawSettings = await _settingsService.GetAllSettingsAsync();
                ViewBag.Settings = rawSettings;
                ViewBag.Services = await _context.Services.Where(s => s.IsActive).OrderBy(s => s.SortOrder).ToListAsync();
                return View(model);
            }

            var result = await _contactService.SubmitContactAsync(model, ip, CurrentCulture);

            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                return Json(result);
            }

            if (result.Success)
            {
                TempData["SuccessMessage"] = result.Message;
                return RedirectToAction(nameof(Contact));
            }

            ModelState.AddModelError(string.Empty, result.Message);
            var settings = await _settingsService.GetAllSettingsAsync();
            ViewBag.Settings = settings;
            ViewBag.Services = await _context.Services.Where(s => s.IsActive).OrderBy(s => s.SortOrder).ToListAsync();
            return View(model);
        }

        // POST: /Home/CalculateStudioEstimate
        [HttpPost]
        public async Task<IActionResult> CalculateStudioEstimate([FromBody] CampaignStudioEstimateRequest request)
        {
            var result = await _studioService.CalculateEstimateAsync(request);
            return Json(result);
        }

        // POST: /Home/SetLanguage
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SetLanguage(string culture, string returnUrl = "/")
        {
            if (culture != "ar" && culture != "en")
            {
                culture = "ar";
            }

            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    IsEssential = true,
                    SameSite = SameSiteMode.Lax,
                    HttpOnly = false
                }
            );

            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: /Home/Privacy
        public IActionResult Privacy()
        {
            return View();
        }

        // GET: /Home/Terms
        public IActionResult Terms()
        {
            return View();
        }

        // Dynamic SEO robots.txt
        [Route("robots.txt")]
        public IActionResult Robots()
        {
            var host = Request.Host.Value;
            var sb = new StringBuilder();
            sb.AppendLine("User-agent: *");
            sb.AppendLine("Disallow: /admin");
            sb.AppendLine("Disallow: /admin/");
            sb.AppendLine("Disallow: /Admin");
            sb.AppendLine("Disallow: /Admin/");
            sb.AppendLine($"Sitemap: https://{host}/sitemap.xml");
            return Content(sb.ToString(), "text/plain", Encoding.UTF8);
        }

        // Dynamic SEO sitemap.xml
        [Route("sitemap.xml")]
        public async Task<IActionResult> Sitemap()
        {
            var host = $"{Request.Scheme}://{Request.Host}";
            var sb = new StringBuilder();
            sb.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            sb.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">");

            var pages = new[] { "", "Home/About", "Home/Services", "Home/Portfolio", "Home/Contact", "Home/Privacy", "Home/Terms" };
            foreach (var page in pages)
            {
                var loc = string.IsNullOrEmpty(page) ? host : $"{host}/{page}";
                sb.AppendLine("  <url>");
                sb.AppendLine($"    <loc>{loc}</loc>");
                sb.AppendLine($"    <xhtml:link rel=\"alternate\" hreflang=\"ar\" href=\"{loc}\" />");
                sb.AppendLine($"    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"{loc}\" />");
                sb.AppendLine("    <changefreq>weekly</changefreq>");
                sb.AppendLine("    <priority>0.8</priority>");
                sb.AppendLine("  </url>");
            }

            var cases = await _context.CaseStudies.Where(c => c.IsActive).ToListAsync();
            foreach (var c in cases)
            {
                var loc = $"{host}/Home/CaseStudy/{c.Id}";
                sb.AppendLine("  <url>");
                sb.AppendLine($"    <loc>{loc}</loc>");
                sb.AppendLine($"    <xhtml:link rel=\"alternate\" hreflang=\"ar\" href=\"{loc}\" />");
                sb.AppendLine($"    <xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"{loc}\" />");
                sb.AppendLine("    <changefreq>monthly</changefreq>");
                sb.AppendLine("    <priority>0.7</priority>");
                sb.AppendLine("  </url>");
            }

            sb.AppendLine("</urlset>");
            return Content(sb.ToString(), "application/xml", Encoding.UTF8);
        }

        // Custom Error Handling (404 and 500)
        [Route("/Home/Error/{statusCode:int?}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error(int? statusCode)
        {
            ViewBag.StatusCode = statusCode ?? 500;
            if (statusCode == 404)
            {
                return View("NotFound");
            }
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
