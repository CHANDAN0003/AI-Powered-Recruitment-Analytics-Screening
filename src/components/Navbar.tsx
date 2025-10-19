import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  function doLogout(){ logout(); window.location.href = '/'; }

  return (
    <header className="backdrop-blur-md bg-white/60 border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">TC</div>
            <div>
              <div className="text-lg font-extrabold text-gray-900">TalentConnect</div>
              <div className="text-xs text-gray-500 -mt-1">AI hiring & screening</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-gray-900 transition">Home</Link>
            <Link to="/jobs" className="hidden sm:inline text-sm text-gray-700 hover:text-gray-900 transition">Jobs</Link>

            {!user && (
              <>
                <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900 transition">Sign in</Link>
                <Link to="/signup" className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-emerald-400 text-white px-4 py-2 rounded-lg shadow hover:brightness-105 transition">Sign up</Link>
              </>
            )}

            {user && (
              <div className="flex items-center gap-3">
                {user.role === 'hr' && <Link to="/hr/composer" className="text-sm text-indigo-600">Compose</Link>}
                <div className="text-sm text-gray-700">{user.name || user.email}</div>
                <button onClick={doLogout} className="text-sm text-gray-600">Logout</button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
