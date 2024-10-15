'use server';

import { iCustomerProfile, iSupplierProfile } from "./fetchProfiles";
import { supabaseClient } from '../supabase/client';

export const deleteSupplier = async (id: number): Promise<iSupplierProfile[]> => {
    
    const { data, error } = await supabaseClient.from('suppliers').delete().eq('id', id).select('*');

    if (error) {
        throw new Error(`Error deleting supplier: ${error.message}`);
    }

    return data as iSupplierProfile[];
};

export const deleteCustomer = async (id: number): Promise<iCustomerProfile[]> => {
    
    const { data, error } = await supabaseClient.from('customers').delete().eq('id', id).select('*');

    if (error) {
        throw new Error(`Error deleting customer: ${error.message}`);
    }

    return data as iCustomerProfile[];
};
