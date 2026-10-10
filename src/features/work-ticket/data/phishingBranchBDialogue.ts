import type { DialogueEntry } from '../types'

export const phishingBranchBDialogue: DialogueEntry[] = [
  {
    id: 1,
    speaker: 'user',
    message: "Hello SOS, I think I clicked on a bad link in an email. I entered my password on the page before I realized it might be fake.",
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message:
      "This is a confirmed credential exposure. Immediate action is required.",
  },
  {
    id: 3,
    speaker: 'mentor',
    message:
      "Follow the same remediation steps as the main scenario, but escalate immediately.",
  },
  {
    id: 4,
    speaker: 'mentor',
    important: true,
    message:
      "Secure the account:\n• In Microsoft Admin, sign the user out of all active sessions immediately\n• In Entra Admin, reset the password\n• Check for mailbox compromise - review mail rules, Sent and Deleted folders",
  },
  {
    id: 5,
    speaker: 'mentor',
    important: true,
    message:
      "Escalate to Tier II. In real ticket #549828, Tier II temporarily blocked the user's O365 login and disabled legacy mail access.",
  },
  {
    id: 6,
    speaker: 'mentor',
    message:
      "The message was a credential-phishing attempt flagged in Material Security.",
  },
  {
    id: 7,
    speaker: 'mentor',
    important: true,
    message:
      "Follow the escalation SOP:\n• Tell the user you've escalated\n• Set the ticket to OPEN\n• Assign it to the Tier 2 tech or queue\n• Do this even if you've done no work yet",
  },
  {
    id: 8,
    speaker: 'mentor',
    message:
      "Document everything:\n• User confirmed they entered credentials on suspicious page\n• Immediately signed user out of all sessions\n• Reset password in Entra Admin\n• Escalated to Tier II for further investigation\n• Ticket assigned to Tier 2 queue",
  },
  {
    id: 9,
    speaker: 'mentor',
    important: true,
    message:
      "Success!\nThis scenario is based on real ticket #549828.",
  },
]
