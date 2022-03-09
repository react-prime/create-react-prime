export const API_URL = (() => {
  if (process.env.APP_ENV === 'beta') {
    return 'https://create-react-prime-dashboard-git-develop-sandervspl.vercel.app/api';
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api';
  }

  return 'https://create-react-prime-dashboard.vercel.app/api';
})();
