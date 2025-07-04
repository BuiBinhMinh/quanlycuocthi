"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom-theme.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const SIDEBAR_ITEMS = [
  { label: 'Dự án', icon: 'bi-speedometer2', path: '/' },
  { label: 'Tin tức', icon: 'bi-ui-checks', path: '/news' },
  { label: 'Tables', icon: 'bi-table', path: '/table' },
  { label: 'Charts', icon: 'bi-bar-chart', path: '/chart' }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="vi" className={roboto.className}>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body>
        <div className="d-flex min-vh-100">
          {/* Sidebar */}
          <nav
            className="sidebar-custom flex-shrink-0 d-none d-md-block"
            style={{
              background: 'linear-gradient(180deg, #338aff 0%, #2563eb 100%)',
              color: '#fff',
              minHeight: '100vh',
              boxShadow: '2px 0 16px 0 rgba(51,138,255,0.08)',
              transition: 'width 0.2s cubic-bezier(.4,0,.2,1)',
            }}
          >
            <div className="p-3">
              <h4 className="sidebar-title text-center fw-bold mb-4" style={{ letterSpacing: 1 }}>AdminCAST</h4>
              <ul className="nav nav-pills flex-column gap-2">
                {SIDEBAR_ITEMS.map(item => {
                  const isActive = item.path === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.path);
                  return (
                    <li key={item.label} className="nav-item">
                      <Link
                        href={item.path}
                        className={`nav-link d-flex align-items-center gap-2 sidebar-animate${isActive ? ' active' : ''}`}
                        style={{
                          color: isActive ? '#2563eb' : '#fff',
                          background: isActive ? '#fff' : 'transparent',
                          borderRadius: 14,
                          fontWeight: 500,
                          fontSize: 17,
                          transition: 'background 0.2s, color 0.2s'
                        }}
                      >
                        <i className={`bi ${item.icon} fs-5`}></i>
                        <span className="sidebar-label">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
          {/* Main Content */}
          <div className="flex-grow-1 w-100" style={{ minHeight: '100vh', background: '#FFFFFFFF' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}