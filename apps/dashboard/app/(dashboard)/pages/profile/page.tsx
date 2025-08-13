/**
 * Profile Page - User Profile
 * VibeThink Orchestrator Dashboard
 * 
 * Simplified version following bundui-reference pattern
 */

'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, MapPin, Calendar, Mail, Phone, Building } from "lucide-react";
import { Button } from "@/shared/components/bundui-premium/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/bundui-premium/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/bundui-premium/components/ui/avatar";
import { Badge } from "@/shared/components/bundui-premium/components/ui/badge";
import { Separator } from "@/shared/components/bundui-premium/components/ui/separator";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-96 bg-muted rounded animate-pulse"></div>
          <div className="h-96 bg-muted rounded animate-pulse"></div>
          <div className="h-96 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Profile Page</h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/pages/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://bundui-images.netlify.app/avatars/01.png" alt="User Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">John Doe</CardTitle>
            <p className="text-muted-foreground">Senior Software Engineer</p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">Pro Member</Badge>
              <Badge variant="outline">Verified</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>john.doe@company.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>VibeThink Corp</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined March 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Passionate software engineer with over 8 years of experience in building scalable web applications. 
              Specialized in React, Node.js, and cloud technologies. Always eager to learn new technologies and 
              contribute to innovative projects.
            </p>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Skills & Expertise</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Node.js</Badge>
                <Badge variant="outline">Next.js</Badge>
                <Badge variant="outline">AWS</Badge>
                <Badge variant="outline">Docker</Badge>
                <Badge variant="outline">PostgreSQL</Badge>
                <Badge variant="outline">GraphQL</Badge>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Completed project: Dashboard Migration</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Updated profile settings</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm">Added new team member</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projects Completed</span>
              <span className="font-medium">47</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasks This Month</span>
              <span className="font-medium">23</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Team Members</span>
              <span className="font-medium">12</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Performance Score</span>
              <Badge variant="default">Excellent</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="h-5 w-5 mb-2" />
                <span className="text-xs">Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Mail className="h-5 w-5 mb-2" />
                <span className="text-xs">Messages</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-xs">Calendar</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Building className="h-5 w-5 mb-2" />
                <span className="text-xs">Projects</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}