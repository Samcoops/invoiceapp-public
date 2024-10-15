'use server';

import { supabaseClient } from '../supabase/client';

export interface iSupplierProfile {
    id?: number;
    name: string;
    address: string;
    psc: string;
    ico: string;
    dic: string;
    bank: string;
    bankAccount: string;
    userId: number;
    createdAt?: string;
}
export interface iCustomerProfile {
    id?: number;
    name: string;
    address: string;
    psc: string;
    ico: string;
    dic: string;
    userId: number;
    createdAt?: string;
}

export const fetchSuppliers = async (userId: number): Promise<iSupplierProfile[]> => {
    const { data, error } = await supabaseClient.from('suppliers').select('*').eq('userId', userId);

    if (error) {
        throw new Error('Něco se pokazilo, zavolejte Ihora. Zde je chyba: ' + error.message);
    }

    return data as iSupplierProfile[];
};

export const fetchCustomers = async (userId: number): Promise<iCustomerProfile[]> => {
    const { data, error } = await supabaseClient.from('customers').select('*').eq('userId', userId);

    if (error) {
        throw new Error('Něco se pokazilo, zavolejte Ihora. Zde je chyba: ' + error.message);
    }

    return data as iCustomerProfile[];
};


