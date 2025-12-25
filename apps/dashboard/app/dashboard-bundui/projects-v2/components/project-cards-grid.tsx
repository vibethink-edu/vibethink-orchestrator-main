"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Avatar, AvatarFallback, AvatarImage, Progress } from "@vibethink/ui";
import { useTranslation } from "@/lib/i18n";

const projects = [
    {
        "id": 1,
        "title": "Mobile App",
        "subtitle": "Prototyping",
        "progress": 78,
        "timeLeft": "1 week left",
        "date": "May 01, 2021",
        "progressColor": "bg-orange-500",
        "badgeColor": "bg-orange-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/01.png" },
            { "id": 2, "avatar": "/assets/images/avatars/02.png" },
            { "id": 3, "avatar": "/assets/images/avatars/03.png" }
        ]
    },
    {
        "id": 2,
        "title": "Design Learn Management System",
        "subtitle": "UI/UX Design",
        "progress": 32,
        "timeLeft": "2 week left",
        "date": "June 04, 2021",
        "progressColor": "bg-blue-500",
        "badgeColor": "bg-blue-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/03.png" },
            { "id": 2, "avatar": "/assets/images/avatars/04.png" }
        ]
    },
    {
        "id": 3,
        "title": "Chat Mobile App",
        "subtitle": "Prototyping",
        "progress": 64,
        "timeLeft": "6 week left",
        "date": "Oct 27, 2021",
        "progressColor": "bg-pink-500",
        "badgeColor": "bg-pink-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/05.png" },
            { "id": 2, "avatar": "/assets/images/avatars/06.png" },
            { "id": 3, "avatar": "/assets/images/avatars/07.png" },
            { "id": 4, "avatar": "/assets/images/avatars/08.png" }
        ]
    },
    {
        "id": 4,
        "title": "Store Dashboard",
        "subtitle": "UI/UX Design",
        "progress": 45,
        "timeLeft": "3 week left",
        "date": "Sep 16, 2021",
        "progressColor": "bg-green-500",
        "badgeColor": "bg-green-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/01.png" },
            { "id": 2, "avatar": "/assets/images/avatars/02.png" },
            { "id": 3, "avatar": "/assets/images/avatars/03.png" }
        ]
    },
    {
        "id": 5,
        "title": "NFT Marketplace App",
        "subtitle": "Prototyping",
        "progress": 69,
        "timeLeft": "4 week left",
        "date": "Jan 03, 2021",
        "progressColor": "bg-red-500",
        "badgeColor": "bg-red-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/10.png" }
        ]
    },
    {
        "id": 6,
        "title": "Mobile App",
        "subtitle": "Prototyping",
        "progress": 56,
        "timeLeft": "2 week left",
        "date": "May 09, 2021",
        "progressColor": "bg-blue-500",
        "badgeColor": "bg-blue-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/01.png" },
            { "id": 2, "avatar": "/assets/images/avatars/02.png" },
            { "id": 3, "avatar": "/assets/images/avatars/03.png" }
        ]
    },
    {
        "id": 7,
        "title": "LMS App Design",
        "subtitle": "UI/UX Design",
        "progress": 78,
        "timeLeft": "2 week left",
        "date": "Jan 03, 2021",
        "progressColor": "bg-orange-500",
        "badgeColor": "bg-orange-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/03.png" },
            { "id": 2, "avatar": "/assets/images/avatars/06.png" }
        ]
    },
    {
        "id": 8,
        "title": "Design Learn Management System",
        "subtitle": "UI/UX Design",
        "progress": 25,
        "timeLeft": "1 week left",
        "date": "June 04, 2021",
        "progressColor": "bg-blue-500",
        "badgeColor": "bg-blue-500",
        "team": [
            { "id": 1, "avatar": "/assets/images/avatars/01.png" },
            { "id": 2, "avatar": "/assets/images/avatars/02.png" },
            { "id": 3, "avatar": "/assets/images/avatars/03.png" }
        ]
    }
];

export function ProjectCardsGrid() {
    const { t } = useTranslation('projects');

    return (
        <>
            <div className="mb-4 flex flex-row items-center justify-between space-y-2">
                <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">{t('summary.activeProjects')} ({projects.length})</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('header.newProject')}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                {projects.map((project) => (
                    <Link href="#" key={project.id}>
                        <Card className="transition-shadow hover:shadow-md h-full">
                            <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                                <CardDescription>{project.subtitle}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground mb-4 text-sm">{project.date}</div>

                                <div className="mb-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm opacity-90">{t('table.progress')}</span>
                                        <span className="text-sm font-semibold">{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} indicatorColor={project.progressColor} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {project.team.map((member, i) => (
                                            <Avatar key={i} className="border-2 border-background w-8 h-8">
                                                <AvatarImage src={member.avatar} alt={`${member.id}`} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>

                                    <Badge
                                        className={`${project.badgeColor} border-0 text-white hover:${project.badgeColor}`}>
                                        {project.timeLeft}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </>
    );
}
