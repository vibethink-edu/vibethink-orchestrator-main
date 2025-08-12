import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface TranslationCompletedEmailProps {
  user: {
    name: string;
    email: string;
  };
  translationData: {
    sourceLanguage: string;
    targetLanguage: string;
    totalWords: number;
    translatedWords: number;
    qualityScore: number;
    duration: string;
    completedAt: string;
    url?: string;
    glossary?: Array<{
      term: string;
      translation: string;
    }>;
    memoryUsage?: {
      newTerms: number;
      reusedTerms: number;
      totalTerms: number;
    };
  };
}

export const TranslationCompletedEmail: React.FC<TranslationCompletedEmailProps> = ({ user, translationData }) => {
  const previewText = `Traducción ${translationData.sourceLanguage} → ${translationData.targetLanguage} completada`;
  const qualityGrade = translationData.qualityScore >= 90 ? 'A' : 
                      translationData.qualityScore >= 80 ? 'B' : 
                      translationData.qualityScore >= 70 ? 'C' : 
                      translationData.qualityScore >= 60 ? 'D' : 'F';

  const getQualityColor = (score: number) => {
    if (score >= 90) return '#28a745';
    if (score >= 80) return '#17a2b8';
    if (score >= 70) return '#ffc107';
    if (score >= 60) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://vthink.com/logo.png"
              width="150"
              height="40"
              alt="VibeThink"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Traducción Completada</Heading>
            
            <Text style={text}>
              Hola {user.name},
            </Text>
            
            <Text style={text}>
              Tu traducción desde <strong>{translationData.sourceLanguage}</strong> hacia{' '}
              <strong>{translationData.targetLanguage}</strong> ha sido completada exitosamente.
            </Text>

            <Section style={statsBox}>
              <Text style={statsTitle}>Resumen de la Traducción:</Text>
              
              <Row style={statsRow}>
                <Column style={statColumn}>
                  <Text style={statNumber}>{translationData.totalWords.toLocaleString()}</Text>
                  <Text style={statLabel}>Palabras Totales</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{translationData.translatedWords.toLocaleString()}</Text>
                  <Text style={statLabel}>Palabras Traducidas</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{translationData.duration}</Text>
                  <Text style={statLabel}>Duración</Text>
                </Column>
              </Row>

              <Row style={statsRow}>
                <Column style={statColumn}>
                  <Text style={{
                    ...statNumber,
                    color: getQualityColor(translationData.qualityScore),
                  }}>
                    {translationData.qualityScore}%
                  </Text>
                  <Text style={statLabel}>Calidad</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={{
                    ...statNumber,
                    color: getQualityColor(translationData.qualityScore),
                  }}>
                    {qualityGrade}
                  </Text>
                  <Text style={statLabel}>Calificación</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>
                    {new Date(translationData.completedAt).toLocaleString()}
                  </Text>
                  <Text style={statLabel}>Completado</Text>
                </Column>
              </Row>
            </Section>

            {translationData.memoryUsage && (
              <Section style={memoryBox}>
                <Text style={memoryTitle}>Uso de Memoria de Traducción:</Text>
                
                <Row style={memoryRow}>
                  <Column style={memoryColumn}>
                    <Text style={memoryNumber}>{translationData.memoryUsage.newTerms}</Text>
                    <Text style={memoryLabel}>Términos Nuevos</Text>
                  </Column>
                  <Column style={memoryColumn}>
                    <Text style={memoryNumber}>{translationData.memoryUsage.reusedTerms}</Text>
                    <Text style={memoryLabel}>Términos Reutilizados</Text>
                  </Column>
                  <Column style={memoryColumn}>
                    <Text style={memoryNumber}>{translationData.memoryUsage.totalTerms}</Text>
                    <Text style={memoryLabel}>Total en Memoria</Text>
                  </Column>
                </Row>
              </Section>
            )}

            {translationData.glossary && translationData.glossary.length > 0 && (
              <Section style={glossaryBox}>
                <Text style={glossaryTitle}>Glosario de Términos:</Text>
                {translationData.glossary.slice(0, 5).map((term, index) => (
                  <Row key={index} style={glossaryRow}>
                    <Column style={glossaryTerm}>
                      <Text style={glossaryTermText}>{term.term}</Text>
                    </Column>
                    <Column style={glossaryArrow}>
                      <Text style={glossaryArrowText}>→</Text>
                    </Column>
                    <Column style={glossaryTranslation}>
                      <Text style={glossaryTranslationText}>{term.translation}</Text>
                    </Column>
                  </Row>
                ))}
                {translationData.glossary.length > 5 && (
                  <Text style={moreTerms}>
                    ... y {translationData.glossary.length - 5} términos más
                  </Text>
                )}
              </Section>
            )}

            {translationData.url && (
              <Section style={ctaSection}>
                <Button style={button} href={translationData.url}>
                  Ver Traducción
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Para gestionar tus traducciones, visita tu{' '}
              <Link href="https://app.vthink.com/translations" style={link}>
                panel de traducciones
              </Link>
            </Text>

            <Text style={footer}>
              © 2024 VibeThink. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Estilos
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 24px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const statsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const statsTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
};

const statsRow = {
  margin: '16px 0',
};

const statColumn = {
  textAlign: 'center' as const,
  padding: '8px',
};

const statNumber = {
  color: '#0070f3',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const statLabel = {
  color: '#666',
  fontSize: '12px',
  margin: '0',
};

const memoryBox = {
  backgroundColor: '#e8f5e8',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const memoryTitle = {
  color: '#155724',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const memoryRow = {
  margin: '8px 0',
};

const memoryColumn = {
  textAlign: 'center' as const,
  padding: '8px',
};

const memoryNumber = {
  color: '#155724',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const memoryLabel = {
  color: '#155724',
  fontSize: '12px',
  margin: '0',
};

const glossaryBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const glossaryTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const glossaryRow = {
  margin: '8px 0',
  padding: '8px 0',
  borderBottom: '1px solid #dee2e6',
};

const glossaryTerm = {
  width: '40%',
};

const glossaryTermText = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const glossaryArrow = {
  width: '20%',
  textAlign: 'center' as const,
};

const glossaryArrowText = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const glossaryTranslation = {
  width: '40%',
};

const glossaryTranslationText = {
  color: '#0070f3',
  fontSize: '14px',
  margin: '0',
};

const moreTerms = {
  color: '#666',
  fontSize: '12px',
  fontStyle: 'italic',
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#dfe1e5',
  margin: '42px 0 26px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
};

export default TranslationCompletedEmail; 