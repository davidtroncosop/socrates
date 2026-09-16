import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Search, Eye, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusDot } from '../components/StatusDot';
import { Modal } from '../components/Modal';
import { useToast } from '../components/UndoToast';
import { mockStudents, StudentRecord } from '../mock/data';

export const Curso: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [students, setStudents] = useState<StudentRecord[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.run.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteStudentInterests = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, interests: [] } : s))
    );
    if (selectedStudent?.id === studentId) {
      setSelectedStudent((prev) => (prev ? { ...prev, interests: [] } : null));
    }
    showToast('Datos de intereses del estudiante eliminados conforme a la política de privacidad');
  };

  return (
    <div>
      <PageHeader
        title="Curso y estudiantes"
        subtitle="Nómina del 8°B · Matemática, trayectoria de aprendizaje y ficha individual"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Curso y estudiantes' },
        ]}
        action={
          <div className="flex items-center gap-3">
            <Link
              to="/curso/intereses"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
            >
              <Heart size={14} strokeWidth={1.5} />
              <span>Intereses del curso y contextualización</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        }
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="text-[12px] text-gray-400">Total nómina activa</div>
          <div className="text-[1.5rem] font-medium text-gray-900 mt-1">42 estudiantes</div>
          <div className="text-[11.5px] text-gray-700 mt-0.5">8°B · Jornada de la mañana</div>
        </div>

        <div
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="text-[12px] text-gray-400">Promedio de logro curso</div>
          <div className="text-[1.5rem] font-medium text-gray-900 mt-1">68% de logro</div>
          <div className="text-[11.5px] text-green-700 mt-0.5">+6% respecto al diagnóstico</div>
        </div>

        <div
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="text-[12px] text-gray-400">Intereses registrados</div>
          <div className="text-[1.5rem] font-medium text-gray-900 mt-1">38 de 42 estudiantes</div>
          <div className="text-[11.5px] text-blue-600 mt-0.5">Disponibles para contextualizar</div>
        </div>
      </div>

      {/* Search box */}
      <div
        style={{ backgroundColor: '#EDEDED' }}
        className="rounded-xl border border-gray-200 p-3 mb-6 flex items-center justify-between"
      >
        <div className="relative w-full sm:w-80">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por estudiante, RUN o interés..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-[#f0f0ee] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
          />
        </div>
        <span className="text-[12px] text-gray-400 hidden sm:inline">
          {filteredStudents.length} estudiantes listados
        </span>
      </div>

      {/* Students list */}
      <div
        style={{ backgroundColor: '#EDEDED' }}
        className="rounded-xl border border-gray-200 overflow-hidden"
      >
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 font-normal">
              <th className="py-3 px-4 font-medium text-gray-700">Estudiante</th>
              <th className="py-3 px-4 font-medium text-gray-700">RUN</th>
              <th className="py-3 px-4 font-medium text-gray-700">Logro acumulado</th>
              <th className="py-3 px-4 font-medium text-gray-700">Estado del objetivo</th>
              <th className="py-3 px-4 font-medium text-gray-700">Intereses registrados</th>
              <th className="py-3 px-4 font-medium text-gray-700 text-right">Ficha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-900">
            {filteredStudents.map((st) => (
              <tr
                key={st.id}
                onClick={() => setSelectedStudent(st)}
                className="hover:bg-black/[0.02] cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-medium">{st.name}</td>
                <td className="py-3 px-4 text-gray-400">{st.run}</td>
                <td className="py-3 px-4 font-medium">{st.generalScorePercent}%</td>
                <td className="py-3 px-4">
                  <StatusDot status={st.status} size="sm" />
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {st.interests.length > 0 ? (
                      st.interests.slice(0, 2).map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0f0ee] border border-gray-200 text-gray-700"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400">Sin registrar</span>
                    )}
                    {st.interests.length > 2 && (
                      <span className="text-[11px] text-gray-400 self-center">
                        +{st.interests.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(st);
                    }}
                    className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
                  >
                    <span>Ver</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          title={selectedStudent.name}
          subtitle={`Ficha pedagógica individual · RUN ${selectedStudent.run} · 8°B`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Trajectory per objective */}
            <div>
              <h3 className="text-[13px] font-medium text-gray-900 mb-2">
                Trayectoria por objetivo de aprendizaje
              </h3>
              <div className="space-y-2">
                {[
                  { code: 'OA 01', name: 'Multiplicación y división de racionales', score: 88, status: 'logrado' as const },
                  { code: 'OA 02', name: 'Proporciones directas e inversas', score: 72, status: 'en_proceso' as const },
                  { code: 'OA 03', name: 'Modelamiento con ecuaciones lineales', score: 65, status: 'en_proceso' as const },
                  { code: 'OA 04', name: 'Propiedades de potencias de base racional', score: selectedStudent.generalScorePercent, status: selectedStudent.status },
                ].map((obj) => (
                  <div
                    key={obj.code}
                    className="p-3 rounded-xl border border-gray-200 bg-[#f0f0ee] flex items-center justify-between text-[12px]"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{obj.code}: </span>
                      <span className="text-gray-700">{obj.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{obj.score}%</span>
                      <StatusDot status={obj.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests & Context */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-medium text-gray-900">
                  Intereses y contextos significativos
                </h3>
                {selectedStudent.interests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteStudentInterests(selectedStudent.id)}
                    className="text-[11.5px] text-rose-500 hover:text-rose-600 inline-flex items-center gap-1"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                    <span>Eliminar intereses (privacidad)</span>
                  </button>
                )}
              </div>

              {selectedStudent.interests.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-gray-200 bg-[#f0f0ee]">
                  {selectedStudent.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-[12px] font-medium text-gray-700 bg-[#EDEDED] px-3 py-1 rounded-full border border-gray-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-gray-400 p-3 bg-[#f0f0ee] rounded-xl border border-gray-200">
                  No hay intereses registrados para este estudiante.
                </p>
              )}
            </div>

            {/* Note about privacy */}
            <div className="p-3 rounded-xl border border-gray-200 bg-[#f0f0ee] text-[11.5px] text-gray-400">
              Protección de datos: Esta ficha solo es visible para el docente de asignatura y jefatura de curso. Los datos de intereses nunca se transfieren a terceros.
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setSelectedStudent(null)}
              >
                Cerrar ficha
              </Button>
              <Link
                to="/curso/intereses"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 hover:text-blue-600"
              >
                <span>Ver sugerencias didácticas con sus intereses</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
