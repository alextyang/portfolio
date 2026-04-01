export default `In 2025, I was a web development fellow at Center Centre, where I owned the production of Center Centre’s public-facing emails. 

Emails are the organization’s primary form of communication: supporting ongoing courses, marketing campaigns, and community engagement. Timely, accurate emails were essential for the event turnouts, campaigns’ effectiveness, and—over the long-term—earned trust from our students and clients. 

I inherited a process for creating emails, though, that had clearly evolved out of urgency. With the standard workflow, it took 1-2 hours to create, schedule, and review each email. Between 15-25 emails per week, the developer faced a tight turnaround that would occupy their entire workload. 

FIGURE (Heavy email calendar in Notion | A normal weekly email calendar, with both course operations and marketing campaign emails. Alongside the high volume, some entries represent multiple variations or last-minute additions.)

When we had two web developers, only one of them would be able to focus on website projects and maintenance. When there was only one, often no projects were progressed at all. 

Email production consumed so much time that most developers felt like they were treading water, unable to step back and iterate on the process. This state of survival left a fragmented workflow that achieved its goals but at disproportionate cost; scaled far beyond what it could reasonably support.

I was able to optimize my personal workflow to the point where I had some bandwidth outside of emails. Instead of just passing the torch, I decided to put my extra time towards improving the process. 

The team had built up a sense of security in the current production and QA review system, but was open to change. Leadership agreed when I proposed improvements: the emails were mostly variations on the same structure, we should be able to just “push a button and have the emails for a course scheduled out.” They emphasized, though, that reliability and the QA process can’t be compromised.

I decided to pursue incremental interventions, especially backwards-compatible automation, to rebuild the system in a way that stayed both trustworthy and coherent. 

This case study will tour the production process before and after my project, in order to show how targeted tooling can transform brittle operational pipelines from the inside out.

# How Emails Used to Work

I’ll walk through the original lifecycle of an email. Each step had serious points of friction and risks that were easy targets for automation.

## 0. Schedule
+45
Emails were sent for a variety of operational needs, divided into two categories: regular and irregular. Most emails were routine notifications for participants in a course or event: ‘Today’s Session’ with the day’s topic and zoom link, ‘Next Week’s Schedule’ with times and homework, or ‘Session Recording’ after a webinar. And occasionally, we would have one-off email blasts to our marketing lists: promotions, free resources, or newsletters.

Regular emails were scheduled based on course/event calendars. Each week, I cross-referenced the upcoming sessions with documentation that specified exactly what type of email to send and when. I would populate our Notion schedule with the corresponding email needs. Throughout the week, one-off emails would be added by other teams.

The scheduling was quick to do once a week, but it introduced a silent risk of failure—miss one entry and a paying cohort or thousands of subscribers wouldn’t receive critical information. Around once a month, someone would catch an email missing or misclassified in the schedule.

FIGURE (Course schedule sheet vs schedule documentation | On the left, a calendar spreadsheet with all sessions and their details. On the right, a document that specifies which emails each session needs, based on its type and timing. Manually cross-referencing the two created the email schedule.| On the top, a calendar spreadsheet with all sessions and their details. On the bottom, a document that specifies which emails each session needs, based on its type and timing. Manually cross-referencing the two created the email schedule.)

## 1. Content

+0
For one-off emails, a Google Doc with markdown-formatted text content was provided.

+20
For regular emails, a pre-existing Google Doc was used as a template. The content would stay the same, but the dates, links, and topics would change. 

The dev would insert and format the new snippets piece-by-piece, using a source of truth for each type of information: an official calendar spreadsheet for times, forum pages for links, and syllabus documents for topics. At least once a week, a developer would miss or incorrectly fill a snippet.

FIGURE (Image of content doc template with highlighted placeholders | A Google Doc template for a routine course email's content and metadata. The majority of content stays the same, dynamic portions are highlighted to be manually populated by the developer.)

+10
Complete a QA checklist to double-check accuracy of inserted details. 

+30 (Inactive)
Send a QA ticket for another person to do the same. In most cases, inaccuracies would be caught here.

## 2. Production

+25
Once a content document was approved, the developer translated it into an HTML email. In Stripo, a visual editor for HTML emails, we would find the closest existing email. A small storage limit meant overall designs were always re-used, but text content usually needed to be completely re-written.

Stripo’s text editor was, unfortunately, tedious to work with. The editor would corrupt the HTML if multiple lines or mixed styles were pasted in. And it would continuously revert to default styling: making links bright green, removing fonts, and breaking indentation. 

For each email, the developer would need to strip the markdown, copy and paste the email line-by-line, and re-apply each styling option. Multiple times a week, small formatting issues or style corruptions would be introduced in this stage. At least once a week, a link, sentence, or snippet would be transferred incorrectly.

FIGURE (Image of Stripo editor | A Stripo email design in the editor. The content is being manually copied and pasted from a Google Doc, then styled/re-styled with the editor’s formatting options.)

+10
Complete a QA checklist to: make sure each sentence, link, and date was correctly copied from content document, then that the styling and format matches the documentation. The content document is used as the source of truth (SoT), though, which means anything missed in the first QA review will no longer be reviewed.

+30 (Inactive)
Send a QA ticket for another person to do the same. In most cases, unnoticed issues with format or content would be caught by the second set of eyes. 

## 3. Scheduling

After the Stripo design is reviewed, the dev exports it to ActiveCampaign, the marketing and CMS platform, and configures it to be delivered.

Note:
Legally, there are two types of emails: marketing and transactional. Marketing emails have strict regulations, like unsubscribe links, and are subject to much more scrutiny by email providers and filters. An email counts as transactional if it is a necessary part of a user-initiated interaction, like confirmations or password resets. 

To maximize deliverability, the two types need to be sent with different service providers. ActiveCampaign provides marketing email sending, but supports this distinction by integrating the transactional email service Postmark.

+10
For marketing emails, we used ActiveCampaign’s campaign feature, which sends a synchronous ‘blast’ of marketing emails to a regulation-compliant list of contacts.

FIGURE (Image of ActiveCampaign campaign | The campaign creation page in ActiveCampaign. The Stripo design is imported, then the audience and scheduling are configured manually, based on the content document's header.)

+20
For transactional emails, we used Postmark in ActiveCampaign automations. ActiveCampaign’s automations are step-by-step funnels, similar to Zapier, that do sequential or conditional actions on select contacts.

Our courses require scheduled, synchronous transactional emails, but Postmark doesn’t natively support scheduled email blasts. By adding ‘wait’ conditions in between Postmark email send actions, we were able to workaround the Postmark limitation to schedule ahead our course-related emails.

FIGURE (Image of ActiveCampaign automations | A page of automation setup in ActiveCampaign. The configuration is similar to campaigns, but with additional setup steps and a slower interface.)

ActiveCampaign’s interface was slow to use, with long load times between each page, form, and even field in each form. Manual entry of the most important details, like recipients and date, inevitably led to serious problems at least once a month. Small mistakes would sometimes send out emails immediately, before the developer could even review the configuration.

+20
After adding the exported email to a campaign or automation, the developer sends out a test email. The final QA checklist checks the content and design of the test email, using the Stripo design as the SoT, then verifies the scheduling settings.

+45 (Inactive)
Have two additional people complete the final checklist.

FIGURE (Map of full process)

# The Problem

If emails were an occasional need, this process would be fine. Completing 3-5 mistake-free emails per day with this system, though, was an overwhelming task.

Developers and reviewers weren’t excited about their bandwidth going towards slow, repetitive work. The organization wasn’t able to get out timely messages, experiment with email content, or make all but slow progress on web initiatives. The manual process achieved a lot of ceremonial QA—continuously reviewing unfinished artifacts—but it was not efficient, scalable, or even particularly reliable.

The course and event emails were just parameterized templates operated by hand. Even the irregular one-off emails seemed automate-able: the documents were markdown text that could be parsed to HTML without hours of high-stakes copying and pasting.

FIGURE (Comparison of two instances of the same email type | Two versions of the same type of email, created for different sessions. The changes in content are small and systematic.)

# The Solution

I began to scaffold out an internal web app that could assist with each stage in the production process. 

# Page 1. The Schedule

For our websites, we already maintained a database with a complete calendar of courses and events. If my app knew which emails each session needed, it could generate the email schedule based on the calendar data.

FIGURE (Airtable with only website fields | A view of the calendar database for the 'UX Metrics' course. The database included all the information necessary to schedule emails, and much of what was needed to populate them.)

I created a configuration file to store the conditions that necessitate each type of email. If “Course:Research”, schedule “Today’s Session” at 8am on the day. An entry in the calendar could be compared to each ‘filter’ to collect a list of applicable emails and their send date.

FIGURE (Notion or screenshot of schedule configuration | The schedule configuration format, which specifies emails based on filter conditions for each session.)
(Put a pin in the "Send Date":"{…}" part in a moment.)

Compared to hard-coding the scheduling logic, this format enabled long-term change—new courses or new types of emails—to be made easily by junior developers.

FIGURE (Video of schedule page of app)

We could now instantly see, search, and filter multiple years’ email needs. It completely eliminated scheduling errors during my tenure.

# Page 2. Filling Variables

Ideally, from here, we could just run some React code and generate an HTML email that’s filled with the data. That would be a total break from longstanding processes, though. 

With the Stripo visual editor and HTML source, the entire process is transparent, accessible, and traceable. A transition to React would require a ground-up rebuild of every design, and the team would not be able to build trust with the process in the same way.

Before sacrificing skill floor, inspectability, and interoperability, I looked for an approach that could directly populate our Stripo-made HTML designs with dynamic data, preserving visual editing and our review culture.

## A Custom Placeholder System

Email providers already have a simple variable system, %FIRSTNAME% or %COMPANY\_ADDRESS%. Our templates, though, ask for things like:
- Different formats or timezones of the same date
- Information about other sessions (example: a link to last week’s recording)
- Iterated content (example: a list of upcoming events)

I created a parser to replace any curly braced ’{Variable}’ with a text value, with built-in guardrails for missing or bad data. I also added robust support for recursion: so templates could use compound placeholders like ‘{{Topic} Title}’ to derive values based on other fields.

FIGURE (Component, notion article, and video of the variable system I created)

Inside the curly braces, it interprets parenthesis-wrapped phrases as ‘transformations’ on the value. {Session Date (GMT)(HH:mm A z)} converts the session’s Date field to GMT time, and formats it to a string like ‘10:30 AM GMT’.

I created transformations as needed and they turned plaintext HTML into robust, flexible templates that could be programmed from within Stripo. 

Even the one-off marketing emails, where the entire body was provided, could be templated: the content could be pasted into a {Body (MD to HTML)} variable that parses the markdown into HTML.

FIGURE (Stripo templates, transforms notion page)

Some values that couldn’t be found in the calendar, like course-wide information, would be annoying to manually input every time. I repurposed the schedule configuration format to provide additional values based on the type of course, session, or email. Templates were able to use the email value configuration for zoom links, topic colors, and a universal {Footer}; all managed in a readable, flexible format.

FIGURE (Settings code, settings Notion page)

## The Result

FIGURE (Video of filling variables stage)

With placeholder-ized HTML templates imported to the app, all the dev needs to do is select an email from the schedule and it is populated with rich, dynamic data.

Most types of emails were so programmatic, they needed no editing at all. No templates required more than a few minutes of value input.

The placeholders were vastly more reliable than manual entry. Not only were issues rare, but they became much easier to spot. Programmatic problems, like broken designs or segments, were obvious compared to human-made mistakes, like doubled words or common misspellings.

# Page 3. Publishing

We now have a ready-to-send email in only moments, all that’s left is reviewing and scheduling. Adding and configuring the email in ActiveCampaign, though, would still be a tedious, error-prone pain point.

The platform, though, doesn’t have documented API methods for the majority of email-related features. Because no supported API existed for critical functionality, I implemented a client-emulation layer that supported creating, configuring, and deleting email designs and marketing campaigns.

FIGURE (Marketing email publishing stage in app)

With error-monitoring and fallbacks, the custom integration saved a significant amount of time while mitigating the long-term risk of maintenance.

For automation editing, where emulating the client wasn’t possible, the fallback helper provides a copy-able version of each value that needs to be entered. Even just this fallback drastically reduced data entry time.

FIGURE (Image of automation assistant)

Alongside the ActiveCampaign automated actions, I added helper integrations for the other administrative tasks: back-linking the scheduled item in Notion, populating Google Doc class notes templates, and submitting the QA tickets in Slack.

Time-consuming data entry was no longer necessary at any stage of creating an email. Most of the time, this publishing stage only required triggering the integrations and inspecting the results. 

# The Impact

FIGURE (Map of final email process)

This email application quickly became the biggest and most impactful piece of software I had worked on. It lifted a weight off the shoulders of the development team and, in the process, uplifted the organization as a whole.

## a. Hours Saved

The majority of emails could be scheduled start-to-finish without leaving the application. The app had become a real version of the ‘press a button’ vision. 

Production time per email dropped from 1-2 hours (25m copy/edit + 25m Stripo + 15m config + 30m dev QA) to 15-30 minutes (5m review + 5m publish + 10m dev QA); a 4-6x improvement. 

The developer was, for the first time, able to comfortably expand their focus beyond emails. This improved product and website launch timelines, enabled faster responses to maintenance issues, and helped developers pursue projects that aligned with their personal goals.

We also had more bandwidth to experiment, iterate, and collaborate on email design and content, which led to a new community onboarding flow that increased new user activation rate by 8-15% each month.

The only manual part of the process remaining was the essential one: QA reviews. I restructured the reviews away from front-loading and re-checking to only validating _output_. It significantly decreased the volume of review work while increasing the amount of meaningful validation.

The start-to-finish email turnover time, including QA latency, dropped from 3-5 hours to 45-90 minutes. The more efficient review workload added time to the day for everyone.

The improved timeline meant that the one-off urgent messages and marketing content could reach its audience much earlier. It greatened the impact of time-sensitive material and created the opportunity for teams to iterate. 

These urgent email timelines demonstrate the difference in efficiency, because they don’t include review wait time or parallel work. Using Slack timestamps, I graphed the urgent email turnover before and after the introduction of the email tool.

FIGURE (Chart of one-off email speed) 

## b. Errors Eliminated

Even while the QA workload was reduced, errors became scarce.  The system lowered overall risk and shifted the remaining from subtle human errors to obvious, testable failures. Problems caught in review decreased from once-a-day to once-a-week. Content and design issues in the final email became near-zero in the rest of my time there.

## c. Longevity

The developers who became responsible for email production after me received this tool and were also able to reap the benefits. The time and accuracy improvements remained, and they were able to adapt the configuration and templates when the needs changed, when a new course launched and branding shifted.

## d. Conclusion

This project became much more than an internal tool. It was a lesson in how to improve a critical system without breaking the trust people have built around it. I wasn’t just speeding up email production; I was redesigning a process that touched deliverability, review culture, and the organization’s day-to-day ability to operate.

My role combined systems design, product judgment, and pragmatic engineering. I identified where the real bottlenecks were, built a flexible technical foundation to remove them, and kept the solution compatible with the workflows the team already relied on. Instead of replacing the process outright, I focused on making it faster, safer, and easier to trust.

That approach shaped how I think about iterating on systems. The best solutions are not always the most novel ones; often, they are the ones that meet people where they are, reduce risk, and create room for better work to happen.

“By prioritizing trust, backwards compatibility, and clear operational wins, I was able to make a critical organizational process both faster and more dependable.”`;
