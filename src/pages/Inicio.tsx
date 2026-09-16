import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { StatusDot } from '../components/StatusDot';
import { mockStats, mockAttentionItems, mockBatches } from '../mock/data';

export const Inicio: React.FC = () => {
  const [isNewAccount, setIsNewAccount] = useState(false);

  return (
    <div>
      <PageHeader
        title="Inicio"
        subtitle="Prioridades pedagógicas y decisiones que requieren tu atención hoy"
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsNewAccount(!isNewAccount)}
              className="text-[12px] font-medium text-gray-700 hover:text-gray-900 underline underline-offset-4 transition-colors"
            >
              {isNewAccount ? 'Ver estado con datos' : 'Simular cuenta nueva'}
            </button>
            <Link
              to="/escaneo"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
            >
              <ScanLine size={16} strokeWidth={1.5} />
              <span>Escanear evaluación</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        }
      />

      {isNewAccount ? (
        /* Empty state for a new account */
        <div
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8"
        >
          <div className="w-12 h-12 rounded-full border border-gray-300 mx-auto flex items-center justify-center text-gray-700 mb-4">
            <ScanLine size={20} strokeWidth={1.5} />
          </div>
          <h2 className="text-[1.5rem] font-medium text-gray-900 tracking-tight mb-2">
            Comienza con tu primera evaluación
          </h2>
          <p className="text-[13px] text-gray-700 mb-6 max-w-md mx-auto">
            Digitaliza las hojas de respuesta con la impresora de tu sala de profesores o sube un archivo PDF para obtener diagnósticos inmediatos por objetivo.
          </p>
          <Link
            to="/escaneo"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
          >
            <span>Escanea tu primera evaluación</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      ) : (
        /* Populated state */
        <div className="space-y-10">
          {/* Top: 3 plain stat blocks (no cards, no borders per spec) */}
          <section aria-label="Resumen operativo">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 py-2">
              {mockStats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[1.5rem] sm:text-[1.75rem] font-medium text-gray-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[12px] text-gray-400 mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Requiere tu atención list */}
          <section aria-labelledby="atencion-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="atencion-heading" className="text-[14px] font-medium text-gray-900">
                Requiere tu atención
              </h2>
              <span className="text-[12px] text-gray-400">
                {mockAttentionItems.length} decisiones pendientes
              </span>
            </div>

            <div
              style={{ backgroundColor: '#EDEDED' }}
              className="rounded-xl border border-gray-200 divide-y divide-gray-200 overflow-hidden"
            >
              {mockAttentionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.015] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <StatusDot status={item.status} size="md" />
                    <div>
                      <div className="text-[13px] font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-gray-700">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={item.actionRoute}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors shrink-0 group self-end sm:self-center"
                  >
                    <span>{item.actionLabel}</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Retomar section: last 3 scanning batches with progress */}
          <section aria-labelledby="retomar-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="retomar-heading" className="text-[14px] font-medium text-gray-900">
                Retomar
              </h2>
              <span className="text-[12px] text-gray-400">
                Últimos 3 lotes de escaneo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockBatches.map((batch) => {
                const percent = Math.round((batch.processedSheets / batch.totalSheets) * 100);
                const isComplete = batch.processedSheets === batch.totalSheets;

                return (
                  <div
                    key={batch.id}
                    style={{ backgroundColor: '#EDEDED' }}
                    className="rounded-xl border border-gray-200 p-4 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11.5px] text-gray-400 mb-1">
                        <span>{batch.course}</span>
                        <span>{batch.date}</span>
                      </div>
                      <h3 className="text-[13px] font-medium text-gray-900 truncate">
                        {batch.name}
                      </h3>
                      <p className="text-[12px] text-gray-700 mt-1">
                        {batch.processedSheets} de {batch.totalSheets} hojas procesadas
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Determinate progress bar */}
                      <div className="w-full bg-[#f0f0ee] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                          role="progressbar"
                          aria-valuenow={percent}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11.5px] text-gray-400">
                          {isComplete ? 'Listo para revisar' : `${percent}% completado`}
                        </span>
                        <Link
                          to="/escaneo"
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors group"
                        >
                          <span>{isComplete ? 'Ver lote' : 'Continuar'}</span>
                          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
