import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowLeft, Download, Check, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusDot } from '../components/StatusDot';
import { Modal } from '../components/Modal';
import { useToast } from '../components/UndoToast';
import {
  mockEvaluations,
  mockStudents,
  mockQuestions,
  mockLearningObjectives,
} from '../mock/data';

export const EvaluacionDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const evaluation =
    mockEvaluations.find((e) => e.id === id) || mockEvaluations[0];

  const [activeTab, setActiveTab] = useState<'resultados' | 'preguntas' | 'objetivos'>(
    'resultados'
  );
  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [rubricMinLogrado, setRubricMinLogrado] = useState(evaluation.rubricLevels.logradoMin);
  const [rubricMinEnProceso, setRubricMinEnProceso] = useState(evaluation.rubricLevels.enProcesoMin);

  const tabs = [
    { id: 'resultados', label: 'Resultados por estudiante' },
    { id: 'preguntas', label: 'Análisis por pregunta y distractores' },
    { id: 'objetivos', label: 'Dominio por objetivo de aprendizaje' },
  ];

  const handleExportCSV = () => {
    showToast('Planilla CSV descargada con las calificaciones del curso');
  };

  const handleSaveRubric = () => {
    setIsRubricOpen(false);
    showToast('Ponderación de rúbrica actualizada para esta evaluación');
  };

  return (
    <div>
      <PageHeader
        title={evaluation.title}
        subtitle={`${evaluation.course} · ${evaluation.subject} · ${evaluation.date} · ${evaluation.averageScorePercent}% de logro promedio`}
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Evaluaciones', to: '/evaluaciones' },
          { label: evaluation.title },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={<SlidersHorizontal size={14} strokeWidth={1.5} />}
              onClick={() => setIsRubricOpen(true)}
            >
              Rúbrica ({rubricMinLogrado}% / {rubricMinEnProceso}%)
            </Button>
            <Button
              variant="secondary"
              icon={<Download size={14} strokeWidth={1.5} />}
              onClick={handleExportCSV}
            >
              Exportar CSV
            </Button>
          </div>
        }
      />

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#EDEDED] text-gray-900 border border-gray-200'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Resultados por estudiante */}
      {activeTab === 'resultados' && (
        <section aria-labelledby="resultados-heading" className="space-y-4">
          <div className="flex items-center justify-between text-[12px] text-gray-700">
            <span>Mostrando {mockStudents.length} de {evaluation.studentsCount} estudiantes evaluados</span>
            <span>Criterio: Logrado (≥{rubricMinLogrado}%), En proceso ({rubricMinEnProceso}%-{rubricMinLogrado - 1}%), No logrado (&lt;{rubricMinEnProceso}%)</span>
          </div>

          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 overflow-hidden"
          >
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-normal">
                  <th className="py-3 px-4 font-medium text-gray-700">Estudiante</th>
                  <th className="py-3 px-4 font-medium text-gray-700">RUN</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Puntaje</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Porcentaje de logro</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Estado del objetivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-900">
                {mockStudents.map((st) => {
                  const correctAnswers = Math.round((st.lastEvaluationScore / 100) * evaluation.questionsCount);
                  const status =
                    st.lastEvaluationScore >= rubricMinLogrado
                      ? 'logrado'
                      : st.lastEvaluationScore >= rubricMinEnProceso
                      ? 'en_proceso'
                      : 'no_logrado';

                  return (
                    <tr key={st.id} className="hover:bg-black/[0.02] transition-colors">
                      <td className="py-3 px-4 font-medium">
                        <Link to={`/curso`} className="hover:text-blue-500 transition-colors">
                          {st.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{st.run}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {correctAnswers} de {evaluation.questionsCount} correctas
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {st.lastEvaluationScore}%
                      </td>
                      <td className="py-3 px-4">
                        <StatusDot status={status} size="sm" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: Análisis por pregunta y distractores */}
      {activeTab === 'preguntas' && (
        <section aria-labelledby="preguntas-heading" className="space-y-6">
          <div className="text-[12px] text-gray-400">
            Análisis de dificultad y frecuencia de elección de distractores. Identifica el error conceptual detrás de cada alternativa incorrecta.
          </div>

          <div className="space-y-4">
            {mockQuestions.map((q) => (
              <div
                key={q.number}
                style={{ backgroundColor: '#EDEDED' }}
                className="rounded-xl border border-gray-200 p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-medium text-gray-900">
                      Pregunta #{q.number}
                    </span>
                    <span className="text-[11.5px] text-blue-500 border border-blue-400 rounded-full px-2.5 py-0.5 bg-[#f0f0ee]">
                      {q.objectiveCode}
                    </span>
                    <span className="text-[12px] text-gray-700">
                      Clave correcta: <strong className="text-gray-900">{q.correctOption}</strong>
                    </span>
                  </div>

                  <div className="text-[12px] font-medium">
                    <span className={q.correctPercent >= 60 ? 'text-green-700' : 'text-rose-700'}>
                      {q.correctPercent}% de acierto en el curso
                    </span>
                  </div>
                </div>

                {/* Distractor analysis breakdown */}
                <div>
                  <div className="text-[11.5px] text-gray-400 mb-2">
                    Distribución de respuestas y análisis de distractores:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const isCorrect = opt === q.correctOption;
                      const dist = q.distractors.find((d) => d.option === opt);
                      const pct = isCorrect ? q.correctPercent : dist ? dist.percent : 0;
                      const misconception = dist?.misconception;

                      return (
                        <div
                          key={opt}
                          className={`p-3 rounded-xl border text-[12px] ${
                            isCorrect
                              ? 'border-green-300 bg-green-50/50'
                              : misconception
                              ? 'border-amber-300 bg-amber-50/50'
                              : 'border-gray-200 bg-[#f0f0ee]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              Opción {opt} {isCorrect && '(Correcta)'}
                            </span>
                            <span className="font-medium">{pct}%</span>
                          </div>
                          {misconception ? (
                            <p className="text-[11px] text-amber-800 leading-tight">
                              {misconception}
                            </p>
                          ) : (
                            <p className="text-[11px] text-gray-400">
                              {isCorrect ? 'Respuesta esperada' : 'Sin error sistemático'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: Objetivos de aprendizaje */}
      {activeTab === 'objetivos' && (
        <section aria-labelledby="objetivos-heading" className="space-y-4">
          <div className="text-[12px] text-gray-400">
            Desempeño consolidado del curso en los objetivos medidos en esta evaluación.
          </div>

          <div className="grid grid-cols-1 gap-4">
            {mockLearningObjectives
              .filter((oa) => evaluation.objectives.includes(oa.code))
              .map((oa) => {
                const total = oa.totalStudents;
                const pctLogrado = Math.round((oa.achievedCount / total) * 100);

                return (
                  <div
                    key={oa.code}
                    style={{ backgroundColor: '#EDEDED' }}
                    className="rounded-xl border border-gray-200 p-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[13px] font-medium text-blue-500 bg-[#f0f0ee] border border-blue-400 rounded-full px-2.5 py-0.5">
                          {oa.code}
                        </span>
                        <span className="text-[13px] font-medium text-gray-900">
                          {oa.description}
                        </span>
                      </div>
                      <span className="text-[12px] font-medium text-gray-700">
                        {pctLogrado}% logro global
                      </span>
                    </div>

                    {/* Stacked bar visualization */}
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-[#f0f0ee] rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(oa.achievedCount / total) * 100}%` }}
                          className="bg-green-600 h-full"
                          title={`Logrado: ${oa.achievedCount}`}
                        />
                        <div
                          style={{ width: `${(oa.inProcessCount / total) * 100}%` }}
                          className="bg-amber-500 h-full"
                          title={`En proceso: ${oa.inProcessCount}`}
                        />
                        <div
                          style={{ width: `${(oa.notAchievedCount / total) * 100}%` }}
                          className="bg-rose-500 h-full"
                          title={`No logrado: ${oa.notAchievedCount}`}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11.5px] text-gray-700 pt-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                            Logrado: {oa.achievedCount} estudiantes
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                            En proceso: {oa.inProcessCount} estudiantes
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                            Objetivo no logrado: {oa.notAchievedCount} estudiantes
                          </span>
                        </div>
                        <Link
                          to="/feedback"
                          className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
                        >
                          Preparar reforzamiento →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Rubric modal */}
      <Modal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
        title="Rúbrica de la evaluación"
        subtitle="Los cambios recalcularán automáticamente los estados de logro de los estudiantes"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="modal-rubric-min-logrado" className="block text-[12px] font-medium text-gray-700 mb-1">
                Exigencia para nivel «Logrado»:
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="modal-rubric-min-logrado"
                  type="number"
                  value={rubricMinLogrado}
                  onChange={(e) => setRubricMinLogrado(Number(e.target.value))}
                  style={{ backgroundColor: '#f0f0ee' }}
                  className="w-24 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-medium text-gray-900"
                />
                <span className="text-[12px] text-gray-700">% o superior</span>
              </div>
            </div>

            <div>
              <label htmlFor="modal-rubric-min-en-proceso" className="block text-[12px] font-medium text-gray-700 mb-1">
                Exigencia para nivel «En proceso»:
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="modal-rubric-min-en-proceso"
                  type="number"
                  value={rubricMinEnProceso}
                  onChange={(e) => setRubricMinEnProceso(Number(e.target.value))}
                  style={{ backgroundColor: '#f0f0ee' }}
                  className="w-24 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-medium text-gray-900"
                />
                <span className="text-[12px] text-gray-700">%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setIsRubricOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveRubric}>
              Aplicar cambios
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
