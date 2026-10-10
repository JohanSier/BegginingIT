import type { DialogueEntry } from '../types'

export const phishingBranchCDialogue: DialogueEntry[] = [
  {
    id: 1,
    speaker: 'user',
    message: "Hello SOS, I think I clicked on a bad link in an email. I closed it before it loaded.",
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message:
      "Even if the page didn't load, check the account thoroughly for compromise indicators.",
  },
  {
    id: 3,
    speaker: 'mentor',
    message:
      "Check for mailbox compromise:\n• Review the user's mail rules\n• Look for rules the user doesn't recognize",
  },
  {
    id: 4,
    speaker: 'user',
    message: "Wait, I see a rule I don't remember setting up. It's forwarding emails to an external address.",
  },
  {
    id: 5,
    speaker: 'mentor',
    important: true,
    message:
      "An unrecognized mail rule is an indicator of compromise. This is not precautionary - this is a confirmed breach.",
  },
  {
    id: 6,
    speaker: 'mentor',
    message:
      "Document this finding immediately:\n• Unrecognized mail rule found forwarding to external address\n• Rule deleted\n• This is a confirmed compromise indicator",
  },
  {
    id: 7,
    speaker: 'mentor',
    important: true,
    message:
      "Escalate immediately. This is not a Tier 1 case anymore.",
  },
  {
    id: 8,
    speaker: 'mentor',
    message:
      "Secure the account:\n• Sign user out of all sessions\n• Reset password\n• Disable the compromised mail rule \n• Install and run Malwarebytes. (You'll always see 3 files that are recognized as malware but they are safe, do not quarantine those) If you see more than 3, ping a T2 for review.",
  },
  {
    id: 9,
    speaker: 'mentor',
    important: true,
    message:
      "Follow escalation SOP:\n• Set ticket to OPEN\n• Assign to Tier 2\n• Document the compromise indicator clearly\n• Tell user you've escalated for security investigation",
  },
  {
    id: 10,
    speaker: 'mentor',
    message:
      "This scenario shows why thorough checking is critical. Even if the user says \"nothing happened,\" verify it yourself.",
  },
  {
    id: 11,
    speaker: 'mentor',
    important: true,
    message:
      "Success!\nThis scenario is based on real ticket #523305.",
  },
]
