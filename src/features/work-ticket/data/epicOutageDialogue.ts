import type { DialogueEntry } from '../types'

export const epicOutageDialogue: DialogueEntry[] = [
  {
    id: 1,
    speaker: 'user',
    message: "Hello SOS, Epic is not working. Me and a few teammates in the Houston office can't get in.",
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message:
      "Before calling, run the 5 W's of troubleshooting.\n• Who = the user and several teammates.\n• What = they can't access Epic.\n• Where = the whole Houston office, not one laptop.\n• When = right now. Ask when it first started.\n• Why = test two hypotheses: a local cause (network, credentials, workstation) or an application-side cause (Epic or the vendor).",
  },
  {
    id: 3,
    speaker: 'mentor',
    message:
      "Notice \"me and a few teammates.\" Several people with the same symptom is the first signal this may not be a normal ticket. Don't start workstation troubleshooting yet.",
  },
  {
    id: 4,
    speaker: 'mentor',
    important: true,
    message:
      "Before testing anything, check these in order:\n1. Zendesk: Look at Tier I queue, can you see more tickets related the same issue? You'll find other offices reporting the same app within minutes, such as #538330 (Macon) and #538372.\n2. Nerd Herd Zoom chat. See whether the team already knows.",
  },
  {
    id: 5,
    speaker: 'mentor',
    important: true,
    message:
      "If you see 10 or more tickets or users reporting the same issue, it is a PROBLEM TICKET.\nA single user's trackpad (#521251) is a normal ticket. Ten users losing Epic at the same time is a shared cause.",
  },
  {
    id: 6,
    speaker: 'mentor',
    message:
      "Count tickets and users. One ticket can cover a whole office, like \"me and my teammates,\" so a handful of tickets can represent 10+ affected people.",
  },
  {
    id: 7,
    speaker: 'mentor',
    important: true,
    message:
      "Once you reach 10+, do this:\n1. Communicate with the team (Nerd Herd on Zoom) so nobody troubleshoots the same outage alone.\n2. If there isn't a Problem Ticket already create one.\n3. Link every related ticket to it.\nThen the cause is handled once, and every linked ticket gets updated together.",
  },
  {
    id: 8,
    speaker: 'user',
    message: "How long will this take? I have clients waiting.",
  },
  {
    id: 9,
    speaker: 'mentor',
    message:
      "The SLA is a 1-hour response. Once you take the ticket, send an immediate email, then follow up with a call. In the ticket type make sure you put Incident and Link it to the Problem ticket that was created, maybe you have to create it the problem ticket instead, double check with team on Nerd Herd chat",
  },
  {
    id: 10,
    speaker: 'mentor',
    message:
      "Tell the user the truth: Higginbotham's Epic instance is unavailable, the Epic team is already engaged, and nothing on their computer needs fixing. Just wait for the Epic Team updates",
  },
  {
    id: 11,
    speaker: 'mentor',
    message:
      "Set the right status. The ticket is waiting on a third party (Applied Support), not on the user, so it is On Hold not Pending.",
  },
  {
    id: 12,
    speaker: 'user',
    message: "Epic is back. Thank you for checking this!",
  },
  {
    id: 13,
    speaker: 'mentor',
    message:
      "Whoever has the \"Problem ticket\" will send an email that will propagate to its incident tickets that are linked to it, saying that Epic is up and running again.",
  },
  {
    id: 14,
    speaker: 'mentor',
    message:
      "Document everything. For example:\n• Confirmed 10+ users reporting Epic not working across multiple offices\n• Notified the team in Nerd Herd\n• Created Problem Ticket and linked related tickets\n• Notified users that Applied restored service\nThen solved the linked tickets.",
  },
  {
    id: 15,
    speaker: 'mentor',
    important: true,
    message:
      "Success!\nThis ticket is real. Check it in Zendesk: #538382.",
  },
]
