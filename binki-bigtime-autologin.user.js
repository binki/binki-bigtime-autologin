// ==UserScript==
// @name binki-bigtime-autologin
// @version 1.1.0
// @homepageURL https://github.com/binki/binki-bigtime-autologin
// @match https://app.bigtime.net/auth/Account/Login*
// @match https://intuit.bigtime.net/bigtime
// @match https://intuit.bigtime.net/bigtime/*
// @match https://intuit.bigtime.net/Bigtime
// @match https://intuit.bigtime.net/Bigtime/*
// @require https://github.com/binki/binki-userscript-when-input-completed/raw/d11bfc5021cb99fd80d5a2d008ffd4c7eabaf554/binki-userscript-when-input-completed.js
// ==/UserScript==

function requireSelector(selector, maybeContext) {
  maybeContext = maybeContext || document.body;
  const found = maybeContext.querySelector(selector);
  if (found) return found;
  throw new Error(`Unable to find selector ${selector}`);
}

(async () => {
  if (document.URL.startsWith('https://app.bigtime.net/')) {
    // Ensure that “Remember me” is selected even if the user manually types something in.
    const button = requireSelector('button[name="Input.Button"]');
    button.addEventListener('click', e => {
      requireSelector('#rememberMe').setAttribute('checked', 'checked');
    });

    // Wait for BigTime to autofill the input (it actually performs server-side pre-fill
    // so this ends up not waiting) or someone to paste in.
    await whenInputCompletedAsync(requireSelector('#Input_EmailAddress'));
    button.click();
  } else if (document.URL.startsWith('https://intuit.bigtime.net/')) {
    // This is really easy because these are prerendered pages.
    await whenInputCompletedAsync(requireSelector('#SUserName'));
    await whenInputCompletedAsync(requireSelector('#SPassword'));
    requireSelector('#BRememberMe').setAttribute('checked', 'checked');
    requireSelector('#form_login button[type=submit], #form_login button:not([type])').click();
  }
})();
