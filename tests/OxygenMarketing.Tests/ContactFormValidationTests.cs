using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using OxygenMarketing.ViewModels;
using Xunit;

namespace OxygenMarketing.Tests
{
    public class ContactFormValidationTests
    {
        private IList<ValidationResult> ValidateModel(object model)
        {
            var results = new List<ValidationResult>();
            var context = new ValidationContext(model, serviceProvider: null, items: null);
            Validator.TryValidateObject(model, context, results, validateAllProperties: true);
            return results;
        }

        [Fact]
        public void ContactForm_EmptyFields_FailsValidation()
        {
            // Arrange
            var model = new ContactFormViewModel();

            // Act
            var errors = ValidateModel(model);

            // Assert
            Assert.NotEmpty(errors);
            Assert.Contains(errors, e => e.MemberNames.Contains(nameof(ContactFormViewModel.Name)));
            Assert.Contains(errors, e => e.MemberNames.Contains(nameof(ContactFormViewModel.Phone)));
            Assert.Contains(errors, e => e.MemberNames.Contains(nameof(ContactFormViewModel.Email)));
            Assert.Contains(errors, e => e.MemberNames.Contains(nameof(ContactFormViewModel.Message)));
        }

        [Theory]
        [InlineData("not-an-email")]
        [InlineData("plainaddress")]
        [InlineData("@missingusername.com")]
        public void ContactForm_InvalidEmail_FailsValidation(string invalidEmail)
        {
            // Arrange
            var model = new ContactFormViewModel
            {
                Name = "Omar",
                Phone = "+962796690421",
                Email = invalidEmail,
                Message = "Inquiring about marketing campaigns."
            };

            // Act
            var errors = ValidateModel(model);

            // Assert
            Assert.Contains(errors, e => e.MemberNames.Contains(nameof(ContactFormViewModel.Email)));
        }

        [Fact]
        public void ContactForm_ValidInputs_PassesValidation()
        {
            // Arrange
            var model = new ContactFormViewModel
            {
                Name = "Sarah Marketing",
                Phone = "+962796690421",
                Email = "sarah@company.jo",
                Company = "Fashion Hub",
                Message = "We need an integrated paid advertising campaign for our new store launch."
            };

            // Act
            var errors = ValidateModel(model);

            // Assert
            Assert.Empty(errors);
        }
    }
}
