export const dynamic = 'force-dynamic';

import ContestsTable from '@/components/projects/ContestsTable';
import StatsCards from '@/components/projects/StatsCards';
import TimelineBarChart from '@/components/projects/TimelineBarChart';
import AwardsPieChart from '@/components/projects/AwardsPieChart';
import AwardsTypePieChart from '@/components/projects/AwardsTypePieChart';
import { fetchProjects } from '@/lib/googleSheet';
import Image from 'next/image';

export const revalidate = 60;

export default async function DashboardPage() {
  const projects = await fetchProjects();

  return (
    <main className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">Hoàng Gia Huy</span>
          <Image
            src="https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-6/480960624_675682554814151_8091216706953034584_n.jpg?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=77Np5iq6OLUQ7kNvwH7-FFY&_nc_oc=Adl68PPJYuhCS_Sui6qimqg5heBz8y6yfhX7NGwhqIYeRJ-mbgrP3m8oZ-283Vy7tzgVPKO62a1tS6w01MdVfs--&_nc_zt=23&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=86E5uXjt8IF5dv9oB1fAQw&oh=00_AfMVSyGvbxuydkf1zSRtIyiNa1XKP5IOtzBDfgx_Mi2fvg&oe=6869B13F"
            alt="Avatar Hoàng Gia Huy"
            width={40}
            height={40}
            className="rounded-circle"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards data={projects} />

      {/* Charts cùng hàng */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-lg-4">
          <div className="card chart-card shadow-lg border-0 h-100 transition-hover">
            <TimelineBarChart data={projects} small />
          </div>
        </div>
        <div className="col-md-4 col-lg-4">
          <div className="card chart-card shadow-lg border-0 h-100 transition-hover">
            <AwardsTypePieChart data={projects} small />
          </div>
        </div>
        <div className="col-md-4 col-lg-4">
          <div className="card chart-card shadow-lg border-0 h-100 transition-hover">
            <AwardsPieChart data={projects} small />
          </div>
        </div>
      </div>

      {/* Table: chiếm trọn chiều ngang, có phân trang */}
      <div className="card mb-4">
        <div className="card-header bg-white border-bottom">
          <strong>Thông tin cuộc thi</strong>
        </div>
        <div className="card-body p-0">
          <ContestsTable data={projects} />
        </div>
      </div>
    </main>
  );
}