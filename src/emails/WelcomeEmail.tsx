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

interface WelcomeEmailProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  company: {
    name: string;
    domain: string;
    logo?: string;
  };
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ user, company }) => {
  const previewText = `¡Bienvenido a ${company.name}! Tu cuenta ha sido creada exitosamente.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={company.logo || "https://vthink.com/logo.png"}
              width="150"
              height="40"
              alt={company.name}
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>¡Bienvenido a {company.name}!</Heading>
            
            <Text style={text}>
              Hola {user.name},
            </Text>
            
            <Text style={text}>
              Tu cuenta ha sido creada exitosamente en la plataforma VibeThink. 
              Estamos emocionados de tenerte como parte de nuestro ecosistema.
            </Text>

            <Section style={infoBox}>
              <Text style={infoTitle}>Información de tu cuenta:</Text>
              <Row>
                <Column>
                  <Text style={infoLabel}>Email:</Text>
                  <Text style={infoValue}>{user.email}</Text>
                </Column>
                <Column>
                  <Text style={infoLabel}>Rol:</Text>
                  <Text style={infoValue}>{user.role}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={infoLabel}>Empresa:</Text>
                  <Text style={infoValue}>{company.name}</Text>
                </Column>
                <Column>
                  <Text style={infoLabel}>Dominio:</Text>
                  <Text style={infoValue}>{company.domain}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              Con VibeThink tendrás acceso a:
            </Text>

            <Section style={features}>
              <Row>
                <Column style={feature}>
                  <Text style={featureTitle}>🚀 Migración Inteligente</Text>
                  <Text style={featureText}>
                    Migra desde Kentico a Strapi con plantillas automáticas
                  </Text>
                </Column>
                <Column style={feature}>
                  <Text style={featureTitle}>🤖 IA Avanzada</Text>
                  <Text style={featureText}>
                    SEO automático y traducción con IA
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column style={feature}>
                  <Text style={featureTitle}>📊 Analytics Premium</Text>
                  <Text style={featureText}>
                    Métricas detalladas y reportes avanzados
                  </Text>
                </Column>
                <Column style={feature}>
                  <Text style={featureTitle}>🔒 Multi-tenant</Text>
                  <Text style={featureText}>
                    Seguridad empresarial con aislamiento completo
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href={`https://app.${company.domain}`}>
                Acceder a tu Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Si tienes alguna pregunta, no dudes en contactarnos en{' '}
              <Link href="mailto:support@vthink.com" style={link}>
                support@vthink.com
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

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const infoTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const infoLabel = {
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0 4px 0',
};

const infoValue = {
  color: '#333',
  fontSize: '14px',
  margin: '0 0 16px 0',
};

const features = {
  margin: '32px 0',
};

const feature = {
  padding: '16px',
  textAlign: 'center' as const,
};

const featureTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const featureText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
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

export default WelcomeEmail; 