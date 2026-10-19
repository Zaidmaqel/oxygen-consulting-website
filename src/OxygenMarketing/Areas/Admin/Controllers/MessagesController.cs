using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OxygenMarketing.Data;

namespace OxygenMarketing.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    [Route("admin/messages")]
    public class MessagesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /admin/messages
        [HttpGet("")]
        public async Task<IActionResult> Index(string? filter)
        {
            var query = _context.ContactMessages
                .Include(m => m.Service)
                .AsQueryable();

            if (filter == "unread")
            {
                query = query.Where(m => !m.IsRead);
            }

            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            ViewBag.CurrentFilter = filter;
            return View(messages);
        }

        // GET: /admin/messages/details/5
        [HttpGet("details/{id:int}")]
        public async Task<IActionResult> Details(int id)
        {
            var message = await _context.ContactMessages
                .Include(m => m.Service)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (message == null) return NotFound();

            if (!message.IsRead)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }

            return View(message);
        }

        // POST: /admin/messages/delete/5
        [HttpPost("delete/{id:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message != null)
            {
                _context.ContactMessages.Remove(message);
                await _context.SaveChangesAsync();
                TempData["AdminSuccess"] = "Message deleted successfully / تم حذف الرسالة بنجاح.";
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: /admin/messages/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportCsv()
        {
            var messages = await _context.ContactMessages
                .Include(m => m.Service)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            var sb = new StringBuilder();
            // Write UTF-8 BOM for Excel Arabic compatibility
            sb.Append('\uFEFF');
            sb.AppendLine("ID,Date (UTC),Name,Phone,Email,Company,Service,Message,Campaign Studio Details,IP Address");

            foreach (var m in messages)
            {
                var cleanMsg = $"\"{m.Message.Replace("\"", "\"\"")}\"";
                var cleanDetails = string.IsNullOrEmpty(m.CampaignDetails) ? "\"\"" : $"\"{m.CampaignDetails.Replace("\"", "\"\"")}\"";
                var serviceName = m.Service != null ? $"\"{m.Service.TitleEn} / {m.Service.TitleAr}\"" : "\"General\"";

                sb.AppendLine($"{m.Id},{m.CreatedAt:yyyy-MM-dd HH:mm},\"{m.Name}\",\"{m.Phone}\",\"{m.Email}\",\"{m.Company}\",{serviceName},{cleanMsg},{cleanDetails},\"{m.IpAddress}\"");
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var fileName = $"Oxygen_Inquiries_{DateTime.UtcNow:yyyyMMdd_HHmm}.csv";
            return File(bytes, "text/csv", fileName);
        }
    }
}
