import { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { GetUniqueActions } from '@/app/_actions/actions';

type UniqueAction = {
  acao: string;
  count: number;
};

export const useFetchUniqueActions = () => {
  const [uniqueActions, setUniqueActions] = useState<UniqueAction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniqueActions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Verifica se o usuário está autenticado
        const session = await fetchAuthSession();

        if (!session || !session.tokens) {
          throw new Error('Usuário não autenticado.');
        }

        // Faz o fetch apenas se a sessão for válida
        const actions = await GetUniqueActions();
        setUniqueActions(actions);
      } catch (err: any) {
        console.error('Erro ao buscar ações únicas:', err);
        setError(err.message || 'Erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueActions();
  }, []); // Executa apenas uma vez ao montar o componente

  return { uniqueActions, loading, error };
};
