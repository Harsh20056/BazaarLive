import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
