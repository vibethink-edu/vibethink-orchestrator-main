import { Card, CardContent, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import { Badge } from "@vibethink/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@vibethink/ui/components/avatar";
import { Button } from "@vibethink/ui/components/button";
import { Skeleton } from "@vibethink/ui/components/skeleton";
import { MoreHorizontal, Mail, Phone } from "@vibethink/ui/icons"
import { useCrmData } from '../hooks/useCrmData'
import { useCrmFilters } from '../hooks/useCrmFilters'
import { Customer, CUSTOMER_STATUSES } from '../types'

const statusColors = {
  active: 'bg-green-100 text-green-800',
  lead: 'bg-blue-100 text-blue-800',
  prospect: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
  churned: 'bg-red-100 text-red-800'
}

interface CustomerTableProps {
  className?: string
}

export function CustomerTable({ className }: CustomerTableProps) {
  const { customers, loading, error } = useCrmData()
  const { filterCustomers } = useCrmFilters()

  const filteredCustomers = filterCustomers(customers)

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Error loading customers: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Customers
          <span className="text-sm font-normal text-muted-foreground">
            {filteredCustomers.length} of {customers.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found</p>
            </div>
          ) : (
            filteredCustomers.slice(0, 10).map((customer: Customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={customer.avatar} />
                    <AvatarFallback>
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.company}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{customer.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">${customer.value.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>

                  <Badge className={statusColors[customer.status as keyof typeof statusColors]}>
                    {CUSTOMER_STATUSES[customer.status]}
                  </Badge>

                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
