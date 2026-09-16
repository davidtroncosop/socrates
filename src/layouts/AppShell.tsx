import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ScanLine,
  FileText,
  Target,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { availableCourses, initialTeacherProfile } from '../mock/data';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState(availableCourses[0]);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

  const mainNavItems = [
    { label: 'Inicio', path: '/', icon: Home },
    { label: 'Escaneo', path: '/escaneo', icon: ScanLine },
    { label: 'Evaluaciones', path: '/evaluaciones', icon: FileText },
    { label: 'Logros', path: '/logros', icon: Target },
    { label: 'Feedback', path: '/feedback', icon: MessageSquare },
    { label: 'Curso', path: '/curso', icon: Users },
    { label: 'Ajustes', path: '/ajustes', icon: Settings },
  ];

  // Mobile bottom bar has 4 main destinations only per spec
  const mobileNavItems = mainNavItems.slice(0, 4);

  const handleLogout = () => {
    navigate('/landing');
  };

  return (
    <div className="min-h-screen bg-[#f0f0ee] flex flex-col sm:flex-row text-gray-900 antialiased">
      {/* Sidebar - Desktop and tablet */}
      <aside
        aria-label="Navegación principal"
        style={{ backgroundColor: '#EDEDED' }}
        className="hidden sm:flex flex-col fixed top-0 bottom-0 left-0 m-3 z-30 rounded-xl border border-gray-200 transition-all duration-200 w-16 lg:w-60"
      >
        {/* Top: Logo + Brand */}
        <div className="p-3 lg:p-4 flex items-center gap-3 border-b border-gray-200">
          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="flex items-center justify-center rounded-full w-10 h-10 shrink-0 border border-gray-200"
          >
            <Logo width={18} height={18} />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-[14px] font-medium text-gray-900 tracking-tight">Sócrates</span>
            <span className="text-[11.5px] text-gray-400">EdTech escolar</span>
          </div>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto" aria-label="Menú docente">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-full text-[13px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-gray-900 bg-[#f0f0ee]'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                title={item.label}
              >
                <Icon size={16} strokeWidth={1.5} className="shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: Course switcher and Teacher info */}
        <div className="p-2 lg:p-3 border-t border-gray-200 flex flex-col gap-2">
          {/* Quick link to Landing for preview */}
          <button
            type="button"
            onClick={() => navigate('/landing')}
            className="hidden lg:flex items-center justify-between px-3 py-1.5 rounded-full text-[11.5px] text-blue-500 hover:text-blue-600 hover:bg-[#f0f0ee] transition-colors"
            title="Ver sección de presentación pública"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} strokeWidth={1.5} />
              <span>Ver Hero público</span>
            </span>
            <span className="text-[11px] text-gray-400">/landing</span>
          </button>

          {/* Course selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-full text-[12px] font-medium text-gray-700 hover:text-gray-900 bg-[#f0f0ee] transition-colors focus-visible:ring-2 ring-blue-400"
              aria-label="Seleccionar curso activo"
            >
              <span className="truncate hidden lg:inline">{selectedCourse.name}</span>
              <span className="truncate lg:hidden">{selectedCourse.id}</span>
              <ChevronDown size={14} strokeWidth={1.5} className="shrink-0 ml-1 text-gray-400" />
            </button>

            {isCourseDropdownOpen && (
              <div
                style={{ backgroundColor: '#EDEDED' }}
                className="absolute bottom-full left-0 mb-1 w-52 rounded-xl border border-gray-200 p-1.5 z-40"
              >
                <div className="px-2 py-1 text-[11.5px] text-gray-400">Cambiar curso activo:</div>
                {availableCourses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourse(c);
                      setIsCourseDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                      c.id === selectedCourse.id
                        ? 'bg-[#f0f0ee] text-gray-900'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Teacher Profile + Logout */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-medium shrink-0"
                aria-hidden="true"
              >
                CH
              </div>
              <div className="hidden lg:flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-gray-900 truncate">
                  {initialTeacherProfile.name}
                </span>
                <span className="text-[11.5px] text-gray-400 truncate">
                  {initialTeacherProfile.school}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 transition-colors focus-visible:ring-2 ring-blue-400"
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 sm:ml-[80px] lg:ml-[264px] px-6 sm:px-10 py-8 pb-20 sm:pb-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Bar for Mobile (<sm) */}
      <nav
        aria-label="Navegación móvil"
        style={{ backgroundColor: '#EDEDED' }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 px-4 py-2 flex items-center justify-around"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-full text-[11.5px] font-medium transition-colors ${
                isActive ? 'text-blue-500 font-medium' : 'text-gray-700'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
