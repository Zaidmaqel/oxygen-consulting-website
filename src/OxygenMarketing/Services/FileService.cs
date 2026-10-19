using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace OxygenMarketing.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<FileService> _logger;

        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".svg" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public FileService(IWebHostEnvironment env, ILogger<FileService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public async Task<(bool Success, string? FilePath, string? ErrorMessage)> SaveImageAsync(IFormFile? file, string folder = "uploads")
        {
            if (file == null || file.Length == 0)
            {
                return (false, null, "No file provided.");
            }

            if (file.Length > MaxFileSize)
            {
                return (false, null, "File size exceeds the 5MB limit.");
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                return (false, null, $"Invalid file format. Allowed formats: {string.Join(", ", AllowedExtensions)}");
            }

            try
            {
                var uploadsDir = Path.Combine(_env.WebRootPath, folder);
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                // Random safe filename to prevent directory traversal or name collision
                var fileName = $"{Guid.NewGuid():N}{extension}";
                var fullPath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var relativeUrl = $"/{folder}/{fileName}";
                return (true, relativeUrl, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to upload file.");
                return (false, null, "An error occurred while uploading the file.");
            }
        }

        public void DeleteFile(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath)) return;

            try
            {
                // Only allow deleting files inside /uploads
                var cleanPath = relativePath.TrimStart('/', '\\');
                if (!cleanPath.StartsWith("uploads", StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                var fullPath = Path.Combine(_env.WebRootPath, cleanPath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {Path}", relativePath);
            }
        }
    }
}
