// Servicio de integración con Zammad para tickets de soporte
export interface ZammadTicket {
  id: number;
  title: string;
  group: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  state: 'new' | 'open' | 'pending' | 'closed' | 'merged';
  customer_id: number;
  created_at: string;
  updated_at: string;
  article?: {
    subject: string;
    body: string;
    type: 'web' | 'phone' | 'email';
    internal: boolean;
  };
}

export interface CreateTicketData {
  title: string;
  description: string;
  type: 'technical' | 'billing';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  customerEmail: string;
  customerName: string;
  companyId: string;
  metadata?: Record<string, any>;
}

export interface ZammadCustomer {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  organization?: string;
  created_at: string;
  updated_at: string;
}

class ZammadService {
  private baseUrl: string;
  private apiToken: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_ZAMMAD_BASE_URL || 'https://support.VibeThink.com';
    this.apiToken = import.meta.env.VITE_ZAMMAD_API_TOKEN || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Token token=${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options
    });

    if (!response.ok) {
      throw new Error(`Zammad API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Crear ticket de soporte
  async createTicket(ticketData: CreateTicketData): Promise<ZammadTicket> {
    try {
      // Primero, buscar o crear el cliente
      const customer = await this.findOrCreateCustomer({
        email: ticketData.customerEmail,
        firstname: ticketData.customerName.split(' ')[0] || ticketData.customerName,
        lastname: ticketData.customerName.split(' ').slice(1).join(' ') || '',
        organization: ticketData.companyId
      });

      // Determinar el grupo basado en el tipo de ticket
      const group = ticketData.type === 'billing' ? 'Billing Support' : 'Technical Support';

      const ticketPayload = {
        ticket: {
          title: ticketData.title,
          group: group,
          priority: ticketData.priority,
          customer_id: customer.id,
          article: {
            subject: ticketData.title,
            body: this.formatTicketBody(ticketData),
            type: 'web',
            internal: false
          },
          custom_fields: {
            company_id: ticketData.companyId,
            ticket_type: ticketData.type,
            ...ticketData.metadata
          }
        }
      };

      const response = await this.makeRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticketPayload)
      });

      return response;
    } catch (error) {
      // TODO: log Error creating Zammad ticket: error
      throw new Error('Error al crear ticket de soporte');
    }
  }

  // Buscar o crear cliente
  async findOrCreateCustomer(customerData: {
    email: string;
    firstname: string;
    lastname: string;
    organization?: string;
  }): Promise<ZammadCustomer> {
    try {
      // Buscar cliente existente por email
      const existingCustomers = await this.makeRequest(`/users?query=${customerData.email}`);
      
      if (existingCustomers.length > 0) {
        const existingCustomer = existingCustomers.find((user: any) => 
          user.role_ids.includes(3) // Role ID 3 es "Customer" en Zammad
        );
        
        if (existingCustomer) {
          return existingCustomer;
        }
      }

      // Crear nuevo cliente
      const newCustomer = await this.makeRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
          user: {
            email: customerData.email,
            firstname: customerData.firstname,
            lastname: customerData.lastname,
            organization: customerData.organization,
            role_ids: [3] // Customer role
          }
        })
      });

      return newCustomer;
    } catch (error) {
      // TODO: log Error finding/creating Zammad customer: error
      throw new Error('Error al gestionar cliente');
    }
  }

  // Obtener tickets de un cliente
  async getCustomerTickets(customerEmail: string): Promise<ZammadTicket[]> {
    try {
      const response = await this.makeRequest(`/tickets?query=${customerEmail}`);
      return response.filter((ticket: ZammadTicket) => 
        ticket.customer_id && !ticket.article?.internal
      );
    } catch (error) {
      // TODO: log Error fetching customer tickets: error
      throw new Error('Error al obtener tickets del cliente');
    }
  }

  // Obtener ticket específico
  async getTicket(ticketId: number): Promise<ZammadTicket> {
    try {
      const response = await this.makeRequest(`/tickets/${ticketId}`);
      return response;
    } catch (error) {
      // TODO: log Error fetching ticket: error
      throw new Error('Error al obtener ticket');
    }
  }

  // Actualizar ticket
  async updateTicket(ticketId: number, updates: Partial<ZammadTicket>): Promise<ZammadTicket> {
    try {
      const response = await this.makeRequest(`/tickets/${ticketId}`, {
        method: 'PUT',
        body: JSON.stringify({ ticket: updates })
      });
      return response;
    } catch (error) {
      // TODO: log Error updating ticket: error
      throw new Error('Error al actualizar ticket');
    }
  }

  // Agregar comentario a ticket
  async addComment(ticketId: number, comment: string, internal: boolean = false): Promise<any> {
    try {
      const response = await this.makeRequest(`/tickets/${ticketId}/articles`, {
        method: 'POST',
        body: JSON.stringify({
          article: {
            body: comment,
            type: internal ? 'note' : 'web',
            internal: internal
          }
        })
      });
      return response;
    } catch (error) {
      // TODO: log Error adding comment to ticket: error
      throw new Error('Error al agregar comentario');
    }
  }

  // Cerrar ticket
  async closeTicket(ticketId: number, resolution?: string): Promise<ZammadTicket> {
    try {
      const updates: any = { state: 'closed' };
      
      if (resolution) {
        // Agregar comentario de resolución antes de cerrar
        await this.addComment(ticketId, `Resolución: ${resolution}`, true);
      }

      return await this.updateTicket(ticketId, updates);
    } catch (error) {
      // TODO: log Error closing ticket: error
      throw new Error('Error al cerrar ticket');
    }
  }

  // Obtener estadísticas de tickets
  async getTicketStats(customerEmail?: string): Promise<{
    total: number;
    open: number;
    closed: number;
    averageResolutionTime: number;
  }> {
    try {
      let endpoint = '/tickets';
      if (customerEmail) {
        endpoint += `?query=${customerEmail}`;
      }

      const tickets = await this.makeRequest(endpoint);
      
      const stats = {
        total: tickets.length,
        open: tickets.filter((t: ZammadTicket) => t.state !== 'closed').length,
        closed: tickets.filter((t: ZammadTicket) => t.state === 'closed').length,
        averageResolutionTime: 0
      };

      // Calcular tiempo promedio de resolución
      const closedTickets = tickets.filter((t: ZammadTicket) => t.state === 'closed');
      if (closedTickets.length > 0) {
        const totalTime = closedTickets.reduce((sum: number, ticket: ZammadTicket) => {
          const created = new Date(ticket.created_at).getTime();
          const updated = new Date(ticket.updated_at).getTime();
          return sum + (updated - created);
        }, 0);
        
        stats.averageResolutionTime = totalTime / closedTickets.length / (1000 * 60 * 60); // en horas
      }

      return stats;
    } catch (error) {
      // TODO: log Error fetching ticket stats: error
      throw new Error('Error al obtener estadísticas');
    }
  }

  // Formatear cuerpo del ticket
  private formatTicketBody(ticketData: CreateTicketData): string {
    const timestamp = new Date().toLocaleString('es-CO');
    
    return `
Nuevo ticket de soporte

**Información del Cliente:**
- Nombre: ${ticketData.customerName}
- Email: ${ticketData.customerEmail}
- Empresa ID: ${ticketData.companyId}
- Tipo: ${ticketData.type === 'billing' ? 'Facturación' : 'Soporte Técnico'}
- Prioridad: ${ticketData.priority}

**Descripción del Problema:**
${ticketData.description}

**Metadatos:**
${Object.entries(ticketData.metadata || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

---
Ticket creado el ${timestamp} desde la aplicación web.
    `.trim();
  }

  // Webhook para recibir actualizaciones de Zammad
  async handleWebhook(payload: any): Promise<void> {
    try {
      // Procesar webhook de Zammad
      const { ticket, article } = payload;
      
      if (ticket && article) {
        // Notificar al cliente sobre actualizaciones del ticket
        await this.notifyCustomerUpdate(ticket, article);
      }
    } catch (error) {
      // TODO: log Error handling Zammad webhook: error
    }
  }

  // Notificar actualizaciones al cliente
  private async notifyCustomerUpdate(ticket: ZammadTicket, article: any): Promise<void> {
    try {
      // Aquí iría la lógica para notificar al cliente
      // Por ejemplo, enviar email, push notification, etc.
      // TODO: log Notificando actualización de ticket: ticket.id
      
      // Ejemplo: enviar email de notificación
      // await emailService.sendTicketUpdate(ticket.customer_id, ticket, article);
    } catch (error) {
      // TODO: log Error notifying customer update: error
    }
  }

  // Crear ticket de facturación específico
  async createBillingTicket(billingData: {
    customerEmail: string;
    customerName: string;
    companyId: string;
    invoiceNumber?: string;
    amount?: number;
    currency?: string;
    issue: string;
  }): Promise<ZammadTicket> {
    const ticketData: CreateTicketData = {
      title: `Consulta de Facturación${billingData.invoiceNumber ? ` - ${billingData.invoiceNumber}` : ''}`,
      description: billingData.issue,
      type: 'billing',
      priority: 'normal',
      customerEmail: billingData.customerEmail,
      customerName: billingData.customerName,
      companyId: billingData.companyId,
      metadata: {
        invoice_number: billingData.invoiceNumber,
        amount: billingData.amount,
        currency: billingData.currency,
        ticket_category: 'billing_inquiry'
      }
    };

    return this.createTicket(ticketData);
  }

  // Crear ticket técnico específico
  async createTechnicalTicket(technicalData: {
    customerEmail: string;
    customerName: string;
    companyId: string;
    feature: string;
    error?: string;
    steps: string;
    expected: string;
    actual: string;
  }): Promise<ZammadTicket> {
    const ticketData: CreateTicketData = {
      title: `Problema Técnico - ${technicalData.feature}`,
      description: `
**Característica afectada:** ${technicalData.feature}

**Pasos para reproducir:**
${technicalData.steps}

**Comportamiento esperado:**
${technicalData.expected}

**Comportamiento actual:**
${technicalData.actual}

${technicalData.error ? `**Error:**\n${technicalData.error}` : ''}
      `.trim(),
      type: 'technical',
      priority: 'normal',
      customerEmail: technicalData.customerEmail,
      customerName: technicalData.customerName,
      companyId: technicalData.companyId,
      metadata: {
        feature: technicalData.feature,
        error: technicalData.error,
        ticket_category: 'technical_issue'
      }
    };

    return this.createTicket(ticketData);
  }
}

// Instancia singleton del servicio
export const zammadService = new ZammadService();

// Hook para usar el servicio en componentes React
export const useZammadService = () => {
  return zammadService;
}; 