import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { BookingCardExample } from '@/components/examples/BookingCardExample';
import { initI18nServer } from '@/lib/i18n/server';

export default async function TestI18nPage() {
  const { locale } = await initI18nServer(['booking']);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">i18n 3-Layers Testing Page</h1>
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h2 className="font-semibold mb-2">Arquitectura de 3 Capas:</h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><strong>CAPA 1:</strong> Semantic IDs (concept.booking.resource.room)</li>
          <li><strong>CAPA 2:</strong> Terminology compartida (termSync/term)</li>
          <li><strong>CAPA 3A:</strong> UI Strings (useTranslation)</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Hotel Context</h2>
          <BookingCardExample productContext="hotel" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Studio Context</h2>
          <BookingCardExample productContext="studio" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cowork Context</h2>
          <BookingCardExample productContext="cowork" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Coliving Context</h2>
          <BookingCardExample productContext="coliving" />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Verificar:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Hotel: &quot;Room&quot; / &quot;Habitación&quot;</li>
          <li>Studio: &quot;Recording Studio&quot; / &quot;Sala de grabación&quot;</li>
          <li>Cowork: &quot;Desk&quot; / &quot;Puesto&quot;</li>
          <li>Coliving: &quot;Shared Space&quot; / &quot;Espacio compartido&quot;</li>
          <li>Cambiar idioma NO hace blink</li>
          <li>Solo 1 idioma se descarga (verificar en Network tab)</li>
        </ul>
      </div>
    </div>
  );
}



