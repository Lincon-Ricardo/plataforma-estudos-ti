import { LESSONS } from "@/lib/seed-tracks";
import LessonClient from "./LessonClient";

export function generateStaticParams() {
  return LESSONS.filter((l) => l.status === "ready").map((l) => ({ id: l.id }));
}

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonClient id={params.id} />;
}
