import React, { useState } from 'react';
import { Download, Filter, TrendingUp, Users, ArrowRight, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusDot } from '../components/StatusDot';
import { useToast } from '../components/UndoToast';
import {
  mockLearningObjectives,
  mockStudents,
  LearningObjective,
} from '../mock/data';

export const Logros: React.FC = () => {
  const { showToast } = useToast();

  const [selectedObjective, setSelectedObjective] = useState<LearningObjective>(
    mockLearningObjectives[1] // OA 02
  );

  // Cell filter state: objectiveCode + level
  const [activeCellFilter, setActiveCellFilter] = useState<{
    oaCode: string;
    level: 'logrado' | 'en_proceso' | 'no_logrado';
    levelLabel: string;
  } | null>(null);

  const handleCellClick = (
    oaCode: string,
    level: 'logrado' | 'en_proceso' | 'no_logrado',
    levelLabel: string
  ) => {
    if (
      activeCellFilter &&
      activeCellFilter.oaCode === oaCode &&
      activeCellFilter.level === level
    ) {
      setActiveCellFilter(null);
    } else {
      setActiveCellFilter({ oaCode, level, levelLabel });
    }
  };

  const handleDownloadReport = (format: 'PDF' | 'CSV') => {
    showToast(`Reporte institucional en formato ${format} generado para Dirección Académica`);
  };

  // Mock historical data for selected objective line chart
  const historicalData = [
    { label: 'Diag. Inicial (Mar)', value: 45 },
    { label: 'Control 1 (May)', value: 52 },
    { label: 'Eval 1 (Jun)', value: 58 },
    { label: 'Control 2 (Ago)', value: 64 },
    { label: 'Eval 3 (Sep)', value: 71 },
  ];

  // Filter students based on active cell selection
  const filteredStudents = mockStudents.filter((st) => {
    if (!activeCellFilter) return true;
    return st.status === activeCellFilter.level;
  });

  return (
    <div>
      <PageHeader
        title="Reportes de logro"
        subtitle="Monitoreo pedagógico por objetivo de aprendizaje (OA) del currículum nacional"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Reportes de logro' },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={<Download size={14} strokeWidth={1.5} />}
              onClick={() => handleDownloadReport('CSV')}
            >
              Exportar CSV
            </Button>
            <Button
              variant="primary"
              icon={<Download size={14} strokeWidth={1.5} />}
              onClick={() => handleDownloadReport('PDF')}
            >
              Descargar reporte PDF
            </Button>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Primary View: Matrix of objectives × achievement level */}
        <section aria-labelledby="matriz-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 id="matriz-heading" className="text-[14px] font-medium text-gray-900">
                Matriz de dominio curricular (8°B)
              </h2>
              <p className="text-[12px] text-gray-400">
                Haz clic en cualquier celda para filtrar y activar una ruta de apoyo con esos estudiantes.
              </p>
            </div>
            {activeCellFilter && (
              <button
                type="button"
                onClick={() => setActiveCellFilter(null)}
                className="inline-flex items-center gap-1.5 text-[12px] text-blue-500 hover:text-blue-600 self-start sm:self-auto"
              >
                <X size={14} strokeWidth={1.5} />
                <span>Quitar filtro de celda</span>
              </button>
            )}
          </div>

          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 overflow-hidden"
          >
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-normal">
                  <th className="py-3 px-4 font-medium text-gray-700">Objetivo de aprendizaje</th>
                  <th className="py-3 px-4 font-medium text-green-700 text-center">Logrado</th>
                  <th className="py-3 px-4 font-medium text-amber-700 text-center">En proceso</th>
                  <th className="py-3 px-4 font-medium text-rose-700 text-center">Objetivo no logrado</th>
                  <th className="py-3 px-4 font-medium text-gray-700 text-right">Total curso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {mockLearningObjectives.map((oa) => {
                  const isRowSelected = selectedObjective.code === oa.code;

                  return (
                    <tr
                      key={oa.code}
                      onClick={() => setSelectedObjective(oa)}
                      className={`hover:bg-black/[0.015] cursor-pointer transition-colors ${
                        isRowSelected ? 'bg-black/[0.025]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 max-w-md">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[11.5px] font-medium text-blue-500 bg-[#f0f0ee] border border-blue-400 px-2 py-0.5 rounded-full">
                            {oa.code}
                          </span>
                          <span className="text-[11.5px] text-gray-400">{oa.category}</span>
                        </div>
                        <div className="font-medium text-gray-900 line-clamp-1">{oa.description}</div>
                      </td>

                      {/* Logrado cell */}
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(oa.code, 'logrado', 'Logrado');
                        }}
                        className={`py-3 px-4 text-center cursor-pointer transition-all ${
                          activeCellFilter?.oaCode === oa.code && activeCellFilter.level === 'logrado'
                            ? 'bg-green-100 font-medium'
                            : 'hover:bg-green-50'
                        }`}
                      >
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-green-800 text-[12px]">
                          {oa.achievedCount} estudiantes
                        </span>
                      </td>

                      {/* En proceso cell */}
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(oa.code, 'en_proceso', 'En proceso');
                        }}
                        className={`py-3 px-4 text-center cursor-pointer transition-all ${
                          activeCellFilter?.oaCode === oa.code && activeCellFilter.level === 'en_proceso'
                            ? 'bg-amber-100 font-medium'
                            : 'hover:bg-amber-50'
                        }`}
                      >
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-amber-800 text-[12px]">
                          {oa.inProcessCount} estudiantes
                        </span>
                      </td>

                      {/* No logrado cell */}
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(oa.code, 'no_logrado', 'Objetivo no logrado');
                        }}
                        className={`py-3 px-4 text-center cursor-pointer transition-all ${
                          activeCellFilter?.oaCode === oa.code && activeCellFilter.level === 'no_logrado'
                            ? 'bg-rose-100 font-medium'
                            : 'hover:bg-rose-50'
                        }`}
                      >
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-rose-800 text-[12px]">
                          {oa.notAchievedCount} estudiantes
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right text-gray-700 font-medium">
                        {oa.totalStudents} estudiantes
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Action Panel if Cell is clicked */}
        {activeCellFilter && (
          <section
            aria-labelledby="filtro-activo-heading"
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-blue-400 p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
              <div>
                <div className="text-[11.5px] text-blue-500 font-medium">
                  Ruta de acción activa para {activeCellFilter.oaCode}
                </div>
                <h3 id="filtro-activo-heading" className="text-[14px] font-medium text-gray-900">
                  Estudiantes con estado «{activeCellFilter.levelLabel}» ({filteredStudents.length} estudiantes)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={() =>
                    showToast(`Borrador de taller remedio creado para los ${filteredStudents.length} estudiantes`)
                  }
                >
                  Preparar taller remedial
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3 rounded-xl border border-gray-200 bg-[#f0f0ee] space-y-1"
                >
                  <div className="text-[13px] font-medium text-gray-900 truncate">
                    {st.name}
                  </div>
                  <div className="text-[11.5px] text-gray-400">
                    Último logro: {st.lastEvaluationScore}%
                  </div>
                  <div className="text-[11px] text-gray-700 truncate">
                    Intereses: {st.interests.slice(0, 2).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Secondary View: Progress over time as simple line chart */}
        <section aria-labelledby="evolucion-heading">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="evolucion-heading" className="text-[14px] font-medium text-gray-900">
                Evolución temporal del {selectedObjective.code}
              </h2>
              <p className="text-[12px] text-gray-400">
                {selectedObjective.description} · {historicalData.length} mediciones en el año escolar
              </p>
            </div>
          </div>

          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 p-6 space-y-4"
          >
            {/* Clean SVG Line chart with labeled axes and no redundant legend */}
            <div className="w-full h-56 relative flex flex-col justify-between">
              {/* Grid lines and y-axis labels */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400">
                <div className="border-b border-gray-200 flex justify-between pr-2 pb-0.5">
                  <span>100% (Logro total)</span>
                </div>
                <div className="border-b border-gray-200 flex justify-between pr-2 pb-0.5">
                  <span>75% (Umbral Logrado)</span>
                </div>
                <div className="border-b border-gray-200 flex justify-between pr-2 pb-0.5">
                  <span>50% (Umbral En proceso)</span>
                </div>
                <div className="border-b border-gray-200 flex justify-between pr-2 pb-0.5">
                  <span>0%</span>
                </div>
              </div>

              {/* SVG Line representation */}
              <svg
                viewBox="0 0 500 200"
                preserveAspectRatio="none"
                className="w-full h-full z-10 overflow-visible"
              >
                {/* Horizontal reference line for 75% threshold */}
                <line
                  x1="0"
                  y1="50"
                  x2="500"
                  y2="50"
                  stroke="#16a34a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points="20,110 130,96 240,84 350,72 470,58"
                />

                {/* Data points with score labels */}
                {historicalData.map((pt, i) => {
                  const x = 20 + i * 112.5;
                  const y = 200 - pt.value * 2;
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#3b82f6"
                        className="hover:scale-125 transition-transform"
                      />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                        fill="#111827"
                      >
                        {pt.value}%
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between pt-2 text-[11px] text-gray-700 font-medium">
                {historicalData.map((pt, i) => (
                  <span key={i} className="text-center">
                    {pt.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[12px] text-gray-400 pt-2 border-t border-gray-200">
              Tendencia positiva: +26 puntos porcentuales de incremento desde el diagnóstico inicial.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
