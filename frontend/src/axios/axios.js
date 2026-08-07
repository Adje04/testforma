import axios from 'axios';

// Avant : baseURL en dur, dupliquée dans 16 fichiers différents.
// Maintenant : une seule source de vérité, pilotée par .env
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // indispensable pour envoyer/recevoir le cookie refreshToken (httpOnly)
});

// --- Intercepteur de requête ---
// Avant : le header Authorization était lu UNE SEULE FOIS à la création du module,
// donc figé avec le token présent (ou absent) au premier chargement de la page.
// Maintenant : on relit le token à CHAQUE requête, donc toujours à jour après un login.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Intercepteur de réponse ---
// Si une requête échoue avec 401 (access token expiré, il ne vit que 15 min côté serveur),
// on tente UNE fois de le renouveler via /refresh-token (cookie httpOnly), puis on rejoue
// la requête d'origine. Si ça échoue aussi, on déconnecte proprement l'utilisateur.
let isRefreshing = false;
let pendingRequests = [];

function resolvePendingRequests(newToken) {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Une requête attend déjà qu'une autre finisse de rafraîchir : on patiente
        return new Promise((resolve) => {
          pendingRequests.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );

        localStorage.setItem('token', data.accessToken);
        resolvePendingRequests(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token invalide/expiré : session vraiment terminée
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
