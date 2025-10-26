/*
  Password rules:
  - Minimum length = 8
  - Must contain at least:
    - 1 number
    - 1 lowercase letter
    - 1 uppercase letter
    - 1 special character
  - Passwords must match
*/

// Helper: toggle success/danger styles for a rule item
function setRuleState(id, isMet) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('list-group-item-success', !!isMet);
  el.classList.toggle('list-group-item-danger', !isMet);
}

// Evaluate password and update UI
function updateRules() {
  const pw = document.getElementById('passwordInput')?.value || '';
  const pw2 = document.getElementById('passwordVerify')?.value || '';

  const hasLen = pw.length >= 8;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSpecial = /[!@#$%^&*()\-_=+\[\]{};:\"'<>.,?\/\\|`~]/.test(pw);
  const matches = pw.length > 0 && pw === pw2;

  setRuleState('rule-length', hasLen);
  setRuleState('rule-upper', hasUpper);
  setRuleState('rule-lower', hasLower);
  setRuleState('rule-number', hasDigit);
  setRuleState('rule-special', hasSpecial);
  setRuleState('rule-match', matches);

  return { hasLen, hasUpper, hasLower, hasDigit, hasSpecial, matches };
}

// Called by inline oninput handlers
function inputPassword() {
  updateRules();
}

// Called by the "Copy Password" button
function validatePassword() {
  const { hasLen, hasUpper, hasLower, hasDigit, hasSpecial, matches } = updateRules();
  const ok = hasLen && hasUpper && hasLower && hasDigit && hasSpecial && matches;
  if (!ok) {
    alert('Password does not meet all requirements yet.');
  } else {
    alert('Great! Your password meets all requirements.');
  }
  return ok;
}

// Save Password: copy current password to clipboard and alert
function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for insecure contexts/older browsers
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(ta);
      successful ? resolve() : reject(new Error('Copy command was unsuccessful'));
    } catch (err) {
      reject(err);
    }
  });
}

// Show a Bootstrap-style alert in the page (fallback to alert())
function showAlert(message, type = 'success', timeout = 4000) {
  const container = document.getElementById('alertContainer');
  if (!container) {
    alert(message);
    return;
  }
  // Replace any existing alert
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = `alert alert-${type} alert-dismissible fade show`;
  wrapper.setAttribute('role', 'alert');
  wrapper.textContent = message;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-close';
  btn.setAttribute('aria-label', 'Close');
  btn.addEventListener('click', () => wrapper.remove());

  wrapper.appendChild(btn);
  container.appendChild(wrapper);

  if (timeout && timeout > 0) {
    setTimeout(() => {
      try { wrapper.classList.remove('show'); } catch (e) {}
      // Remove after transition (~150ms), keep it simple
      setTimeout(() => wrapper.remove(), 200);
    }, timeout);
  }
}

function savePassword() {
  // Evaluate and sync UI
  const { hasLen, hasUpper, hasLower, hasDigit, hasSpecial, matches } = updateRules();
  const pw = document.getElementById('passwordInput')?.value || '';
  const pw2 = document.getElementById('passwordVerify')?.value || '';

  if (!pw) {
    showAlert('Please enter a password.', 'warning');
    return false;
  }

  // Ensure both fields are filled and match
  if (!pw2 || !matches) {
    showAlert('Passwords do not match and cannot be copied. Please make both entries identical.', 'warning');
    return false;
  }

  // Ensure all complexity requirements are met
  if (!(hasLen && hasUpper && hasLower && hasDigit && hasSpecial)) {
    showAlert('Password does not meet all requirements and cannot be copied yet.', 'warning');
    return false;
  }

  // Copy to clipboard
  copyTextToClipboard(pw)
    .then(() => {
      showAlert('Password has been saved to the clipboard.', 'success');
    })
    .catch((err) => {
      console.error('Clipboard error:', err);
      showAlert('Sorry, could not copy the password to the clipboard.', 'danger');
    });
  return true;
}

// Measure the toggle button widths and adjust input padding so text/placeholder
// appear centered relative to the entire input group.
function adjustCentering() {
  try {
    const pairs = [
      { inputId: 'passwordInput', btnId: 'togglePassword' },
      { inputId: 'passwordVerify', btnId: 'togglePasswordVerify' },
    ];
    pairs.forEach(({ inputId, btnId }) => {
      const input = document.getElementById(inputId);
      const btn = document.getElementById(btnId);
      if (!input || !btn) return;
      const btnRect = btn.getBoundingClientRect();
      // Use measured width; minimal buffer to account for borders
      const offset = Math.ceil(btnRect.width) + 1;
      input.style.setProperty('--toggle-offset', offset + 'px');
    });
  } catch (_) {
    // Ignore errors
  }
}

// Initialize styles once DOM is ready (covers refresh / prefilled fields)
function initUI() {
  updateRules();
  adjustCentering();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}

// Keep centering accurate on resize
window.addEventListener('resize', adjustCentering);