import { fetchGitHubRepos } from '@/lib/github'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    try {
        const repos = await fetchGitHubRepos(username)
        return NextResponse.json(repos)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
