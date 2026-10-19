using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Data;
using OxygenMarketing.Models;
using OxygenMarketing.Services;

namespace OxygenMarketing.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/casestudies")]
    public class CaseStudiesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileService _fileService;

        public CaseStudiesController(ApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        // GET: /admin/casestudies
        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            var cases = await _context.CaseStudies.OrderBy(c => c.SortOrder).ToListAsync();
            return View(cases);
        }

        // GET: /admin/casestudies/create
        [HttpGet("create")]
        public IActionResult Create()
        {
            return View(new CaseStudy { SortOrder = 1, IsActive = true, IsFeatured = true });
        }

        // POST: /admin/casestudies/create
        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CaseStudy item, IFormFile? imageFile)
        {
            if (imageFile != null)
            {
                var (success, filePath, error) = await _fileService.SaveImageAsync(imageFile, "uploads");
                if (success)
                {
                    item.ImagePath = filePath;
                }
                else
                {
                    ModelState.AddModelError(string.Empty, error ?? "Failed to upload image.");
                }
            }

            if (!ModelState.IsValid)
            {
                return View(item);
            }

            _context.CaseStudies.Add(item);
            await _context.SaveChangesAsync();
            TempData["AdminSuccess"] = "Case study created successfully / تم إنشاء دراسة الحالة بنجاح.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /admin/casestudies/edit/5
        [HttpGet("edit/{id:int}")]
        public async Task<IActionResult> Edit(int id)
        {
            var item = await _context.CaseStudies.FindAsync(id);
            if (item == null) return NotFound();
            return View(item);
        }

        // POST: /admin/casestudies/edit/5
        [HttpPost("edit/{id:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, CaseStudy item, IFormFile? imageFile)
        {
            if (id != item.Id) return BadRequest();

            if (imageFile != null)
            {
                var (success, filePath, error) = await _fileService.SaveImageAsync(imageFile, "uploads");
                if (success)
                {
                    _fileService.DeleteFile(item.ImagePath);
                    item.ImagePath = filePath;
                }
                else
                {
                    ModelState.AddModelError(string.Empty, error ?? "Failed to upload image.");
                }
            }

            if (!ModelState.IsValid)
            {
                return View(item);
            }

            _context.CaseStudies.Update(item);
            await _context.SaveChangesAsync();
            TempData["AdminSuccess"] = "Case study updated successfully / تم تحديث دراسة الحالة بنجاح.";
            return RedirectToAction(nameof(Index));
        }

        // POST: /admin/casestudies/delete/5
        [HttpPost("delete/{id:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.CaseStudies.FindAsync(id);
            if (item != null)
            {
                _fileService.DeleteFile(item.ImagePath);
                _context.CaseStudies.Remove(item);
                await _context.SaveChangesAsync();
                TempData["AdminSuccess"] = "Case study deleted successfully / تم حذف دراسة الحالة بنجاح.";
            }

            return RedirectToAction(nameof(Index));
        }
    }
}
