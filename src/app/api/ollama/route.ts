import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434";

interface IntentRequest {
  workflowState: {
    blocks: Array<{ id: string; type: string; label: string; status: string; result?: string; config: Record<string, unknown> }>;
    edges: Array<{ source: string; target: string }>;
    memory: Array<{ key: string; value: unknown; type: string }>;
    currentBlockId: string | null;
    executionLog: Array<{ blockId: string; status: string; message: string }>;
  };
  userQuery?: string;
  mode: "infer-next" | "generate-content" | "analyze-results" | "suggest-workflow";
}

function buildIntentPrompt(state: IntentRequest["workflowState"], mode: string): string {
  const completedBlocks = state.blocks.filter(b => b.status === "completed");
  const failedBlocks = state.blocks.filter(b => b.status === "error");
  const pendingBlocks = state.blocks.filter(b => b.status === "idle");
  const currentBlock = state.blocks.find(b => b.id === state.currentBlockId);

  const memoryContext = state.memory.map(m => `${m.key}: ${JSON.stringify(m.value)}`).join("\n");

  const blockSummaries = completedBlocks.map(b =>
    `- ${b.label} (${b.type}): ${b.result?.slice(0, 200) || "completed"}`
  ).join("\n");

  if (mode === "infer-next") {
    return `You are an AI workflow orchestrator. Based on the current workflow state, infer what the user needs to decide NEXT.

COMPLETED STEPS:
${blockSummaries || "None yet"}

PENDING STEPS:
${pendingBlocks.map(b => `- ${b.label} (${b.type})`).join("\n") || "None"}

CURRENT BLOCK: ${currentBlock ? `${currentBlock.label} (${currentBlock.type})` : "None"}

MEMORY CONTEXT:
${memoryContext || "No context available"}

AVAILABLE ACTIONS:
1. "execute" - Run the next block automatically
2. "decide" - Show the user a decision to make
3. "skip" - Suggest skipping a step
4. "review" - Show results for human review
5. "error-recovery" - Suggest recovery from failure

Respond with JSON only:
{
  "intent": "execute|decide|skip|review|error-recovery",
  "reasoning": "why this action",
  "nextBlockId": "id of the next block or null",
  "userDecision": "what the user needs to decide (if applicable)",
  "confidence": 0.0-1.0,
  "suggestedAction": "brief description of what happens next"
}`;
  }

  if (mode === "generate-content") {
    return `Generate professional content for a sales outreach workflow.

Context from previous steps:
${blockSummaries}

Memory:
${memoryContext}

Generate a personalized, professional email or message based on the context above. Be specific, reference the data, and make it actionable.`;
  }

  if (mode === "analyze-results") {
    return `Analyze the results of this workflow execution and provide insights.

Completed steps:
${blockSummaries}

Failed steps:
${failedBlocks.map(b => `- ${b.label}: ${b.result}`).join("\n") || "None"}

Provide:
1. Summary of what was accomplished
2. Key metrics and insights
3. Recommended next actions
4. Any issues or concerns`;
  }

  return `Based on the user's goal and available blocks, suggest a complete workflow.

User goal: ${state.memory.find(m => m.key === "user_goal")?.value || "Not specified"}

Available block types: research, writer, analyst, coder, crm, email, image, approval

Suggest a workflow with 3-5 steps. For each step, specify:
- blockType: which block to use
- label: what to call it
- config: suggested configuration

Respond with JSON array of steps.`;
}

async function callOllama(prompt: string, model?: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "llama3.2",
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 512,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    return data.response || "";
  } catch (error) {
    console.error("Ollama call failed:", error);
    throw new Error(`AI service unavailable: ${error instanceof Error ? error.message : "unknown"}`);
  }
}

function fallbackInferIntent(state: IntentRequest["workflowState"]): string {
  const completedBlocks = state.blocks.filter(b => b.status === "completed");
  const pendingBlocks = state.blocks.filter(b => b.status === "idle");
  const failedBlocks = state.blocks.filter(b => b.status === "error");

  if (failedBlocks.length > 0) {
    return JSON.stringify({
      intent: "error-recovery",
      reasoning: `${failedBlocks.length} block(s) failed. Need to decide how to proceed.`,
      nextBlockId: failedBlocks[0]?.id || null,
      userDecision: "How would you like to handle the failure? Retry, skip, or abort?",
      confidence: 1.0,
      suggestedAction: `Retry or skip ${failedBlocks[0]?.label || "failed block"}`,
    });
  }

  if (pendingBlocks.length > 0) {
    const next = pendingBlocks[0];
    if (next.type === "approval") {
      return JSON.stringify({
        intent: "review",
        reasoning: "Next step requires human approval before proceeding.",
        nextBlockId: next.id,
        userDecision: `Review and approve: ${next.label}`,
        confidence: 0.95,
        suggestedAction: "Present approval dialog for human review",
      });
    }
    return JSON.stringify({
      intent: "execute",
      reasoning: `Ready to execute: ${next.label}. No blockers detected.`,
      nextBlockId: next.id,
      userDecision: null,
      confidence: 0.85,
      suggestedAction: `Execute ${next.label} block`,
    });
  }

  if (completedBlocks.length > 0) {
    return JSON.stringify({
      intent: "review",
      reasoning: "All blocks completed. Review final results.",
      nextBlockId: null,
      userDecision: "Workflow complete. Review results and decide next steps.",
      confidence: 1.0,
      suggestedAction: "Show final results summary",
    });
  }

  return JSON.stringify({
    intent: "execute",
    reasoning: "No blocks executed yet. Ready to start.",
    nextBlockId: state.blocks[0]?.id || null,
    userDecision: null,
    confidence: 0.7,
    suggestedAction: "Start workflow execution",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: IntentRequest = await request.json();

    let aiResponse: string;
    let usedFallback = false;

    try {
      const prompt = buildIntentPrompt(body.workflowState, body.mode);
      aiResponse = await callOllama(prompt);
    } catch {
      usedFallback = true;
      if (body.mode === "infer-next") {
        aiResponse = fallbackInferIntent(body.workflowState);
      } else {
        aiResponse = JSON.stringify({
          content: `AI service is offline. Based on the workflow state, here's what I can determine:\n\n` +
            `Completed: ${body.workflowState.blocks.filter(b => b.status === "completed").length} blocks\n` +
            `Pending: ${body.workflowState.blocks.filter(b => b.status === "idle").length} blocks\n` +
            `Failed: ${body.workflowState.blocks.filter(b => b.status === "error").length} blocks\n\n` +
            `To get AI-powered analysis, start Ollama with: ollama serve`,
          source: "fallback",
        });
      }
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      parsed = { content: aiResponse, source: usedFallback ? "fallback" : "ollama" };
    }

    return NextResponse.json({
      success: true,
      data: parsed,
      source: usedFallback ? "fallback" : "ollama",
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        source: "error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: "connected",
        models: data.models?.map((m: { name: string }) => m.name) || [],
        url: OLLAMA_URL,
      });
    }
    return NextResponse.json({ status: "error", message: "Ollama not responding" });
  } catch {
    return NextResponse.json({
      status: "offline",
      message: "Ollama not available. Using fallback inference.",
      url: OLLAMA_URL
    });
  }
}
