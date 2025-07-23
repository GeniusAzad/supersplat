import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Splat = Database['public']['Tables']['splats']['Row']
type SplatInsert = Database['public']['Tables']['splats']['Insert']

export function useSplats(filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['splats', filters],
    queryFn: async () => {
      let query = supabase
        .from('splats')
        .select(`
          *,
          profiles:seller_id (
            username,
            avatar_url
          ),
          reviews (
            rating
          )
        `)
        .order('created_at', { ascending: false })

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export function useSplat(id: string) {
  return useQuery({
    queryKey: ['splat', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('splats')
        .select(`
          *,
          profiles:seller_id (
            username,
            avatar_url,
            bio
          ),
          reviews (
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
  })
}

export function useCreateSplat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (splat: SplatInsert) => {
      const { data, error } = await supabase
        .from('splats')
        .insert(splat)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['splats'] })
    },
  })
}

export function useUserSplats(userId: string) {
  return useQuery({
    queryKey: ['user-splats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('splats')
        .select(`
          *,
          reviews (
            rating
          )
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useFeaturedSplats() {
  return useQuery({
    queryKey: ['featured-splats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('splats')
        .select(`
          *,
          profiles:seller_id (
            username,
            avatar_url
          ),
          reviews (
            rating
          )
        `)
        .eq('is_featured', true)
        .limit(6)

      if (error) throw error
      return data
    },
  })
}