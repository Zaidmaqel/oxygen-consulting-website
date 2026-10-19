using System.Threading.Tasks;
using OxygenMarketing.ViewModels;

namespace OxygenMarketing.Services
{
    public interface IContactService
    {
        Task<ContactSubmissionResult> SubmitContactAsync(ContactFormViewModel model, string? ipAddress, string culture);
    }
}
