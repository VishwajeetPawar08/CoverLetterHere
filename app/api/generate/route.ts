import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jd, resume } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // OpenRouter needs these to verify your "app"
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "Cover Letter Generator",
      },
      body: JSON.stringify({
        model: "openrouter/auto", // Ensure this exact string is used
        messages: [
          {
            role: "system",
            content: `You are a professional job applicant. Write a formal yet simple Cover Letter.
            
            STRICT OUTPUT RULES:
            1. FORMAT: Use standard letter format (Dear Hiring Manager, [3 paragraphs], Sincerely).
            2. NO MARKDOWN: Do not use bold (**), italics (*), or bullet points. Use plain text only.
            3. NO ANALYSIS: Do not explain your reasoning. Do not provide a 'Strengths' list. Output ONLY the letter.
            4. SKILLS: Use the exact phrases from the Job Description (e.g., "secure data handling", "optimising data models") ONLY if the Resume shows relevant experience. 
            5. HALLUCINATION CHECK: Do not mention Kafka, GDPR, or specific security tools unless they are explicitly written in the Resume.
            6. HUMAN TOUCH: Include exactly one minor natural phrasing 'error' (e.g., using "I've" instead of "I have" in a formal spot, or a missing comma) to look human-written.
            7. LENGTH: Maximum 400 words.
            8. NO DOUBLE SPACING: Use only a single new line between paragraphs and a single new line between 'Sincerely,' and your name.
            9. NO MARKDOWN: Plain text only.`
          },
          { 
            role: "user", 
            content: `Target Job Description: ${jd}\n\nMy Resume Details: ${resume}` 
          }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}

// Inside the POST function
console.log("Key exists:", !!process.env.OPENROUTER_API_KEY);