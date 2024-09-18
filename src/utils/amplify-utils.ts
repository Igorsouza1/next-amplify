import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import config from '@/../amplify_outputs.json';
import { cookies } from 'next/headers';
import { getCurrentUser } from 'aws-amplify/auth/server';

export const { runWithAmplifyServerContext } = createServerRunner({
    config
})



export const isAuthenticated = async (): Promise<boolean> => {
    return await runWithAmplifyServerContext({
        nextServerContext: {cookies},
        async operation(contextSpec) {
            try {
                const user = await getCurrentUser(contextSpec);
                return !!user;
            } catch (E) {
                return false;
            }
        }
    });
}

