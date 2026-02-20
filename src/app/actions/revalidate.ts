'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidates a specific Next.js path
 * @param path The path to revalidate (e.g., '/')
 * @param type The type of revalidation ('page' | 'layout'). Default: 'page'
 */
export async function revalidatePathAction(path: string, type?: 'layout' | 'page') {
    if (type) {
        revalidatePath(path, type)
    } else {
        revalidatePath(path)
    }
}
