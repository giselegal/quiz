// DEPRECATED: This file is being replaced by server-side API calls
// Use apiService from @/services/api instead

import { apiService } from '@/services/api';

// Legacy compatibility layer - redirects to new API service
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => {
          console.warn('Supabase client deprecated. Use apiService instead.');
          return Promise.reject(new Error('Use apiService instead'));
        }
      })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => {
          console.warn('Supabase client deprecated. Use apiService instead.');
          return Promise.reject(new Error('Use apiService instead'));
        }
      })
    })
  })
};

// Export the new API service for easy migration
export { apiService };