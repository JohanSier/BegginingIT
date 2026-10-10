import type { DialogueEntry } from '../types'

export const phishingMainDialogue: DialogueEntry[] = [
  {
    id: 1,
    speaker: 'user',
    message: "Hello SOS, I think I clicked on a bad link in an email. I closed the page before it loaded and I already hit Report on the email. Should I be worried?",
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message:
      "Don't call yet. With so little information, work out the issue with the 5 W's of Troubleshooting.\n\n• Who = our user, who got the email and clicked.\n• What = a suspected phishing link was clicked, and the page was closed before it loaded.\n• Where = the user's Microsoft 365 account, mailbox, and workstation.\n• When = the click happened recently. Ask exactly when.\n• Why = this is a security question, so we need hypotheses to test.",
  },
  {
    id: 3,
    speaker: 'mentor',
    message:
      "Possible scenarios to rule in or out:\n\n1. The page never loaded, and nothing was entered or downloaded.\n2. The user entered credentials on a fake page.\n3. Something was downloaded to the workstation (malware).\n4. The account was already compromised, for example through mailbox rules or messages sent from it.",
  },
  {
    id: 4,
    speaker: 'mentor',
    important: true,
    message:
      "Before testing anything, check these in order:\n\n1. Zendesk. Search for similar tickets. Other users may have received the same email.\n2. IT Glue.\n3. Nerd Herd on Teams and Zoom chat. Type keywords like \"phishing\" or the email subject.\n\nHiggy feedback is helpful, but it can be wrong. In this real ticket, Higgy told the user they did the right thing, not to click again, and to wait for the security review. The agent rated that 3/5 as incomplete, because it missed the account and endpoint checks that were actually needed.",
  },
  {
    id: 5,
    speaker: 'mentor',
    important: true,
    message:
      "When you call the user, Caller Verify them first. Don't touch their account or remote into their computer before that. If they mention the word of the day, share it with them.",
  },
  {
    id: 6,
    speaker: 'user',
    message: "I clicked it, but the page closed before it loaded. I didn't type anything or download anything. The email is already reported.",
  },
  {
    id: 7,
    speaker: 'mentor',
    important: true,
    message:
      "The user's answers support the \"page never loaded\" scenario, but they don't prove it. A click on a suspicious link is enough to justify checking the account and the computer. Don't close the ticket just because the email was reported.\n\nAsk these before you remote in:\n\n• Did you enter a password or any information on the page?\n• Did anything download or open?\n• Did you use the Report tab to report the email? (This user did.)",
  },
  {
    id: 8,
    speaker: 'mentor',
    important: true,
    message:
      "Key insight: Now test the hypotheses in order. Each step needs admin access.\n\n1. Secure the account.\n• In Microsoft Admin, sign the user out of all active sessions.\n• In Entra Admin, reset the password.\n\n2. Check for mailbox compromise.\n• Review the user's mail rules. Look for rules the user doesn't recognize.\n• Check the Sent and Deleted folders for messages the user didn't send or delete.\n\n3. Scan the workstation.\n• Start a remote session.\n• Install and run Malwarebytes.",
  },
  {
    id: 9,
    speaker: 'user',
    message: "Okay, it's running. Should I be doing anything else?",
  },
  {
    id: 10,
    speaker: 'mentor',
    message:
      "Walk them through setting the new password. They'll need to sign back in everywhere, since you signed them out of all sessions. Stay on the call while the scan finishes.",
  },
  {
    id: 11,
    speaker: 'user',
    message: "It says the scan finished.",
  },
  {
    id: 12,
    speaker: 'mentor',
    message:
      "The scan came back clean, no malware found. The mail rules were clean, and Sent and Deleted showed nothing suspicious. The account is secured and the endpoint is clear.\n\nConfirm the email was reported (it was). Tell the user:\n\n• Don't click the link again.\n• The Security Team reviews reported emails.\n• Next time, use the Report button. Don't forward suspicious emails to SOS.",
  },
  {
    id: 13,
    speaker: 'mentor',
    important: true,
    message:
      "Root cause: there wasn't a confirmed compromise. This was a precautionary remediation after a suspected phishing click. Verify full functionality by confirming the user can sign in with the new password and reach their email.",
  },
  {
    id: 14,
    speaker: 'mentor',
    important: true,
    message:
      "Document the findings, the actions taken and the outcomes. Screenshots are highly encouraged, such as the clean Malwarebytes result. Following the Ticket Notes SOP, a note could read:\n\n• Caller verified, word of the day shared\n• Confirmed user clicked link, page closed before loading, no credentials entered\n• Signed user out of all sessions in Microsoft Admin\n• Reset password in Entra Admin\n• Reviewed mail rules, Sent and Deleted folders\n• No suspicious activity found\n\n• Ran Malwarebytes\n• Scan clean\n\nConclusion: No indicators of compromise found. Account secured as a precaution.",
  },
  {
    id: 15,
    speaker: 'mentor',
    important: true,
    message:
      "Success!\nThis ticket is real, and you can check it in Zendesk: #531638.",
  },
]
