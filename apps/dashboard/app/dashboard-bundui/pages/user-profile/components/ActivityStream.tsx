import { Clock12Icon, FileText, MoreHorizontal } from "lucide-react";
import { Badge } from "@vibethink/ui/components/badge";
import { Button } from "@vibethink/ui/components/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@vibethink/ui/components/card";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from "@vibethink/ui/components/extensions/timeline";
import Link from "next/link";

const activities = [
  {
    id: "1",
    type: "file-upload",
    title: "Task report - uploaded weekly reports",
    description: "Added 3 files to task",
    timestamp: "5 minutes ago",
    files: [
      { name: "weekly-reports.xls", size: "12kb", type: "excel" },
      { name: "weekly-reports.xls", size: "4kb", type: "word" },
      { name: "monthly-reports.xls", size: "8kb", type: "word" }
    ]
  },
  {
    id: "2",
    type: "status-update",
    title: "Project status updated",
    description: "Marked",
    timestamp: "3 hours ago",
    badge: { text: "Completed", color: "cyan" }
  },
  {
    id: "3",
    type: "image-added",
    title: "3 new photos added",
    description: "Added 3 images to",
    timestamp: "Yesterday",
    images: [
      {
        id: "1",
        src: "/assets/images/products/01.jpeg"
      },
      {
        id: "2",
        src: "/assets/images/products/02.jpeg"
      },
      {
        id: "3",
        src: "/assets/images/products/03.jpeg"
      }
    ]
  }
];

export function ActivityStream() {
  return (
    <Card className="overflow-hidden pb-0">
      <CardHeader>
        <CardTitle>Activity stream</CardTitle>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Timeline defaultValue={3}>
          {activities.map((activity) => (
            <TimelineItem key={activity.id} step={Number(activity.id)} className="space-y-2">
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineTitle className="-mt-0.5">{activity.title}</TimelineTitle>
                <TimelineIndicator />
              </TimelineHeader>
              <TimelineContent className="space-y-4">
                {activity.files && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activity.files.map((file, idx) => (
                      <Link
                        href="#"
                        key={idx}
                        className="bg-muted/30 hover:bg-muted flex items-center gap-3 rounded-lg border p-4">
                        <FileText className="text-muted-foreground size-5" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-muted-foreground text-xs">{file.size}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {activity.images && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {activity.images.map((img) => (
                      <figure key={img.id}>
                        <img className="aspect-video w-full rounded-lg" src={img.src} alt="..." />
                      </figure>
                    ))}
                  </div>
                )}

                {activity.timestamp && (
                  <TimelineDate className="mt-2 mb-0 flex items-center gap-1.5">
                    <Clock12Icon className="size-3" />
                    {activity.timestamp}
                  </TimelineDate>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
      <CardFooter className="border-t p-0!">
        <Button variant="ghost" className="w-full rounded-none">
          View more
        </Button>
      </CardFooter>
    </Card>
  );
}















