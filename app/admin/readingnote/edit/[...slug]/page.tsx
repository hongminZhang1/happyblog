import AdminReadingNoteEditPage from '@/modules/admin/page/admin-readingnote-edit-page'

interface Props {
  params: Promise<{ slug: string[] }>
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  return <AdminReadingNoteEditPage params={resolvedParams} />
}
