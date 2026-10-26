import { defaultTheme, themeLocalStorageKey } from "../ThemeSelector/types";

/**
 * Inline script for the document head. It sets `data-theme` before first paint, so there is no
 * flash of the wrong theme (the stylesheet keeps the page hidden until the attribute is set).
 */
export const initThemeScript = `
(function () {
  function getImplicitPreference() {
    var mediaQuery = '(prefers-color-scheme: dark)'
    var mql = window.matchMedia(mediaQuery)
    var hasImplicitPreference = typeof mql.matches === 'boolean'

    if (hasImplicitPreference) {
      return mql.matches ? 'dark' : 'light'
    }

    return null
  }

  function themeIsValid(theme) {
    return theme === 'light' || theme === 'dark'
  }

  var themeToSet = '${defaultTheme}'
  var preference = null

  try {
    preference = window.localStorage.getItem('${themeLocalStorageKey}')
  } catch (e) {}

  if (themeIsValid(preference)) {
    themeToSet = preference
  } else {
    var implicitPreference = getImplicitPreference()

    if (implicitPreference) {
      themeToSet = implicitPreference
    }
  }

  document.documentElement.setAttribute('data-theme', themeToSet)
})();
`;
