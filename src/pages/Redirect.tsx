import { useEffect } from 'react';

export default function VRedirect() {
  useEffect(() => {
    const dest = new URL('/auth/callback', window.location.origin);
    dest.search = window.location.search;
    dest.hash = window.location.hash;
    window.location.replace(dest.toString());
  }, []);
  
  return null;
}