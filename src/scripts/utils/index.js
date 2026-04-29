/**
 * Utility: Check if user is logged in
 */
export function isUserLoggedIn() {
  return !!localStorage.getItem("authToken");
}

/**
 * Utility: Format tanggal (Locale Indonesia)
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Utility: View Transition API (dengan fallback)
 * Transisi visual halaman dengan animasi fade
 */
export async function transitionToView(callback) {
  if (document.startViewTransition) {
    // Browser support View Transition API
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        await callback();
        resolve();
      });
    });
  } else {
    // Fallback: langsung render tanpa animasi
    await callback();
    return Promise.resolve();
  }
}

/**
 * Utility: Setup Skip to Content
 */
export function setupSkipContent(skipLink, mainContent) {
  if (skipLink && mainContent) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
}
