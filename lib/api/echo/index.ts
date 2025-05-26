import type { Echo } from '@prisma/client'

export async function fetchAllEchosPromise(): Promise<Echo[]> {
  return ((await fetch(`${process.env!.SITE_URL}/api/echo/getAllEchos`, {
    cache: 'force-cache',
  })).json())
}
