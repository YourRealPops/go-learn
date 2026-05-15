import { notFound } from "next/navigation";
import { getLessonBySlug, getLessons } from "@/lib/lessons";
import LessonPageClient from "./LessonPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return {};
  return { title: `${lesson.title} — GoLearn` };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();
  return <LessonPageClient lesson={lesson} />;
}