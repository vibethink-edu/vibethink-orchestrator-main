import React, { useState, useEffect } from "react";

/**
 * Componente de ayuda dinámica para developers.
 * Lee los comandos útiles desde /devHelp.json (generado automáticamente)
 * y permite recargar la ayuda sin reiniciar la app.
 */
const HelpShortcuts: React.FC = () => {
  const [help, setHelp] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar la ayuda dinámica
  const fetchHelp = async () => {
    setLoading(true);
    setError(null);
    try {
      // Forzar recarga con timestamp para evitar caché
      const res = await fetch("/devHelp.json?" + Date.now());
      if (!res.ok) throw new Error("No se pudo cargar la ayuda dinámica");
      const data = await res.json();
      setHelp(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelp();
  }, []);

  return (
    <aside className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-6">
      <h2 className="font-bold text-lg mb-2">🔑 Shortcuts y Ayuda Dinámica para Developers</h2>
      <button
        onClick={fetchHelp}
        disabled={loading}
        className="mb-4 px-3 py-1 bg-yellow-200 rounded hover:bg-yellow-300 text-sm font-semibold"
      >
        {loading ? "Recargando..." : "🔄 Recargar ayuda"}
      </button>
      {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
      {help.length === 0 && !loading && (
        <div className="text-gray-500 text-xs">No se encontraron comandos útiles en la documentación.</div>
      )}
      <ul className="list-disc pl-6 text-sm">
        {help.map((section) => (
          <li key={section.title} className="mb-2">
            <b>{section.title}</b>
            <ul className="pl-4 mt-1">
              {section.commands.map((c: any, i: number) => (
                <li key={i} className="mb-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{c.cmd}</code> {c.desc}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-500 mt-2">
        Esta ayuda se genera automáticamente a partir de los README principales del monorepo.<br />
        Si agregas o cambias comandos, ejecuta <code>node scripts/generate-dev-help.cjs</code> y pulsa "Recargar ayuda".
      </div>
    </aside>
  );
};

export default HelpShortcuts; 