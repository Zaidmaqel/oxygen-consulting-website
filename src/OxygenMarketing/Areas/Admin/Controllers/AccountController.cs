using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OxygenMarketing.Areas.Admin.ViewModels;
using OxygenMarketing.Models;

namespace OxygenMarketing.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("admin")]
    public class AccountController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<AccountController> _logger;

        public AccountController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _logger = logger;
        }

        // GET: /admin/login
        [HttpGet("login")]
        [AllowAnonymous]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity?.IsAuthenticated == true && User.IsInRole("Admin"))
            {
                return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
            }

            ViewData["ReturnUrl"] = returnUrl;
            return View(new AdminLoginViewModel());
        }

        // POST: /admin/login
        [HttpPost("login")]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(AdminLoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.IsInRoleAsync(user, "Admin"))
            {
                _logger.LogWarning("Failed admin login attempt for email: {Email}", model.Email);
                ModelState.AddModelError(string.Empty, "Invalid login credentials / بيانات الدخول غير صحيحة.");
                return View(model);
            }

            // Attempt password sign in with lockout enabled
            var result = await _signInManager.PasswordSignInAsync(
                user.UserName ?? model.Email,
                model.Password,
                model.RememberMe,
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                _logger.LogInformation("Admin user {Email} logged in successfully.", model.Email);

                if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                {
                    return Redirect(returnUrl);
                }
                return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
            }

            if (result.IsLockedOut)
            {
                _logger.LogWarning("Admin account {Email} locked out due to multiple failed attempts.", model.Email);
                ModelState.AddModelError(string.Empty, "This account has been locked out for 15 minutes due to multiple failed login attempts. / تم قفل الحساب مؤقتاً بسبب تكرار المحاولات الخاطئة.");
                return View(model);
            }

            ModelState.AddModelError(string.Empty, "Invalid login credentials / بيانات الدخول غير صحيحة.");
            return View(model);
        }

        // POST: /admin/logout
        [HttpPost("logout")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("Admin user signed out.");
            return RedirectToAction(nameof(Login));
        }
    }
}
