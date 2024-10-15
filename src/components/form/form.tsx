'use client';

import { useEffect, useRef, useState } from 'react';
import s from './form.module.scss';
import InvoiceComponent from '../invoice/invoice';
import html2pdf from 'html2pdf.js';
import { fetchCustomers, fetchSuppliers, iCustomerProfile, iSupplierProfile } from '@/lib/actions/fetchProfiles';
import { saveCustomers, saveSuppliers } from '@/lib/actions/saveProfiles';
import { deleteCustomer, deleteSupplier } from '@/lib/actions/deleteProfiles';
import Loading from '@/app/loading';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FormComponent() {
    const router = useRouter();
    const { data: session } = useSession();

    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [showInvoice, setShowInvoice] = useState<boolean>(false);
    const [scaleInvoice, setScaleInvoice] = useState<number>(1);
    const [dynamicHeight, setDynamicHeight] = useState<number>(1123);

    // Supplier and Customer Profile States
    const [invoiceNumber, setInvoiceNumber] = useState<string>('');
    const [invoiceSupplierName, setInvoiceSupplierName] = useState<string>('');
    const [invoiceSupplierAddress, setInvoiceSupplierAddress] = useState<string>('');
    const [invoiceSupplierPSC, setInvoiceSupplierPSC] = useState<string>('');
    const [invoiceSupplierICO, setInvoiceSupplierICO] = useState<string>('');
    const [invoiceSupplierDIC, setInvoiceSupplierDIC] = useState<string>('');
    const [invoiceSupplierBank, setInvoiceSupplierBank] = useState<string>('');
    const [invoiceSupplierBankAccount, setInvoiceSupplierBankAccount] = useState<string>('');
    const [invoiceCustomerName, setInvoiceCustomerName] = useState<string>('');
    const [invoiceCustomerAddress, setInvoiceCustomerAddress] = useState<string>('');
    const [invoiceCustomerPSC, setInvoiceCustomerPSC] = useState<string>('');
    const [invoiceCustomerICO, setInvoiceCustomerICO] = useState<string>('');
    const [invoiceCustomerDIC, setInvoiceCustomerDIC] = useState<string>('');

    // Payment Terms
    const [invoicePayStart, setInvoicePayStart] = useState<string>('');
    const [invoicePayDid, setInvoicePayDid] = useState<string>('');
    const [invoicePayLast, setInvoicePayLast] = useState<string>('');

    // Invoice Text and Price
    const [invoiceText, setInvoiceText] = useState<string[]>([]);
    const [invoicePrice, setInvoicePrice] = useState<number>(0);

    const [isSuppliersStartLoad, setIsSuppliersStartLoad] = useState<boolean>(false);
    const [isCustomersStartLoad, setIsCustomersStartLoad] = useState<boolean>(false);
    const [invoiceSupplierProfiles, setInvoiceSupplierProfiles] = useState<iSupplierProfile[]>([]);
    const [invoiceCustomerProfiles, setInvoiceCustomerProfiles] = useState<iCustomerProfile[]>([]);
    const [selectedSupplierProfile, setSelectedSupplierProfile] = useState<number>(0);
    const [selectedCustomerProfile, setSelectedCustomerProfile] = useState<number>(0);
    const [isUseSupplierProfile, setIsUseSupplierProfile] = useState<boolean>(false);
    const [isUseCustomerProfile, setIsUseCustomerProfile] = useState<boolean>(false);
    const [isLoadingPreviewSupplierProfilesOption, setIsLoadingPreviewSupplierProfilesOption] = useState<boolean>(false);
    const [isLoadingPreviewCustomerProfilesOption, setIsLoadingPreviewCustomerProfilesOption] = useState<boolean>(false);

    const invoiceRef = useRef<HTMLDivElement>(null);

    // Helper functions for handling inputs
    const handleChange = (setter: (value: any) => void, key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setter(value);
        localStorage.setItem(key, value.toString());
    };

    const handleTextChange = (index: number, value: string) => {
        const newTexts = [...invoiceText];
        newTexts[index] = value;
        setInvoiceText(newTexts);
        if (index === 0) localStorage.setItem('invoiceText', value);
    };

    const addTextArea = () => setInvoiceText([...invoiceText, '']);
    const removeTextArea = () => setInvoiceText(invoiceText.slice(0, -1));

    const setAllRestInvoiceInputsByLocaleStorage = () => {
        setShowInvoice(localStorage.getItem('showInvoice') === 'true');
        setInvoiceNumber(localStorage.getItem('invoiceNumber') || '');
        setInvoicePayStart(localStorage.getItem('invoicePayStart') || '');
        setInvoicePayDid(localStorage.getItem('invoicePayDid') || '');
        setInvoicePayLast(localStorage.getItem('invoicePayLast') || '');
        setInvoiceText([localStorage.getItem('invoiceText') || '']);
        setInvoicePrice(parseInt(localStorage.getItem('invoicePrice') || '0'));
    };

    const setAllSupplierInputsByLocaleStorage = () => {
        setInvoiceSupplierName(localStorage.getItem('invoiceSupplierName') || '');
        setInvoiceSupplierAddress(localStorage.getItem('invoiceSupplierAddress') || '');
        setInvoiceSupplierPSC(localStorage.getItem('invoiceSupplierPSC') || '');
        setInvoiceSupplierICO(localStorage.getItem('invoiceSupplierICO') || '');
        setInvoiceSupplierDIC(localStorage.getItem('invoiceSupplierDIC') || '');
        setInvoiceSupplierBank(localStorage.getItem('invoiceSupplierBank') || '');
        setInvoiceSupplierBankAccount(localStorage.getItem('invoiceSupplierBankAccount') || '');
    };

    const setAllCustomerInputsByLocaleStorage = () => {
        setInvoiceCustomerName(localStorage.getItem('invoiceCustomerName') || '');
        setInvoiceCustomerAddress(localStorage.getItem('invoiceCustomerAddress') || '');
        setInvoiceCustomerPSC(localStorage.getItem('invoiceCustomerPSC') || '');
        setInvoiceCustomerICO(localStorage.getItem('invoiceCustomerICO') || '');
        setInvoiceCustomerDIC(localStorage.getItem('invoiceCustomerDIC') || '');
    };

    const setAllInvoiceInputsByLocaleStorage = () => {
        setAllRestInvoiceInputsByLocaleStorage();
        setAllSupplierInputsByLocaleStorage();
        setAllCustomerInputsByLocaleStorage();
    };

    useEffect(() => {
        setAllInvoiceInputsByLocaleStorage();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const fixedWidth = 794;
            const maxWidth = 820;
            const fixedHeight = 1123;

            if (window.innerWidth < maxWidth) {
                const newScale = window.innerWidth / fixedWidth;
                setScaleInvoice(newScale);
                setDynamicHeight(fixedHeight * newScale);
            } else {
                setScaleInvoice(1);
                setDynamicHeight(fixedHeight);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowInvoice(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generatePDF = () => {
        if (invoiceRef.current) {
            setLoadingState(true);
            invoiceRef.current.style.overflow = 'hidden';
            invoiceRef.current.style.maxHeight = '295mm';
            html2pdf()
                .from(invoiceRef.current)
                .set({
                    margin: 0,
                    filename: `faktura-${invoiceNumber}.pdf`,
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: { scale: 4, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                })
                .output('blob')
                .then((pdfBlob: Blob | MediaSource) => {
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    window.open(pdfUrl);
                    setShowInvoice(false);
                    setLoadingState(false);
                })
                .catch((error: any) => {
                    setLoadingState(false);
                    throw new Error('Error generating PDF: ', error);
                });
        }
    };

    // Supplier and Customer Data Handling
    const loadSuppliers = async (): Promise<iSupplierProfile[] | undefined> => {
        if (session) {
            const data = await fetchSuppliers(parseInt(session.user.id));
            setInvoiceSupplierProfiles(data);
            return data;
        } else {
            setIsSuppliersStartLoad(false);
            if (confirm('Pro přístup k profilům musíte být přihlašení. Stísktnět ok a budete přesměrováný do příjlášení.')) {
                router.push('/auth/signin');
            }
        }
    };

    const loadCustomers = async (): Promise<iCustomerProfile[] | undefined> => {
        if (session) {
            const data = await fetchCustomers(parseInt(session.user.id));
            setInvoiceCustomerProfiles(data);
            return data;
        } else {
            setIsCustomersStartLoad(false);
            if (confirm('Pro přístup k profilům musíte být přihlašení. Stísktnět ok a budete přesměrováný do příjlášení.')) {
                router.push('/auth/signin');
            }
        }
    };

    useEffect(() => {
        if (isSuppliersStartLoad) {
            setIsLoadingPreviewSupplierProfilesOption(true);
            const load = async () => {
                await loadSuppliers();
                setIsLoadingPreviewSupplierProfilesOption(false);
            };
            load();
        }
        if (isCustomersStartLoad) {
            setIsLoadingPreviewCustomerProfilesOption(true);
            const load = async () => {
                await loadCustomers();
                setIsLoadingPreviewCustomerProfilesOption(false);
            };
            load();
        }
    }, [isSuppliersStartLoad, isCustomersStartLoad]);

    useEffect(() => {
        const fillSupplierProfile = () => {
            const supplier = invoiceSupplierProfiles.find(profile => profile.id === selectedSupplierProfile);
            setInvoiceSupplierName(supplier!.name);
            setInvoiceSupplierAddress(supplier!.address);
            setInvoiceSupplierPSC(supplier!.psc);
            setInvoiceSupplierICO(supplier!.ico);
            setInvoiceSupplierDIC(supplier!.dic);
            setInvoiceSupplierBank(supplier!.bank);
            setInvoiceSupplierBankAccount(supplier!.bankAccount);
        };

        const fillCustomerProfile = () => {
            const customer = invoiceCustomerProfiles.find(profile => profile.id === selectedCustomerProfile);
            setInvoiceCustomerName(customer!.name);
            setInvoiceCustomerAddress(customer!.address);
            setInvoiceCustomerPSC(customer!.psc);
            setInvoiceCustomerICO(customer!.ico);
            setInvoiceCustomerDIC(customer!.dic);
        };

        if (selectedSupplierProfile !== 0) {
            setIsUseSupplierProfile(true);
            fillSupplierProfile();
        } else {
            setAllSupplierInputsByLocaleStorage();
            setIsUseSupplierProfile(false);
        }

        if (selectedCustomerProfile !== 0) {
            setIsUseCustomerProfile(true);
            fillCustomerProfile();
        } else {
            setAllCustomerInputsByLocaleStorage();
            setIsUseCustomerProfile(false);
        }
    }, [selectedSupplierProfile, selectedCustomerProfile, invoiceSupplierProfiles, invoiceCustomerProfiles]);

    // Saving and Deleting Suppliers and Customers
    const handleSaveSupplier = async () => {
        if (
            invoiceSupplierName &&
            invoiceSupplierAddress &&
            invoiceSupplierPSC &&
            invoiceSupplierICO &&
            invoiceSupplierDIC &&
            invoiceSupplierBank &&
            invoiceSupplierBankAccount
        ) {
            if (session) {
                if (confirm('Tímto uložite dodavatele do databaze. Jste si jistý?')) {
                    const data = await saveSuppliers({
                        userId: parseInt(session.user.id),
                        name: invoiceSupplierName,
                        address: invoiceSupplierAddress,
                        psc: invoiceSupplierPSC,
                        ico: invoiceSupplierICO,
                        dic: invoiceSupplierDIC,
                        bank: invoiceSupplierBank,
                        bankAccount: invoiceSupplierBankAccount,
                    });
                    if (data === 23505) {
                        alert(`Nepodařilo se uložit dodavatele protože s uvedeným jmenem "${invoiceSupplierName}" již existuje.`);
                    } else if (Array.isArray(data)) {
                        const supplierId = data.map(item => item.id);
                        await loadSuppliers();
                        setIsSuppliersStartLoad(true);
                        setIsUseSupplierProfile(true);
                        setSelectedSupplierProfile(supplierId[0]!);
                    }
                }
            } else {
                if (confirm('Pro uložení profilů musíte být přihlašení. Stísktnět ok a budete přesměrováný do příjlášení.')) {
                    router.push('/auth/signin');
                }
            }
        } else {
            alert('Vyplňte všechna pole u dodavatele, aby jste mohli uložit do databze');
        }
    };

    const handleDeleteSupplier = async (userId: number) => {
        if (confirm('Tímto smažete dodavatele z databaze. Jste si jistý?')) {
            await deleteSupplier(userId);
            loadSuppliers();
            setIsUseSupplierProfile(false);
            setSelectedSupplierProfile(0);
        }
    };

    const handleSaveCustomer = async () => {
        if (invoiceCustomerName && invoiceCustomerAddress && invoiceCustomerPSC && invoiceCustomerICO && invoiceCustomerDIC) {
            if (session) {
                if (confirm('Tímto uložite odběratele do databaze. Jste si jistý?')) {
                    const data = await saveCustomers({
                        userId: parseInt(session.user.id),
                        name: invoiceCustomerName,
                        address: invoiceCustomerAddress,
                        psc: invoiceCustomerPSC,
                        ico: invoiceCustomerICO,
                        dic: invoiceCustomerDIC,
                    });

                    if (data === 23505) {
                        alert(`Nepodařilo se uložit odběratele protože s uvedeným jmenem "${invoiceCustomerName}" již existuje.`);
                    } else if (Array.isArray(data)) {
                        const customerId = data.map(item => item.id);
                        await loadCustomers();
                        setIsCustomersStartLoad(true);
                        setIsUseCustomerProfile(true);
                        setSelectedCustomerProfile(customerId[0]!);
                    }
                }
            } else {
                if (confirm('Pro uložení profilů musíte být přihlašení. Stísktnět ok a budete přesměrováný do příjlášení.')) {
                    router.push('/auth/signin');
                }
            }
        } else {
            alert('Vyplňte všechna pole u odběratele, aby jste mohli uložit do databaze');
        }
    };

    const handleDeleteCustomer = async (userId: number) => {
        if (confirm('Tímto smažete odběratele z databaze. Jste si jistý?')) {
            await deleteCustomer(userId);
            loadCustomers();
            setIsUseCustomerProfile(false);
            setSelectedCustomerProfile(0);
        }
    };

    return (
        <section id={s.section}>
            {loadingState && <Loading />}
            <>
                {showInvoice === false ? (
                    <div className={`${s.container}`}>
                        <div
                            className='flex'
                            style={{
                                width: '100%',
                                color: '#6d6d6d',
                                justifyContent: 'space-between',
                                marginBottom: '25px',
                            }}
                        >
                            {!session && <Link href={'/auth/signin'}>Přihlásit se</Link>}
                            {session && (
                                <>
                                    <span style={{ color: 'rgb(28, 126, 255)' }}>{session.user.name}</span>
                                    <span style={{ cursor: 'pointer' }} onClick={() => signOut()}>
                                        Odhlásit se
                                    </span>
                                </>
                            )}
                        </div>

                        <form className={s.content} onSubmit={handleSubmit}>
                            <div className={`${s.input_group} ${s.item}`} style={{ gap: '10px' }}>
                                <label htmlFor='inputInovoiceNumber'>
                                    <h2 className={s.title} style={{ color: 'black' }}>
                                        Číslo faktury
                                    </h2>
                                </label>
                                <input
                                    required
                                    id='inputInovoiceNumber'
                                    type='text'
                                    value={invoiceNumber}
                                    onChange={handleChange(setInvoiceNumber, 'invoiceNumber')}
                                />
                            </div>

                            <div className={`${s.block} ${s.item}`}>
                                <h2 className={s.title}>Dodavatel</h2>

                                {session && (
                                    <div className={s.select_block}>
                                        <span>Vybrat profil dodavatele z databaze</span>
                                        <select
                                            onClick={() => setIsSuppliersStartLoad(true)}
                                            onChange={(e) => setSelectedSupplierProfile(parseInt(e.target.value))}
                                            value={selectedSupplierProfile}
                                            name='supplier_profile'
                                            id='supplier_profile'
                                            style={{ marginBottom: '5px' }}
                                        >
                                            <option value='0'>Žádný</option>
                                            {isLoadingPreviewSupplierProfilesOption && <option value='0'>Načítání...</option>}
                                            {invoiceSupplierProfiles.map((profile) => (
                                                <option key={profile.id} value={profile.id}>
                                                    {profile.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {isUseSupplierProfile && (
                                    <div className={s.btns}>
                                        <button
                                            onClick={() => handleDeleteSupplier(selectedSupplierProfile)}
                                            type='button'
                                            className='negative'
                                        >
                                            Smazat dodavatele
                                        </button>
                                    </div>
                                )}

                                {!isUseSupplierProfile && (
                                    <>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierName'>Název</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierName'
                                                type='text'
                                                value={invoiceSupplierName}
                                                onChange={handleChange(setInvoiceSupplierName, 'invoiceSupplierName')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierAddress'>Adresa</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierAddress'
                                                type='text'
                                                value={invoiceSupplierAddress}
                                                onChange={handleChange(setInvoiceSupplierAddress, 'invoiceSupplierAddress')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierPSC'>PSČ</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierPSC'
                                                type='text'
                                                value={invoiceSupplierPSC}
                                                onChange={handleChange(setInvoiceSupplierPSC, 'invoiceSupplierPSC')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierICO'>IČO</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierICO'
                                                type='text'
                                                value={invoiceSupplierICO}
                                                onChange={handleChange(setInvoiceSupplierICO, 'invoiceSupplierICO')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierDIC'>DIČ</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierDIC'
                                                type='text'
                                                value={invoiceSupplierDIC}
                                                onChange={handleChange(setInvoiceSupplierDIC, 'invoiceSupplierDIC')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierBank'>Banka</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierBank'
                                                type='text'
                                                value={invoiceSupplierBank}
                                                onChange={handleChange(setInvoiceSupplierBank, 'invoiceSupplierBank')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceSupplierBankAccount'>Číslo účtu</label>
                                            <input
                                                required
                                                id='inputInovoiceSupplierBankAccount'
                                                type='text'
                                                value={invoiceSupplierBankAccount}
                                                onChange={handleChange(setInvoiceSupplierBankAccount, 'invoiceSupplierBankAccount')}
                                            />
                                        </div>

                                        {session && (
                                            <div className={s.btns}>
                                                <button onClick={handleSaveSupplier} type='button' className='contrast'>
                                                    Uložit dodavatele
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={`${s.block} ${s.item}`}>
                                <h2 className={s.title}>Odběratel</h2>

                                {session && (
                                    <div className={s.select_block}>
                                        <span>Vybrat profil odběratele z databaze</span>
                                        <select
                                            onClick={() => setIsCustomersStartLoad(true)}
                                            onChange={(e) => setSelectedCustomerProfile(parseInt(e.target.value))}
                                            value={selectedCustomerProfile}
                                            name='customer_profile'
                                            id='customer_profile'
                                            style={{ marginBottom: '5px' }}
                                        >
                                            <option value='0'>Žádný</option>
                                            {isLoadingPreviewCustomerProfilesOption && <option value='0'>Načítání...</option>}
                                            {invoiceCustomerProfiles.map((profile) => (
                                                <option key={profile.id} value={profile.id}>
                                                    {profile.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {isUseCustomerProfile && (
                                    <div className={s.btns}>
                                        <button
                                            onClick={() => handleDeleteCustomer(selectedCustomerProfile)}
                                            type='button'
                                            className='negative'
                                        >
                                            Smazat odběratele
                                        </button>
                                    </div>
                                )}
                                {!isUseCustomerProfile && (
                                    <>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceCustomerName'>Název</label>
                                            <input
                                                required
                                                id='inputInovoiceCustomerName'
                                                type='text'
                                                value={invoiceCustomerName}
                                                onChange={handleChange(setInvoiceCustomerName, 'invoiceCustomerName')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceCustomerAddress'>Adresa</label>
                                            <input
                                                required
                                                id='inputInovoiceCustomerAddress'
                                                type='text'
                                                value={invoiceCustomerAddress}
                                                onChange={handleChange(setInvoiceCustomerAddress, 'invoiceCustomerAddress')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceCustomerPSC'>PSČ</label>
                                            <input
                                                required
                                                id='inputInovoiceCustomerPSC'
                                                type='text'
                                                value={invoiceCustomerPSC}
                                                onChange={handleChange(setInvoiceCustomerPSC, 'invoiceCustomerPSC')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceCustomerICO'>IČO</label>
                                            <input
                                                required
                                                id='inputInovoiceCustomerICO'
                                                type='text'
                                                value={invoiceCustomerICO}
                                                onChange={handleChange(setInvoiceCustomerICO, 'invoiceCustomerICO')}
                                            />
                                        </div>
                                        <div className={s.input_group}>
                                            <label htmlFor='inputInovoiceCustomerDIC'>DIČ</label>
                                            <input
                                                required
                                                id='inputInovoiceCustomerDIC'
                                                type='text'
                                                value={invoiceCustomerDIC}
                                                onChange={handleChange(setInvoiceCustomerDIC, 'invoiceCustomerDIC')}
                                            />
                                        </div>

                                        {session && (
                                            <div className={s.btns}>
                                                <button onClick={handleSaveCustomer} type='button' className='contrast'>
                                                    Uložit odběratele
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={`${s.block} ${s.item}`}>
                                <h2 className={s.title}>Platební podmínky</h2>

                                <div className={s.input_group}>
                                    <label htmlFor='inputInovoiceDateStart'>Datum vystavení faktury</label>
                                    <input
                                        required
                                        id='inputInovoiceDateStart'
                                        type='text'
                                        value={invoicePayStart}
                                        onChange={handleChange(setInvoicePayStart, 'invoicePayStart')}
                                    />
                                </div>
                                <div className={s.input_group}>
                                    <label htmlFor='inputInovoiceDateDid'>Datum uskutečnění plnění</label>
                                    <input
                                        required
                                        id='inputInovoiceDateDid'
                                        type='text'
                                        value={invoicePayDid}
                                        onChange={handleChange(setInvoicePayDid, 'invoicePayDid')}
                                    />
                                </div>
                                <div className={s.input_group}>
                                    <label htmlFor='inputInovoiceDateLast'>Datum splatnosti faktury</label>
                                    <input
                                        required
                                        id='inputInovoiceDateLast'
                                        type='text'
                                        value={invoicePayLast}
                                        onChange={handleChange(setInvoicePayLast, 'invoicePayLast')}
                                    />
                                </div>
                            </div>

                            <div className={`${s.block} ${s.item}`}>
                                <h2 className={s.title}>Text</h2>

                                <div className={s.input_group} style={{ gap: '15px' }}>
                                    {invoiceText.map((text, index) => (
                                        <textarea
                                            key={index}
                                            required={index === 0 ? true : false}
                                            value={text}
                                            onChange={(e) => handleTextChange(index, e.target.value)}
                                        />
                                    ))}
                                    <div className={s.btns}>
                                        <button type='button' onClick={addTextArea} className='contrast'>
                                            Přidat Text
                                        </button>
                                        {invoiceText.length > 1 && (
                                            <button type='button' onClick={removeTextArea} className='negative'>
                                                Odebrat Text
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`${s.block} ${s.item}`}>
                                <h2 className={s.title}>Celková cena bez DPH</h2>

                                <div className={s.input_group}>
                                    <input
                                        required
                                        type='number'
                                        value={invoicePrice}
                                        onChange={handleChange(setInvoicePrice, 'invoicePrice')}
                                    />
                                </div>
                            </div>

                            <div className={`${s.block} ${s.item}`}>
                                <button type='submit' style={{ width: '100%' }}>
                                    Vytvořít
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div id={s.invoice} style={{ height: dynamicHeight }}>
                        <div ref={invoiceRef}>
                            <InvoiceComponent
                                scale={scaleInvoice}
                                number={invoiceNumber}
                                supplier={{
                                    name: invoiceSupplierName,
                                    address: invoiceSupplierAddress,
                                    psc: invoiceSupplierPSC,
                                    ico: invoiceSupplierICO,
                                    dic: invoiceSupplierDIC,
                                    bank: invoiceSupplierBank,
                                    bankAccount: invoiceSupplierBankAccount,
                                }}
                                customer={{
                                    name: invoiceCustomerName,
                                    address: invoiceCustomerAddress,
                                    psc: invoiceCustomerPSC,
                                    ico: invoiceCustomerICO,
                                    dic: invoiceCustomerDIC,
                                }}
                                date={{
                                    start: invoicePayStart,
                                    did: invoicePayDid,
                                    last: invoicePayLast,
                                }}
                                text={invoiceText}
                                price={invoicePrice}
                            />
                        </div>

                        <div className={s.nav}>
                            <button onClick={() => setShowInvoice(false)}>Upravit</button>
                            <button
                                onClick={() => {
                                    setScaleInvoice(1);
                                    generatePDF();
                                }}
                            >
                                PDF
                            </button>
                        </div>
                    </div>
                )}
            </>
        </section>
    );
}
