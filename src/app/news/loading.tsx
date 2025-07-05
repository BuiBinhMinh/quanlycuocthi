'use client'

export default function NewsLoading() {
  return (
    <div className="d-flex align-items-center justify-content-center p-4" style={{height: '50vh'}}>
      <div className="spinner-border text-primary me-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span>Đang tải dữ liệu Quản lý bài báo Khoa học...</span>
    </div>
  )
}