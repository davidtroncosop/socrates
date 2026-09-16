import React, { useState } from 'react';
import { Sparkles, Heart, Shield, Trash2, Copy, Check, Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/UndoToast';
import {
  mockActivitySuggestions,
  ActivityContextSuggestion,
} from '../mock/data';

export const Intereses: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'docente' | 'formulario'>('docente');
  const [selectedSuggestion, setSelectedSuggestion] = useState<ActivityContextSuggestion | null>(null);
  const [editableDraftText, setEditableDraftText] = useState('');

  // Course clustered interests
  const [interestClusters, setInterestClusters] = useState([
    { name: 'Minecraft y construcción de mundos', category: 'Videojuegos', count: 18 },
    { name: 'Fútbol barrial y campeonatos', category: 'Deportes', count: 15 },
    { name: 'Música urbana y trap chileno', category: 'Música', count: 14 },
    { name: 'Edición de video y TikTok', category: 'Creación digital', count: 11 },
    { name: 'Cuidado y rescate de mascotas', category: 'Naturaleza', count: 8 },
    { name: 'Skate y ciclismo urbano', category: 'Deportes', count: 7 },
  ]);

  // Student form preview simulation state
  const [studentFormName, setStudentFormName] = useState('Benjamín');
  const [studentFormInterests, setStudentFormInterests] = useState('Fútbol, Mecánica, Trap chileno');

  const handleOpenContextModal = (sug: ActivityContextSuggestion) => {
    setSelectedSuggestion(sug);
    setEditableDraftText(sug.draftText);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableDraftText);
    showToast('Borrador copiado al portapapeles para usar en tu guía de trabajo');
  };

  const handleDeleteCluster = (interestName: string) => {
    setInterestClusters((prev) => prev.filter((i) => i.name !== interestName));
    showToast(
      `Interés «${interestName}» eliminado del registro del curso`,
      () => {
        // undo logic
      },
      'Deshacer eliminación'
    );
  };

  return (
    <div>
      <PageHeader
        title="Intereses y contextualización didáctica"
        subtitle="Herramienta para formular problemas matemáticos con sentido personal para los estudiantes del 8°B"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Curso y estudiantes', to: '/curso' },
          { label: 'Intereses y contextualización' },
        ]}
      />

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('docente')}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
            activeTab === 'docente'
              ? 'bg-[#EDEDED] text-gray-900 border border-gray-200'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Vista del docente y contextualización
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('formulario')}
          className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
            activeTab === 'formulario'
              ? 'bg-[#EDEDED] text-gray-900 border border-gray-200'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Formulario que completan los estudiantes
        </button>
      </div>

      {activeTab === 'docente' ? (
        <div className="space-y-8">
          {/* Top: Clustered course interests */}
          <section aria-labelledby="clusters-heading">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 id="clusters-heading" className="text-[14px] font-medium text-gray-900">
                  Intereses predominantes en el 8°B
                </h2>
                <p className="text-[12px] text-gray-400">
                  Basado en las respuestas voluntarias del diagnóstico de afinidad.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {interestClusters.map((cluster) => (
                <div
                  key={cluster.name}
                  style={{ backgroundColor: '#EDEDED' }}
                  className="rounded-xl border border-gray-200 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11.5px] text-gray-400 mb-1">
                      <span>{cluster.category}</span>
                      <span className="font-medium text-gray-900">{cluster.count} de 42 estudiantes</span>
                    </div>
                    <h3 className="text-[13px] font-medium text-gray-900">
                      {cluster.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        const matchedSug =
                          mockActivitySuggestions.find((s) =>
                            s.interestTitle.toLowerCase().includes(cluster.name.slice(0, 5).toLowerCase())
                          ) || mockActivitySuggestions[0];
                        handleOpenContextModal(matchedSug);
                      }}
                      className="text-[12px] font-medium text-blue-500 hover:text-blue-600 inline-flex items-center gap-1 group"
                    >
                      <Sparkles size={14} strokeWidth={1.5} />
                      <span>Contextualizar una actividad</span>
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCluster(cluster.name)}
                      aria-label={`Eliminar interés ${cluster.name}`}
                      className="text-gray-400 hover:text-rose-500 p-1 rounded-full transition-colors"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contextualization Suggestions Cards */}
          <section aria-labelledby="sugerencias-heading">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 id="sugerencias-heading" className="text-[14px] font-medium text-gray-900">
                  Sugerencias didácticas contextualizadas
                </h2>
                <p className="text-[12px] text-gray-400">
                  Propuestas editables para vincular los objetivos prioritarios con los intereses reales del curso.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {mockActivitySuggestions.map((sug) => (
                <div
                  key={sug.id}
                  style={{ backgroundColor: '#EDEDED' }}
                  className="rounded-xl border border-gray-200 p-5 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11.5px] font-medium text-blue-500 bg-[#f0f0ee] border border-blue-400 px-2.5 py-0.5 rounded-full">
                        {sug.objectiveCode}
                      </span>
                      <span className="text-[13px] font-medium text-gray-900">
                        {sug.activityTitle}
                      </span>
                    </div>
                    <span className="text-[11.5px] text-gray-400">
                      Contexto: {sug.interestTitle}
                    </span>
                  </div>

                  <p className="text-[12px] text-gray-700 leading-relaxed">
                    {sug.draftText}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11.5px] text-gray-400 font-mono">
                      Modelo: {sug.sampleProblem}
                    </span>
                    <Button
                      variant="primary"
                      onClick={() => handleOpenContextModal(sug)}
                    >
                      Editar y adaptar problema
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy & Minor Data Explicit Note */}
          <section
            aria-labelledby="privacidad-heading"
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-[14px] font-medium text-gray-900">
              <Shield size={18} strokeWidth={1.5} className="text-blue-500" />
              <h2 id="privacidad-heading">Protección de datos de estudiantes menores de edad</h2>
            </div>

            <p className="text-[12px] text-gray-700 leading-relaxed max-w-4xl">
              En cumplimiento estricto de la Ley N° 19.628 sobre protección de la vida privada y los lineamientos del Ministerio de Educación de Chile, los datos sobre pasatiempos, gustos y aficiones se almacenan exclusivamente con fines de enriquecimiento pedagógico del docente de aula.
            </p>

            <ul className="text-[12px] text-gray-700 list-disc pl-5 space-y-1">
              <li>No se generan perfiles comerciales ni publicitarios.</li>
              <li>La información es accesible únicamente por el profesor de la asignatura y la jefatura de curso.</li>
              <li>Cualquier estudiante o su apoderado puede solicitar el borrado total e inmediato de sus preferencias en cualquier momento.</li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Deseas purgar todos los registros de intereses del 8°B? Esta acción eliminará los datos ingresados.')) {
                    setInterestClusters([]);
                    showToast('Todos los intereses del curso han sido eliminados de la base de datos');
                  }
                }}
                className="text-[12px] text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1.5"
              >
                <Trash2 size={14} strokeWidth={1.5} />
                <span>Purgar todos los datos de intereses del curso</span>
              </button>
            </div>
          </section>
        </div>
      ) : (
        /* Form that students fill in */
        <div
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 sm:p-8 max-w-xl mx-auto space-y-6"
        >
          <div>
            <div className="text-[11.5px] text-blue-500 font-medium mb-1">
              Vista previa del cuestionario escolar
            </div>
            <h2 className="text-[1.5rem] font-medium text-gray-900 tracking-tight">
              ¿Qué te gusta hacer fuera de clases?
            </h2>
            <p className="text-[13px] text-gray-700 mt-1">
              Tu profesor usará tus respuestas para crear ejemplos y ejercicios de matemática basados en las cosas que realmente te interesan.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-[12px] font-medium text-gray-700 mb-1">
                Tu nombre y curso:
              </label>
              <input
                id="student-name"
                type="text"
                value={studentFormName}
                onChange={(e) => setStudentFormName(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="student-interests" className="block text-[12px] font-medium text-gray-700 mb-1">
                Tus aficiones, juegos, deportes o temas favoritos:
              </label>
              <textarea
                id="student-interests"
                rows={4}
                value={studentFormInterests}
                onChange={(e) => setStudentFormInterests(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full p-3 text-[13px] rounded-xl border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
                placeholder="Ej. Minecraft, skate, básquetbol, dibujar manga..."
              />
            </div>

            <div className="p-3 rounded-xl border border-gray-200 bg-[#f0f0ee] text-[11.5px] text-gray-400">
              Respuestas confidenciales. Solo las ve tu profesora.
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => showToast('Simulación de respuesta estudiantil guardada')}
              >
                Enviar mis preferencias
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Contextualizar una actividad (Editable draft) */}
      <Modal
        isOpen={Boolean(selectedSuggestion)}
        onClose={() => setSelectedSuggestion(null)}
        title="Contextualizar problema matemático"
        subtitle="Propuesta adaptada a los intereses del curso (editable por el docente)"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-blue-300 bg-blue-50/50 text-[12px] text-blue-800 flex items-start gap-2">
            <Sparkles size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
            <div>
              <strong>Sugerencia didáctica (Borrador):</strong> Puedes ajustar los valores numéricos, el grado de dificultad o la redacción antes de incorporar el ejercicio a tu próxima guía de evaluación.
            </div>
          </div>

          <div>
            <label htmlFor="context-draft" className="block text-[12px] font-medium text-gray-700 mb-1">
              Texto del problema en contexto:
            </label>
            <textarea
              id="context-draft"
              rows={6}
              value={editableDraftText}
              onChange={(e) => setEditableDraftText(e.target.value)}
              style={{ backgroundColor: '#f0f0ee' }}
              className="w-full p-3 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus-visible:ring-2 ring-blue-400"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              icon={<Copy size={14} strokeWidth={1.5} />}
              onClick={handleCopyDraft}
            >
              Copiar al portapapeles
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => setSelectedSuggestion(null)}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  showToast('Problema contextualizado guardado en el banco de ítems del 8°B');
                  setSelectedSuggestion(null);
                }}
              >
                Guardar en banco de ítems
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
