export const resourceCategories = [
  "All",
  "Grief",
  "Anxiety",
  "Trauma",
  "Stress",
  "Depression",
  "Loneliness",
  "Burnout",
  "ADHD",
  "Growth",
  "Support",
] as const

export const resourceTypes = [
  "Article",
  "Coping Strategy",
  "Guided Exercise",
  "Stories & Reflection",
  "Tools & Worksheets",
] as const

export const resources: Array<{
  id: string
  title: string
  category:
    | "Grief"
    | "Anxiety"
    | "Trauma"
    | "Stress"
    | "Depression"
    | "Loneliness"
    | "Burnout"
    | "ADHD"
    | "Growth"
    | "Support"
  type:
    | "Article"
    | "Coping Strategy"
    | "Guided Exercise"
    | "Stories & reflection"
    | "Tools & Worksheets"
  readTime: string
  summary: string
  content: string
}> = [
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Processing Loss After Sudden Death",
    category: "Grief",
    type: "Article",
    readTime: "10 min",
    summary:
      "Understanding the unique challenges of grieving when death comes unexpectedly and strategies for moving forward.",
    content: `When death arrives without warning, it can shatter our sense of safety and control. The shock of sudden loss creates a unique type of grief that often feels more intense and disorienting than anticipated loss.

**The Impact of Shock**

Sudden death doesn't allow time for preparation or goodbyes. Many people describe feeling numb, disconnected, or like they're moving through a fog. This is your mind's way of protecting you from overwhelming emotions while you gradually process what has happened.

**Common Experiences**

You might find yourself replaying the last conversation, searching for signs you missed, or asking "what if" questions repeatedly. These are normal responses as your brain tries to make sense of something that feels incomprehensible.

**Moving Forward**

Healing from sudden loss takes time and patience with yourself. Allow emotions to surface when they do, seek support from others who understand, and remember that there's no "right" way to grieve. Professional support can be especially helpful in navigating the complex emotions that come with unexpected loss.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Grounding Techniques for Panic Attacks",
    category: "Anxiety",
    type: "Coping Strategy",
    readTime: "5 min",
    summary:
      "Simple, effective methods to help you stay present and calm during moments of overwhelming anxiety.",
    content: `Panic attacks can feel terrifying, but grounding techniques can help you regain control and return to the present moment.

**The 5-4-3-2-1 Method**

Identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This technique interrupts the panic cycle by engaging your senses.

**Physical Grounding**

Press your feet firmly into the floor, hold ice cubes in your hands, or splash cold water on your face. Physical sensations can quickly break the anxiety spiral and bring you back to your body.

**The STOP Technique**

Stop what you're doing. Take a breath. Observe your thoughts and feelings without judgment. Proceed with something that will support you in the moment. This simple acronym can be your anchor during panic.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Recognizing PTSD Triggers in Daily Life",
    category: "Trauma",
    type: "Article",
    readTime: "15+ min",
    summary:
      "Learn to identify common triggers and develop personalized strategies for managing trauma responses.",
    content: `Triggers are sensory experiences that activate traumatic memories, often without warning. Learning to recognize your triggers is an essential step in managing PTSD and reclaiming your sense of safety.

**What Are Triggers?**

A trigger can be anything that reminds you of your trauma—a sound, smell, place, anniversary date, or even a feeling in your body. Unlike ordinary memories, triggers can make you feel like you're experiencing the trauma all over again.

**Common Types of Triggers**

Sensory triggers involve the five senses: the sound of sirens, certain songs, specific smells, or visual reminders. Emotional triggers might include feeling trapped, criticized, or out of control. Situational triggers occur in contexts similar to your trauma, like crowded spaces or driving on highways.

**Identifying Your Personal Triggers**

Start keeping a simple log when you notice strong reactions. What were you doing? What did you see, hear, or smell? What emotions came up? Over time, patterns will emerge that help you anticipate and prepare for triggering situations.

**Managing Triggers**

Once you know your triggers, you can develop coping strategies. This might include avoiding certain situations temporarily, bringing a support person, using grounding techniques, or working with a therapist to gradually reduce trigger sensitivity through exposure therapy.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Body Scan for Stress Relief",
    category: "Stress",
    type: "Guided Exercise",
    readTime: "10 min",
    summary: "A gentle meditation practice to release tension and reconnect with your body.",
    content: `Find a comfortable position, either lying down or sitting with your back supported. Close your eyes or soften your gaze.

**Beginning the Scan**

Take three deep breaths, letting each exhale be longer than the inhale. Allow your body to settle into stillness.

**Moving Through Your Body**

Bring your attention to the top of your head. Notice any sensations—warmth, tingling, tightness, or perhaps nothing at all. There's no need to change anything, simply observe.

Slowly move your awareness down to your forehead, eyes, and jaw. Many people hold tension here without realizing it. If you notice tightness, breathe into that space and imagine it softening on the exhale.

Continue down through your neck and shoulders, arms and hands, chest and belly. Notice where you're holding tension and where you feel relaxed.

**Completing the Practice**

Move through your hips, legs, and feet. Take a moment to feel your whole body at once. When you're ready, gently wiggle your fingers and toes, and slowly open your eyes. Notice how you feel compared to when you started.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "When Grief Turns to Depression",
    category: "Depression",
    type: "Article",
    readTime: "10 min",
    summary:
      "Understanding the difference between normal grief and clinical depression, and when to seek help.",
    content: `Grief and depression share many symptoms—sadness, fatigue, difficulty concentrating. But they're not the same, and knowing the difference can help you get the right support.

**Understanding Normal Grief**

Grief comes in waves. You might feel intense sadness one moment and find yourself laughing at a memory the next. The pain is connected to your loss, and while it may feel overwhelming, it typically lessens in intensity over time. You can still experience moments of joy and connection.

**Signs It May Be Depression**

Depression is more constant and pervasive. If weeks or months after your loss you feel persistently hopeless, worthless, or unable to function in daily life, depression may have developed. Other signs include persistent thoughts of death unrelated to your loss, severe guilt about things unrelated to the deceased, or complete inability to experience any positive emotions.

**When to Seek Help**

If you're struggling to eat, sleep, or take care of basic needs for extended periods, or if you're having thoughts of self-harm, it's time to reach out for professional support. Depression is treatable, and seeking help is a sign of strength, not weakness.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Building Connection Through Vulnerability",
    category: "Loneliness",
    type: "Stories & reflection",
    readTime: "5 min",
    summary:
      "Personal stories of overcoming isolation by reaching out and sharing authentic experiences.",
    content: `*"I spent months feeling invisible, convinced no one would understand what I was going through. Then one day, I took a risk and told a coworker I was struggling. Her response changed everything: 'Me too.'"*

**The Paradox of Connection**

When we're lonely, we often hide the very thing that could bring us closer to others—our vulnerability. We assume our struggles make us unlovable, when in reality, sharing them creates the deepest connections.

**Small Acts of Courage**

You don't need to share your deepest pain with everyone. Start small: admit you're having a hard day, ask someone how they're really doing, or share something you're worried about. These small acts of authenticity invite others to do the same.

**Finding Your People**

Connection doesn't mean being surrounded by people constantly. It means finding even one or two people who see you, who you can be real with. Sometimes those connections form in unexpected places—a support group, an online community, or a conversation with a stranger who becomes a friend.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Setting Boundaries at Work",
    category: "Burnout",
    type: "Tools & Worksheets",
    readTime: "15+ min",
    summary:
      "A practical worksheet to help you identify your limits and communicate them effectively.",
    content: `Use this worksheet to clarify your boundaries and create a plan for communicating them.

**Part 1: Identify Your Limits**

What aspects of work are draining your energy? (Check all that apply)
- [ ] Working beyond scheduled hours
- [ ] Responding to messages after hours
- [ ] Taking on others' responsibilities
- [ ] Saying yes when you want to say no
- [ ] Not taking breaks or lunch
- [ ] Bringing work stress home

**Part 2: Define Your Boundaries**

For each checked item above, write one specific boundary:

Example: "I will not respond to non-emergency emails after 6pm"

My boundaries:
1. ___________________________________
2. ___________________________________
3. ___________________________________

**Part 3: Communication Script**

Choose your most important boundary and write how you'll communicate it:

"I've realized that [situation] has been affecting my wellbeing. Going forward, I'll be [your boundary]. I'm committed to [how you'll maintain quality work within this boundary]."

**Part 4: Anticipate Challenges**

What obstacles might you face? _____________________
How will you handle pushback? _____________________
Who can support you? _____________________`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Managing ADHD Executive Dysfunction",
    category: "ADHD",
    type: "Coping Strategy",
    readTime: "10 min",
    summary:
      "Evidence-based techniques for tackling task initiation, organization, and follow-through.",
    content: `Executive dysfunction makes everyday tasks feel impossibly hard. These strategies can help you work with your ADHD brain, not against it.

**The 2-Minute Rule**

If something takes less than 2 minutes, do it immediately. This prevents small tasks from piling up and becoming overwhelming. The key is removing the decision-making step entirely.

**Body Doubling**

Work alongside someone else, either in person or virtually. You don't need to talk or work on the same thing—the presence of another person can activate your focus and motivation systems.

**External Systems Over Willpower**

Your brain struggles with working memory and time awareness. Instead of trying to remember things, create external systems: visible timers, alarms for transitions, checklists you can see, and designated spots for important items.

**Task Breakdown**

Large tasks overwhelm the ADHD brain. Break everything into the smallest possible steps. Instead of "clean kitchen," try "put 5 dishes in dishwasher." Starting is often the hardest part, and tiny steps make starting feel possible.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Finding Meaning After Loss",
    category: "Grief",
    type: "Stories & reflection",
    readTime: "15+ min",
    summary:
      "Reflections on how others have discovered purpose and growth through their grief journey.",
    content: `*"I never wanted this wisdom. I never asked for this growth. But here I am, changed by loss in ways I couldn't have imagined."*

**The Unwanted Transformation**

No one wants to grow through grief. We would give anything to have our loved ones back instead. Yet many people find that loss, while never welcomed, eventually reshapes them in profound ways.

**Different Forms of Meaning**

Finding meaning doesn't mean being glad the loss happened. It might mean discovering inner strength you didn't know you had. It might mean connecting more deeply with others who've experienced loss. It might mean living more intentionally because you understand how precious and fragile life is.

**Honoring Through Action**

Some people find meaning by turning their grief into action—advocating for causes their loved one cared about, supporting others through similar losses, or simply living more fully in their memory.

**The Both/And of Grief**

You can miss someone desperately and still find moments of joy. You can be forever changed by loss and still build a meaningful life. Grief and meaning aren't opposites—they often exist side by side, woven together in the fabric of a life touched by love and loss.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Breathwork for Anxiety Relief",
    category: "Anxiety",
    type: "Guided Exercise",
    readTime: "5 min",
    summary: "Three breathing techniques you can use anywhere to reduce anxiety and restore calm.",
    content: `Your breath is a powerful tool for calming your nervous system. Try these three techniques and notice which works best for you.

**Box Breathing**

Breathe in for 4 counts, hold for 4, exhale for 4, hold empty for 4. Repeat 4-5 times. This equal-sided breath creates balance and activates your parasympathetic nervous system.

**4-7-8 Breathing**

Inhale through your nose for 4 counts, hold for 7, exhale completely through your mouth for 8. The long exhale signals safety to your body. Repeat 3-4 times.

**Physiological Sigh**

Take two quick inhales through your nose (a big breath, then a small sip of air on top), then one long, slow exhale through your mouth. This is one of the fastest ways to reduce anxiety. Repeat 2-3 times.

**Making It a Habit**

Practice these when you're calm so they're available when anxiety strikes. Set reminders to breathe throughout your day, before anxiety builds.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Healing from Childhood Trauma",
    category: "Trauma",
    type: "Article",
    readTime: "15+ min",
    summary:
      "Understanding how early experiences shape us and steps toward processing and healing.",
    content: `Childhood trauma doesn't just live in the past—it shapes how we see ourselves, relate to others, and move through the world. Healing is possible, though it requires patience and compassion.

**How Childhood Trauma Shows Up**

You might struggle with trust, set unhealthy boundaries, feel chronically anxious, or have difficulty regulating emotions. These aren't character flaws—they're adaptations that helped you survive difficult circumstances.

**The Body Keeps Score**

Trauma is stored not just in memories but in your nervous system. You might experience physical symptoms like chronic pain, digestive issues, or a constantly activated fight-or-flight response, even when you're safe now.

**Reparenting Yourself**

Healing often involves learning to give yourself what you didn't receive as a child: safety, validation, compassion, and unconditional acceptance. This isn't about blaming your caregivers—it's about taking responsibility for your own healing.

**The Role of Therapy**

Working with a trauma-informed therapist can provide the safe relationship your nervous system needs to heal. Approaches like EMDR, somatic experiencing, and internal family systems can be particularly effective for childhood trauma.

**Moving Forward**

Healing isn't linear, and it doesn't mean forgetting what happened. It means the past no longer controls your present. You deserve to feel safe in your own body and worthy of love.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Daily Mood Tracking Template",
    category: "Depression",
    type: "Tools & Worksheets",
    readTime: "5 min",
    summary:
      "A simple tool to monitor your emotional patterns and identify triggers or helpful activities.",
    content: `Track your mood each day to identify patterns and understand what influences your mental health.

**Daily Mood Log**

Date: ___________

**Morning Mood** (1-10): ___
What I noticed: _________________

**Afternoon Mood** (1-10): ___
What I noticed: _________________

**Evening Mood** (1-10): ___
What I noticed: _________________

**Today I:**
- [ ] Took medication
- [ ] Exercised/moved my body
- [ ] Ate regular meals
- [ ] Slept well last night
- [ ] Connected with someone
- [ ] Spent time outside
- [ ] Did something enjoyable

**Mood influencers:**
What helped today: _________________
What was difficult: _________________

**Notes for tomorrow:**
_________________________________

**Weekly Review**

At the end of each week, look for patterns:
- What days were hardest? _____________
- What activities correlated with better moods? _____________
- What warning signs did you notice? _____________`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Embracing Post-Traumatic Growth",
    category: "Growth",
    type: "Article",
    readTime: "10 min",
    summary: "How adversity can lead to positive personal transformation and increased resilience.",
    content: `Post-traumatic growth isn't about being grateful for trauma or minimizing suffering. It's about recognizing that humans have a remarkable capacity to find strength and wisdom through difficult experiences.

**What Is Post-Traumatic Growth?**

Research shows that many people who experience trauma eventually report positive changes: deeper relationships, greater appreciation for life, increased personal strength, new possibilities, or spiritual growth. This doesn't happen automatically—it develops through actively processing the experience.

**Growth and Pain Coexist**

You can acknowledge growth while still wishing the trauma never happened. These aren't contradictory feelings. The growth doesn't justify the pain, and recognizing growth doesn't mean you're "over it."

**Factors That Support Growth**

Processing emotions rather than avoiding them, finding meaning in the experience, having social support, and taking time to reflect all contribute to post-traumatic growth. Professional therapy can help facilitate this process.

**Your Timeline Is Your Own**

There's no rush to find growth or meaning. Some people discover it years after their trauma, others never do, and both are okay. Growth isn't a requirement for healing.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Asking for Help Without Shame",
    category: "Support",
    type: "Coping Strategy",
    readTime: "5 min",
    summary:
      "Practical tips for reaching out to friends, family, or professionals when you need support.",
    content: `Asking for help feels vulnerable, but it's one of the most courageous things you can do. Here's how to make it easier.

**Reframe Your Thinking**

Needing help isn't weakness—it's human. The people who care about you want to be there for you. By letting them help, you're actually giving them an opportunity to show love.

**Be Specific**

Instead of "I need help," try "Could you come sit with me for an hour?" or "Can you help me find a therapist?" Specific requests are easier for people to respond to and more likely to get you what you need.

**Start Small**

If reaching out feels too scary, start with something low-stakes. Text a friend "Having a hard day," without asking for anything. Opening the door even slightly can make bigger asks feel more possible.

**Have a Few People**

Don't rely on just one person. Build a small network so you have options and no one feels overburdened. Different people can support different needs.

**Professional Support**

Sometimes friends and family aren't enough, and that's okay. Therapists, support groups, and crisis lines exist precisely because professional support is sometimes necessary. Using these resources is smart, not shameful.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Managing Workplace Stress Effectively",
    category: "Stress",
    type: "Tools & Worksheets",
    readTime: "10 min",
    summary:
      "Identify your stress sources and create an action plan for a healthier work-life balance.",
    content: `Use this worksheet to understand your workplace stress and develop strategies to manage it.

**Part 1: Stress Inventory**

Rate each area from 1 (no stress) to 10 (extreme stress):

Workload: ___
Relationships with colleagues: ___
Management/leadership: ___
Work-life balance: ___
Job security: ___
Lack of control: ___
Unclear expectations: ___

**Part 2: What's In Your Control?**

For your highest-rated stressors, identify:

Things I can change directly:
1. _________________________________
2. _________________________________

Things I can influence:
1. _________________________________
2. _________________________________

Things I must accept:
1. _________________________________
2. _________________________________

**Part 3: Action Plan**

For one stressor you can change or influence:

The problem: _______________________
My goal: __________________________
First step I'll take: ________________
When: ____________________________
Support I need: ____________________

**Part 4: Coping Strategies**

During my workday, I can reduce stress by:
- [ ] Taking real breaks
- [ ] Setting communication boundaries
- [ ] Asking for help when needed
- [ ] Using stress-reduction techniques
- [ ] Other: _______________________`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "ADHD-Friendly Organization Systems",
    category: "ADHD",
    type: "Article",
    readTime: "15+ min",
    summary:
      "Learn about organizational methods designed specifically for ADHD brains and how to implement them.",
    content: `Traditional organization advice doesn't work for ADHD brains. Here's why, and what does work instead.

**Why Standard Systems Fail**

Most organization systems rely on consistency, memory, and impulse control—exactly what ADHD makes difficult. If you've failed at organization before, it's not because you're lazy or unmotivated. The system wasn't designed for your brain.

**ADHD-Friendly Principles**

Visibility over storage. If you can't see it, it doesn't exist. Use open shelving, clear containers, and keep important items in sight.

Simplicity over perfection. The best system is one you'll actually use. A basket on the counter beats a complex filing system you never maintain.

Multiple "homes" for important items. Have phone chargers in several rooms. Keep keys by every door you use. Redundancy prevents crisis.

**Environmental Design**

Put friction between you and distractions (delete apps, put phone in another room). Remove friction from important tasks (lay out gym clothes, keep medications visible).

**Digital Tools**

Use calendar alerts for everything, not just appointments. Set reminders for transitions. Use apps that work with ADHD: simple task lists, body doubling platforms, or habit trackers that don't require streaks.

**The Flexibility Factor**

What works changes over time. Give yourself permission to constantly adjust and experiment. There's no one "right" system—only what works for you right now.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Navigating Loneliness in a New City",
    category: "Loneliness",
    type: "Coping Strategy",
    readTime: "10 min",
    summary:
      "Actionable steps to build community and meaningful connections when starting over somewhere new.",
    content: `Moving to a new city can feel isolating, but you can build meaningful connections with intention and patience.

**Become a Regular**

Pick one coffee shop, gym, or bookstore and go consistently. Familiarity breeds connection. Eventually, you'll recognize faces, exchange smiles, and start conversations. Belonging starts with showing up.

**Say Yes (Even When It's Hard)**

Accept invitations even if you don't feel like it. Attend meetups that sound even marginally interesting. Building community requires putting yourself in proximity to people repeatedly.

**Focus on Activities, Not Networking**

Join groups around genuine interests—a running club, book club, volunteer organization, or hobby class. Friendships form more naturally when you're doing something together rather than trying to "make friends."

**Initiate Plans**

If you have a good conversation with someone, suggest meeting again. "Want to grab coffee next week?" Most people appreciate when someone else takes initiative.

**Be Patient With Yourself**

Building genuine friendships takes time—often 6-12 months before you feel truly connected. The loneliness you feel now is temporary, even though it doesn't feel that way. Keep showing up.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Recovering from Burnout",
    category: "Burnout",
    type: "Article",
    readTime: "15+ min",
    summary:
      "Recognizing the signs of burnout and creating a sustainable recovery plan to restore your energy.",
    content: `Burnout isn't just being tired—it's physical, emotional, and mental exhaustion that doesn't improve with rest. Recovery requires more than a vacation.

**Recognizing True Burnout**

Beyond exhaustion, burnout includes cynicism about your work, feeling ineffective, and a sense of detachment. You might stop caring about things that used to matter, feel emotionally numb, or experience physical symptoms like headaches and insomnia.

**The Problem With "Push Through"**

Our culture glorifies powering through, but burnout worsens if ignored. Your body is sending emergency signals. Continuing to override them can lead to serious health consequences and deeper burnout.

**Immediate Steps**

First, acknowledge that you're burned out without judgment. Then, identify what absolutely must be done and what can be postponed, delegated, or dropped entirely. Create space for rest, even if it's imperfect.

**Long-Term Recovery**

Recovery takes months, not days. You'll need to address not just rest but the conditions that created burnout: unsustainable workload, lack of control, value misalignment, or inadequate support.

**Rebuilding Boundaries**

As you recover, notice what depletes you versus what restores you. Build protection around your energy. This might mean changing jobs, reducing hours, or fundamentally shifting how you approach work and rest.

**Preventing Recurrence**

Once you've experienced burnout, you're more vulnerable to it again. Recovery isn't about returning to how things were—it's about creating a sustainable way forward that honors your limits.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Progressive Muscle Relaxation",
    category: "Anxiety",
    type: "Guided Exercise",
    readTime: "15+ min",
    summary:
      "A full-body relaxation technique to release physical tension and calm an anxious mind.",
    content: `This technique helps you recognize and release tension you might not even realize you're holding.

**Getting Started**

Find a comfortable position, sitting or lying down. Take a few deep breaths, letting yourself settle.

**The Process**

You'll tense each muscle group for 5 seconds, then release for 10-15 seconds. Notice the difference between tension and relaxation.

**Hands and Arms**

Make tight fists with both hands. Hold... and release. Notice the warmth and heaviness as your hands relax.

Tense your biceps by bringing your hands to your shoulders. Hold... and release. Let your arms feel heavy.

**Face and Neck**

Raise your eyebrows and wrinkle your forehead. Hold... and release. Feel your forehead become smooth.

Squeeze your eyes shut tightly. Hold... and release. Notice the softness around your eyes.

Clench your jaw. Hold... and release. Let your jaw hang slightly open, relaxed.

**Shoulders and Chest**

Pull your shoulders up to your ears. Hold... and release. Feel them drop heavily.

Take a deep breath, filling your chest. Hold... and exhale completely, letting your chest soften.

**Stomach and Back**

Tighten your stomach muscles. Hold... and release. Feel your belly soften with each breath.

**Legs and Feet**

Tense your thighs. Hold... and release.

Point your toes away from you. Hold... and release.

Pull your toes toward your shins. Hold... and release.

**Completion**

Take a moment to scan your whole body. Notice the feeling of relaxation. When you're ready, gently stretch and return to your day, carrying this sense of calm with you.`,
  },
  {
    id: Math.random().toString(36).substring(2, 8),
    title: "Journaling Through Grief",
    category: "Grief",
    type: "Tools & Worksheets",
    readTime: "5 min",
    summary: "Prompts and guidance for using writing as a tool to process loss and honor memories.",
    content: `Writing can help you process emotions that feel too big to say out loud. Use these prompts when you're ready.

**Getting Started**

There's no right way to journal. Write as much or as little as feels right. Don't worry about grammar or making sense. This is just for you.

**Prompts for Processing**

- What I wish I could tell you is...
- Today I'm feeling...
- The hardest part right now is...
- What I miss most about you...
- Something that made me think of you today...

**Prompts for Memory**

- A favorite memory I never want to forget...
- Something funny you used to do...
- The way you made me feel...
- What I learned from you...
- A conversation I wish we could have...

**Prompts for Moving Forward**

- Right now I need...
- Something that helped today...
- A small moment of peace I found...
- How I'm different now...
- What I'm learning about myself...

**Letters to Your Loved One**

Sometimes it helps to write directly to the person you lost. Tell them about your day, ask them questions, share what you wish they could see.

**Be Gentle With Yourself**

Some days the words flow easily. Other days, writing one sentence feels impossible. Both are okay. Return to these prompts whenever you need them.`,
  },
]
