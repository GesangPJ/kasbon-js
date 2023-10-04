// sessionStorageUtils.js

export function getIsAdminFromSessionStorage() {
  const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));

  return sessionData && sessionData.isAdmin;
}
