using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace OxygenMarketing.Services
{
    /// <summary>
    /// Email dispatch service with SMTP support.
    /// By default disabled in appsettings.json for zero-configuration local runs.
    /// Can be enabled in production by providing real SMTP credentials.
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string bodyHtml)
        {
            var isEnabled = _config.GetValue<bool>("Smtp:Enabled", false);
            if (!isEnabled)
            {
                _logger.LogInformation("SMTP dispatch is disabled. Simulated email to: {To}, Subject: {Subject}", toEmail, subject);
                return;
            }

            try
            {
                var host = _config["Smtp:Host"];
                var port = _config.GetValue<int>("Smtp:Port", 587);
                var username = _config["Smtp:Username"];
                var password = _config["Smtp:Password"];
                var fromEmail = _config["Smtp:FromEmail"] ?? "no-reply@oxygen.jo";
                var enableSsl = _config.GetValue<bool>("Smtp:EnableSsl", true);

                if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(username))
                {
                    _logger.LogWarning("SMTP is marked enabled but host/username configuration is missing.");
                    return;
                }

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = enableSsl
                };

                using var mail = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Oxygen Consulting & Marketing"),
                    Subject = subject,
                    Body = bodyHtml,
                    IsBodyHtml = true
                };
                mail.To.Add(toEmail);

                await client.SendMailAsync(mail);
                _logger.LogInformation("Notification email sent to {To}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To}", toEmail);
            }
        }
    }
}
