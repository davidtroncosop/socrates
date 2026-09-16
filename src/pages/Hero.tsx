import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export const Hero: React.FC = () => {
  const navLinks = ['Módulos', 'Colegios', 'Precios', 'Soporte'];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f0ee]">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src="<PEGA_AQUÍ_LA_URL_DEL_VIDEO>"
        aria-hidden="true"
      />

      {/* Foreground content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-center pt-4 sm:pt-6 px-4 sm:px-8 gap-2 sm:gap-3">
          {/* Left circular logo container */}
          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shrink-0"
          >
            <Logo width={18} height={18} />
          </div>

          {/* Right pill container */}
          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="flex items-center gap-4 sm:gap-10 rounded-xl px-4 sm:px-8 py-2.5 sm:py-3"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[12px] sm:text-[14px] font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-xs">
            {/* 1. Badge link */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3 group"
            >
              <span>Creado junto a profesores de aula</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>

            {/* 2. Headline */}
            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
              Menos corrección mecánica, más tiempo para enseñar y acompañar.
            </h1>

            {/* 3. Subtext */}
            <p className="text-[13px] text-gray-400 font-normal mb-3">
              Escanea las pruebas y recibe los logros del curso.
            </p>

            {/* 4. CTA anchor */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
            >
              <span>Probar con un curso</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
