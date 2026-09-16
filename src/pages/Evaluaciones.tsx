import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, SlidersHorizontal, Plus, Search, Check } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusDot } from '../components/StatusDot';
import { Modal } from '../components/Modal';
import { useToast } from '../components/UndoToast';
import { mockEvaluations, EvaluationItem } from '../mock/data';

export const Evaluaciones: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(mockEvaluations);
  const [courseFilter, setCourseFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false);

  // Rubric settings state
  const [rubricMinLogrado, setRubricMinLogrado] = useState(75);
  const [rubricMinEnProceso, setRubricMinEnProceso] = useState(50);

  const filteredEvaluations = evaluations.filter((ev) => {
    if (courseFilter !== 'todos' && ev.course !== courseFilter) return false;
    if (statusFilter !== 'todos' && ev.status !== statusFilter) return false;
    if (
      searchQuery &&
      !ev.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.subject.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredEvaluations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEvaluations.map((e) => e.id));
    }
  };

  const handleArchiveSelected = () => {
    const count = selectedIds.length;
    const archivedItems = evaluations.filter((e) => selectedIds.includes(e.id));
    setEvaluations((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
    setSelectedIds([]);

    showToast(
      `Se archivaron ${count} evaluaciones seleccionadas`,
      () => {
        setEvaluations((prev) => [...prev, ...archivedItems]);
      },
      'Deshacer archivado'
    );
  };

  const handleSaveRubric = () => {
    setIsRubricModalOpen(false);
    showToast('Niveles de logro y rúbrica del establecimiento actualizados');
  };

  const getStatusDotProps = (status: EvaluationItem['status']) => {
    switch (status) {
      case 'publicada':
        return { status: 'logrado' as const, label: 'Publicada' };
      case 'corregida':
        return { status: 'en_proceso' as const, label: 'Corregida (sin publicar)' };
      case 'borrador':
        return { status: 'requiere_revision' as const, label: 'Borrador' };
    }
  };

  return (
    <div>
      <PageHeader
        title="Evaluaciones"
        subtitle="Registro histórico, aplicación de pautas y configuración de niveles de logro"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Evaluaciones' },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={<SlidersHorizontal size={14} strokeWidth={1.5} />}
              onClick={() => setIsRubricModalOpen(true)}
            >
              Configurar rúbrica
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={14} strokeWidth={1.5} />}
              onClick={() => navigate('/escaneo')}
            >
              Nueva evaluación
            </Button>
          </div>
        }
      />

      {/* Filters bar */}
      <div
        style={{ backgroundColor: '#EDEDED' }}
        className="rounded-xl border border-gray-200 p-3.5 mb-6 flex flex-col md:flex-row items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[#f0f0ee] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
            />
          </div>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-1.5 text-[12px] bg-[#f0f0ee] rounded-full border border-gray-200 text-gray-700 focus-visible:ring-2 ring-blue-400"
            aria-label="Filtrar por curso"
          >
            <option value="todos">Todos los cursos</option>
            <option value="8°B">8°B</option>
            <option value="8°A">8°A</option>
            <option value="7°B">7°B</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-[12px] bg-[#f0f0ee] rounded-full border border-gray-200 text-gray-700 focus-visible:ring-2 ring-blue-400"
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="publicada">Publicada</option>
            <option value="corregida">Corregida</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>

        {/* Bulk selection actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-[12px] text-gray-700 font-medium">
              {selectedIds.length} seleccionadas
            </span>
            <Button
              variant="secondary"
              icon={<Archive size={14} strokeWidth={1.5} />}
              onClick={handleArchiveSelected}
              className="py-1 px-3 text-[12px]"
            >
              Archivar
            </Button>
          </div>
        )}
      </div>

      {/* Table: 12px cells, hairline dividers, no zebra striping */}
      {/* Desktop view (>= md) */}
      <div
        style={{ backgroundColor: '#EDEDED' }}
        className="hidden md:block rounded-xl border border-gray-200 overflow-hidden"
      >
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 font-normal">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredEvaluations.length > 0 &&
                    selectedIds.length === filteredEvaluations.length
                  }
                  onChange={selectAll}
                  aria-label="Seleccionar todas las evaluaciones"
                  className="rounded border-gray-300 text-blue-500 focus-visible:ring-2 ring-blue-400"
                />
              </th>
              <th className="py-3 px-4 font-medium text-gray-700">Evaluación</th>
              <th className="py-3 px-4 font-medium text-gray-700">Curso</th>
              <th className="py-3 px-4 font-medium text-gray-700">Fecha</th>
              <th className="py-3 px-4 font-medium text-gray-700">Estado</th>
              <th className="py-3 px-4 font-medium text-gray-700 text-right">Promedio de logro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-900">
            {filteredEvaluations.map((ev) => {
              const isSelected = selectedIds.includes(ev.id);
              const statusProps = getStatusDotProps(ev.status);

              return (
                <tr
                  key={ev.id}
                  onClick={() => navigate(`/evaluaciones/${ev.id}`)}
                  className={`hover:bg-black/[0.02] cursor-pointer transition-colors ${
                    isSelected ? 'bg-black/[0.03]' : ''
                  }`}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleSelect(ev.id, e as any)}
                      aria-label={`Seleccionar ${ev.title}`}
                      className="rounded border-gray-300 text-blue-500 focus-visible:ring-2 ring-blue-400"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <div className="truncate max-w-sm">{ev.title}</div>
                    <div className="text-[11px] text-gray-400">{ev.questionsCount} preguntas · {ev.studentsCount} estudiantes</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{ev.course}</td>
                  <td className="py-3 px-4 text-gray-400">{ev.date}</td>
                  <td className="py-3 px-4">
                    <StatusDot status={statusProps.status} label={statusProps.label} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {ev.averageScorePercent > 0 ? (
                      <span>{ev.averageScorePercent}% de logro</span>
                    ) : (
                      <span className="text-gray-400">Sin calificar</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet view (< md): stacked rows */}
      <div className="md:hidden space-y-3">
        {filteredEvaluations.map((ev) => {
          const isSelected = selectedIds.includes(ev.id);
          const statusProps = getStatusDotProps(ev.status);

          return (
            <div
              key={ev.id}
              onClick={() => navigate(`/evaluaciones/${ev.id}`)}
              style={{ backgroundColor: '#EDEDED' }}
              className={`p-4 rounded-xl border border-gray-200 transition-colors cursor-pointer space-y-2.5 ${
                isSelected ? 'border-blue-400' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggleSelect(ev.id, e as any)}
                    aria-label={`Seleccionar ${ev.title}`}
                    className="rounded border-gray-300 text-blue-500"
                  />
                  <span className="text-[13px] font-medium text-gray-900">
                    {ev.title}
                  </span>
                </div>
                <StatusDot status={statusProps.status} label={statusProps.label} size="sm" />
              </div>

              <div className="flex items-center justify-between text-[12px] text-gray-700 pt-1 border-t border-gray-200">
                <span>{ev.course} · {ev.date}</span>
                <span className="font-medium text-gray-900">
                  {ev.averageScorePercent > 0 ? `${ev.averageScorePercent}% de logro` : 'Sin calificar'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric editor modal */}
      <Modal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        title="Configuración de rúbrica y umbrales"
        subtitle="Ajusta los cortes porcentuales para los niveles de logro según el reglamento del colegio"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="min-logrado" className="block text-[12px] font-medium text-gray-700 mb-1">
                Umbral mínimo para «Logrado» (verde):
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="min-logrado"
                  type="number"
                  min={50}
                  max={100}
                  value={rubricMinLogrado}
                  onChange={(e) => setRubricMinLogrado(Number(e.target.value))}
                  style={{ backgroundColor: '#f0f0ee' }}
                  className="w-24 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-medium text-gray-900 focus-visible:ring-2 ring-blue-400"
                />
                <span className="text-[12px] text-gray-700">% o superior</span>
              </div>
            </div>

            <div>
              <label htmlFor="min-en-proceso" className="block text-[12px] font-medium text-gray-700 mb-1">
                Umbral mínimo para «En proceso» (ámbar):
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="min-en-proceso"
                  type="number"
                  min={30}
                  max={rubricMinLogrado - 1}
                  value={rubricMinEnProceso}
                  onChange={(e) => setRubricMinEnProceso(Number(e.target.value))}
                  style={{ backgroundColor: '#f0f0ee' }}
                  className="w-24 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-medium text-gray-900 focus-visible:ring-2 ring-blue-400"
                />
                <span className="text-[12px] text-gray-700">
                  % hasta {rubricMinLogrado - 1}% (menor a este valor se cataloga como «No logrado»)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 bg-[#f0f0ee] text-[12px] text-gray-700">
            Regla de redacción: En todos los informes se reporta el nivel de desempeño del objetivo («objetivo no logrado»), evitando etiquetar de forma peyorativa a los estudiantes.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setIsRubricModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveRubric}>
              Guardar configuración
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
