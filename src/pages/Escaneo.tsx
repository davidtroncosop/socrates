import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { StatusDot } from '../components/StatusDot';
import { Modal } from '../components/Modal';
import { useToast } from '../components/UndoToast';
import {
  mockEvaluations,
  mockConnectedScanners,
  mockScannedSheets,
  EvaluationItem,
  ScannedSheetReviewItem,
} from '../mock/data';

interface UploadedSheet {
  id: string;
  name: string;
  size: string;
  thumbnailNumber: number;
}

export const Escaneo: React.FC = () => {
  const { showToast } = useToast();

  // Wizard state: 1, 2, 3, 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1 state
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationItem>(mockEvaluations[0]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newEvalTitle, setNewEvalTitle] = useState('');

  // Step 2 state
  const [scanSource, setScanSource] = useState<'scanner' | 'upload'>('scanner');
  const [selectedScannerId, setSelectedScannerId] = useState(mockConnectedScanners[0].id);
  const [sheetsList, setSheetsList] = useState<UploadedSheet[]>([
    { id: 'h-1', name: 'Hoja_001_Soto_M.pdf', size: '240 KB', thumbnailNumber: 1 },
    { id: 'h-2', name: 'Hoja_002_Valenzuela_J.pdf', size: '252 KB', thumbnailNumber: 2 },
    { id: 'h-3', name: 'Hoja_003_Gonzalez_M.pdf', size: '238 KB', thumbnailNumber: 3 },
    { id: 'h-4', name: 'Hoja_004_Morales_C.pdf', size: '245 KB', thumbnailNumber: 4 },
    { id: 'h-5', name: 'Hoja_005_Tapia_I.pdf', size: '260 KB', thumbnailNumber: 5 },
    { id: 'h-6', name: 'Hoja_006_Castro_V.pdf', size: '248 KB', thumbnailNumber: 6 },
  ]);

  // Step 3 state (processing simulation)
  const [processedCount, setProcessedCount] = useState<number>(0);
  const totalExpectedSheets = selectedEvaluation.studentsCount || 42;
  const [isProcessingPaused, setIsProcessingPaused] = useState(false);

  // Step 4 state (review & confirm)
  const [sheetsToReview, setSheetsToReview] = useState<ScannedSheetReviewItem[]>(mockScannedSheets);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [selectedAmbiguityIndex, setSelectedAmbiguityIndex] = useState(0);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);

  // Step 3 simulated progress
  useEffect(() => {
    if (currentStep === 3 && !isProcessingPaused && processedCount < totalExpectedSheets) {
      const timer = setTimeout(() => {
        setProcessedCount((prev) => {
          const next = prev + 6;
          if (next >= totalExpectedSheets) {
            // Auto advance to step 4 when done
            setTimeout(() => setCurrentStep(4), 500);
            return totalExpectedSheets;
          }
          return next;
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isProcessingPaused, processedCount, totalExpectedSheets]);

  // Keyboard navigation for Step 4 review
  const currentReviewItem = sheetsToReview[activeReviewIndex];

  const handleResolveAmbiguity = useCallback((option: string) => {
    if (!currentReviewItem) return;
    setSheetsToReview((prev) =>
      prev.map((item, idx) => {
        if (idx !== activeReviewIndex) return item;
        const updatedAmbiguities = [...item.ambiguities];
        if (updatedAmbiguities[selectedAmbiguityIndex]) {
          updatedAmbiguities[selectedAmbiguityIndex] = {
            ...updatedAmbiguities[selectedAmbiguityIndex],
            acceptedMark: option,
            resolved: true,
          };
        }
        return {
          ...item,
          ambiguities: updatedAmbiguities,
        };
      })
    );
  }, [activeReviewIndex, currentReviewItem, selectedAmbiguityIndex]);

  useEffect(() => {
    if (currentStep !== 4 || hasPublished) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused or publish modal is open
      if (showPublishModal || document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentReviewItem && selectedAmbiguityIndex < currentReviewItem.ambiguities.length - 1) {
          setSelectedAmbiguityIndex((prev) => prev + 1);
        } else if (activeReviewIndex < sheetsToReview.length - 1) {
          setActiveReviewIndex((prev) => prev + 1);
          setSelectedAmbiguityIndex(0);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedAmbiguityIndex > 0) {
          setSelectedAmbiguityIndex((prev) => prev - 1);
        } else if (activeReviewIndex > 0) {
          setActiveReviewIndex((prev) => prev - 1);
          setSelectedAmbiguityIndex(0);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Accept the detected mark
        if (currentReviewItem?.ambiguities[selectedAmbiguityIndex]) {
          handleResolveAmbiguity(currentReviewItem.ambiguities[selectedAmbiguityIndex].detectedMark);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentStep,
    hasPublished,
    showPublishModal,
    activeReviewIndex,
    selectedAmbiguityIndex,
    sheetsToReview.length,
    currentReviewItem,
    handleResolveAmbiguity,
  ]);

  const handleRemoveSheet = (id: string) => {
    setSheetsList((prev) => prev.filter((s) => s.id !== id));
  };

  const handlePublishConfirm = () => {
    setShowPublishModal(false);
    setHasPublished(true);

    showToast(
      `Resultados publicados para ${selectedEvaluation.course} (${selectedEvaluation.studentsCount} evaluaciones)`,
      () => {
        setHasPublished(false);
      },
      'Deshacer publicación'
    );
  };

  const stepsList = [
    { num: 1, title: 'Elegir evaluación' },
    { num: 2, title: 'Cargar hojas' },
    { num: 3, title: 'Procesando' },
    { num: 4, title: 'Revisar y confirmar' },
  ];

  return (
    <div>
      <PageHeader
        title="Escaneo y corrección"
        subtitle="Flujo guiado para digitalizar hojas de respuesta, verificar marcas y publicar resultados"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Escaneo y corrección' },
        ]}
      />

      {/* Stepper Header */}
      <nav aria-label="Progreso del escaneo" className="mb-8">
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {stepsList.map((step) => {
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;

            return (
              <li
                key={step.num}
                style={{ backgroundColor: '#EDEDED' }}
                className={`rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                  isCurrent
                    ? 'border-blue-400 text-gray-900'
                    : isCompleted
                    ? 'border-gray-200 text-gray-700'
                    : 'border-gray-200 text-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0 ${
                    isCurrent
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-[#f0f0ee] text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={2} /> : step.num}
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] text-gray-400 leading-tight">
                    Paso {step.num}
                  </div>
                  <div className="text-[13px] font-medium truncate">
                    {step.title}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* STEP 1: Elegir evaluación */}
      {currentStep === 1 && (
        <section aria-labelledby="step1-title" className="space-y-6">
          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 id="step1-title" className="text-[14px] font-medium text-gray-900">
                  Selecciona la evaluación a calificar
                </h2>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  Elige una pauta activa o genera una nueva hoja de respuestas para tu curso.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingNew(!isCreatingNew)}
                className="text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors self-start sm:self-auto"
              >
                {isCreatingNew ? 'Seleccionar existente' : '+ Crear nueva evaluación'}
              </button>
            </div>

            {isCreatingNew ? (
              <div className="p-4 rounded-xl border border-gray-200 bg-[#f0f0ee] space-y-4">
                <div>
                  <label htmlFor="new-eval-name" className="block text-[12px] font-medium text-gray-700 mb-1">
                    Nombre de la evaluación
                  </label>
                  <input
                    id="new-eval-name"
                    type="text"
                    value={newEvalTitle}
                    onChange={(e) => setNewEvalTitle(e.target.value)}
                    placeholder="Ej. Control 5: Álgebra y funciones"
                    style={{ backgroundColor: '#EDEDED' }}
                    className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <span className="text-gray-400 block mb-1">Curso asignado</span>
                    <span className="font-medium text-gray-900">8°B · Matemática</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Estudiantes en nómina</span>
                    <span className="font-medium text-gray-900">42 estudiantes esperados</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockEvaluations.map((ev) => {
                  const isSelected = ev.id === selectedEvaluation.id;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvaluation(ev)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedEvaluation(ev)}
                      role="button"
                      tabIndex={0}
                      className={`p-4 rounded-xl border transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'border-blue-400 bg-[#f0f0ee]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11.5px] text-gray-400 mb-1.5">
                        <span>{ev.course}</span>
                        <span>{ev.questionsCount} preguntas</span>
                      </div>
                      <div className="text-[13px] font-medium text-gray-900 line-clamp-2 mb-2">
                        {ev.title}
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-gray-700">
                        <span>{ev.studentsCount} estudiantes</span>
                        <span className="text-blue-500 font-medium">
                          {isSelected ? 'Seleccionada' : 'Elegir'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected evaluation summary */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[12px] text-gray-700">
                Evaluación: <strong className="font-medium text-gray-900">{selectedEvaluation.title}</strong> · Curso:{' '}
                <strong className="font-medium text-gray-900">{selectedEvaluation.course}</strong> ({selectedEvaluation.studentsCount} estudiantes esperados)
              </div>
              <Button
                variant="primary"
                hasArrow
                onClick={() => setCurrentStep(2)}
              >
                Continuar a cargar hojas
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 2: Cargar hojas */}
      {currentStep === 2 && (
        <section aria-labelledby="step2-title" className="space-y-6">
          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 p-6 space-y-6"
          >
            <div>
              <h2 id="step2-title" className="text-[14px] font-medium text-gray-900">
                Cargar hojas de respuesta
              </h2>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Escanea por lote con la impresora multifuncional del colegio o sube archivos digitalizados.
              </p>
            </div>

            {/* Source selection tabs side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Scanner */}
              <div
                onClick={() => setScanSource('scanner')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setScanSource('scanner')}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  scanSource === 'scanner'
                    ? 'border-blue-400 bg-[#f0f0ee]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Printer size={18} strokeWidth={1.5} className="text-blue-500" />
                  <span className="text-[13px] font-medium text-gray-900">
                    Desde el escáner del colegio
                  </span>
                </div>
                <p className="text-[12px] text-gray-700 mb-3">
                  Envía el comando de escaneo directo a la máquina conectada a la red local.
                </p>

                {scanSource === 'scanner' && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-gray-200">
                    <label htmlFor="scanner-select" className="text-[11.5px] text-gray-400 block">
                      Dispositivo detectado:
                    </label>
                    <select
                      id="scanner-select"
                      value={selectedScannerId}
                      onChange={(e) => setSelectedScannerId(e.target.value)}
                      style={{ backgroundColor: '#EDEDED' }}
                      className="w-full px-3 py-1.5 text-[12px] rounded-full border border-gray-300 text-gray-900 focus-visible:ring-2 ring-blue-400"
                    >
                      {mockConnectedScanners.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name} ({sc.location}) — {sc.status}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Option 2: Upload files */}
              <div
                onClick={() => setScanSource('upload')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setScanSource('upload')}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  scanSource === 'upload'
                    ? 'border-blue-400 bg-[#f0f0ee]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UploadCloud size={18} strokeWidth={1.5} className="text-blue-500" />
                  <span className="text-[13px] font-medium text-gray-900">
                    Subir archivos
                  </span>
                </div>
                <p className="text-[12px] text-gray-700 mb-3">
                  Arrastra o selecciona un archivo PDF multi-página o imágenes JPG/PNG de las pruebas.
                </p>

                {scanSource === 'upload' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-[#EDEDED]">
                    <span className="text-[12px] text-gray-700 block">
                      Arrastra tus archivos aquí o haz clic para examinar
                    </span>
                    <span className="text-[11.5px] text-gray-400 block mt-0.5">
                      Admite PDF de hasta 100 páginas o carpetas comprimidas
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Batch counter & Thumbnails list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-gray-900">
                    Lote cargado
                  </span>
                  <span className="text-[12px] text-gray-400">
                    ({sheetsList.length} de {selectedEvaluation.studentsCount} hojas preparadas)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newSheet: UploadedSheet = {
                      id: `h-${Date.now()}`,
                      name: `Hoja_00${sheetsList.length + 1}_Escaneo_Lote.pdf`,
                      size: '244 KB',
                      thumbnailNumber: sheetsList.length + 1,
                    };
                    setSheetsList((prev) => [...prev, newSheet]);
                  }}
                  className="text-[12px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Agregar hoja al lote
                </button>
              </div>

              {/* Per-sheet thumbnails grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {sheetsList.map((sheet, index) => (
                  <div
                    key={sheet.id}
                    className="group relative p-2.5 rounded-xl border border-gray-200 bg-[#f0f0ee] flex flex-col items-center justify-between text-center"
                  >
                    {/* Simulated miniature test sheet */}
                    <div
                      style={{ backgroundColor: '#EDEDED' }}
                      className="w-full aspect-[3/4] rounded-lg border border-gray-200 mb-2 p-1.5 flex flex-col justify-between"
                    >
                      <div className="w-full flex justify-between items-center text-[9px] text-gray-400 border-b border-gray-200 pb-0.5">
                        <span>Pág {index + 1}</span>
                        <span>8°B</span>
                      </div>
                      {/* Miniature bubble pattern */}
                      <div className="space-y-1 py-1 px-0.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-gray-400">1</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                          <span className="w-1.5 h-1.5 rounded-full border border-gray-400 inline-block" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-gray-400">2</span>
                          <span className="w-1.5 h-1.5 rounded-full border border-gray-400 inline-block" />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-gray-400">3</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                          <span className="w-1.5 h-1.5 rounded-full border border-gray-400 inline-block" />
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 truncate">
                        OMR
                      </div>
                    </div>

                    <div className="w-full text-[11.5px] font-medium text-gray-900 truncate">
                      Hoja #{index + 1}
                    </div>
                    <div className="w-full text-[10px] text-gray-400 truncate">
                      {sheet.size}
                    </div>

                    {/* Delete button before processing */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSheet(sheet.id)}
                      aria-label={`Eliminar hoja ${index + 1}`}
                      title="Eliminar del lote"
                      className="absolute top-1 right-1 p-1 rounded-full text-gray-400 hover:text-rose-500 hover:bg-white transition-colors"
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(1)}
              >
                Volver a evaluación
              </Button>
              <Button
                variant="primary"
                hasArrow
                onClick={() => {
                  setProcessedCount(0);
                  setCurrentStep(3);
                }}
              >
                Iniciar procesamiento ({sheetsList.length} hojas)
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 3: Procesando */}
      {currentStep === 3 && (
        <section aria-labelledby="step3-title" className="space-y-6 max-w-xl mx-auto">
          <div
            style={{ backgroundColor: '#EDEDED' }}
            className="rounded-xl border border-gray-200 p-8 text-center space-y-6"
          >
            <div>
              <h2 id="step3-title" className="text-[1.5rem] font-medium text-gray-900 tracking-tight">
                {isProcessingPaused ? 'Procesamiento en pausa' : 'Procesando hojas de evaluación'}
              </h2>
              <p className="text-[13px] text-gray-700 mt-1">
                Extrayendo identificación de estudiantes, decodificando marcas OMR y calculando índices de logro.
              </p>
            </div>

            {/* Real count & determinate progress bar */}
            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-[13px] font-medium text-gray-900">
                <span>Progreso del lote</span>
                <span>
                  {processedCount} de {totalExpectedSheets} hojas
                </span>
              </div>

              <div className="w-full bg-[#f0f0ee] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((processedCount / totalExpectedSheets) * 100))}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={processedCount}
                  aria-valuemin={0}
                  aria-valuemax={totalExpectedSheets}
                />
              </div>

              <div className="flex justify-between text-[11.5px] text-gray-400">
                <span>Tiempo estimado: ~15 segundos</span>
                <span>{Math.round((processedCount / totalExpectedSheets) * 100)}%</span>
              </div>
            </div>

            {/* Explanatory note: can keep working elsewhere */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-[#f0f0ee] text-[12px] text-gray-700 text-left">
              Puedes continuar trabajando en otras pestañas o cerrar esta ventana; el lote se procesará en segundo plano y quedará disponible en la sección «Retomar».
            </div>

            {/* Actions: Cancel explaining what is kept, or manual skip for testing */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (isProcessingPaused) {
                    setIsProcessingPaused(false);
                  } else {
                    setIsProcessingPaused(true);
                  }
                }}
                className="text-[13px] font-medium text-gray-700 hover:text-gray-900 px-4 py-2"
              >
                {isProcessingPaused ? 'Reanudar procesamiento' : 'Pausar'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Deseas cancelar el procesamiento? Las hojas ya analizadas quedarán guardadas como borrador.')) {
                    setCurrentStep(2);
                  }
                }}
                className="text-[13px] font-medium text-rose-500 hover:text-rose-600 px-4 py-2"
              >
                Cancelar lote (se conservan hojas analizadas)
              </button>

              <Button
                variant="primary"
                onClick={() => setCurrentStep(4)}
              >
                Saltar a revisión
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* STEP 4: Revisar y confirmar (Human-in-the-loop) */}
      {currentStep === 4 && (
        <section aria-labelledby="step4-title" className="space-y-6">
          {hasPublished ? (
            /* Inline success message after publishing per spec: no modal celebration */
            <div
              style={{ backgroundColor: '#EDEDED' }}
              className="rounded-xl border border-green-300 p-8 text-center max-w-xl mx-auto space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[1.5rem] font-medium text-gray-900 tracking-tight">
                  Resultados publicados exitosamente
                </h2>
                <p className="text-[13px] text-gray-700 mt-1">
                  Se han registrado 45 resultados para 8°B · Matemática. Los objetivos y brechas ya están calculados.
                </p>
              </div>

              {/* Two forward links per spec */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  to="/logros"
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
                >
                  <span>Ver reporte de logros</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setHasPublished(false);
                    setCurrentStep(1);
                  }}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-full px-5 py-2.5 hover:border-gray-500 transition-all duration-200"
                >
                  <span>Corregir otra evaluación</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review header & shortcuts bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 id="step4-title" className="text-[14px] font-medium text-gray-900">
                    Revisión de marcas y confirmación docente
                  </h2>
                  <p className="text-[12px] text-gray-400">
                    Solo se destacan los casos con baja confianza o marcas ambiguas. El docente valida antes de calificar.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11.5px] text-gray-400 bg-[#EDEDED] px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="font-medium text-gray-700">Teclado:</span>
                  <span>↑↓ cambiar ítem</span>
                  <span>·</span>
                  <span>Enter aceptar sugerencia</span>
                </div>
              </div>

              {/* Items navigation bar */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-2">
                  {sheetsToReview.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveReviewIndex(idx);
                        setSelectedAmbiguityIndex(0);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors flex items-center gap-1.5 border ${
                        idx === activeReviewIndex
                          ? 'border-blue-400 bg-[#EDEDED] text-gray-900'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Hoja #{item.sheetNumber}</span>
                      <span className="text-[11px] text-gray-400">({item.studentName.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={activeReviewIndex === 0}
                    onClick={() => {
                      setActiveReviewIndex((prev) => Math.max(0, prev - 1));
                      setSelectedAmbiguityIndex(0);
                    }}
                    className="p-1.5 rounded-full border border-gray-200 disabled:opacity-30 hover:border-gray-400 text-gray-700 transition-colors"
                    aria-label="Hoja anterior"
                  >
                    <ChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <span className="text-[12px] text-gray-700 font-medium">
                    {activeReviewIndex + 1} de {sheetsToReview.length}
                  </span>
                  <button
                    type="button"
                    disabled={activeReviewIndex === sheetsToReview.length - 1}
                    onClick={() => {
                      setActiveReviewIndex((prev) => Math.min(sheetsToReview.length - 1, prev + 1));
                      setSelectedAmbiguityIndex(0);
                    }}
                    className="p-1.5 rounded-full border border-gray-200 disabled:opacity-30 hover:border-gray-400 text-gray-700 transition-colors"
                    aria-label="Siguiente hoja"
                  >
                    <ChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Split view: scanned sheet on left, detected answers on right. Responsive: stacks under md */}
              {currentReviewItem && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Scanned Sheet Representation */}
                  <div
                    style={{ backgroundColor: '#EDEDED' }}
                    className="rounded-xl border border-gray-200 p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                      <div>
                        <div className="text-[13px] font-medium text-gray-900">
                          Hoja escaneada #{currentReviewItem.sheetNumber}
                        </div>
                        <div className="text-[11.5px] text-gray-400">
                          {currentReviewItem.studentName} · RUN {currentReviewItem.studentRun}
                        </div>
                      </div>
                      <span className="text-[11.5px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 font-medium">
                        Confianza: {currentReviewItem.confidencePercent}%
                      </span>
                    </div>

                    {/* Simulated physical test sheet visualization */}
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-5 space-y-4 font-mono select-none">
                      {/* Header block of sheet */}
                      <div className="border-b border-gray-200 pb-3 text-[11px] text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>LICEO BICENTENARIO CORDILLERA</span>
                          <span>MATEMÁTICA 8°B</span>
                        </div>
                        <div className="font-sans text-[12px] text-gray-900 font-medium">
                          Estudiante: {currentReviewItem.studentName}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          RUN: {currentReviewItem.studentRun}
                        </div>
                      </div>

                      {/* Bubbles grid with highlighted ambiguities */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                        {currentReviewItem.answers.map((ans) => {
                          const hasAmbiguity = currentReviewItem.ambiguities.some(
                            (a) => a.questionNumber === ans.questionNumber
                          );
                          const isSelectedQ =
                            currentReviewItem.ambiguities[selectedAmbiguityIndex]?.questionNumber ===
                            ans.questionNumber;

                          return (
                            <div
                              key={ans.questionNumber}
                              className={`flex items-center justify-between p-1.5 rounded transition-colors ${
                                isSelectedQ
                                  ? 'bg-amber-100/70 border border-amber-400'
                                  : hasAmbiguity
                                  ? 'bg-amber-50 border border-amber-200'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <span className="font-sans text-gray-600 text-[11.5px]">
                                Pregunta {ans.questionNumber}:
                              </span>
                              <div className="flex items-center gap-1.5">
                                {['A', 'B', 'C', 'D'].map((letter) => {
                                  const isMarked = ans.option === letter;
                                  return (
                                    <span
                                      key={letter}
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                        isMarked
                                          ? 'bg-gray-900 text-white font-medium'
                                          : 'border border-gray-300 text-gray-500'
                                      }`}
                                    >
                                      {letter}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detected answers and Human Decision */}
                  <div
                    style={{ backgroundColor: '#EDEDED' }}
                    className="rounded-xl border border-gray-200 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="pb-3 mb-3 border-b border-gray-200">
                        <div className="text-[13px] font-medium text-gray-900">
                          Verificación de marcas ambiguas
                        </div>
                        <div className="text-[11.5px] text-gray-400">
                          {currentReviewItem.ambiguities.length} marcas requieren confirmación del docente
                        </div>
                      </div>

                      {/* Ambiguity list */}
                      <div className="space-y-3">
                        {currentReviewItem.ambiguities.map((amb, ambIdx) => {
                          const isSelected = ambIdx === selectedAmbiguityIndex;
                          return (
                            <div
                              key={amb.questionNumber}
                              onClick={() => setSelectedAmbiguityIndex(ambIdx)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-blue-400 bg-[#f0f0ee]'
                                  : 'border-gray-200 bg-[#EDEDED] hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                  <span className="text-[13px] font-medium text-gray-900">
                                    Pregunta {amb.questionNumber}
                                  </span>
                                </div>
                                {amb.resolved ? (
                                  <span className="text-[11.5px] text-green-700 font-medium flex items-center gap-1">
                                    <Check size={12} strokeWidth={2} />
                                    Confirmado: {amb.acceptedMark}
                                  </span>
                                ) : (
                                  <span className="text-[11.5px] text-amber-600 font-medium">
                                    Pendiente
                                  </span>
                                )}
                              </div>

                              <p className="text-[12px] text-gray-700 mb-3">
                                {amb.reason}
                              </p>

                              {/* Action buttons to choose option */}
                              <div className="flex items-center gap-2 pt-1">
                                <span className="text-[11.5px] text-gray-400 mr-1">
                                  Definir marca válida:
                                </span>
                                {['A', 'B', 'C', 'D'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResolveAmbiguity(opt);
                                    }}
                                    className={`w-7 h-7 rounded-full text-[12px] font-medium transition-colors ${
                                      amb.acceptedMark === opt && amb.resolved
                                        ? 'bg-blue-500 text-white'
                                        : 'border border-gray-300 hover:border-blue-400 text-gray-700'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolveAmbiguity('Anulada');
                                  }}
                                  className="text-[11.5px] font-medium text-gray-700 hover:text-gray-900 ml-auto underline underline-offset-2"
                                >
                                  Anular ítem
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="pt-6 border-t border-gray-200 flex items-center justify-between mt-6">
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentStep(2)}
                      >
                        Volver al lote
                      </Button>

                      {/* Primary Publish Action */}
                      <Button
                        variant="primary"
                        onClick={() => setShowPublishModal(true)}
                      >
                        Publicar resultados
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal to confirm publishing per spec: names exactly what happens */}
          <Modal
            isOpen={showPublishModal}
            onClose={() => setShowPublishModal(false)}
            title="Confirmar publicación de resultados"
            subtitle="Los diagnósticos quedarán disponibles de inmediato para el curso"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-[#f0f0ee] space-y-2 text-[13px] text-gray-700">
                <p>
                  Estás a punto de publicar las calificaciones de:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-medium text-gray-900">
                  <li>Evaluación: {selectedEvaluation.title}</li>
                  <li>Curso: {selectedEvaluation.course} · Matemática</li>
                  <li>Alcance: Se publicarán 45 resultados para {selectedEvaluation.course}</li>
                </ul>
              </div>

              <p className="text-[12px] text-gray-400">
                Esta acción actualizará automáticamente la matriz de logros por objetivo y las brechas en el tablero de retroalimentación. Podrás deshacer la publicación durante los primeros 10 segundos.
              </p>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() => setShowPublishModal(false)}
                >
                  Continuar revisando
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePublishConfirm}
                >
                  Publicar resultados ahora
                </Button>
              </div>
            </div>
          </Modal>
        </section>
      )}
    </div>
  );
};
