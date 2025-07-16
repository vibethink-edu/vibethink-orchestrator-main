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

interface NotificationEmailProps {
  user: {
    name: string;
    email: string;
  };
  notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
  };
}

export const NotificationEmail: React.FC<NotificationEmailProps> = ({ user, notification }) => {
  const previewText = notification.title;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
          color: '#155724',
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          color: '#856404',
        };
      case 'error':
        return {
          backgroundColor: '#f8d7da',
          borderColor: '#f5c6cb',
          color: '#721c24',
        };
      default:
        return {
          backgroundColor: '#d1ecf1',
          borderColor: '#bee5eb',
          color: '#0c5460',
        };
    }
  };

  const typeStyles = getTypeStyles(notification.type);

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
              alt="VThink"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>{notification.title}</Heading>
            
            <Text style={text}>
              Hola {user.name},
            </Text>

            <Section style={{
              ...notificationBox,
              ...typeStyles,
            }}>
              <Text style={{
                ...notificationText,
                color: typeStyles.color,
              }}>
                {notification.message}
              </Text>
            </Section>

            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <Section style={metadataBox}>
                <Text style={metadataTitle}>Detalles:</Text>
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <Row key={key} style={metadataRow}>
                    <Column style={metadataLabel}>
                      <Text style={metadataLabelText}>{key}:</Text>
                    </Column>
                    <Column style={metadataValue}>
                      <Text style={metadataValueText}>{String(value)}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {notification.actionUrl && notification.actionText && (
              <Section style={ctaSection}>
                <Button style={button} href={notification.actionUrl}>
                  {notification.actionText}
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Para gestionar tus notificaciones, visita tu{' '}
              <Link href={`https://app.vthink.com/settings/notifications`} style={link}>
                panel de configuración
              </Link>
            </Text>

            <Text style={footer}>
              © 2024 VThink. Todos los derechos reservados.
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

const notificationBox = {
  borderRadius: '6px',
  padding: '16px',
  margin: '24px 0',
  border: '1px solid',
};

const notificationText = {
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
};

const metadataBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const metadataTitle = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const metadataRow = {
  margin: '8px 0',
};

const metadataLabel = {
  width: '30%',
};

const metadataLabelText = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  margin: '0',
};

const metadataValue = {
  width: '70%',
};

const metadataValueText = {
  color: '#333',
  fontSize: '12px',
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

export default NotificationEmail; 