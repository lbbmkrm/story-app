export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function transitionToView(callback) {
  if (document.startViewTransition) {
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        await callback();
        resolve();
      });
    });
  } else {
    await callback();
    return Promise.resolve();
  }
}

export function setupSkipContent(skipLink, mainContent) {
  if (skipLink && mainContent) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
}
