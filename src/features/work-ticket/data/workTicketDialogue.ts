import type { DialogueEntry } from '../types'

export const workTicketDialogue: DialogueEntry[] = [
  {
    id: 1,
    speaker: 'user',
    message: "Hello SOS my Laptop's Trackpad stopped working",
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message:
      "Before calling the user, since there is little information\ntry to identify the issue with the 5 W's of Troubleshooting\n(Who, What, Where, When, and Why).",
  },
  {
    id: 3,
    speaker: 'mentor',
    message:
      "In this case Who = Our User, What = The laptop's built-in trackpad has stopped responding, Where = On the user's specific laptop hardware / OS environment.\n\nWhen = The issue is occurring right now (you might want to ask when was the first time it happened) and Why = Here we'll need to establish initial hypotheses to test",
  },
  {
    id: 4,
    speaker: 'mentor',
    message:
      'A possible cause of the issue might be\n1. The trackpad key shortcut was toggled off\n2. Trackpad driver crashed\n3. Hardware Issue, trackpad might be damaged\n4. External mouse or Bluetooth device is generating conflict with the trackpad',
  },
  {
    id: 5,
    speaker: 'mentor',
    important: true,
    message:
      "Before testing your hypotheses, is always crucial\n1st: Check in Zendesk if there's a ticket with the same issue, Higgy feedback is helpful, but sometimes it won't be right",
  },
  {
    id: 6,
    speaker: 'mentor',
    message:
      '2nd: Check IT Glue and 3rd: Type the keywords of your ticket, in this case, "Trackpad" in Nerd Herd Teams and Zoom chat, you might find useful information on those groups',
  },
  {
    id: 7,
    speaker: 'user',
    message: "I'm using a external mouse with a usb receiver and it works totally fine, the trackpad is the only thing that's not working",
  },
  {
    id: 8,
    speaker: 'mentor',
    important: true,
    message:
      "You called the user and got extra information, then don't forget to Caller Verify the user, before remoting into their computer. Also, if they mention the word of the day, share it with them",
  },
  {
    id: 9,
    speaker: 'mentor',
    important: true,
    message:
      "Now is time to test your hypotheses, so you go to settings and see that the trackpad function is not toggled off is on. You had the user restart the computer, but trackpad still doesn't work. Finally checked for Dell Updates and there was one for the trackpad",
  },
  {
    id: 10,
    speaker: 'mentor',
    message:
      'Now establish a plan of action to resolve the problem and implement the solution. Install the Dell Updates and check if problem gets resolved!',
  },
  {
    id: 11,
    speaker: 'user',
    message: 'Is working now! Thank you so much SOS',
  },
  {
    id: 12,
    speaker: 'mentor',
    important: true,
    message:
      "You found the root cause! We needed to update trackpad's driver, now verify full system functionality and, if applicable, implement preventative measures.",
  },
  {
    id: 13,
    speaker: 'mentor',
    message:
      'Finally, Document the findings, the actions taken and the outcomes to those (Screenshots are highly encouraged).',
  },
  {
    id: 14,
    speaker: 'mentor',
    important: true,
    message:
      'Success! This ticket was real and you can check it on Zendesk: #521251',
  },
]