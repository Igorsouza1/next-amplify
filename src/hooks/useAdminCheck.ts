import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminGroup = async () => {
      try {
        // Obtém a sessão de autenticação atual
        const session = await fetchAuthSession();

        // Verifica se os tokens estão presentes
        if (session.tokens) {
          // Extrai o payload do token de acesso
          const { accessToken } = session.tokens;
          const payload = accessToken.payload

          // Verifica se o usuário pertence ao grupo "ADMINS"
          const groups = payload['cognito:groups'] || [];
          setIsAdmin(Array.isArray(groups) && groups.includes('ADMIN'));
        } else {
          console.error('Tokens de autenticação não encontrados.');
        }
      } catch (error) {
        console.error('Erro ao verificar grupo do usuário:', error);
      }
    };

    checkAdminGroup();
  }, []);

  return isAdmin;
};

export default useAdminCheck;
