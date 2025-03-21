// ==UserScript==
// @name binki-bigtime-autologin
// @version 1.0.0
// @homepageURL https://github.com/binki/binki-bigtime-autologin
// @match https://app.bigtime.net/auth/Account/Login*
// @match https://intuit.bigtime.net/bigtime
// @match https://intuit.bigtime.net/bigtime/*
// @match https://intuit.bigtime.net/Bigtime
// @match https://intuit.bigtime.net/Bigtime/*
// ==/UserScript==

function requireSelector(selector, maybeContext) {
  maybeContext = maybeContext || document.body;
  const found = maybeContext.querySelector(selector);
  if (found) return found;
  throw new Error(`Unable to find selector ${selector}`);
}

function whenTextCompletedAsync(input, maybeAutoCompleteDelta) {
  const inputEventName = 'input';
  const autoCompleteDelta = maybeAutoCompleteDelta || 4;
  return new Promise(resolve => {
    let lastLength = 0;
    const inputHandler = () => {
      if (input.value.length >= autoCompleteDelta && Math.abs(input.value.length - lastLength) >= autoCompleteDelta) {
        input.removeEventListener(inputEventName, inputHandler);
        resolve();
      } else {
        lastLength = input.value.length;
      }
    };
    input.addEventListener(inputEventName, inputHandler);
    inputHandler();
  });
}

(async () => {
  if (document.URL.startsWith('https://app.bigtime.net/')) {
    // This is really easy because these are prerendered pages.
    await whenTextCompletedAsync(requireSelector('#Input_EmailAddress'));
    requireSelector('#rememberMe').setAttribute('checked', 'checked');
    requireSelector('button[name="Input.Button"]').click();
  } else if (document.URL.startsWith('https://intuit.bigtime.net/')) {
    // This is really easy because these are prerendered pages.
    await whenTextCompletedAsync(requireSelector('#SUserName'));
    await whenTextCompletedAsync(requireSelector('#SPassword'));
    requireSelector('#BRememberMe').setAttribute('checked', 'checked');
    requireSelector('#form_login button[type=submit], #form_login button:not([type])').click();
  }
})();
