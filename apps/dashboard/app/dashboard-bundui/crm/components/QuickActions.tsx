import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Button } from "@vibethink/ui/components/button";
import { Badge } from "@vibethink/ui/components/badge";
import {
  Plus,
  UserPlus,
  FileText,
  Phone,
  Mail,
  Calendar,
  Target,
  Settings,
  Activity
} from 'lucide-react'

const quickActionItems = [
  {
    title: 'Add New Customer',
    description: 'Create a new customer profile',
    icon: UserPlus,
    color: 'bg-blue-500 hover:bg-blue-600',
    action: 'primary'
  },
  {
    title: 'Create Deal',
    description: 'Start a new sales opportunity',
    icon: Target,
    color: 'bg-green-500 hover:bg-green-600',
    action: 'secondary'
  },
  {
    title: 'Schedule Call',
    description: 'Book a customer meeting',
    icon: Phone,
    color: 'bg-purple-500 hover:bg-purple-600',
    action: 'secondary'
  },
  {
    title: 'Send Email',
    description: 'Compose customer email',
    icon: Mail,
    color: 'bg-orange-500 hover:bg-orange-600',
    action: 'secondary'
  }
]

const recentActivities = [
  {
    id: 1,
    type: 'deal_created',
    title: 'New deal created',
    description: 'Enterprise Software License - $45,000',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'customer_contacted',
    title: 'Customer contacted',
    description: 'Called Sarah Johnson from Tech Corp',
    time: '15 minutes ago',
    status: 'info'
  },
  {
    id: 3,
    type: 'proposal_sent',
    title: 'Proposal sent',
    description: 'Website Redesign Project proposal',
    time: '1 hour ago',
    status: 'warning'
  },
  {
    id: 4,
    type: 'meeting_scheduled',
    title: 'Meeting scheduled',
    description: 'Demo call with Healthcare Pro',
    time: '3 hours ago',
    status: 'info'
  }
]

const statusColors = {
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800'
}

export function QuickActions() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActionItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Button
                key={index}
                variant={item.action === 'primary' ? 'default' : 'outline'}
                className="w-full justify-start h-auto p-3"
              >
                <div className={`p-2 rounded-md mr-3 ${item.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                </div>
              </Button>
            )
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings & Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            CRM Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Export Customer Data
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Sync Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Target className="h-4 w-4 mr-2" />
            Pipeline Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
