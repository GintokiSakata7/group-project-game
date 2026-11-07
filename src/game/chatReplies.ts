import type { ChatMessage } from './types';

export interface ChatReply {
  senderId: string;
  senderName: string;
  text: string;
  kind?: 'normal' | 'funny' | 'client' | 'system';
  effectDeltas?: {
    clientTrust?: number;
    morale?: number;
    scopeCreep?: number;
    technicalDebt?: number;
    employeeMorale?: Record<string, number>;
    founderTrust?: Record<string, number>;
  };
}

let nikhilCounter = 0;
let meeraCounter = 0;
let buntyCounter = 0;
let aaravCounter = 0;
let varunCounter = 0;
let kunalCounter = 0;
let prakashCounter = 0;
let generalCounter = 0;

const lastSentBySender: Record<string, string> = {};

function pickNext(senderId: string, options: string[], counter: number): { text: string; nextCounter: number } {
  let idx = Math.abs(counter) % options.length;
  let text = options[idx];
  if (text === lastSentBySender[senderId] && options.length > 1) {
    idx = (idx + 1) % options.length;
    text = options[idx];
  }
  lastSentBySender[senderId] = text;
  return { text, nextCounter: idx + 1 };
}

export function isGibberishOrShort(text: string): boolean {
  const clean = text.trim();
  if (clean.length <= 4) {
    if (/^(no|yes|hi|ok|k|yo|sup|why|how|bye|sure|nah|nope)$/i.test(clean)) return false;
    return true;
  }
  const lettersOnly = clean.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length >= 3 && !/[aeiouy]/i.test(lettersOnly)) {
    return true;
  }
  if (/^[^a-zA-Z0-9]+$/.test(clean)) {
    return true;
  }
  return false;
}

