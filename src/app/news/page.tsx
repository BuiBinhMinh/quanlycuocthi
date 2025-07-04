export const dynamic = 'force-dynamic';

import PublicationStats from '@/components/news/PublicationStats'
import PublicationTimelineChart from '@/components/news/PublicationTimelineChart'
import PublicationCountryPie from '@/components/news/PublicationCountryPie'
import PublicationsTable from '@/components/news/PublicationsTable'
import { fetchPublications } from '@/lib/googleSheet'


export const revalidate = 60   // tái sinh lại page mỗi 60 giây
export default async function NewsPage() {
  const publications = await fetchPublications()

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý bài báo Khoa học</h2>
      </div>

      {/* 1) Stats Cards */}
      <PublicationStats data={publications} />

      {/* 2) Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <PublicationTimelineChart data={publications} />
        </div>
        <div className="col-md-6">
          <PublicationCountryPie data={publications} />
        </div>
      </div>

      {/* 3) Table */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <PublicationsTable data={publications} />
        </div>
      </div>
    </main>
  )
}
