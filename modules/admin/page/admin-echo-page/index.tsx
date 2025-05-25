import { getAllEchos } from '@/actions/echos'
import Loading from '@/components/shared/loading'
import { Suspense } from 'react'
import EchoListTable from './internal/echo-list-table'
import EchoSearch from './internal/echo-search'

const echoPromise = getAllEchos()

export default async function AdminEchoPage() {
  return (
    <main className="w-full flex flex-col gap-2">
      <EchoSearch />
      <Suspense fallback={<Loading />}>
        <EchoListTable initialPromiseData={echoPromise} />
      </Suspense>
    </main>
  )
}
