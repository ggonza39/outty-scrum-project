// Creates a GET /api/discover route for the Outty application.
// This returns profiles for the authenticated user and supports multi-criteria filtering through a JSON query.

import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { createAdminClient } from '../../../lib/supabase/admin'

type DiscoverFilters = {
  min_age?: number
  max_age?: number
  gender?: string
  activity_list?: string[]
  skill_level?: string
  location_data?: {
    zip_code?: string
    distance?: number
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const rawFilters = searchParams.get('filters')

    let filters: DiscoverFilters = {}

    if (rawFilters) {
      try {
        filters = JSON.parse(rawFilters) as DiscoverFilters
      } catch {
        return NextResponse.json(
          { error: 'Invalid filters JSON.' },
          { status: 400 }
        )
      }
    }

    const normalizedFilters: DiscoverFilters = {
      min_age: typeof filters.min_age === 'number' ? filters.min_age : undefined,
      max_age: typeof filters.max_age === 'number' ? filters.max_age : undefined,
      gender:
        filters.gender &&
        filters.gender.trim() !== '' &&
        filters.gender.trim().toLowerCase() !== 'any'
          ? filters.gender.trim()
          : undefined,
      activity_list:
        filters.activity_list && filters.activity_list.length > 0
          ? filters.activity_list
          : undefined,
      skill_level:
        filters.skill_level &&
        filters.skill_level.trim() !== '' &&
        filters.skill_level.trim().toLowerCase() !== 'any'
          ? filters.skill_level.trim()
          : undefined,
      location_data:
        filters.location_data &&
        filters.location_data.zip_code &&
        filters.location_data.zip_code.trim() !== '' &&
        typeof filters.location_data.distance === 'number'
          ? {
              zip_code: filters.location_data.zip_code.trim(),
              distance: filters.location_data.distance,
            }
          : undefined,
    }

    let nearbyProfileIds: string[] | null = null

    if (normalizedFilters.location_data) {
      const { data: nearbyProfiles, error: nearbyError } = await adminSupabase.rpc(
        'get_profiles_within_radius',
        {
          search_zip: normalizedFilters.location_data.zip_code,
          radius_miles: normalizedFilters.location_data.distance,
        }
      )

      if (nearbyError) {
        console.error('Discover distance filter error:', nearbyError)

        return NextResponse.json(
          { error: 'Failed to apply distance filter.' },
          { status: 500 }
        )
      }

      const matchedProfileIds = ((nearbyProfiles ?? []) as { profile_id: string }[]).map(
        (row) => row.profile_id
      )

      if (matchedProfileIds.length === 0) {
        return NextResponse.json({
          filters: normalizedFilters,
          results: [],
        })
      }

      nearbyProfileIds = matchedProfileIds
    }

    let query = adminSupabase
      .from('profiles')
      .select(`
        id,
        display_name,
        age,
        bio,
        interests,
        gender,
        skill_level
      `)
      .neq('id', user.id)
      .eq('is_searchable', true)

    if (nearbyProfileIds) {
      query = query.in('id', nearbyProfileIds)
    }

    if (typeof normalizedFilters.min_age === 'number') {
      query = query.gte('age', normalizedFilters.min_age)
    }

    if (typeof normalizedFilters.max_age === 'number') {
      query = query.lte('age', normalizedFilters.max_age)
    }

    if (normalizedFilters.gender) {
      query = query.ilike('gender', normalizedFilters.gender)
    }

    if (normalizedFilters.skill_level) {
      query = query.ilike('skill_level', normalizedFilters.skill_level)
    }

    if (normalizedFilters.activity_list && normalizedFilters.activity_list.length > 0) {
      query = query.overlaps('interests', normalizedFilters.activity_list)
    }

    const { data: profiles, error: profilesError } = await query.order('created_at', {
      ascending: false,
    })

    if (profilesError) {
      console.error('Discover fetch error:', profilesError)

      return NextResponse.json(
        { error: 'Failed to fetch discover profiles.' },
        { status: 500 }
      )
    }

    const results = (profiles ?? []).map((profile) => ({
      id: profile.id,
      name: profile.display_name,
      age: profile.age,
      bio: profile.bio,
      interests: profile.interests ?? [],
      gender: profile.gender,
      skill_level: profile.skill_level,
    }))

    return NextResponse.json({
      filters: normalizedFilters,
      results,
    })
  } catch (error) {
    console.error('Unexpected discover route error:', error)

    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching discover profiles.' },
      { status: 500 }
    )
  }
}