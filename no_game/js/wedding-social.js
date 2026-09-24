import { mountRSVP } from './rsvp.js';
import { mountGuestbook } from './guestbook.js';
const root = document.getElementById('optional-content');
if (root) { mountRSVP(root); mountGuestbook(root); }
