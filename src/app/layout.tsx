import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.scss';
import Povider from '@/Povider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'invoiceapp',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <html lang='cs'>
            <head>
            <meta name="robots" content="noindex, nofollow" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <Povider session={session}>{children}</Povider>
            </body>
        </html>
    );
}
