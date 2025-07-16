import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings, 
  Bot, 
  Layers,
  TrendingUp,
  Activity,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const teamMembers = [
  { name: 'Patricia Escallon', email: 'patricia@vibethink.com', role: 'Viewer' },
  { name: 'Cristina Manrique', email: 'cristina@vibethink.com', role: 'Developer' },
  { name: 'Eduardo', email: 'eduardo@vibethink.com', role: 'Viewer' },
];

const chatMessages = [
  { from: 'Patricia Escallon', text: 'Hola, ¿en qué puedo ayudarte hoy?', self: false },
  { from: 'Eduardo', text: 'Tengo problemas para acceder a mi cuenta.', self: true },
  { from: 'Patricia Escallon', text: '¿Cuál parece ser el problema?', self: false },
  { from: 'Eduardo', text: 'No puedo iniciar sesión.', self: true },
];

const Dashboard3Main: React.FC = () => {
  const metrics = [
    {
      title: 'Usuarios Activos',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Documentos Procesados',
      value: '15,234',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Mensajes Enviados',
      value: '8,921',
      change: '+23.1%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'AI Interactions',
      value: '3,456',
      change: '+45.7%',
      trend: 'up',
      icon: Bot,
      color: 'text-pink-600'
    }
  ];

  const recentActivities = [
    {
      title: 'Nuevo usuario registrado',
      description: 'María González se unió al equipo de ventas',
      time: 'Hace 5 minutos',
      type: 'user'
    },
    {
      title: 'Documento procesado',
      description: 'Reporte mensual generado automáticamente',
      time: 'Hace 15 minutos',
      type: 'document'
    },
    {
      title: 'Configuración actualizada',
      description: 'Parámetros de seguridad modificados',
      time: 'Hace 1 hora',
      type: 'settings'
    },
    {
      title: 'AI Assistant activo',
      description: 'Asistente procesando consultas de usuarios',
      time: 'Hace 2 horas',
      type: 'ai'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'document': return FileText;
      case 'settings': return Settings;
      case 'ai': return Bot;
      default: return Activity;
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Dashboard3 - Panel Avanzado</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Team Members */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Team Members</h2>
          <ul className="space-y-2">
            {teamMembers.map((m) => (
              <li key={m.email} className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {m.name[0]}
                </span>
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.email}</div>
                </div>
                <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded">{m.role}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Chat Widget */}
        <div className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">AI Chat</h2>
          <div className="space-y-2">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded px-3 py-1 ${msg.self ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 border rounded px-2 py-1" placeholder="Type your message..." />
            <button className="bg-blue-600 text-white rounded px-3">Enviar</button>
          </div>
        </div>
      </div>
      {/* Aquí puedes agregar más widgets, gráficas, etc. */}
    </div>
  );
};

export default Dashboard3Main; 