export default `In 2025, I was a web dev fellow at Center Centre, a UX-focused professional education company, where I owned development and maintenance of their suite of websites. As an online-only organization, Center Centre's websites are an essential public presence, the primary source of information on their courses, and the point-of-sale for enrolling students.

Each of Center Centre’s courses has a website with topics, <abbr title='The courses are offered on a rolling basis—usually once a month—and students select an upcoming cohort to enroll in. When a cohort starts, students participate in a schedule of online sesssions alongside other members of their cohort.'>upcoming cohorts</abbr>, and enrollment pages. When I arrived, these sites had just been migrated from vanilla HTML/CSS/JS to a new React/Vite stack. 

React was chosen to be a modern foundation for new development, and Vite provided a smooth transition. Vite bundles the React code into a <abbr title='A static website is delivered to the user as a collection of ready-to-go files. Because it does not require live storage or server-side processing, it is highly secure, fast, and inexpensive to host. For example, a simple HTML/CSS/JS project uploaded to Github Pages or Netlify.'>static site</abbr>, which can be deployed similarly to the previous versions. By keeping the sites static, we were able to keep our cost-efficient hosting and simple QA process.

FIGURE (Image of Cohort Selector | A landing page for one of Center Centre's UX courses, featuring a call-to-action that lists the options for upcoming cohorts.)

Not all the content on these sites was purely static, though. The pages have a call-to-action that lists upcoming cohorts, with dates and links that need to stay current. To avoid re-deploying new versions of each selector every week, the previous fellows maintained a database in <abbr title='Airtable is a low-code database platform. It provides a user-friendly spreadsheet interface and spreadsheet-like relational tools to manage and link records. Developers can query the tables with a RESTful API.'>Airtable</abbr> with the schedules and pulled them on each page load. 

The schedule fetch was an effective middle ground between dynamic and static: Airtable enabled smooth schedule turnover, while the rest of the site stayed lightweight, reliable, and low-maintenance.

FIGURE (Flowchart of Initial Solution)

However, this Airtable fetch had a critical downside: latency. It would often take 5-10 additional seconds for the cohorts to load, after the rest of the page. 

Airtable’s API was not designed to be a CDN, so it would frequently give slow responses to the elevated traffic. And more so, the client-side fetch couldn’t even begin until the website’s code had completely finished loading. Together, these factors created an egregiously long pause between the webpage displaying and the page's key touchpoint appearing.

FIGURE (Videos of initial loading time - home & cohort pages | Almost all pages features dynamic content above the fold, and cohort-specific pages were almost entirely data-driven. On the timeline, the sequential requests have to all complete before the content renders.)

This delay was at odds with the websites’ core value to both the users and business. Until the Airtable data loaded, the list of available cohorts—and the enrollment buttons tied to them—were completely out-of-order. 

For a significant amount of time in UX terms, users are unable to evaluate their options or take a next step. These sites are a mandatory step for enrollment and a critical conversion point; friction here should be addressed as a priority.

# Searching for a Strategic Intervention

The industry-standard solutions for this issue would have required sweeping changes. Usually, websites that display dynamic content are rendered server-side. A server would be able to remember Airtable’s responses locally and populate them instantly for each client. 

A framework that supports <abbr title='Server-side rendering, where React code is run on a server; as opposed to client-side, static websites.'>SSR</abbr>, though, would have required a new type of hosting, a new QA structure, and a higher skill floor for a team that was unfamiliar with SSR. Such a migration would not have been a cheap solution for such a specific issue. I opted to explore some more localized fixes.

My first 'localized fix' idea: create a static version of the dynamic content. 

By periodically downloading the schedules from Airtable and saving them into a local file, the websites could access all the data they’d need. However, this would be difficult to implement without hard-coding a bunch of data-structure and course-specific logic. 

The websites need to make a series of Airtable API calls that change based on the course, the month, and the scheduled cohorts. Each time a course or website structure changes, any program that pre-compiles data would need to be rewritten. 

Considering the risk of headaches in the long-term, I put a pin in this idea. If a solution could respond to website needs in real time instead, it could be a robust and lighter-weight alternative.

I drafted out a possible ‘runtime’ intervention: a service that serves as a middleman between our sites and the Airtable API, caching and reusing Airtable’s responses. This service would be easy to implement and wouldn't need to front the complexity of the schedule querying logic.

# Deploying a Lightweight Proxy

We already had a DigitalOcean droplet that could host a persistent web service, so it only took an hour to draft and upload a simple Next.js app to test out this idea. It accepted any requests formatted for Airtable’s API, checked a local cache for a matching response, and either returned the cached response or forwarded the request to Airtable and saved the response for next time.

FIGURE (Flow chart of runtime middleman cache)

I switched the websites' code to direct API calls to this new Next.js app’s URL, and the load times changed significantly.

It only took 1-2 seconds of waiting before the dynamic content appeared. After an initial ‘<abbr title='All API calls need to be made once before they can be added to a cache. This means the first load still had a full 5-10 delay. Luckily, this only needs to happen once per site per cache, which means end users practically never experience this.'>priming</abbr>’ load, the middleman had a full key-value dictionary of all data the websites needed. And it was much faster to serve responses from memory than Airtable’s reluctant servers.

I only needed to add a few more lines of code for <abbr title='Refreshing cached data periodically by re-requesting data and saving the latest version; keeping data up-to-date'>revalidation</abbr> and <abbr title='Forgetting cached responses when they go unused for an extended period; keeping the cache optimized for current needs'>eviction</abbr>, and we had a completely hands-free caching service.

FIGURE (Videos of runtime cache loading time - home & cohort pages | The delay was now much better, only a few seconds at most. The data-driven pages, thought, still suffered from an awkward content shift after the requests returned.)

This implementation was also completely neutral to specific requests, websites, and data structures. No matter how the schedule data and API queries were formatted, they can be stored as strings in a HTTP request-response dictionary. 

Future features, courses, and websites that use Airtable's API would require no additional setup to work with this middleman.

FIGURE (Pros Cons chart of initial solutions)

An interesting problem emerged during testing, the site for our longest course had an extra latency: two 16-week cohorts appeared quickly, but the third cohort consistently took a full 5-10 seconds, which indicated a cache-miss. 

The key-value cache relies on a one-to-one relationship between requests and responses but, while inspecting the data, I noticed Airtable’s pagination system <abbr title='Airtable generates an ID for each page to prevent ongoing edits from unpredictably offsetting paginated requests.'>generates a random ID for each page over 100 records</abbr>. 

With an unpredictable ID in the request, the cache would be unable to identify the corresponding responses. There wasn’t a simple way to prevent this, especially with asynchronous revalidation, so I opted to have the middleman automatically merge paginated data on receipt. 

The fix unfortunately locked us into Airtable as the API provider, but it was necessary for a compact and reliable middleman.

# Why Wait for the Fetch?

The middleman had put out the fire, but a 1-2 second delay was still subpar compared to industry standard. Server-side rendering would insert the data before the page is shown. The API calls were finishing faster, but were still only starting after page load. 

Only a ‘pre-load’ approach, like my first idea, would be able to overcome this limitation; a complete bundle of data being ‘pre-loaded.’ I put a pin in this strategy above because the API calls change constantly, and would’ve required a new high-maintenance project just to anticipate.

Fortunately, we had just incidentally created a complete, automated inventory of all the necessary data for each website: the middleman’s running cache. 

The cache has each request that is currently in-use and its complete, corresponding response from Airtable. And its updated automatically: when a cohort goes off of sale, the unused requests are evicted; when a new cohort is scheduled, all the new responses are added within minutes.

The middleman happened to be maintaining exactly what we would need to ‘pre-load’ our data. 

If the clients could download this cache as a file, the websites would no longer need to make any network requests at all. Plus, as a static file, it could be downloaded _concurrently_ with the rest of the website. The cached data could be loaded locally before the page even renders. 

FIGURE (Flowchart of preload solution)

I couldn’t find examples of other people downloading caches like this, but it seemed well worth pursuing. 

In the middleman’s code, I saved the cache dictionaries for each site periodically into a publicly-accessible JavaScript file. Through some pre-written JavaScript in the file, the scripts save the cache data to a global variable, allowing our websites to import it concurrently like any other script/font/style asset and use the data anywhere.

In the websites' code, I added a line to the HTML header that imports the JavaScript cache file. Then, I had the clients check this downloaded cache when they’re about to make a remote fetch. If they find pre-loaded data for the request, they skip making a remote call altogether.

FIGURE (Videos of preload solution loading time - home & cohort pages | The data was now populating on first render, so even the most dynamic components and pages felt completely integrated into the site.)

This worked so well, it was hard to believe. The live data appeared instantly, at the same time as all other text on the screen. 

All the sequential logic—locating upcoming cohorts, fetching their schedules, populating pages and components—was running locally and invisibly; at the full speed of the CPU.

FIGURE (Pros Cons chart of final solutions)

These websites are business-critical. They drive enrollment, which is Center Centre’s primary revenue source. With the ‘static cache’, the primary feature of the sites was finally fully integrated. 

_At first glance_, potential students and clients could now see the website’s full content and design exactly as crafted by our team.

With the middleman service acting as both a runtime cache and a static snapshot provider, it is able to provide responses to requests before they are made: effectively ‘anticipating’ anything that the website might ask for. 

When the schedules roll over and the code starts making new queries, it only takes one priming fetch to add the new cohort to the static bundle. No ongoing maintenance is necessary: this process happens in the background for each new schedule, website, and Airtable configuration.

Since no changes were made to how the Airtable responses are formatted and parsed, everything is backwards compatible with the previous, 5-10 second latency method. So if the droplet were to freeze or go offline, the client code’s fetch function can use a built-in fallback. 

If the static cache misses or fails, the client fetches from the middleman. If the middleman doesn’t respond, the client calls the Airtable API directly. With the fallbacks, the worst case scenario is just business as usual, allowing universal implementation without sacrificing reliability.

# Beyond the Better Latency

Overall, the service only totaled to 270 lines of code. While it is designed to be robust and hands-free, a need for maintenance is always possible. With such a small codebase, though, the ‘tech debt’ footprint is minimized. 

Equipped with documentation, junior developers were able to take complete ownership and effectively manage the system during the December 2025 Next.js vulnerability. When the droplet became unresponsive, they located the issue and re-deployed the cache service within only a few hours.

As we transitioned more Center Centre websites to React, the access to instant dynamic content allowed us to create a range of new features: course schedules aggregated on one page, dynamic links to articles and videos, and data-driven forms. 

Without the static cache, these powerful marketing and operational tools would have greatly suffered in usability and been far less feasible overall. Instead, they were simple to implement and required no additional configuration of the cache to begin serving new types of content. 

These features supported the marketing of a number of programs and ended up being critical to the launch of a new product that bundled courses together.

FIGURE (Videos of aggregated schedules on one page | A new homepage for Center Centre relied heavily on the middleman, full of dynamic content and bridging the gap between various courses, programs, and events.)

With an investment into thoughtful system design, our websites were able to receive the benefits of server-side rendering without bulldozing all of our existing technical and operational setup. 

The unique solution we arrived at excels in its specific use-case—converting dynamic content to static  for zero-latency client-side fetches—with strategically minimized cost, risk, and technical debt. 

If anyone found themselves in a similar situation and wanted to expand on the project, there are a number of further opportunities for scalability. While API-specific behaviors proved necessary, those behaviors could be applied dynamically with support for any API provider. To optimize speed beyond what was necessary for us, the static cache files could be periodically pushed to CDNs, and their infrastructure could accelerate the distribution.

The project is a great demonstration for me on how important planning and experimentation are, especially for lightweight solutions. 

This latency could have easily motivated a high-maintenance or expensive project, but instead it was solved with just a few hundred lines of easy-to-read, self-maintaining code. 

Over time, I've learned that opting towards modernization at any cost can be alluring, but will often miss the opportunity and insight that getting to know your problems more intimately can offer.`;
