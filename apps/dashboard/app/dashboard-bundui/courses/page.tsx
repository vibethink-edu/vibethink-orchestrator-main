import CoursesClient from "./CoursesClient";

export const metadata = {
  title: "Courses",
  alternates: {
    canonical: "/dashboard-bundui/courses",
  },
};

export default function Page() {
  return <CoursesClient />;
}

