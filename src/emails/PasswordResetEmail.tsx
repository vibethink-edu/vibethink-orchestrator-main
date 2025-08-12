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
} from '@react-email/components';

interface PasswordResetEmailProps {
  user: {
    name: string;
    email: string;
  };
  resetToken: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({ user, resetToken }) => {
  const previewText = 'Restablece tu contraseña de VibeThink';
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

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
            <Heading style={h1}>Restablecer Contraseña</Heading>
            
            <Text style={text}>
              Hola {user.name},
            </Text>
            
            <Text style={text}>
              Has solicitado restablecer tu contraseña en VThink. 
              Si no fuiste tú quien hizo esta solicitud, puedes ignorar este email.
            </Text>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ Este enlace expirará en 1 hora por seguridad.
              </Text>
            </Section>

            <Section style={ctaSection}>
              <Button style={button} href={resetUrl}>
                Restablecer Contraseña
              </Button>
            </Section>

            <Text style={text}>
              O copia y pega este enlace en tu navegador:
            </Text>
            
            <Text style={linkText}>
              <Link href={resetUrl} style={link}>
                {resetUrl}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Si tienes problemas, contacta a{' '}
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

const warningBox = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
};

const warningText = {
  color: '#856404',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#dc3545',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const linkText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
  wordBreak: 'break-all' as const,
};

const link = {
  color: '#0070f3',
  textDecoration: 'underline',
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

export default PasswordResetEmail; 