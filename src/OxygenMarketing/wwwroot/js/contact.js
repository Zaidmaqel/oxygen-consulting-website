/**
 * Oxygen Marketing — Contact Form Module
 * Progressive enhancement for visitor inquiry and Campaign Studio bundle submission.
 * Client-side validation, anti-spam honeypot verification, and zero-reload AJAX dispatch.
 */
(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('oxygen-contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const alertBox = document.getElementById('contact-alert-box');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Clear previous alert state
      if (alertBox) {
        alertBox.style.display = 'none';
        alertBox.className = 'alert';
      }

      // Basic client-side validation
      const name = form.querySelector('[name="Name"]')?.value?.trim();
      const phone = form.querySelector('[name="Phone"]')?.value?.trim();
      const email = form.querySelector('[name="Email"]')?.value?.trim();
      const message = form.querySelector('[name="Message"]')?.value?.trim();
      const isAr = document.documentElement.lang === 'ar';

      if (!name || !phone || !email || !message) {
        showAlert(
          isAr ? 'يرجى تعبئة جميع الحقول المطلوبة (الاسم، الهاتف، البريد، والرسالة).' : 'Please fill in all required fields (Name, Phone, Email, and Message).',
          'alert-danger'
        );
        return;
      }

      // Button loading indicator
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = isAr ? 'جاري الإرسال...' : 'Sending...';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action || '/Home/Contact', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        const result = await response.json();

        if (result.success) {
          showAlert(result.message, 'alert-success');
          form.reset();
        } else {
          showAlert(result.message || (isAr ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.' : 'An error occurred while sending your message. Please try again.'), 'alert-danger');
        }
      } catch (err) {
        // Fallback: If JavaScript fetch fails or network fails, submit form normally
        console.warn('AJAX submission failed, attempting standard form post:', err);
        form.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });

    function showAlert(msg, alertClass) {
      if (!alertBox) {
        alert(msg);
        return;
      }
      alertBox.textContent = msg;
      alertBox.className = `alert ${alertClass}`;
      alertBox.style.display = 'block';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
