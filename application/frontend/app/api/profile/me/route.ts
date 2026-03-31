// Creates a secure GET /api/profile/me route for the Outty application.
// This reads the authenticated Supabase server session from request cookies,
// then returns the current user's profile record without requiring a UUID parameter.

import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        display_name,
        bio,
        interests,
        created_at,
        updated_at,
        age,
        zip_code,
        partner_preference,
        skill_level,
        distance,
        instagram,
        tiktok,
        facebook,
        linkedin,
        profile_views
      `)
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Profile fetch error:', profileError)

      return NextResponse.json(
        { error: 'Failed to fetch profile.' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Unexpected profile/me route error:', error)

    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the profile.' },
      { status: 500 }
    )
  }
}