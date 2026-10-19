using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace OxygenMarketing.Services
{
    public interface IFileService
    {
        Task<(bool Success, string? FilePath, string? ErrorMessage)> SaveImageAsync(IFormFile? file, string folder = "uploads");
        void DeleteFile(string? relativePath);
    }
}
