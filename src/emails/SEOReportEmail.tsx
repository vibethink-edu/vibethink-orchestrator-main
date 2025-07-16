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

interface SEOReportEmailProps {
  user: {
    name: string;
    email: string;
  };
  seoReport: {
    url: string;
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      message: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    recommendations: string[];
    competitors: Array<{
      domain: string;
      score: number;
      difference: number;
    }>;
    keywords: Array<{
      keyword: string;
      position: number;
      volume: number;
      difficulty: number;
    }>;
    generatedAt: string;
    reportUrl?: string;
  };
}

export const SEOReportEmail: React.FC<SEOReportEmailProps> = ({ user, seoReport }) => {
  const previewText = `Reporte SEO Premium - ${seoReport.url}`;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#28a745';
      case 'B': return '#17a2b8';
      case 'C': return '#ffc107';
      case 'D': return '#fd7e14';
      case 'F': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#fd7e14';
      case 'low': return '#ffc107';
      default: return '#6c757d';
    }
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
              alt="VThink"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Reporte SEO Premium</Heading>
            
            <Text style={text}>
              Hola {user.name},
            </Text>
            
            <Text style={text}>
              Tu análisis SEO premium para <strong>{seoReport.url}</strong> está listo.
              Aquí tienes un resumen de los hallazgos más importantes:
            </Text>

            <Section style={scoreBox}>
              <Row>
                <Column style={scoreColumn}>
                  <Text style={scoreNumber}>{seoReport.score}/100</Text>
                  <Text style={scoreLabel}>Puntuación SEO</Text>
                </Column>
                <Column style={gradeColumn}>
                  <Text style={{
                    ...gradeText,
                    color: getGradeColor(seoReport.grade),
                  }}>
                    {seoReport.grade}
                  </Text>
                  <Text style={gradeLabel}>Calificación</Text>
                </Column>
              </Row>
            </Section>

            {seoReport.issues.length > 0 && (
              <Section style={issuesBox}>
                <Text style={issuesTitle}>Problemas Detectados:</Text>
                {seoReport.issues.slice(0, 5).map((issue, index) => (
                  <Section key={index} style={issueItem}>
                    <Row>
                      <Column style={priorityColumn}>
                        <Text style={{
                          ...priorityBadge,
                          backgroundColor: getPriorityColor(issue.priority),
                        }}>
                          {issue.priority.toUpperCase()}
                        </Text>
                      </Column>
                      <Column style={messageColumn}>
                        <Text style={issueMessage}>{issue.message}</Text>
                      </Column>
                    </Row>
                  </Section>
                ))}
                {seoReport.issues.length > 5 && (
                  <Text style={moreIssues}>
                    ... y {seoReport.issues.length - 5} problemas más
                  </Text>
                )}
              </Section>
            )}

            {seoReport.recommendations.length > 0 && (
              <Section style={recommendationsBox}>
                <Text style={recommendationsTitle}>Recomendaciones Principales:</Text>
                {seoReport.recommendations.slice(0, 3).map((rec, index) => (
                  <Text key={index} style={recommendationText}>
                    • {rec}
                  </Text>
                ))}
              </Section>
            )}

            {seoReport.competitors.length > 0 && (
              <Section style={competitorsBox}>
                <Text style={competitorsTitle}>Análisis Competitivo:</Text>
                {seoReport.competitors.slice(0, 3).map((competitor, index) => (
                  <Row key={index} style={competitorRow}>
                    <Column style={competitorDomain}>
                      <Text style={competitorDomainText}>{competitor.domain}</Text>
                    </Column>
                    <Column style={competitorScore}>
                      <Text style={competitorScoreText}>{competitor.score}/100</Text>
                    </Column>
                    <Column style={competitorDiff}>
                      <Text style={{
                        ...competitorDiffText,
                        color: competitor.difference > 0 ? '#28a745' : '#dc3545',
                      }}>
                        {competitor.difference > 0 ? '+' : ''}{competitor.difference}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {seoReport.keywords.length > 0 && (
              <Section style={keywordsBox}>
                <Text style={keywordsTitle}>Palabras Clave Principales:</Text>
                {seoReport.keywords.slice(0, 5).map((keyword, index) => (
                  <Row key={index} style={keywordRow}>
                    <Column style={keywordText}>
                      <Text style={keywordTextStyle}>{keyword.keyword}</Text>
                    </Column>
                    <Column style={keywordMetrics}>
                      <Text style={keywordMetric}>Pos: {keyword.position}</Text>
                      <Text style={keywordMetric}>Vol: {keyword.volume.toLocaleString()}</Text>
                      <Text style={keywordMetric}>Diff: {keyword.difficulty}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            )}

            {seoReport.reportUrl && (
              <Section style={ctaSection}>
                <Button style={button} href={seoReport.reportUrl}>
                  Ver Reporte Completo
                </Button>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              Generado el {new Date(seoReport.generatedAt).toLocaleString()}
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

const scoreBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
};

const scoreColumn = {
  textAlign: 'center' as const,
};

const scoreNumber = {
  color: '#0070f3',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const scoreLabel = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const gradeColumn = {
  textAlign: 'center' as const,
};

const gradeText = {
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const gradeLabel = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const issuesBox = {
  margin: '24px 0',
};

const issuesTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const issueItem = {
  margin: '12px 0',
  padding: '12px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
};

const priorityColumn = {
  width: '80px',
};

const priorityBadge = {
  color: '#fff',
  fontSize: '10px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  textAlign: 'center' as const,
  display: 'inline-block',
};

const messageColumn = {
  width: 'calc(100% - 80px)',
};

const issueMessage = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const moreIssues = {
  color: '#666',
  fontSize: '12px',
  fontStyle: 'italic',
  margin: '8px 0 0 0',
  textAlign: 'center' as const,
};

const recommendationsBox = {
  backgroundColor: '#e8f5e8',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const recommendationsTitle = {
  color: '#155724',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const recommendationText = {
  color: '#155724',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const competitorsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const competitorsTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const competitorRow = {
  margin: '8px 0',
  padding: '8px 0',
  borderBottom: '1px solid #dee2e6',
};

const competitorDomain = {
  width: '50%',
};

const competitorDomainText = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const competitorScore = {
  width: '25%',
  textAlign: 'center' as const,
};

const competitorScoreText = {
  color: '#666',
  fontSize: '14px',
  margin: '0',
};

const competitorDiff = {
  width: '25%',
  textAlign: 'center' as const,
};

const competitorDiffText = {
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const keywordsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0',
};

const keywordsTitle = {
  color: '#333',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const keywordRow = {
  margin: '8px 0',
  padding: '8px 0',
  borderBottom: '1px solid #dee2e6',
};

const keywordText = {
  width: '60%',
};

const keywordTextStyle = {
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const keywordMetrics = {
  width: '40%',
  textAlign: 'right' as const,
};

const keywordMetric = {
  color: '#666',
  fontSize: '12px',
  margin: '2px 0',
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

export default SEOReportEmail; 