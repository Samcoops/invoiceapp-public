// app/auth/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Přihlášení pomocí credentials
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            alert('Přihlášení selhalo: ' + result.error);
        } else {
            router.push('/'); // Přesměrování po úspěšném přihlášení
        }
    };

    return (
        <div style={{ maxWidth: '350px', width: '100%', margin: 'auto', padding: '200px 25px' }}>
            <h1 style={{marginBottom: '25px', textAlign: 'center'}}>Přihlášení</h1>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <label className='flex column start'>
                    Email:
                    <input
                        style={{ width: '100%' }}
                        type='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label className='flex column start'>
                    Heslo:
                    <input
                        style={{ width: '100%' }}
                        type='password'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button style={{width: '100%'}} type='submit'>Přihlásit</button>
            </form>
        </div>
    );
}
