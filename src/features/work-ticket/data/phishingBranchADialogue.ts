import type { DialogueEntry } from '../types'

export const phishingBranchADialogue: DialogueEntry[] = [
  {
    id: 1,
    speaker: 'user',
    message: "I got a weird email. Is it safe?",
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message:
      "Since the user did NOT click the link, no admin work is needed. There's nothing to remediate.",
  },
  {
    id: 3,
    speaker: 'mentor',
    message:
      "Have the user right-click the email, choose Report, then Report Phishing. This will report it to Microsoft's security team for analysis.",
  },
  {
    id: 4,
    speaker: 'mentor',
    important: true,
    message:
      "Tell the user:\n• Don't forward suspicious emails to SOS\n• Use the Report button in Outlook instead\n• The Security Team reviews reported emails",
  },
  {
    id: 5,
    speaker: 'mentor',
    message:
      "Since no action was taken on the email (no click, no credentials entered, no downloads), the account and workstation are not at risk.",
  },
  {
    id: 6,
    speaker: 'mentor',
    important: true,
    message:
      "Document the interaction:\n• User reported suspicious email, did not click\n• Guided user to use Report Phishing feature\n• No account compromise indicators\n• No remediation needed",
  },
  {
    id: 7,
    speaker: 'mentor',
    important: true,
    message:
      "Success!\nThis scenario is based on real ticket #482025.",
  },
]
