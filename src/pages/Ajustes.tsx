import React, { useState } from 'react';
import { Check, Printer, RefreshCw, Shield, Bell, School, User, Sliders } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { useToast } from '../components/UndoToast';
import { mockConnectedScanners, initialTeacherProfile, ConnectedScanner } from '../mock/data';

export const Ajustes: React.FC = () => {
  const { showToast } = useToast();

  // Section 1: Perfil
  const [profileName, setProfileName] = useState(initialTeacherProfile.name);
  const [profileEmail, setProfileEmail] = useState(initialTeacherProfile.email);
  const [profileSubject, setProfileSubject] = useState(initialTeacherProfile.subject);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Section 2: Establecimiento
  const [schoolName, setSchoolName] = useState(initialTeacherProfile.school);
  const [schoolRbd, setSchoolRbd] = useState('25432-1');
  const [schoolComuna, setSchoolComuna] = useState('Santiago');
  const [schoolSavedMsg, setSchoolSavedMsg] = useState(false);

  // Section 3: Escáneres
  const [scanners, setScanners] = useState<ConnectedScanner[]>(mockConnectedScanners);
  const [testingScannerId, setTestingScannerId] = useState<string | null>(null);
  const [scannerSavedMsg, setScannerSavedMsg] = useState(false);

  // Section 4: Rúbricas
  const [defaultLogradoMin, setDefaultLogradoMin] = useState(75);
  const [defaultEnProcesoMin, setDefaultEnProcesoMin] = useState(50);
  const [rubricSavedMsg, setRubricSavedMsg] = useState(false);

  // Section 5: Notificaciones
  const [notifyAmbiguities, setNotifyAmbiguities] = useState(true);
  const [notifyBatchesComplete, setNotifyBatchesComplete] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);
  const [notificationsSavedMsg, setNotificationsSavedMsg] = useState(false);

  // Section 6: Privacidad y datos
  const [dataRetentionMonths, setDataRetentionMonths] = useState(12);
  const [privacySavedMsg, setPrivacySavedMsg] = useState(false);

  const handleTestConnection = (scannerId: string) => {
    setTestingScannerId(scannerId);
    setTimeout(() => {
      setTestingScannerId(null);
      setScanners((prev) =>
        prev.map((s) => (s.id === scannerId ? { ...s, status: 'conectado', lastPing: 'Hace unos segundos' } : s))
      );
      showToast('Conexión con impresora multifuncional verificada exitosamente');
    }, 800);
  };

  const handleSaveSection = (setter: (v: boolean) => void, toastMsg: string) => {
    setter(true);
    showToast(toastMsg);
    setTimeout(() => setter(false), 4000);
  };

  return (
    <div>
      <PageHeader
        title="Ajustes"
        subtitle="Configuración del perfil docente, red de impresoras del colegio y parámetros pedagógicos"
        breadcrumbs={[
          { label: 'Inicio', to: '/' },
          { label: 'Ajustes' },
        ]}
      />

      {/* Grouped in sections, one column, generous spacing per spec */}
      <div className="space-y-10 max-w-3xl">
        {/* 1. Perfil */}
        <section
          aria-labelledby="perfil-heading"
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <User size={18} strokeWidth={1.5} className="text-blue-500" />
            <h2 id="perfil-heading" className="text-[14px] font-medium text-gray-900">
              Perfil docente
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="user-name" className="block text-[12px] font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="user-name"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="user-email" className="block text-[12px] font-medium text-gray-700 mb-1">
                Correo institucional
              </label>
              <input
                id="user-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="user-subject" className="block text-[12px] font-medium text-gray-700 mb-1">
                Asignatura principal
              </label>
              <input
                id="user-subject"
                type="text"
                value={profileSubject}
                onChange={(e) => setProfileSubject(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {profileSavedMsg ? (
              <span className="text-[12px] text-green-700 flex items-center gap-1.5 font-medium">
                <Check size={14} strokeWidth={2} /> Cambios de perfil guardados correctamente
              </span>
            ) : (
              <span className="text-[12px] text-gray-400">Sin cambios pendientes</span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSaveSection(setProfileSavedMsg, 'Perfil docente actualizado')}
            >
              Guardar cambios
            </Button>
          </div>
        </section>

        {/* 2. Establecimiento */}
        <section
          aria-labelledby="colegio-heading"
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <School size={18} strokeWidth={1.5} className="text-blue-500" />
            <h2 id="colegio-heading" className="text-[14px] font-medium text-gray-900">
              Establecimiento educacional
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="school-name" className="block text-[12px] font-medium text-gray-700 mb-1">
                Nombre de la institución
              </label>
              <input
                id="school-name"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="school-rbd" className="block text-[12px] font-medium text-gray-700 mb-1">
                RBD (Rol Base de Datos)
              </label>
              <input
                id="school-rbd"
                type="text"
                value={schoolRbd}
                onChange={(e) => setSchoolRbd(e.target.value)}
                style={{ backgroundColor: '#f0f0ee' }}
                className="w-full px-3.5 py-2 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {schoolSavedMsg ? (
              <span className="text-[12px] text-green-700 flex items-center gap-1.5 font-medium">
                <Check size={14} strokeWidth={2} /> Datos de establecimiento actualizados
              </span>
            ) : (
              <span className="text-[12px] text-gray-400">Sin cambios pendientes</span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSaveSection(setSchoolSavedMsg, 'Datos del establecimiento guardados')}
            >
              Guardar cambios
            </Button>
          </div>
        </section>

        {/* 3. Escáneres conectados */}
        <section
          aria-labelledby="escaneres-heading"
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <Printer size={18} strokeWidth={1.5} className="text-blue-500" />
              <h2 id="escaneres-heading" className="text-[14px] font-medium text-gray-900">
                Escáneres e impresoras conectados
              </h2>
            </div>
            <span className="text-[12px] text-gray-400">
              Red local del establecimiento
            </span>
          </div>

          <p className="text-[12px] text-gray-700">
            Sócrates detecta automáticamente los multifuncionales compatibles con TWAIN y WIA presentes en la red escolar.
          </p>

          <div className="space-y-3">
            {scanners.map((sc) => {
              const isTesting = testingScannerId === sc.id;
              const isConnected = sc.status === 'conectado';

              return (
                <div
                  key={sc.id}
                  className="p-4 rounded-xl border border-gray-200 bg-[#f0f0ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isConnected ? 'bg-green-600' : 'bg-amber-500'
                        }`}
                      />
                      <span className="text-[13px] font-medium text-gray-900">
                        {sc.name}
                      </span>
                      <span className="text-[11.5px] text-gray-400">
                        ({sc.location})
                      </span>
                    </div>
                    <div className="text-[12px] text-gray-700">
                      IP: {sc.ipAddress} · {sc.defaultTray} · Último contacto: {sc.lastPing}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={() => handleTestConnection(sc.id)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full border border-gray-300 hover:border-gray-500 bg-[#EDEDED] transition-colors focus-visible:ring-2 ring-blue-400"
                    >
                      <RefreshCw
                        size={12}
                        strokeWidth={1.5}
                        className={isTesting ? 'animate-spin text-blue-500' : ''}
                      />
                      <span>{isTesting ? 'Probando...' : 'Probar conexión'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {scannerSavedMsg ? (
              <span className="text-[12px] text-green-700 flex items-center gap-1.5 font-medium">
                <Check size={14} strokeWidth={2} /> Configuración de escáneres guardada
              </span>
            ) : (
              <span className="text-[12px] text-gray-400">Detección activa por UDP broadcast</span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSaveSection(setScannerSavedMsg, 'Lista de escáneres actualizada')}
            >
              Guardar cambios
            </Button>
          </div>
        </section>

        {/* 4. Rúbricas y niveles de logro */}
        <section
          aria-labelledby="rubricas-heading"
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <Sliders size={18} strokeWidth={1.5} className="text-blue-500" />
            <h2 id="rubricas-heading" className="text-[14px] font-medium text-gray-900">
              Rúbricas y niveles de logro predeterminados
            </h2>
          </div>

          <p className="text-[12px] text-gray-700">
            Define la escala institucional que se aplicará por omisión a todas las nuevas evaluaciones generadas en el colegio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="logrado-cut" className="block text-[12px] font-medium text-gray-700 mb-1">
                Porcentaje mínimo para nivel «Logrado»:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="logrado-cut"
                  type="number"
                  min={50}
                  max={100}
                  value={defaultLogradoMin}
                  onChange={(e) => setDefaultLogradoMin(Number(e.target.value))}
                  style={{ backgroundColor: '#f0f0ee' }}
                  className="w-24 px-3 py-1.5 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
                />
                <span className="text-[12px] text-gray-700">%</span>
              </div>
            </div>

            <div>
              <label htmlFor="proceso-cut" className="block text-[12px] font-medium text-gray-700 mb-1">
                Porcentaje mínimo para nivel «En proceso»:
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="proceso-cut"
                  type="number"
                  min={20}
                  max={defaultLogradoMin - 1}
                  value={defaultEnProcesoMin}
                  onChange={(e) => setDefaultEnProcesoMin(Number(e.target.value))}
                  style={{ backgroundColor: '#f0f0ee' }}
                  className="w-24 px-3 py-1.5 text-[13px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
                />
                <span className="text-[12px] text-gray-700">%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {rubricSavedMsg ? (
              <span className="text-[12px] text-green-700 flex items-center gap-1.5 font-medium">
                <Check size={14} strokeWidth={2} /> Umbrales institucionales guardados
              </span>
            ) : (
              <span className="text-[12px] text-gray-400">Sin cambios pendientes</span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSaveSection(setRubricSavedMsg, 'Umbrales de logro actualizados')}
            >
              Guardar cambios
            </Button>
          </div>
        </section>

        {/* 5. Notificaciones */}
        <section
          aria-labelledby="notif-heading"
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <Bell size={18} strokeWidth={1.5} className="text-blue-500" />
            <h2 id="notif-heading" className="text-[14px] font-medium text-gray-900">
              Notificaciones y alertas de corrección
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyAmbiguities}
                onChange={(e) => setNotifyAmbiguities(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus-visible:ring-2 ring-blue-400"
              />
              <span className="text-[12px] text-gray-700">
                Alertar de marcas ambiguas o doble respuesta antes de cerrar el lote de escaneo
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyBatchesComplete}
                onChange={(e) => setNotifyBatchesComplete(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus-visible:ring-2 ring-blue-400"
              />
              <span className="text-[12px] text-gray-700">
                Avisar cuando el escáner multifuncional finalice la digitalización en segundo plano
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyWeeklyDigest}
                onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                className="rounded border-gray-300 text-blue-500 focus-visible:ring-2 ring-blue-400"
              />
              <span className="text-[12px] text-gray-700">
                Resumen semanal de objetivos en riesgo por correo institucional
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {notificationsSavedMsg ? (
              <span className="text-[12px] text-green-700 flex items-center gap-1.5 font-medium">
                <Check size={14} strokeWidth={2} /> Preferencias de notificación guardadas
              </span>
            ) : (
              <span className="text-[12px] text-gray-400">Sin cambios pendientes</span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSaveSection(setNotificationsSavedMsg, 'Preferencias de notificación actualizadas')}
            >
              Guardar cambios
            </Button>
          </div>
        </section>

        {/* 6. Privacidad y datos */}
        <section
          aria-labelledby="privacidad-datos-heading"
          style={{ backgroundColor: '#EDEDED' }}
          className="rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <Shield size={18} strokeWidth={1.5} className="text-blue-500" />
            <h2 id="privacidad-datos-heading" className="text-[14px] font-medium text-gray-900">
              Privacidad, retención y respaldo de datos
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="retention-period" className="block text-[12px] font-medium text-gray-700 mb-1">
                Período de retención de imágenes escaneadas de pruebas físicas:
              </label>
              <select
                id="retention-period"
                value={dataRetentionMonths}
                onChange={(e) => setDataRetentionMonths(Number(e.target.value))}
                style={{ backgroundColor: '#f0f0ee' }}
                className="px-3.5 py-2 text-[12px] rounded-full border border-gray-200 text-gray-900 focus-visible:ring-2 ring-blue-400"
              >
                <option value={6}>6 meses (duración del semestre académico)</option>
                <option value={12}>12 meses (año escolar completo)</option>
                <option value={24}>24 meses (ciclo básico/medio)</option>
              </select>
            </div>

            <p className="text-[12px] text-gray-400 leading-relaxed">
              Cumplimiento con directrices Mineduc y Ley N° 19.628. Las hojas escaneadas son procesadas localmente en memoria y encriptadas en reposo.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            {privacySavedMsg ? (
              <span className="text-[12px] text-green-700 flex items-center gap-1.5 font-medium">
                <Check size={14} strokeWidth={2} /> Políticas de retención actualizadas
              </span>
            ) : (
              <span className="text-[12px] text-gray-400">Sin cambios pendientes</span>
            )}
            <Button
              variant="primary"
              onClick={() => handleSaveSection(setPrivacySavedMsg, 'Configuración de privacidad guardada')}
            >
              Guardar cambios
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
