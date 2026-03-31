// This fetches a specific user's public profile by ID and returns only fields that are safe for profile viewing within the authenticated app experience.

import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { createAdminClient } from '../../../../lib/supabase/admin'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    const { id } = await context.params

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

    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select(`
        display_name,
        bio,
        interests,
        age
      `)
      .eq('id', id)
      .maybeSingle()

    if (profileError) {
      console.error('Public profile fetch error:', profileError)

      return NextResponse.json(
        { error: 'Failed to fetch public profile.' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found.' },
        { status: 404 }
      )
    }

    const { error: viewError } = await supabase.rpc('record_profile_view', {
      target_profile_id: id,
    })

    if (viewError) {
      console.error('Profile view tracking error:', viewError)

      return NextResponse.json(
        { error: 'Failed to record profile view.' },
        { status: 500 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Unexpected public profile route error:', error)

    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the public profile.' },
      { status: 500 }
    )
  }
}