import Loading from '@/components/shared/loading'
import { fetchAllEchosPromise } from '@/lib/api/echo'
import { Suspense } from 'react'
import EchoListTable from './internal/echo-list-table'
import EchoSearch from './internal/echo-search'

export default async function AdminEchoPage() {
  const echoPromise = fetchAllEchosPromise()

  return (
    <main className="w-full flex flex-col gap-2">
      <EchoSearch />
      <Suspense fallback={<Loading />}>
        <EchoListTable echoPromise={echoPromise} />
      </Suspense>
    </main>
  )
}
