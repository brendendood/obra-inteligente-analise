
import { useEffect, useMemo, useState } from 'react';

export interface BrazilState {
  id: number;
  sigla: string;
  nome: string;
}

export interface BrazilCity {
  id: number;
  nome: string;
}

const STATES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';
const CITIES_BY_UF_URL = (uf: string) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`;

const citiesCache = new Map<string, BrazilCity[]>();

export const useBrazilLocations = () => {
  const [states, setStates] = useState<BrazilState[]>([]);
  const [cities, setCities] = useState<BrazilCity[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingStates(true);
    fetch(STATES_URL)
      .then((res) => res.json())
      .then((data: any[]) => {
        if (!mounted) return;
        // Normalize and sort just in case
        const parsed = data
          .map((s) => ({ id: s.id, sigla: s.sigla, nome: s.nome }))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        setStates(parsed);
      })
      .catch((e) => setError(e?.message || 'Falha ao carregar estados'))
      .finally(() => setLoadingStates(false));
    return () => {
      mounted = false;
    };
  }, []);

  const loadCities = async (uf: string) => {
    if (!uf) return;
    setError(null);
    setLoadingCities(true);
    try {
      if (citiesCache.has(uf)) {
        setCities(citiesCache.get(uf)!);
      } else {
        const res = await fetch(CITIES_BY_UF_URL(uf));
        const data: any[] = await res.json();
        const parsed = data
          .map((c) => ({ id: c.id, nome: c.nome }))
          .sort((a, b) => a.nome.localeCompare(b.nome));
        citiesCache.set(uf, parsed);
        setCities(parsed);
      }
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar cidades');
    } finally {
      setLoadingCities(false);
    }
  };

  const stateOptions = useMemo(() => states.map((s) => ({ value: s.sigla, label: `${s.nome} (${s.sigla})` })), [states]);
  const cityOptions = useMemo(() => cities.map((c) => ({ value: c.nome, label: c.nome })), [cities]);

  return {
    states,
    cities,
    stateOptions,
    cityOptions,
    loadingStates,
    loadingCities,
    error,
    loadCities,
  };
};
