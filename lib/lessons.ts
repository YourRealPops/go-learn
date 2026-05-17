import type { Lesson } from "./types";

// MVP: lessons defined in code. Later, fetch from your Go backend / DB.
const LESSONS: Omit<Lesson, "contentHtml" | "prevSlug" | "nextSlug">[] = [
  {
    slug: "why-go",
    chapter: 1,
    title: "Why Go?",
    description: "Understand what problems Go solves and why it's designed the way it is.",
    duration: 8,
    challenge: "Print your name and why you want to learn Go using fmt.Println. Run it.",
    hints: [
      "Use fmt.Println(\"...\") — Go's print function is in the fmt package.",
      "Every Go program starts with package main and a func main() entry point.",
    ],
    starterCode: `package main

import "fmt"

func main() {
	// Your code here
	fmt.Println("Hello, Go!")
}
`,
  },
  {
    slug: "variables-and-types",
    chapter: 2,
    title: "Variables & types",
    description: "Learn Go's type system, zero values, and the := short declaration syntax.",
    duration: 12,
    challenge: "Declare variables for a user's name (string), age (int), and account balance (float64) using both var and :=. Print them all.",
    hints: [
      "Use := for short variable declaration inside functions: name := \"Alice\"",
      "var declares at package level or when you want to be explicit about the type: var age int = 30",
      "Go initialises all variables to their zero value — string is \"\", int is 0, float64 is 0.0",
    ],
    starterCode: `package main

import "fmt"

func main() {
	// Declare a name using :=
	
	// Declare age using var
	
	// Declare balance as float64
	
	fmt.Println("Name:", /* your variable */)
	fmt.Println("Age:", /* your variable */)
	fmt.Println("Balance:", /* your variable */)
}
`,
  },
  {
    slug: "functions",
    chapter: 2,
    title: "Functions & multiple returns",
    description: "Go functions can return multiple values; this is idiomatic, not a quirk.",
    duration: 15,
    challenge: "Write a divide(a, b float64) function that returns (float64, error). Return an error if b is zero. Call it twice; once with valid inputs, once with b=0.",
    hints: [
      "Use errors.New(\"message\") from the errors package to create an error value.",
      "Check the error with: result, err := divide(10, 2); if err != nil { ... }",
      "Return multiple values like: return 0, errors.New(\"cannot divide by zero\")",
    ],
    starterCode: `package main

import (
	"errors"
	"fmt"
)

// divide returns the result and an error if b is zero
func divide(a, b float64) (float64, error) {
	// TODO: return an error if b == 0
	
	return a / b, nil
}

func main() {
	result, err := divide(10, 2)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Println("10 / 2 =", result)

	// TODO: call divide with b = 0 and handle the error
}
`,
  },
  {
  slug: "control-flow",
  chapter: 2,
  title: "Control flow",
  description: "if, for, and switch — Go's three control structures.",
  duration: 10,
  challenge: "Write a for loop that prints numbers 1 to 10, but prints 'fizz' for multiples of 3 and 'buzz' for multiples of 5.",
  hints: [
    "Go's only loop keyword is for — there is no while.",
    "Use the modulo operator % to check divisibility: if n % 3 == 0",
    "Check fizzbuzz first (divisible by both 3 and 5) before checking each individually.",
  ],
  starterCode: `package main

import "fmt"

func main() {
	for i := 1; i <= 10; i++ {
		// TODO: print fizz, buzz, or the number
		fmt.Println(i)
	}
}
`,
},
];

// Build the full lesson list with prev/next links and HTML content
function buildLessons(): Lesson[] {
  return LESSONS.map((l, idx) => ({
    ...l,
    contentHtml: getContentHtml(l.slug),
    prevSlug: LESSONS[idx - 1]?.slug,
    nextSlug: LESSONS[idx + 1]?.slug,
  }));
}

