import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, AlertCircle, Clock, Check } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusDot } from '../components/StatusDot';
import { Modal } from '../components/Modal';
import { useToast } from '../components/UndoToast';
import { mockCourseGaps, mockLearningObjectives, CourseGap } from '../mock/data';

export const Feedback: React.FC = () => {
  const { showToast } = useToast();

  const [activeGapForPlan, setActiveGapForPlan] = useState<CourseGap | null>(null);
  const [activeGapForFeedback, setActiveGapForFeedback] = useState<CourseGap | null>(null);

  // Editable reinforcement plan text
  const [planText, setPlanText] = useState('');

  // Editable draft comments for students
  const [draftComments, setDraftComments] = useState<{
    studentName: string;
    comment: string;
  }[]>([
    {
      studentName: 'Martín González Muñoz',
      comment: 'Martín: En la evaluación observamos un buen manejo de operaciones básicas, pero detectamos confusión en la regla del signo al calcular potencias como (-2)⁴ frente a -2⁴. Recuerda que si el signo está dentro del paréntesis, se eleva todo el número negativo.',
    },
    {
      studentName: 'Camila Morales Palma',
      comment: 'Camila: Excelente orden al plantear los ejercicios. Te sugerimos revisar el paso 3 del control, donde el exponente par afecta únicamente a la base sin incluir el signo negativo previo.',
    },
    {
      studentName: 'Benjamín Silva Paredes',
      comment: 'Benjamín: Notamos avances en el cálculo mental. Para la próxima clase dedicaremos 10 minutos a practicar la diferencia entre exponente con y sin paréntesis con ejemplos de puntajes de fútbol.',
    },
  ]);

  const handleOpenPlan = (gap: CourseGap) => {
    setActiveGapForPlan(gap);
    setPlanText(gap.suggestedPlan);
  };

  const handleSavePlan = () => {
    if (activeGapForPlan) {
      showToast(`Plan de reforzamiento para «${activeGapForPlan.title}» guardado`);
      setActiveGapForPlan(null);
    }
  };

  const handleOpenFeedbackModal = (gap: CourseGap) => {
    setActiveGapForFeedback(gap);
  };

  const handleSendFeedback = () => {
    if (activeGapForFeedback) {
      const studentCount = activeGapForFeedback.affectedStudentsCount;
      showToast(
        `Retroalimentación enviada a ${studentCount} estudiantes de 8°B`,
        () => {
          // undo logic
        },
        'Deshacer envío'
      );
      setActiveGapForFeedback(null);
    }
  };

  // Puntos ciegos: objectives not evaluated recently
  const blindspots = [
    {
      code: 'OA 06',
      title: 'Funciones afines y lineales',
      description: 'Tablas de valores, gráficos y pendiente en situaciones cotidianas.',
      daysUnchecked: 48,
      urgency: 'alta',
    },
    {
      code: 'OA 07',
      title: 'Teorema de Pitágoras en contexto',
      description: 'Aplicación en cálculo de distancias y resolución de problemas geométricos.',
      daysUnchecked: 62,
      urgency: 'media',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tablero de feedback"
        subtitle="Conversión de datos de corrección en intervenciones pedagógicas y retroalimentación personalizada"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Tablero de feedback' },
        ]}
      />

      <div className="space-y-8">
        {/* Brechas del curso */}
        <section aria-labelledby="brechas-heading">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="brechas-heading" className="text-[14px] font-medium text-gray-900">
                Brechas del curso
              </h2>
              <p className="text-[12px] text-gray-400">
                Los errores sistemáticos más frecuentes detectados en las últimas evaluaciones y el concepto no consolidado.
              </p>
            </div>
            <span className="text-[12px] text-gray-700">
              {mockCourseGaps.length} brechas priorizadas
            </span>
          </div>

          <div className="space-y-4">
            {mockCourseGaps.map((gap) => (
              <div
                key={gap.id}
                style={{ backgroundColor: '#EDEDED' }}
                className="rounded-xl border border-gray-200 p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[11.5px] font-medium text-blue-500 bg-[#f0f0ee] border border-blue-400 px-2 py-0.5 rounded-full">
                        {gap.relatedObjective}
                      </span>
                      <h3 className="text-[13px] font-medium text-gray-900">
                        {gap.title}
                      </h3>
                    </div>

                    <p className="text-[12px] text-gray-700 mt-1 max-w-3xl">
                      <strong className="font-medium text-gray-900">Error conceptual recurrente:</strong> {gap.misconception}
                    </p>
                  </div>

                  <div className="text-[12px] text-gray-700 font-medium whitespace-nowrap self-start">
                    {gap.affectedStudentsCount} de {gap.totalStudents} estudiantes afectados
                  </div>
                </div>

                {/* Actions per gap per spec */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-200">
                  <Button
                    variant="primary"
                    icon={<BookOpen size={14} strokeWidth={1.5} />}
                    onClick={() => handleOpenPlan(gap)}
                  >
                    Preparar reforzamiento
                  </Button>

                  <Button
                    variant="secondary"
                    icon={<Send size={14} strokeWidth={1.5} />}
                    onClick={() => handleOpenFeedbackModal(gap)}
                  >
                    Enviar retroalimentación
                  </Button>

                  <span className="text-[11.5px] text-gray-400 ml-auto">
                    El docente siempre revisa y autoriza antes de emitir
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Puntos ciegos: not evaluated recently */}
        <section aria-labelledby="ciegos-heading">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="ciegos-heading" className="text-[14px] font-medium text-gray-900">
                Puntos ciegos
              </h2>
              <p className="text-[12px] text-gray-400">
                Objetivos del plan curricular sin evaluaciones registradas recientemente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blindspots.map((bp) => (
              <div
                key={bp.code}
                style={{ backgroundColor: '#EDEDED' }}
                className="rounded-xl border border-gray-200 p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11.5px] font-medium text-blue-500 bg-[#f0f0ee] border border-blue-400 px-2 py-0.5 rounded-full">
                      {bp.code}
                    </span>
                    <span className="text-[11.5px] text-amber-600 flex items-center gap-1 font-medium">
                      <Clock size={12} strokeWidth={1.5} />
                      Sin evaluar hace {bp.daysUnchecked} días
                    </span>
                  </div>
                  <h3 className="text-[13px] font-medium text-gray-900">
                    {bp.title}
                  </h3>
                  <p className="text-[12px] text-gray-700 mt-1">
                    {bp.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[11.5px] text-gray-400">
                    Recomendación: Programar ticket de salida
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(`Pauta breve generada para ${bp.code}`)}
                    className="text-[12px] font-medium text-blue-500 hover:text-blue-600 inline-flex items-center gap-1"
                  >
                    Generar 3 preguntas →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal: Preparar reforzamiento (Short editable plan) */}
      <Modal
        isOpen={Boolean(activeGapForPlan)}
        onClose={() => setActiveGapForPlan(null)}
        title="Plan breve de reforzamiento"
        subtitle={`Sugerencia metodológica para ${activeGapForPlan?.relatedObjective} (15 minutos de clase)`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl border border-blue-300 bg-blue-50/50 text-[12px] text-blue-800 flex items-start gap-2">
            <Sparkles size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
            <div>
              <strong>Borrador sugerido por Sócrates:</strong> Este esquema fue generado a partir del error común de {activeGapForPlan?.affectedStudentsCount} estudiantes. Modifica las etapas con tu propio criterio pedagógico.
            </div>
          </div>

          <div>
            <label htmlFor="plan-editor" className="block text-[12px] font-medium text-gray-700 mb-1">
              Secuencia didáctica editable:
            </label>
            <textarea
              id="plan-editor"
              rows={6}
              value={planText}
              onChange={(e) => setPlanText(e.target.value)}
              style={{ backgroundColor: '#f0f0ee' }}
              className="w-full p-3 rounded-xl border border-gray-200 text-[13px] text-gray-900 focus-visible:ring-2 ring-blue-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setActiveGapForPlan(null)}>
              Cerrar sin guardar
            </Button>
            <Button variant="primary" onClick={handleSavePlan}>
              Guardar plan en mi cuaderno
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Enviar retroalimentación (Review and edit before sending) */}
      <Modal
        isOpen={Boolean(activeGapForFeedback)}
        onClose={() => setActiveGapForFeedback(null)}
        title="Retroalimentación individual sugerida"
        subtitle="Revisa y edita los comentarios antes de autorizar su publicación a los estudiantes"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="text-[12px] text-gray-700">
            Los comentarios se redactaron con tono formativo, mencionando avances concretos y la oportunidad de mejora en {activeGapForFeedback?.title}.
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {draftComments.map((draft, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-gray-200 bg-[#f0f0ee] space-y-2"
              >
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-gray-900">{draft.studentName}</span>
                  <span className="text-[11px] text-blue-500 font-medium">Borrador editable</span>
                </div>
                <textarea
                  rows={3}
                  value={draft.comment}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraftComments((prev) =>
                      prev.map((c, i) => (i === idx ? { ...c, comment: val } : c))
                    );
                  }}
                  style={{ backgroundColor: '#EDEDED' }}
                  className="w-full p-2.5 rounded-lg border border-gray-200 text-[12px] text-gray-900 focus-visible:ring-2 ring-blue-400"
                />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl border border-gray-200 bg-[#f0f0ee] text-[11.5px] text-gray-700">
            Garantía pedagógica: Ninguna observación llega al apoderado o estudiante sin tu validación expresa. Podrás deshacer este envío durante los primeros 10 segundos.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setActiveGapForFeedback(null)}>
              Descartar
            </Button>
            <Button variant="primary" onClick={handleSendFeedback}>
              Confirmar envío a {activeGapForFeedback?.affectedStudentsCount} estudiantes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
