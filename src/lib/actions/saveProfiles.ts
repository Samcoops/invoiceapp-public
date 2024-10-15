'use server';

import { supabaseClient } from '../supabase/client';
import { iCustomerProfile, iSupplierProfile } from './fetchProfiles';

export const saveSuppliers = async ({
    name,
    address,
    psc,
    ico,
    dic,
    bank,
    bankAccount,
    userId,
    createdAt,
}: iSupplierProfile): Promise<iSupplierProfile[] | number> => {
    const { data: existingSupplier, error: selectError } = await supabaseClient
        .from('suppliers')
        .select('id')
        .eq('name', name)
        .eq('userId', userId)
        .single();

    if (selectError && selectError.code !== 'PGRST116') {
        throw new Error('Něco se pokazilo při kontrole duplicity: ' + selectError.code + ', ' + selectError.message);
    }

    if (existingSupplier) {
        return 23505;
    }

    const { data, error } = await supabaseClient
        .from('suppliers')
        .insert({
            name,
            address,
            psc,
            ico,
            dic,
            bank,
            bankAccount,
            userId,
            createdAt,
        })
        .select('*');

    if (error) {
        throw new Error('Něco se pokazilo při ukládání záznamu: ' + error.code + ', ' + error.message);
    }

    return data as iSupplierProfile[];
};

export const saveCustomers = async ({
    name,
    address,
    psc,
    ico,
    dic,
    userId,
    createdAt,
}: iCustomerProfile): Promise<iCustomerProfile[] | number> => {
    const { data: existingCustomer, error: selectError } = await supabaseClient
        .from('customers')
        .select('id')
        .eq('name', name)
        .eq('userId', userId)
        .single();

    if (selectError && selectError.code !== 'PGRST116') {
        throw new Error('Něco se pokazilo při kontrole duplicity: ' + selectError.code + ', ' + selectError.message);
    }

    if (existingCustomer) {
        return 23505;
    }

    const { data, error } = await supabaseClient
        .from('customers')
        .insert({
            name,
            address,
            psc,
            ico,
            dic,
            userId,
            createdAt,
        })
        .select('*');

    if (error) {
        throw new Error('Něco se pokazilo při ukládání záznamu: ' + error.code + ', ' + error.message);
    }

    return data as iCustomerProfile[];
};
