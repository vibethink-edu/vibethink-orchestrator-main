"use client";

import * as React from "react";

import { Calendar } from "@vibethink/ui/components/calendar";
import { Card, CardContent } from "@vibethink/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@vibethink/ui/components/avatar";
import { Badge } from "@vibethink/ui/components/badge";
import { Appointment } from "../types";

interface PlannedCalendarProps {
  appointments: Appointment[];
}

type AppointmentData = {
  avatar: string;
  hour: string;
  title: string;
  description: string;
  status: string;
  statusColor: "success" | "warning";
};

const data: AppointmentData[] = [
  {
    avatar: "/assets/images/avatars/08.png",
    hour: "10:00-11:00 AM",
    title: "General Health Check up",
    description: "Dr. Dianne Philips",
    status: "active",
    statusColor: "success"
  },
  {
    avatar: "/assets/images/avatars/04.png",
    hour: "05:00-06:00 PM",
    title: "Temporary Headache",
    description: "Dr. Jenny Smith",
    status: "pending",
    statusColor: "warning"
  }
];

export default function PlannedCalendar({ appointments }: PlannedCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          today={new Date()}
          defaultMonth={new Date()}
          className="w-full!"
        />
      </CardContent>
      <div className="flex flex-col divide-y border-t px-0">
        {appointments.slice(0, 5).map((appointment, i) => (
          <div className="w-full" key={appointment.id}>
            <div className="flex items-center p-4">
              <Avatar>
                <AvatarImage src={`/assets/images/avatars/${(i % 5 + 1).toString().padStart(2, '0')}.png`} />
                <AvatarFallback>{appointment.patient_name[0]}</AvatarFallback>
              </Avatar>
              <div className="ms-4 space-y-1">
                <p className="leading-none font-medium">{appointment.type}</p>
                <p className="text-muted-foreground text-sm">
                  {appointment.patient_name} at {appointment.time}
                </p>
              </div>
              <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'} className="ms-auto capitalize">
                {appointment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
