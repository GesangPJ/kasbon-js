// Fungsi Ambil Session

export const fetchSessionData = async () => {
  // Ambil SessionData dari Session Storage
  const sessionDataStr = sessionStorage.getItem('sessionData');
  if (sessionDataStr) {
    const sessionData = JSON.parse(sessionDataStr);
    setSessionData(sessionData);
  }
};
