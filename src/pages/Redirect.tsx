import { useEffect } from 'react';

export default function VRedirect() {
  useEffect(() => {
    window.location.replace('/auth/callback' + window.location.search + window.location.hash);
  }, []);
  
  return null;
}