export function generateChatReplies(
  channelId: string,
  channelType: 'group' | 'direct' | 'client',
  text: string,
  day: number
): ChatReply[] {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // -------------------------------------------------------------
  // 1. CLIENT CHANNEL (Mr. Prakash)
  // -------------------------------------------------------------
  if (channelType === 'client' || channelId === 'prakash') {
    if (/(no|cannot|can't|cant|impossible|extra|charge|scope|not included|not possible|never|refuse|denied|nah)/i.test(lower)) {
      const replies = [
        'Founder beta, don\'t say no so quickly! We are like family now. In business, adjustments are part of the journey. What can we do without extra charges?',
        'Bunty told me software is just copy-paste from ChatGPT. Why extra money for 2 more pages? Think about our long-term partnership!',
        'Hmm. Let me discuss with Bunty. He says it should be possible with a WordPress plugin. But please maintain high quality.',
        'In 1994, when I started Royal Feast, we never said "not possible" to a customer. That is how reputation is built beta!',
        'Okay, okay, calm down. Let\'s find a middle ground. Can we at least do 1 page instead of 3 without blowing the budget?',
      ];
      const pick = pickNext('prakash', replies, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
          effectDeltas: { clientTrust: -2 },
        },
      ];
    } else if (/(yes|sure|done|can do|ready|included|welcome|no problem|agree|approved)/i.test(lower)) {
      const replies = [
        'Very good! Shabash! I knew you were the right team. If you do this well, my brother\'s daughter\'s wedding in December also needs an app!',
        'Excellent! True leadership! I will tell my entire Lions Club about your software agency!',
        'Wonderful! I am telling Mrs. Prakash that the website will be the most grand in all of Mumbai!',
      ];
      const pick = pickNext('prakash', replies, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
          effectDeltas: { clientTrust: 3, scopeCreep: 3 },
        },
      ];
    } else if (/(whatsapp|samosa|biryani|catering|food|order|menu|test|package)/i.test(lower)) {
      const replies = [
        'Yes! The most important thing is when a customer clicks "Book 500 plates Biryani", my phone must ring on WhatsApp immediately. Test that 10 times!',
        'Food pictures must look royal! When someone sees the Galouti Kebab, their mouth must water right through the mobile screen!',
        'Make sure the guest count calculator handles up to 2,500 people. Big fat Indian weddings are our bread and butter!',
      ];
      const pick = pickNext('prakash', replies, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
          effectDeltas: { clientTrust: 2 },
        },
      ];
    } else if (/(money|advance|cheque|payment|invoice|paid|cost|price|budget|fee|rupee)/i.test(lower)) {
      const replies = [
        'Payment will come on Day 7 after full demo! I am an honest businessman of 35 years in Dadar. Deliver quality, and Prakash will never delay your cheque.',
        'Don\'t worry about payment. A Prakash cheque never bounces! Just make sure Bunty doesn\'t find 10 bugs on demo day.',
      ];
      const pick = pickNext('prakash', replies, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
        },
      ];
    } else if (/(preview|link|website|staging|look|see|demo|screen)/i.test(lower)) {
      const replies = [
        'I opened the link on my Samsung tablet. Looks nice, but can you make the gold colour more shiny? Like 24-karat gold!',
        'I clicked on the photo of the dum biryani. It looks crispy, but the enquiry button gave a weird warning. Please check!',
      ];
      const pick = pickNext('prakash', replies, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
          effectDeltas: { clientTrust: 2 },
        },
      ];
    } else if (/(bunty|nephew)/i.test(lower)) {
      const replies = [
        'Bunty is young blood, full of new ideas! Sometimes too much ideas, but his heart is in the right place. Guide him like an elder brother.',
        'Bunty has a computer degree from YouTube University. Listen to him politely, then do what is practical!',
      ];
      const pick = pickNext('prakash', replies, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
        },
      ];
    } else if (isGibberishOrShort(clean)) {
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: 'Beta, my spectacles are in the car. What did you write? Please send clear message or audio note.',
          kind: 'client',
        },
      ];
    } else {
      const fallbacks = [
        'Understood. Please keep me updated. Also, my wife says can the catering logo be a little bigger?',
        'Noted beta. Work hard today! Remember, a wedding website brings blessings from the families.',
        'Sounds good. Bunty is monitoring the progress. Deliver on Day 7 and we have a celebration feast!',
      ];
      const pick = pickNext('prakash', fallbacks, prakashCounter++);
      prakashCounter = pick.nextCounter;
      return [
        {
          senderId: 'prakash',
          senderName: 'Mr. Prakash',
          text: pick.text,
          kind: 'client',
        },
      ];
    }
  }

  // -------------------------------------------------------------
  // 2. DIRECT MESSAGES
  // -------------------------------------------------------------
  if (channelType === 'direct') {
    // A) BUNTY
    if (channelId === 'bunty') {
      if (/(no|reject|cancel|cannot|can't|cant|impossible|not possible|never|stop|don't|dont|not happening|is not possible|nah|nope|denied)/i.test(lower)) {
        const buntyRejections = [
          'Wait, hear me out founder: what if instead of full blockchain, we just add a ticker that shows fake crypto prices? My cousin says it increases engagement by 400%!',
          'Are you sure? Elon Musk tweeted about Web3 yesterday. If Royal Feast doesn\'t have Web3, the wedding guests will think Uncle Prakash is in the stone age.',
          'Okay fine, no blockchain... BUT can we at least have a 3D rotating Biryani pot that plays dubstep when clicked?',
          'Bro, you are thinking Web2. We need to think Web4. A decentralized samosa validator node costs almost nothing to host!',
          'What do you mean "impossible"? My senior in college said anything is possible if you just install the right Python package!',
          'You are rejecting a billion-dollar pivot, founder. First Steve Jobs was rejected, now Bunty is rejected. History will vindicate me.',
          'Okay, no Web3. What if we add an AI hologram of Uncle Prakash welcoming guests at 60 FPS in WebGL?',
          'I have noted your objection. However, my cousin\'s friend raised $2M on an AI samosa slide deck. We should rethink.',
        ];
        const pick = pickNext('bunty', buntyRejections, buntyCounter++);
        buntyCounter = pick.nextCounter;
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: pick.text,
            kind: 'funny',
          },
        ];
      } else if (/(yes|ok|okay|sure|possible|fine|agree|do it|add it|approved|go ahead)/i.test(lower)) {
        const buntyAgrees = [
          'YES! Founder, this is why you are a visionary. I am already preparing the BiryaniCoin tokenomics whitepaper on Google Docs. 1 Billion $BIRYANI minted!',
          'I KNEW IT! True visionary leadership! I am tweeting to Vitalik Buterin right now that Royal Feast is going on-chain!',
          'Epic! I will create a Discord server for Royal Feast VIP token holders. Free rasgulla for diamond hands!',
        ];
        const pick = pickNext('bunty', buntyAgrees, buntyCounter++);
        buntyCounter = pick.nextCounter;
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: pick.text,
            kind: 'funny',
            effectDeltas: { scopeCreep: 6, technicalDebt: 4 },
          },
        ];
      } else if (/(cost|money|budget|price|expensive|pay|fee|rupee|cash|₹)/i.test(lower)) {
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: 'Budget? But founder, this will generate passive income! People can stake their samosas for 18% APY yield on Polygon network.',
            kind: 'funny',
          },
        ];
      } else if (/(who|role|why|nephew|uncle|prakash)/i.test(lower)) {
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: 'I am Bunty, Chief Innovation Officer and Uncle Prakash\'s favourite nephew. I got 94% in 10th standard computer applications, so I know how algorithms work.',
            kind: 'funny',
          },
        ];
      } else if (/(ai|bot|chatgpt|voice|amitabh)/i.test(lower)) {
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: 'Bro the AI voice bot is crucial! Imagine an AI Amitabh Bachchan saying "Ek plate mutton biryani lock kiya jaaye!" People will cry tears of joy.',
            kind: 'funny',
          },
        ];
      } else if (/(hi|hello|hey|sup|yo)/i.test(lower)) {
        const buntyHellos = [
          'Namaste founder! I was just watching a 3-hour YouTube documentary on decentralized samosa delivery. We need to pivot immediately.',
          'Yo founder! Just woke up at 2 PM. Ready to disrupt the catering industry with disruptive paradigms.',
        ];
        const pick = pickNext('bunty', buntyHellos, buntyCounter++);
        buntyCounter = pick.nextCounter;
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: pick.text,
            kind: 'funny',
          },
        ];
      } else if (isGibberishOrShort(clean)) {
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: 'Is that a secret cryptographic hash? A mnemonic seed phrase? Should I enter that into MetaMask right now?!',
            kind: 'funny',
          },
        ];
      } else {
        const fallbacks = [
          'I have discussed this with my cousin. He says we can add blockchain in the footer. It is very lightweight.',
          'My college senior built an entire metaverse in 48 hours with ChatGPT. Why is our catering website taking 7 days?',
          'Uncle Prakash is expecting a Silicon Valley quality app. I promised him we have automated AI biryani logistics.',
          'Can you add dark mode for the naan section? My Discord friends only order food in dark mode.',
          'I tested the website on my iPhone 16 Pro Max. The mutton curry photo took 1.2 seconds to load. We need edge caching.',
          'What if customers can mint their wedding catering receipt as a commemorative soulbound NFT?',
          'Did you see the new viral reel about AI catering robots? I forwarded it to Uncle Prakash with high priority.',
        ];
        const pick = pickNext('bunty', fallbacks, buntyCounter++);
        buntyCounter = pick.nextCounter;
        return [
          {
            senderId: 'bunty',
            senderName: 'Bunty (uninvited)',
            text: pick.text,
            kind: 'funny',
          },
        ];
      }
    }

    // B) NIKHIL
    if (channelId === 'nikhil') {
      if (/(hi|hello|hey|ping|online|u there|are you there|status|where)/i.test(lower)) {
        const replies = [
          'station. network patchy. hotspot dropping. ping me in 10.',
          'seen',
          'running migrations on 2G. don\'t touch prod.',
          'online for 3 minutes before boarding train. what\'s broken?',
          'in transit. laptop battery at 14%. push your branch.',
          'seen 12 mins ago. writing sql queries on mobile notepad.',
        ];
        const pick = pickNext('nikhil', replies, nikhilCounter++);
        nikhilCounter = pick.nextCounter;
        return [{ senderId: 'nikhil', senderName: 'Nikhil', text: pick.text }];
      } else if (/(backend|api|endpoint|db|database|postgres|sql|prisma|seed|table)/i.test(lower)) {
        const replies = [
          'endpoints deployed on localhost. writing seed script. don\'t ask about unit tests.',
          'api returns 200 for now. mock data inside. looks fast, right?',
          'added 1 table: `users_final_v2_really_final`. should scale to 10M requests maybe.',
          'wrote raw sql query with 8 joins. runs in 4 milliseconds. nobody touch it.',
        ];
        const pick = pickNext('nikhil', replies, nikhilCounter++);
        nikhilCounter = pick.nextCounter;
        return [{ senderId: 'nikhil', senderName: 'Nikhil', text: pick.text }];
      } else if (/(bug|broken|error|crash|fail|500|404|cors)/i.test(lower)) {
        const replies = [
          'that was Aarav\'s port mapping. fixed. restart your container.',
          'CORS header was set to *. That fixes the error and destroys security. Pick one.',
          '500 error resolved. Someone passed null to a non-nullable varchar. Aarav was here.',
        ];
        const pick = pickNext('nikhil', replies, nikhilCounter++);
        nikhilCounter = pick.nextCounter;
        return [{ senderId: 'nikhil', senderName: 'Nikhil', text: pick.text }];
      } else if (/(deadline|hurry|urgent|fast|when|eta|time)/i.test(lower)) {
        const replies = [
          'working on it. coffee count: 4. ETA: after midnight.',
          'don\'t rush me or I will push straight to production without migrations.',
        ];
        const pick = pickNext('nikhil', replies, nikhilCounter++);
        nikhilCounter = pick.nextCounter;
        return [{ senderId: 'nikhil', senderName: 'Nikhil', text: pick.text }];
      } else if (/(thanks|thank you|good job|nice|cool|great|awesome|legend)/i.test(lower)) {
        return [
          {
            senderId: 'nikhil',
            senderName: 'Nikhil',
            text: '👍',
            effectDeltas: { employeeMorale: { nikhil: 3 }, founderTrust: { nikhil: 3 } },
          },
        ];
      } else if (isGibberishOrShort(clean)) {
        const shortReplies = ['seen', '...', 'terminal output: syntax error. just like that message.', 'k'];
        const pick = pickNext('nikhil', shortReplies, nikhilCounter++);
        nikhilCounter = pick.nextCounter;
        return [{ senderId: 'nikhil', senderName: 'Nikhil', text: pick.text }];
      } else {
        const normalReplies = [
          'noted. pushing commit tonight.',
          'got it. will check after dinner.',
          'seen',
          'zip uploaded. check slack attachments.',
        ];
        const pick = pickNext('nikhil', normalReplies, nikhilCounter++);
        nikhilCounter = pick.nextCounter;
        return [{ senderId: 'nikhil', senderName: 'Nikhil', text: pick.text }];
      }
    }

    // C) MEERA
    if (channelId === 'meera') {
      if (/(priority|critical|blocker|p0|urgent)/i.test(lower)) {
        const replies = [
          'Agreed. Focusing all testing cycles on the primary checkout flow and WhatsApp CTA. The 1px border issue has been placed in emotional support.',
          'P0 defects isolated. If Aarav commits one more unreviewed file, I will revoke his git credentials.',
        ];
        const pick = pickNext('meera', replies, meeraCounter++);
        meeraCounter = pick.nextCounter;
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: pick.text,
            kind: 'normal',
            effectDeltas: { employeeMorale: { meera: 4 } },
          },
        ];
      } else if (/(done|fixed|ready|finished|shipped|resolved)/i.test(lower)) {
        const replies = [
          'Define "fixed". Did you write an automated regression test, or did you just refresh the browser and pray?',
          'I just verified your "fix". It works on Chrome desktop if you don\'t click the second tab. That is not fixed.',
        ];
        const pick = pickNext('meera', replies, meeraCounter++);
        meeraCounter = pick.nextCounter;
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: pick.text,
            kind: 'funny',
          },
        ];
      } else if (/(bug|defect|broken|error|fail|issue|crash|qa|test)/i.test(lower)) {
        const qaReplies = [
          'I have already reproduced it 7 times across Chrome, Firefox, Safari and an Android tablet running Android 10. Steps to reproduce are logged in Jira.',
          'Found 3 more critical defects while reading this message. Please tell Aarav to stop using `!important` on line 42.',
          'The button throws a TypeError on iOS Safari. Aarav claims this is a "spiritual placeholder". I have stopped the release candidate.',
          'I performed boundary testing on the guest count input. Entering -5 biryanis crashed the entire container.',
        ];
        const pick = pickNext('meera', qaReplies, meeraCounter++);
        meeraCounter = pick.nextCounter;
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: pick.text,
            kind: 'normal',
          },
        ];
      } else if (/(relax|calm|chill|minor|cosmetic|ignore|later|leave it)/i.test(lower)) {
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: 'A 1-pixel misalignment today is a 100-pixel disaster tomorrow. I do not do "relax". I do compliance.',
            kind: 'funny',
            effectDeltas: { employeeMorale: { meera: -2 } },
          },
        ];
      } else if (/(hi|hello|hey|morning|good morning)/i.test(lower)) {
        const replies = [
          'Hello founder. Release health is currently 64%. What would you like me to audit today?',
          'Good morning. I tested 14 forms before 9:00 AM. 6 of them passed. 8 need counseling.',
        ];
        const pick = pickNext('meera', replies, meeraCounter++);
        meeraCounter = pick.nextCounter;
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: pick.text,
            kind: 'normal',
          },
        ];
      } else if (isGibberishOrShort(clean)) {
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: 'I cannot parse that input. Is that a test payload for SQL injection? If so, sanitize your inputs.',
            kind: 'funny',
          },
        ];
      } else {
        const meeraFallbacks = [
          'Please attach the build link and acceptance criteria. I will test the actual behaviour, not the promises.',
          'Test report updated. 14 items verified, 3 items suspicious, 1 button currently in an existential crisis.',
          'I am monitoring the pull request queue. Please tell Aarav not to force push directly to main.',
          'Every commit without a test case is an invitation to production disaster.',
        ];
        const pick = pickNext('meera', meeraFallbacks, meeraCounter++);
        meeraCounter = pick.nextCounter;
        return [
          {
            senderId: 'meera',
            senderName: 'Meera (QA)',
            text: pick.text,
            kind: 'normal',
          },
        ];
      }
    }

    // D) AARAV
    if (channelId === 'aarav') {
      if (/(bug|broken|error|crash|fail|issue)/i.test(lower)) {
        const aaravBugs = [
          'Bro it works on my machine! I have 32GB RAM and M3 Max. Tell the client to upgrade their hardware.',
          'That’s not a bug, that’s an undocumented experimental micro-feature. Steve Jobs did this all the time bro.',
          'Clear cache and cookies bro. If that fails, restart your laptop. If that fails, it\'s Meera\'s fault.',
          'I wrapped the entire component in a try/catch with an empty catch block. Bug is officially eliminated bro.',
        ];
        const pick = pickNext('aarav', aaravBugs, aaravCounter++);
        aaravCounter = pick.nextCounter;
        return [{ senderId: 'aarav', senderName: 'Aarav', text: pick.text, kind: 'funny' }];
      } else if (/(css|style|design|color|font|animation|ugly|look|ui)/i.test(lower)) {
        return [
          {
            senderId: 'aarav',
            senderName: 'Aarav',
            text: 'Just added 4 blur filters, 12 glowing gradients, and smooth spring physics. The page looks like Cyberpunk 2077 now bro.',
            kind: 'funny',
          },
        ];
      } else if (/(fast|hurry|rush|deliver|quick|now|speed)/i.test(lower)) {
        return [
          {
            senderId: 'aarav',
            senderName: 'Aarav',
            text: 'I am typing at 120 WPM bro. Just pushed 8 commits directly to main. CI is crying but we are moving!',
            kind: 'funny',
          },
        ];
      } else if (/(package|npm|dep|dependency|install|lib)/i.test(lower)) {
        return [
          {
            senderId: 'aarav',
            senderName: 'Aarav',
            text: 'Only added 14 new npm libraries today. Total node_modules size is 1.4 GB. Lightweight bro.',
            kind: 'funny',
          },
        ];
      } else if (/(test|review|meera|qa)/i.test(lower)) {
        return [
          {
            senderId: 'aarav',
            senderName: 'Aarav',
            text: 'Meera rejected my PR because a button shadow was "too emotional". Bro, shadows have feelings too.',
            kind: 'funny',
          },
        ];
      } else if (/(hi|hello|hey|yo|sup)/i.test(lower)) {
        return [
          {
            senderId: 'aarav',
            senderName: 'Aarav',
            text: 'What\'s good founder! Frontend is moving at Mach 3. What vibe are we shipping today?',
            kind: 'funny',
          },
        ];
      } else if (isGibberishOrShort(clean)) {
        return [
          {
            senderId: 'aarav',
            senderName: 'Aarav',
            text: 'Bro fell asleep on the keyboard. Respect the hustle, get some Red Bull.',
            kind: 'funny',
          },
        ];
      } else {
        const aaravFallbacks = [
          'Got it bro. Pushing a fix. If the build breaks, it was already like that.',
          'I refactored the entire navbar in 4 minutes. No documentation, purely vibe-driven development.',
          'Currently debugging with console.log("here 1"), console.log("here 2"), console.log("why god why").',
          'Vibe check passed. Deploying to Vercel in 3, 2, 1...',
        ];
        const pick = pickNext('aarav', aaravFallbacks, aaravCounter++);
        aaravCounter = pick.nextCounter;
        return [{ senderId: 'aarav', senderName: 'Aarav', text: pick.text, kind: 'funny' }];
      }
    }

    // E) VARUN
    if (channelId === 'varun') {
      if (/(status|progress|update|how is|report)/i.test(lower)) {
        const varunStatus = [
          'I have prepared an updated 36-page architectural whitepaper outlining our microservices topology. Implementation phase will commence shortly.',
          'Current system readiness: 87.4% conceptually, 12.1% in executable machine code. The gap is purely philosophical.',
          'The state machine diagram has achieved geometric equilibrium. We may begin coding the contact form next week.',
        ];
        const pick = pickNext('varun', varunStatus, varunCounter++);
        varunCounter = pick.nextCounter;
        return [{ senderId: 'varun', senderName: 'Varun', text: pick.text, kind: 'normal' }];
      } else if (/(simple|monolith|fast|quick|no microservices|scale)/i.test(lower)) {
        return [
          {
            senderId: 'varun',
            senderName: 'Varun',
            text: 'A monolith?! In 2026?! What about horizontal multi-region scalability when Royal Feast expands to Dubai and Singapore?!',
            kind: 'funny',
            effectDeltas: { employeeMorale: { varun: -2 } },
          },
        ];
      } else if (/(code|demo|show|pr|github|commit|repo)/i.test(lower)) {
        return [
          {
            senderId: 'varun',
            senderName: 'Varun',
            text: 'The pull request is being structured with strict modularity. I will push once the git commit tree passes my aesthetic symmetry standards.',
            kind: 'normal',
          },
        ];
      } else if (/(hi|hello|hey|morning)/i.test(lower)) {
        return [
          {
            senderId: 'varun',
            senderName: 'Varun',
            text: 'Greetings founder. All architectural vectors are currently aligned within nominal tolerances.',
            kind: 'normal',
          },
        ];
      } else if (isGibberishOrShort(clean)) {
        return [
          {
            senderId: 'varun',
            senderName: 'Varun',
            text: 'That message has anomalous packet structure. I suspect network degradation in the founder\'s subnet.',
            kind: 'funny',
          },
        ];
      } else {
        const varunFallbacks = [
          'Acknowledged. I will update the technical documentation and provide a status.',
          'The architectural blueprint has been updated to revision v4.2. Awaiting peer review.',
          'System latency is currently nominal. Please do not introduce unbenchmarked dependencies.',
          'I have containerized our container orchestrator so it can orchestrate other containers.',
        ];
        const pick = pickNext('varun', varunFallbacks, varunCounter++);
        varunCounter = pick.nextCounter;
        return [{ senderId: 'varun', senderName: 'Varun', text: pick.text, kind: 'normal' }];
      }
    }

    // F) KUNAL
    if (channelId === 'kunal') {
      if (/(client|prakash|bunty|call|meeting|sync)/i.test(lower)) {
        return [
          {
            senderId: 'kunal',
            senderName: 'Kunal',
            text: 'I have already pre-emptively texted Mr. Prakash two motivational quotes and a picture of samosas. Client happiness is at 100%!',
            kind: 'funny',
          },
        ];
      } else if (/(stress|panic|worry|help|crisis|problem|scared|tired)/i.test(lower)) {
        return [
          {
            senderId: 'kunal',
            senderName: 'Kunal',
            text: 'Breathe, founder! Remember: software is temporary, vibes are eternal. I made an emergency lofi chill beats playlist for this exact moment.',
            kind: 'funny',
            effectDeltas: { morale: 3 },
          },
        ];
      } else if (/(money|budget|salary|cash|pay|invoice)/i.test(lower)) {
        return [
          {
            senderId: 'kunal',
            senderName: 'Kunal',
            text: 'Budget is just a number, but team spirit has infinite valuation! (Though ₹500 for chai would be deeply appreciated).',
            kind: 'funny',
          },
        ];
      } else if (/(hi|hello|hey|morning|good morning)/i.test(lower)) {
        return [
          {
            senderId: 'kunal',
            senderName: 'Kunal',
            text: 'GOOD MORNING LEGENDS! Today is going to be historic! What are we conquering first?!',
            kind: 'funny',
          },
        ];
      } else if (isGibberishOrShort(clean)) {
        return [
          {
            senderId: 'kunal',
            senderName: 'Kunal',
            text: 'Love the raw energy in those keystrokes! True passion! I will log that in the minutes of the meeting!',
            kind: 'funny',
          },
        ];
      } else {
        const kunalFallbacks = [
          'Love the initiative! I will capture this in the meeting notes and the meeting notes about the meeting notes.',
          'Sent positive vibes to the engineering channel. Productivity increase expected shortly!',
          'Remember team: a bug is just an unexpected feature on its own spiritual journey.',
          'I scheduled a 15-minute alignment sync so we can align on whether we are aligned.',
        ];
        const pick = pickNext('kunal', kunalFallbacks, kunalCounter++);
        kunalCounter = pick.nextCounter;
        return [{ senderId: 'kunal', senderName: 'Kunal', text: pick.text, kind: 'funny' }];
      }
    }
  }

  // -------------------------------------------------------------
  // 3. GROUP CHANNELS (#general, #random-chaos, #engineering, etc.)
  // -------------------------------------------------------------
  if (channelId === 'general' || channelId === 'project' || channelId === 'random') {
    if (/(hi|hello|hey|morning|good morning|sup|yo)/i.test(lower)) {
      return [
        { senderId: 'kunal', senderName: 'Kunal', text: `GOOD MORNING TEAM! 🌞 Day ${day} is here. Today we shine!`, kind: 'funny' },
        { senderId: 'aarav', senderName: 'Aarav', text: 'Morning. Coffee in hand, npm running. Let\'s make mistakes.', kind: 'funny' },
      ];
    } else if (/(nikhil|where is nikhil|ghost|online|seen)/i.test(lower)) {
      return [
        { senderId: 'nikhil', senderName: 'Nikhil', text: 'seen', kind: 'funny' },
        { senderId: 'kunal', senderName: 'Kunal', text: 'He is online! Nobody startle him or make loud sudden noises!', kind: 'funny' },
      ];
    } else if (/(merge|pr|main|deploy|push|production|git)/i.test(lower)) {
      return [
        { senderId: 'meera', senderName: 'Meera', text: 'PLEASE STOP MERGING DIRECTLY TO MAIN. I AM BEGGING.', kind: 'normal' },
        { senderId: 'aarav', senderName: 'Aarav', text: 'Already merged bro. Yolo.', kind: 'funny' },
      ];
    } else if (/(deadline|deliver|ship|demo|client|call)/i.test(lower)) {
      return [
        { senderId: 'meera', senderName: 'Meera', text: 'I need verified acceptance criteria before anyone declares victory.', kind: 'normal' },
        { senderId: 'aarav', senderName: 'Aarav', text: 'It is basically done. I am defining basically as "the page loads".', kind: 'funny' },
        { senderId: 'kunal', senderName: 'Kunal', text: 'I have prepared the celebration playlist: "We Definitely Tested This".', kind: 'funny' },
      ];
    } else if (/(coffee|tea|chai|lunch|food|pizza|samosa|biryani)/i.test(lower)) {
      return [
        { senderId: 'kunal', senderName: 'Kunal', text: 'Chai break is sacred company culture! I approve 100%.', kind: 'funny' },
        { senderId: 'aarav', senderName: 'Aarav', text: 'If anyone orders samosas, add extra chutney or my code slows down.', kind: 'funny' },
      ];
    } else if (/(bug|broken|error|crash|fail)/i.test(lower)) {
      return [
        { senderId: 'meera', senderName: 'Meera', text: 'I have already filed a P0 blocker report. Assignee: Everyone.', kind: 'normal' },
        { senderId: 'aarav', senderName: 'Aarav', text: 'Clear cache and cookies bro. Works on my machine.', kind: 'funny' },
      ];
    } else if (isGibberishOrShort(clean)) {
      const funnyGibberish = [
        [
          { senderId: 'kunal', senderName: 'Kunal', text: 'That looks like raw keyboard enthusiasm! Keep the momentum high team!', kind: 'funny' as const },
          { senderId: 'aarav', senderName: 'Aarav', text: 'Cat walked on keyboard? Respect.', kind: 'funny' as const },
        ],
        [
          { senderId: 'varun', senderName: 'Varun', text: 'Unrecognized input syntax detected. Packet loss suspected.', kind: 'normal' as const },
          { senderId: 'nikhil', senderName: 'Nikhil', text: 'seen', kind: 'funny' as const },
        ],
      ];
      return funnyGibberish[generalCounter++ % funnyGibberish.length];
    } else {
      const generalFallbacks = [
        { senderId: 'kunal', senderName: 'Kunal', text: 'Love the initiative. I will capture this in the meeting notes and the meeting notes about the meeting notes.', kind: 'funny' as const },
        { senderId: 'varun', senderName: 'Varun', text: 'Acknowledged. Adding this context to the system topology map.', kind: 'normal' as const },
        { senderId: 'aarav', senderName: 'Aarav', text: 'Noted bro. I will style this after I finish the button glow effect.', kind: 'funny' as const },
      ];
      return [generalFallbacks[generalCounter++ % generalFallbacks.length]];
    }
  }

  // Engineering Channel
  if (channelId === 'engineering') {
    if (/(api|integration|backend|build|endpoint)/i.test(lower)) {
      return [
        { senderId: 'varun', senderName: 'Varun', text: 'The integration contract is documented in RFC-4029. Please check revision 3.', kind: 'normal' },
        { senderId: 'aarav', senderName: 'Aarav', text: 'The documentation says /api/menu. The backend says /api/products. They are in a long-distance relationship.', kind: 'funny' },
      ];
    } else if (/(pair|together|collaborat|work with)/i.test(lower)) {
      return [
        { senderId: 'aarav', senderName: 'Aarav', text: 'Fine. I will pair with Varun. But if he opens another architecture diagram, I am closing my laptop.', kind: 'funny' },
        { senderId: 'varun', senderName: 'Varun', text: 'I have prepared a lightweight diagram. It has only four boxes. We are making progress.', kind: 'funny' },
      ];
    } else {
      return [
        { senderId: 'aarav', senderName: 'Aarav', text: 'I am on it bro. Define "it" and I can make it 60% complete.', kind: 'funny' },
      ];
    }
  }

  // Default fallback
  return [
    { senderId: 'kunal', senderName: 'Kunal', text: 'Message received and processed with positive team energy!', kind: 'funny' },
  ];
}