// Inline HTML content for each lesson (move to MDX files as you scale)
function getContentHtml(slug: string): string {
  const content: Record<string, string> = {
    "why-go": `
      <h2>What is Go?</h2>
      <p>Go (or Golang) is a statically typed, compiled language designed at Google in 2007 by Robert Griesemer, Rob Pike, and Ken Thompson. It was built to solve real engineering problems at scale, slow compile times, complex dependency management, and painful concurrency.</p>
      <h2>The Go philosophy</h2>
      <p>Go has an opinionated design: <em>fewer features, done well</em>. There's usually one obvious way to do something. This makes codebases written by different people feel consistent and readable.</p>
      <ul>
        <li><strong>Simplicity</strong>: if you can't explain a feature, it probably doesn't belong</li>
        <li><strong>Explicitness</strong>: code should say what it does, not hide it</li>
        <li><strong>Composition</strong>: build complex things from small, simple pieces</li>
      </ul>
      <h2>Your first Go program</h2>
      <p>Every Go program needs a <code>package main</code> declaration and a <code>func main()</code> entry point. The <code>fmt</code> package provides formatted I/O.</p>
      <pre><code>package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}</code></pre>
      <blockquote>Go is compiled, not interpreted. When you click Run, your code is compiled to machine code and executed, that's why it's fast.</blockquote>
    `,
    "variables-and-types": `
      <h2>Declaring variables</h2>
      <p>Go gives you two main ways to declare variables. The <code>var</code> keyword is explicit and works anywhere:</p>
      <pre><code>var name string = "Alice"
var age int = 30</code></pre>
      <p>The <code>:=</code> short declaration is concise and idiomatic inside functions:</p>
      <pre><code>name := "Alice"  // type inferred as string
age := 30        // type inferred as int</code></pre>
      <h2>Zero values — Go's safety net</h2>
      <p>Every variable in Go is initialised to its <strong>zero value</strong> if you don't provide one. This eliminates a whole class of bugs:</p>
      <pre><code>var count int      // 0
var name string    // ""
var active bool    // false
var price float64  // 0.0</code></pre>
      <h2>Go's basic types</h2>
      <ul>
        <li><code>string</code> — UTF-8 text</li>
        <li><code>int</code>, <code>int8</code>, <code>int32</code>, <code>int64</code> — integers</li>
        <li><code>float32</code>, <code>float64</code> — floating point</li>
        <li><code>bool</code> — true or false</li>
        <li><code>byte</code> — alias for uint8</li>
      </ul>
    `,
    "functions": `
      <h2>Functions in Go</h2>
      <p>Go functions are declared with <code>func</code>, take typed parameters, and can return multiple values:</p>
      <pre><code>func add(a int, b int) int {
    return a + b
}</code></pre>
      <p>When parameters share a type, you can shorten it:</p>
      <pre><code>func add(a, b int) int {
    return a + b
}</code></pre>
      <h2>Multiple return values, not a quirk</h2>
      <p>In Go, returning multiple values is the standard way to signal errors. This is idiomatic, not a workaround:</p>
      <pre><code>func openFile(path string) (*File, error) {
    // ...
}</code></pre>
      <p>The caller <em>must</em> handle both values:</p>
      <pre><code>f, err := openFile("data.txt")
if err != nil {
    log.Fatal(err)
}</code></pre>
      <h2>Why not exceptions?</h2>
      <p>Go deliberately has no exceptions. Errors are just values; they appear in the type signature, can be inspected, wrapped, and passed around. This makes error handling explicit and visible, not hidden in a try/catch somewhere up the call stack.</p>
      <blockquote>If a function can fail, its return type should say so. Don't hide failure paths.</blockquote>
    `,
    "control-flow": `
  <h2>The for loop</h2>
  <p>Go has only one looping construct: <code>for</code>. It replaces while, do-while, and foreach from other languages.</p>
  <pre><code>for i := 0; i < 10; i++ {
    fmt.Println(i)
}</code></pre>
  <h2>if / else</h2>
  <p>Standard conditional — no parentheses needed around the condition:</p>
  <pre><code>if x > 0 {
    fmt.Println("positive")
} else {
    fmt.Println("non-positive")
}</code></pre>
  <h2>switch</h2>
  <p>Go's switch doesn't fall through by default — no need for break:</p>
  <pre><code>switch day {
case "Monday":
    fmt.Println("Start of the week")
case "Friday":
    fmt.Println("Almost weekend")
default:
    fmt.Println("Midweek")
}</code></pre>
`,
  };
  return content[slug] ?? "<p>Content coming soon.</p>";
}

let _lessons: Lesson[] | null = null;

export function getLessons(): Lesson[] {
  if (!_lessons) _lessons = buildLessons();
  return _lessons;
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getLessons().find((l) => l.slug === slug);
}