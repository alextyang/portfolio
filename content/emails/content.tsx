export default `In 2025, I was the developer responsible for producing Center Centre's emails. A typical week meant 15–25 course, event, and marketing messages—roughly 5 million sends a month in total.

A routine email moved through Google Docs, Stripo, ActiveCampaign or Postmark, Notion, and Slack. It took 1–2 hours of hands-on work before review, much of it spent copying the same dates, links, text, and delivery settings from one system to the next.

I built an internal app around that workflow rather than replacing it. It generated the schedule, populated the team's existing Stripo templates from source data, and automated the safer parts of publishing. Average hands-on time fell from 1 hour 40 minutes to 25 minutes; serious issues caught in QA fell from 2–5 a day to 1–2 a week.

FIGURE (Heavy email calendar in Notion | A typical week mixed course operations and marketing campaigns. Several entries represented multiple audience variants or last-minute requests.)

# Why I did not replace Stripo

My first idea was to rebuild the templates in React Email. That would have made the developer path simpler, but if code became the source of truth, the rest of the team would lose Stripo's visual editing and review surface.

The co-founder gave me a useful brief: routine emails should be schedulable “at the push of a button,” without making the workflow harder for the next developer to understand. I decided to automate the transfers between the existing tools, demoing each stage before expanding it.

# How one email moved through the stack

The estimates below combine my experience with estimates from two other developers, using our fastest typical times. A routine email moved through four stages.

## 1. Build the schedule

Once a week, the developer compared program calendars with a separate rules document to decide which emails each session required. The task took about 45 minutes, but an omitted row could mean that a paying cohort or thousands of subscribers missed an important message. Roughly once a month, someone found an email that was missing or misclassified.

FIGURE (Course schedule sheet vs schedule documentation | Before the app, a developer manually cross-referenced the session calendar with a separate rules document to build the email schedule.| On mobile, the calendar appears above the rules document. Every session had to be checked against both.)

## 2. Assemble and review the content

For routine course emails, the developer copied dates, times, topics, and links from several sources into a Google Doc. The copy was mostly fixed; the changing details were not. After filling the placeholders, the developer completed an accuracy checklist and sent the document to another reviewer.

FIGURE (Image of content doc template with highlighted placeholders | Each highlighted placeholder came from a different source of truth. The transfer took about 20 minutes, followed by roughly 45 minutes of checking and review.)

## 3. Rebuild the design in Stripo

Approved copy was pasted into Stripo, the team's visual HTML-email editor. Normal pasting could turn links bright green, add margins, or corrupt the markup, so we stripped formatting and inserted the text line by line. Then the result went through another checklist and review.

FIGURE (Image of Stripo editor | Copy moved from the approved Google Doc into Stripo one line at a time. This handoff introduced formatting problems several times a week.)

## 4. Configure delivery

Finally, the developer exported the design and re-entered its audience, timing, and sender details in ActiveCampaign or Postmark. A small configuration error could trigger an immediate send, so two additional people reviewed every test.

FIGURE (Image of ActiveCampaign automations | Delivery settings were entered manually in ActiveCampaign. The interface was slow, and a wrong date or audience could have immediate consequences.)

A routine course email required about 1 hour 45 minutes of active work and 1 hour 50 minutes of review. One-off campaigns were slightly faster, at about 1 hour 35 minutes of active work and another hour of review. Across the mix, active production averaged about 1 hour 40 minutes per email.

At 15–25 emails a week, this could fill almost an entire developer's schedule. Every developer I spoke with had the same reaction: this felt like work a machine should be doing.

FIGURE (Comparison of two instances of the same email type | The changes between two instances of the same email were small and systematic. These were programmatic templates being operated by hand.)

# Build strategy: remove retyping, keep the checkpoints

I worked through the workflow in order. At each stage, I looked for the smallest automation that could remove retyping while leaving the result visible in the same tool. I demoed each stage before moving on and kept a manual fallback for each automated action.

The final app connected three parts of the workflow: scheduling, template population, and publishing.

# 1. Generate the schedule from source data

Center Centre already maintained an Airtable database containing course dates, session types, topics, and links. The missing piece was a reusable mapping between each kind of session and the emails it required.

FIGURE (Airtable with only website fields | The existing calendar database already held most of the information needed to schedule and populate an email.)

I encoded the scheduling rules in readable configuration rather than hard-coding them into the app. A rule could express, for example: *for a Research course, schedule a Today's Session email at 8 a.m. on the session date.* Each session ran through that rule set to produce its complete list of emails.

FIGURE (Notion or screenshot of schedule configuration | The scheduling format kept business rules visible and editable. New courses and email types could be added without changing the app's core logic.)

The schedule view generated required emails months in advance, supported one-off entries, tracked progress, and linked each item to its Notion calendar entry and Google Doc. No scheduling omissions were reported during my tenure or those of the two developers who succeeded me.

FIGURE (Video of schedule page of app | The generated schedule made future email work visible in one place. Each entry tracked its progress and connected to the team's existing Notion and Google Docs records.)

# 2. Populate trusted templates

I kept Stripo as the template editor and added plaintext variables directly to its existing HTML. A variable such as \`{Session Date}\` could resolve from the course calendar; transformations handled time zones, date formats, related-session data, repeated lists, and Markdown-to-HTML conversion.

FIGURE (Simple Stripo template, variable documentation page | Variables turned an existing Stripo design into a reusable template without changing how the team edited or reviewed it. _The documentation gave future developers a reference for authoring and debugging variables.)

Some values depended on context rather than a single calendar field. A footer, Zoom link, brand color, or delivery category might vary by program and email type. I extended the same readable configuration model to resolve those conditional settings, allowing one template to work across several programs without duplication.

FIGURE (Settings code, settings Notion page | Program-level settings supplied links, colors, footers, and delivery metadata to reusable templates. _The documented format mirrored the scheduling rules, so future developers only had one configuration model to learn.)

The parser could resolve variables nested inside other variables and apply transformations in order. \`{Week 1 Session 2 Topic}\` pulled data from another session; \`{Session Date (GMT)(HH:mm A z)}\` converted and formatted a timestamp without changing the source value. The daily interface hid that syntax unless a developer was authoring or debugging a template.

After selecting an email, the developer first reviewed the resolved source values and then inspected the rendered template beside a form containing only the values in use. Most routine emails required no typing. One-off campaigns usually required only the body copy.

FIGURE (Variable fill demonstration | The app showed the resolved data and rendered email together. Missing or malformed values were flagged before anything reached the publishing stage.)

New templates received a full review. Once approved, each populated email was checked at the final content-and-design stage instead of repeating the same transfer checks in every intermediate tool.

# 3. Reduce publishing risk

ActiveCampaign did not document APIs for several actions this workflow needed. I inspected the network requests made by its own web app and wrapped only the calls required to import HTML, configure a campaign, send a test, and revert the app's changes.

Those endpoints could change, so each action ran checks before and after. The app warned when local and exported versions diverged, offered an undo where the underlying action supported one, and kept the manual route available.

FIGURE (Marketing email publishing stage in app | The publishing view coordinated export, delivery configuration, testing, and Slack approval while keeping each step visible to the developer.)

Where reliable automation was not feasible, the app supplied correctly formatted, copyable values for manual entry. Even this smaller intervention reduced retyping and made the remaining manual work easier to verify.

FIGURE (Video of automation assistant | For the parts of ActiveCampaign that could not be automated safely, the app presented each required value in the exact accepted format.)

I also connected the administrative work around publishing: linking the Notion entry, creating participant notes in Google Docs, and opening and tracking the Slack QA request. The developer's job changed from re-entering high-risk settings to triggering actions and inspecting their results.

FIGURE (Gallery of email tool)

# Results

## 75% less active work

<div className="opacity-100 font-[350]! text-lg bg-gray-100 px-2 py-1 block w-full">
<b>Manual process</b>
<br/>
<span className="sans opacity-90 font-normal!">
    0–30 min content + 40–55 min design + 35–40 min delivery setup = <b className="bg-yellow-100 px-1">1 hr 40 min</b>
<br/>
    (+1–2 hours of review = <b>2 hr 40 min–3 hr 40 min</b> estimated turnaround)
</span>
</div>
<br/>
<div className="opacity-100 font-[350]! text-lg bg-blue-100 px-2 py-1 block w-full">
<b>Tool-assisted process</b>
<br/>
<span className="sans opacity-90 font-normal!">
    10 min content/design + 15 min publishing = <b className="bg-yellow-100 px-1">25 min</b>
<br/>
    (+35 min average review = <b>about 1 hr</b> average turnaround)
</span>
</div>

Average active production fell from 1 hour 40 minutes to 25 minutes per email. Estimated end-to-end turnaround fell from roughly 2 hours 40 minutes–3 hours 40 minutes to about 1 hour.

FIGURE (Time saved estimate)

Urgent requests made the change especially visible because their turnaround was not hidden inside a batch. Emails that had taken hours could be handed back in a fraction of the time, giving the team more room to revise the message instead of spending that time moving it between tools.

FIGURE (Chart of one-off email speed)

## More capacity for product work

The app did not cause these launches, but it changed who had time to work on them. Once email production stopped filling the assigned developer's week, we could put that time toward three product launches, five site redesigns, a community onboarding flow, topic-based unsubscribe controls, and smaller maintenance and migration work.

FIGURE (Gallery of side projects)

## Fewer serious QA issues

According to the team's QA records, serious issues caught before send fell from 2–5 per day to 1–2 per week after adoption. I treat that as a before-and-after signal, not proof that the app caused the entire difference: email volume and mix also affect the raw count.

What clearly changed in the workflow was that missing data and invalid values produced visible warnings instead of hiding inside copied text.

FIGURE (Chart of email error rate)

# What made the app last

Partway through, I understood why nobody had built this already. The parser and integrations were only half the problem; the other half was changing a process people trusted without taking away the places where they wrote, designed, and checked the work.

Google Docs remained the place for copy, Stripo for design, ActiveCampaign for delivery, and Slack for review. The manual workflow also stayed available as a fallback and as part of training.

Two later developers learned that process, transitioned to the app, and maintained its templates and configuration without me. That handoff—not the first successful send—is the result I care most about.`;
