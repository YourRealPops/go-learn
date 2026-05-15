export interface Lesson {
  slug: string;
  title: string;
  description: string;
  chapter: number;
  duration: number;
  starterCode: string;
  contentHtml: string;
  challenge: string;
  hints?: string[];
  prevSlug?: string;
  nextSlug?: string;
}

export interface TestResult {
  name: string;
  passed: boolean;
  expected?: string;
  got?: string;
}

export interface RunResponse {
  output?: string;
  error?: string;
  isError?: boolean;
  testResults?: TestResult[];
}