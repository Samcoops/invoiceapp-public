import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseClient } from '@/lib/supabase/client';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    console.error('Chybí přihlašovací údaje.');
                    return null;
                }

                const { email, password } = credentials;

                const { data, error } = await supabaseClient
                    .from('users')
                    .select('id, email, name, password')
                    .eq('email', email)
                    .single();

                if (error || !data) {
                    console.error('Uživatel nebyl nalezen. Chyba:', error?.message || 'Neznámý uživatel');
                    return null;
                }

                if (password !== data.password) {
                    console.error('Špatné heslo pro e-mail:', email);
                    return null;
                }

                // console.log("User authorized:", data);
                return { id: data.id.toString(), email: data.email, name: data.name };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            //   console.log("JWT Callback - před:", token);
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            //   console.log("JWT Callback - po:", token);
            return token;
        },
        async session({ session, token }) {
            //   console.log("Session Callback - token:", token);

            session.user = {
                id: token.sub || '',
                email: token.email || '',
                name: token.name || '',
            };

            //   console.log("Session Callback - session:", session);
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
