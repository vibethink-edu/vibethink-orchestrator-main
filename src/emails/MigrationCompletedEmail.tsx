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

interface MigrationCompletedEmailProps {
  user: {
    name: string;
    email: string;
  };
  migrationData: {
    source: string;
    target: string;
    status: 'completed' | 'failed' | 'partial';
    totalItems: number;
    migratedItems: number;
    failedItems: number;
    duration: string;
    completedAt: string;
    url?: string;
    errors?: string[];
  };
}

export const MigrationCompletedEmail: React.FC<MigrationCompletedEmailProps> = ({ user, migrationData }) => {
  const previewText = `Migración ${migrationData.source} → ${migrationData.target} completada`;
  const successRate = ((migrationData.migratedItems / migrationData.totalItems) * 100).toFixed(1);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
          color: '#155724',
          icon: '✅',
        };
      case 'failed':
        return {
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          color: '#721c24',
          icon: '❌',
        };
      case 'partial':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          color: '#856404',
          icon: '⚠️',
        };
      default:
        return {
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          color: '#0c5460',
          icon: 'ℹ️',
        };
    }
  };

  const statusStyles = getStatusStyles(migrationData.status);

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
            <Heading style={h1}>Migración Completada</Heading>
            
            <Text style={text}>
              Hola {user.name},
            </Text>
            
            <Text style={text}>
              Tu migración desde {migrationData.source} hacia {migrationData.target} ha sido completada.
            </Text>

            <Section style={{
              ...statusBox,
              ...statusStyles,
            }}>
              <Text style={{
                ...statusText,
                color: statusStyles.color,
              }}>
                {statusStyles.icon} {migrationData.status.toUpperCase()}
              </Text>
            </Section>

            <Section style={statsBox}>
              <Text style={statsTitle}>Resumen de la Migración:</Text>
              
              <Row style={statsRow}>
                <Column style={statColumn}>
                  <Text style={statNumber}>{migrationData.totalItems}</Text>
                  <Text style={statLabel}>Total de Elementos</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{migrationData.migratedItems}</Text>
                  <Text style={statLabel}>Migrados Exitosamente</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{migrationData.failedItems}</Text>
                  <Text style={statLabel}>Fallidos</Text>
                </Column>
              </Row>

              <Row style={statsRow}>
                <Column style={statColumn}>
                  <Text style={statNumber}>{successRate}%</Text>
                  <Text style={statLabel}>Tasa de Éxito</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{migrationData.duration}</Text>
                  <Text style={statLabel}>Duración</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{new Date(migrationData.completedAt).toLocaleString()}</Text>
                  <Text style={statLabel}>Completado</Text>
                </Column>
              </Row>
            </Section>

            {migrationData.errors && migrationData.errors.length > 0 && (
              <Section style={errorsBox}>
                <Text style={errorsTitle}>Errores Encontrados:</Text>
                {migrationData.errors.map((error, index) => (
                  <Text key={index} style={errorText}>
                    • {error}
                  </Text>
                ))}
              </Section>
            )}

            {migrationData.url && (
              <Section style={ctaSection}>
                <Button style={button} href={migrationData.url}>
                  Ver Resultados
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Para más detalles sobre la migración, visita tu{' '}
              <Link href="https://app.vthink.com/migrations" style={link}>
                panel de migraciones
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

const statusBox = {
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
  border: '1px solid',
  textAlign: 'center' as const,
};

const statusText = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
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
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const statLabel = {
  color: '#666',
  fontSize: '12px',
  margin: '0',
};

const errorsBox = {
  backgroundColor: '#f8d7da',
  border: '1px solid #f5c6cb',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const errorsTitle = {
  color: '#721c24',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const errorText = {
  color: '#721c24',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '4px 0',
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

export default MigrationCompletedEmail; 