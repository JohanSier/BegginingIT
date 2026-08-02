import { Dialogue } from '../types/dialogue';

export const sampleConversation: Dialogue[] = [
  {
    id: 1,
    speaker: 'user',
    important: false,
    message: 'Hello SOS my trackpad stopped working'
  },
  {
    id: 2,
    speaker: 'mentor',
    important: true,
    message: 'Before calling the user, since there is little information try to identify the issue with the 5 W\'s of Troubleshooting (Who, What, Where, When, and Why).'
  },
  {
    id: 3,
    speaker: 'mentor',
    important: false,
    message: 'A possible cause of the issue might be 1. The trackpad key shortcut was toggled off 2. Trackpad driver crashed 3. Hardware Issue, trackpad might be damaged 4. External mouse or Bluetooth device is generating conflict with our trackpad'
  },
  {
    id: 4,
    speaker: 'mentor',
    important: false,
    message: 'Before testing your hypotheses, is always crucial 1st: Check in Zendesk if there\'s a ticket with the same issue, Higgy feedback is crucial, but sometimes it won\'t be right'
  },
  {
    id: 5,
    speaker: 'mentor',
    important: false,
    message: '2nd: Check IT Glue and 3rd: Type the keywords of your ticket, in this case, "Trackpad" in the Nerd Herd Teams and Zoom chat, you might find useful information on those groups'
  },
  {
    id: 6,
    speaker: 'user',
    important: false,
    message: 'I\'m using a external mouse with a usb receiver and it works totally fine'
  },
  {
    id: 7,
    speaker: 'mentor',
    important: false,
    message: 'You called the user and got extra information, then don\'t forget to caller verify user and if they mention the word of the day, share it with them'
  },
  {
    id: 8,
    speaker: 'mentor',
    important: false,
    message: 'Now is time to test your hypotheses, so you go to settings and see that the trackpad function is not toggled off is on. Had the user restart the computer, but trackpad still doesn\'t work. Finally chechekd for Dell Updates and there was one for the trackpad'
  },
  {
    id: 9,
    speaker: 'mentor',
    important: false,
    message: 'Now establish a plan of action to resolve the problem and implement the solution. Install the Dell Updates and check if problem gets resolved!'
  },
  {
    id: 10,
    speaker: 'user',
    important: false,
    message: 'Is working now! Thank you so much SOS'
  },
  {
    id: 11,
    speaker: 'mentor',
    important: false,
    message: 'You found the root cause! We needed to update trackpad driver, now verify full system functionality and, if applicable, implement preventative measures.'
  },
  {
    id: 12,
    speaker: 'mentor',
    important: false,
    message: 'Finally, Document the findings, the actions taken and the outcomes to those (Screenshots are highly encouraged).'
  },
  {
    id: 13,
    speaker: 'mentor',
    important: false,
    message: 'Success! This ticket was real and you can check it on Zendesk: #534256'
  }
];