// sessionStorageUtils.js

export function getIsAdminFromSessionStorage() {
  // Check if we're running in the browser environment
  if (typeof window !== 'undefined') {
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));

    return sessionData && sessionData.isAdmin;
  }

  // Handle non-browser environments gracefully
  return false; // Set a default value or handle it as needed
}
