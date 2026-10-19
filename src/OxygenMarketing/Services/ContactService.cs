using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OxygenMarketing.Data;
using OxygenMarketing.Models;
using OxygenMarketing.ViewModels;

namespace OxygenMarketing.Services
{
    /// <summary>
    /// Handles contact submissions, spam honeypot filtration, hourly IP rate limiting (max 5/hour),
    /// persistent DB storage, and optional notification dispatch.
    /// </summary>
    public class ContactService : IContactService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;
        private readonly ILogger<ContactService> _logger;

        public ContactService(
            ApplicationDbContext context,
            IEmailService emailService,
            IConfiguration config,
            ILogger<ContactService> logger)
        {
            _context = context;
            _emailService = emailService;
            _config = config;
            _logger = logger;
        }

        public async Task<ContactSubmissionResult> SubmitContactAsync(ContactFormViewModel model, string? ipAddress, string culture)
        {
            var isArabic = culture.StartsWith("ar", StringComparison.OrdinalIgnoreCase);

            // 1. Honeypot check: If bot filled the hidden 'Website' field, drop quietly
            if (!string.IsNullOrWhiteSpace(model.Website))
            {
                _logger.LogWarning("Spam detected via honeypot field from IP: {IpAddress}", ipAddress);
                return new ContactSubmissionResult
                {
                    Success = true,
                    Message = isArabic
                        ? "شكراً لتواصلك معنا! تم استلام رسالتك بنجاح."
                        : "Thank you for reaching out! Your message has been received."
                };
            }

            // 2. IP Rate Limiting: Maximum 5 submissions per IP within the last 1 hour
            if (!string.IsNullOrEmpty(ipAddress) && ipAddress != "127.0.0.1" && ipAddress != "::1")
            {
                var oneHourAgo = DateTime.UtcNow.AddHours(-1);
                var recentSubmissionsCount = await _context.ContactMessages
                    .CountAsync(m => m.IpAddress == ipAddress && m.CreatedAt >= oneHourAgo);

                if (recentSubmissionsCount >= 5)
                {
                    _logger.LogWarning("Rate limit exceeded for IP: {IpAddress}", ipAddress);
                    return new ContactSubmissionResult
                    {
                        Success = false,
                        Message = isArabic
                            ? "تم تجاوز الحد المسموح به من الرسائل (5 رسائل في الساعة). يرجى المحاولة لاحقاً."
                            : "Rate limit reached (maximum 5 submissions per hour). Please try again later."
                    };
                }
            }

            // 3. Save contact message to database
            var entity = new ContactMessage
            {
                Name = model.Name.Trim(),
                Phone = model.Phone.Trim(),
                Email = model.Email.Trim().ToLowerInvariant(),
                Company = model.Company?.Trim(),
                ServiceId = model.ServiceId,
                Message = model.Message.Trim(),
                CampaignDetails = model.CampaignDetails,
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                IpAddress = ipAddress
            };

            _context.ContactMessages.Add(entity);
            await _context.SaveChangesAsync();
            _logger.LogInformation("New contact message received from {Email} (ID: {Id})", entity.Email, entity.Id);

            // 4. Optionally dispatch email alert to agency inbox
            var notifyEmail = _config["ContactSettings:NotificationEmail"] ?? "infooxygenmedia2022@gmail.com";
            var subject = $"[Oxygen Inquiry] New Message from {entity.Name}";
            var body = $@"
                <h2>New Contact Inquiry - Oxygen Website</h2>
                <p><strong>Name:</strong> {entity.Name}</p>
                <p><strong>Phone:</strong> {entity.Phone}</p>
                <p><strong>Email:</strong> {entity.Email}</p>
                <p><strong>Company:</strong> {entity.Company ?? "N/A"}</p>
                <p><strong>Message:</strong><br/>{entity.Message.Replace("\n", "<br/>")}</p>
                {(string.IsNullOrEmpty(entity.CampaignDetails) ? "" : $"<p><strong>Campaign Studio Details:</strong><br/>{entity.CampaignDetails}</p>")}
                <p><small>Received at {entity.CreatedAt:yyyy-MM-dd HH:mm:ss UTC} from {ipAddress}</small></p>
            ";

            _ = _emailService.SendEmailAsync(notifyEmail, subject, body);

            return new ContactSubmissionResult
            {
                Success = true,
                Message = isArabic
                    ? "شكراً لتواصلك معنا! تم استلام رسالتك بنجاح وسيتواصل معك فريق أكسجين قريباً."
                    : "Thank you for reaching out! Your message has been received and our team will get back to you shortly."
            };
        }
    }
}
