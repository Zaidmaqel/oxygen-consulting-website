using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Data;
using OxygenMarketing.Models;

namespace OxygenMarketing.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/services")]
    public class ServicesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /admin/services
        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var services = await _context.Services.OrderBy(s => s.SortOrder).ToListAsync();
            return View(services);
        }

        // GET: /admin/services/create
        [HttpGet("create")]
        public IActionResult Create()
        {
            return View(new Service { SortOrder = 1, IsActive = true });
        }

        // POST: /admin/services/create
        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Service service)
        {
            if (!ModelState.IsValid)
            {
                return View(service);
            }

            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            TempData["AdminSuccess"] = "Service created successfully / تم إضافة الخدمة بنجاح.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /admin/services/edit/5
        [HttpGet("edit/{id:int}")]
        public async Task<IActionResult> Edit(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound();
            return View(service);
        }

        // POST: /admin/services/edit/5
        [HttpPost("edit/{id:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Service service)
        {
            if (id != service.Id) return BadRequest();

            if (!ModelState.IsValid)
            {
                return View(service);
            }

            _context.Services.Update(service);
            await _context.SaveChangesAsync();
            TempData["AdminSuccess"] = "Service updated successfully / تم تحديث الخدمة بنجاح.";
            return RedirectToAction(nameof(Index));
        }

        // POST: /admin/services/delete/5
        [HttpPost("delete/{id:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service != null)
            {
                _context.Services.Remove(service);
                await _context.SaveChangesAsync();
                TempData["AdminSuccess"] = "Service deleted successfully / تم حذف الخدمة بنجاح.";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
