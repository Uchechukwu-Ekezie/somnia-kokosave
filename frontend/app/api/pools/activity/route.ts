import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Supabase is optional - activities are stored on-chain via Somnia Data Streams
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { success: true, message: 'Activity will be stored on-chain via Somnia Data Streams' },
        { status: 200 }
      )
    }

    const body = await req.json()
    const { pool_id, activity_type, user_address, amount, description, tx_hash } = body

    if (!pool_id || !activity_type) {
      return NextResponse.json(
        { error: 'Missing required fields: pool_id, activity_type' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('pool_activity')
      .insert([
        {
          pool_id,
          activity_type,
          user_address: user_address?.toLowerCase() || null,
          amount: amount || null,
          description: description || null,
          tx_hash: tx_hash || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting activity:', error)
      return NextResponse.json(
        { error: 'Failed to insert activity' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

