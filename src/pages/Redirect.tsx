import { useEffect } from 'react';

export default function VRedirect() {
  useEffect(() => {
    const next = '/auth/callback' + window.location.search + window.location.hash;
    window.location.replace(next);
  }, []);
  
  return null;
}