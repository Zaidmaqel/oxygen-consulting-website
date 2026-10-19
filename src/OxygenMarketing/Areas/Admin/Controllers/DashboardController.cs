using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Areas.Admin.ViewModels;
using OxygenMarketing.Data;

namespace OxygenMarketing.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin")]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /admin
        [HttpGet("")]
        [HttpGet("dashboard")]
        public async Task<IActionResult> Index()
        {
            var totalMessages = await _context.ContactMessages.CountAsync();
            var unreadMessages = await _context.ContactMessages.CountAsync(m => !m.IsRead);
            var totalServices = await _context.Services.CountAsync();
            var totalCaseStudies = await _context.CaseStudies.CountAsync();

            var recentMessages = await _context.ContactMessages
                .Include(m => m.Service)
                .OrderByDescending(m => m.CreatedAt)
                .Take(5)
                .ToListAsync();

            var vm = new AdminDashboardViewModel
            {
                TotalMessages = totalMessages,
                UnreadMessages = unreadMessages,
                TotalServices = totalServices,
                TotalCaseStudies = totalCaseStudies,
                RecentMessages = recentMessages
            };

            return View(vm);
        }
    }
}
