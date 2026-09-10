import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  Users,
  Store,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Collections', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: Users },
];

function AdminLayout() {
  const { user, loading, profileLoading, isAdmin, profile, signOut } = useAuth();

  if (loading || profileLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-2xl text-foreground">Admin sign-in required</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Log in with an admin account to access this area.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Go to log in
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-heading text-2xl text-foreground">You don't have access to this page</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This area is restricted to admin accounts. Signed in as {profile?.email || user.email}.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Back to the store
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-1px)]">
      {/* Sidebar */}
      <aside className="lg:w-60 shrink-0 bg-neutral-950 text-neutral-50 flex flex-col">
        <div className="px-5 py-6 border-b border-neutral-800">
          <span className="font-heading text-lg tracking-tight">LittleNest Admin</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-50 text-neutral-950'
                    : 'text-neutral-300 hover:text-neutral-50 hover:bg-neutral-900'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-neutral-50 hover:bg-neutral-900 transition-colors"
          >
            <Store className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            View Store
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-neutral-50 hover:bg-neutral-900 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0 bg-background">
        <div className="px-5 lg:px-8 py-8 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
