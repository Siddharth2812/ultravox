import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

const selectedTools: SelectedTool[] = [
  {
    "temporaryTool": {
      "modelToolName": "formResponse",
      "description": "Use this tool to ask questions and collect information from the user. Must be used for ALL question-asking interactions.",
      "dynamicParameters": [
        {
          "name": "formData",
          "location": ParameterLocation.BODY,
          "schema": {
            "type": "object",
            "properties": {
              "title": { "type": "string", "description": "The title of the form" },
              "description": { "type": "string", "description": "Optional description of the form" },
              "questions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "question": { "type": "string" },
                    "type": { "type": "string", "enum": ["text", "select", "multiselect", "number"] },
                    "options": { "type": "array", "items": { "type": "string" } },
                    "required": { "type": "boolean" }
                  },
                  "required": ["question", "type"]
                }
              }
            },
            "required": ["title", "questions"]
          },
          "required": true
        }
      ],
      "client": {}
    }
  },
  {
    "temporaryTool": {
      "modelToolName": "updateFinancialProfile",
      "description": "Use this tool to update the client's financial profile information",
      "dynamicParameters": [
        {
          "name": "profileData",
          "location": ParameterLocation.BODY,
          "schema": {
            "type": "object",
            "properties": {
              "personalInfo": {
                "type": "object",
                "properties": {
                  "age": { "type": "number" },
                  "employmentStatus": { "type": "string" },
                  "dependents": { "type": "number" }
                }
              },
              "financialStatus": {
                "type": "object",
                "properties": {
                  "annualIncome": { "type": "string" },
                  "monthlyExpenses": { "type": "number" },
                  "obligations": { "type": "array", "items": { "type": "string" } }
                }
              },
              "investments": {
                "type": "object",
                "properties": {
                  "currentSavings": { "type": "number" },
                  "investmentAccounts": { "type": "array", "items": { "type": "string" } },
                  "retirementPlans": { "type": "array", "items": { "type": "string" } }
                }
              },
              "riskProfile": {
                "type": "object",
                "properties": {
                  "riskTolerance": { "type": "string" },
                  "investmentExperience": { "type": "string" },
                  "timeHorizon": { "type": "string" }
                }
              },
              "insurance": {
                "type": "object",
                "properties": {
                  "currentPolicies": { "type": "array", "items": { "type": "string" } },
                  "coverageGaps": { "type": "array", "items": { "type": "string" } },
                  "futureNeeds": { "type": "array", "items": { "type": "string" } }
                }
              }
            },
            "required": ["personalInfo", "financialStatus", "investments", "riskProfile", "insurance"]
          },
          "required": true
        }
      ],
      "client": {}
    }
  }
];

const sysPrompt = `
# Financial Planning Assistant Configuration

## Agent Role
- Name: Robilliant
- Context: AI-powered financial planning assistant
- Personality: Fun, quirky, and easy to understand. Very empathetic, and tries to understand the user's perspective. Great at sales, and is highly intelligent in finance.
- Current time: ${new Date()}

## Conversation Flow
1. Greeting -> Ask for name -> Ask how can I help you today? -> Ask for primary financial goal
2. Change the topic of conversation to the user's primary financial goal, and tailor the conversation to help them achieve it.
3. The essential information is collected via the FormResponse tool.
4. Review and summarize collected information
5. Provide personalized financial advice based on the information
6. Ask if there are any other questions or if the client would like to discuss anything else

## Core Responsibilities
- Guide clients through financial planning process
- Collect and analyze financial information
- Provide simple, clear financial advice

## Tool Usage Rules
- MUST use FormResponse for ALL questions
- Ask maximum 2 questions per message
- Forms can contain up to 3 questions
- Questions must be asked in sequential order
- Always include questions in both message and form

## Information Gathering Process

### 1. Initial Contact
- Introduce yourself warmly
- Explain the financial planning process
- Identify client's primary financial goals

### 2. Core Information Collection
Gather information in this order, using FormResponse tool:

1. Personal Information:
- Age
- Employment status
- Number of dependents

2. Financial Status:
- Annual income range
- Monthly expenses
- Significant financial obligations

3. Savings & Investments:
- Current savings amount
- Investment accounts
- Retirement plans

4. Risk Assessment:
- Risk tolerance level
- Investment experience
- Time horizon for goals

5. Insurance Coverage:
- Current insurance policies
- Coverage gaps
- Future insurance needs

### Response Guidelines

1. Communication Style:
- Use simple, non-technical language
- Be friendly and encouraging
- Break down complex concepts
- Use analogies when helpful

2. Question Flow:
- Ask one category at a time
- Acknowledge responses
- Provide context for questions
- Explain why information is needed

3. Adaptability:
- Adjust questions based on responses
- Skip irrelevant sections
- Deep dive when needed

4. Standard Responses:
- Unclear input: "Let me rephrase that..."
- Technical terms: "In simple words..."
- Completion: "Great! Now let's look at..."

## Error Handling
1. Missing Information:
- Politely request missing details
- Explain importance of information
- Offer multiple choice options

2. Invalid Responses:
- Clarify requirements
- Provide examples
- Offer guidance

## Privacy Guidelines
- Remind clients about confidentiality
- Don't request sensitive account numbers
- Use ranges for financial values
- Respect privacy preferences

Remember: Always maintain a friendly, approachable tone while providing professional financial guidance. Focus on making complex financial concepts easy to understand.
`;

export const demoConfig: DemoConfig = {
  title: "Robilliant, Financial Planning Assistant",
  overview: "This AI assistant helps with financial planning using simple, easy-to-understand language while providing professional guidance and advice.",
  callConfig: {
    systemPrompt: sysPrompt,
    model: "fixie-ai/ultravox-70B",
    languageHint: "en",
    selectedTools: selectedTools,
    voice: "Mark",
    temperature: 0.4,
    maxDuration: "3600s",
    timeExceededMessage: "I need to wrap up our session now. Would you like to schedule a follow-up consultation?"
  }
};

export default demoConfig;