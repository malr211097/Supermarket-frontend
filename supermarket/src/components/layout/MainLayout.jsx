import { Link } from 'react-router-dom'

const styles = {
  shell: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    color: '#1f2937',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  sidebar: {
    padding: '28px 20px',
    backgroundColor: '#172b2a',
    color: '#f8faf9',
  },
  brand: {
    margin: '0 0 36px',
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  navLabel: {
    margin: '0 0 12px',
    color: '#a9bbb7',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  link: {
    display: 'block',
    padding: '10px 12px',
    borderRadius: '5px',
    color: '#e5eeeb',
    fontSize: '14px',
    textDecoration: 'none',
  },
  content: {
    minWidth: 0,
  },
  header: {
    minHeight: '72px',
    borderBottom: '1px solid #e5e9ec',
    backgroundColor: '#fff',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
  },
}

function MainLayout({ children }) {
  return (
    <div className="container-fluid p-0" style={styles.shell}>
      <div className="row g-0 min-vh-100">
        <aside className="col-12 col-lg-3 col-xl-2" style={styles.sidebar}>
          <p style={styles.brand}>Supermarket Admin</p>

          <nav aria-label="Main navigation">
            <p style={styles.navLabel}>Navigation</p>

            <div className="d-flex flex-wrap flex-lg-column gap-2">
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/users" style={styles.link}>Users</Link>
              <Link to="/products" style={styles.link}>Products</Link>
              <Link to="/providers" style={styles.link}>Providers</Link>
              <Link to="/sales" style={styles.link}>Sales</Link>
            </div>
          </nav>
        </aside>

        <div className="col-12 col-lg-9 col-xl-10" style={styles.content}>
          <header
            className="d-flex align-items-center justify-content-between px-3 px-md-4 py-3"
            style={styles.header}
          >
            <h1 style={styles.headerTitle}>Dashboard</h1>
          </header>

          <main className="p-3 p-md-4">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout