export default `In 2025, I participated in a Web Dev Fellowship at Center Centre—a UX-focused professional education company—owning development and maintenance of their suite of websites. As an online organization, its websites are essential for public presence, as the primary source of information on courses, and as the point-of-sale for enrolling students.

Each of Center Centre’s courses has a dedicated website with topics, <abbr title='The courses are offered on a rolling basis—usually once a month—and students select an upcoming cohort to enroll in. When a cohort starts, students participate in a schedule of online sesssions alongside other members of their cohort.'>cohort schedules</abbr>, and enrollment options. When I arrived, these sites had just been migrated from vanilla HTML/CSS/JS to a new React/Vite stack. React was chosen to be a modern foundation for new development, and Vite had provided a smooth transition. Vite bundles the React code into a <abbr title='A static website is delivered to the user as a collection of ready-to-go files. Because it does not require live storage or server-side processing, it is highly secure, fast, and inexpensive to host. For example, a simple HTML/CSS/JS project uploaded to Github Pages or Netlify.'>static site</abbr>, which can be deployed similarly to the previous versions. Without the need for a server-side setup, we were able to keep our cost-efficient hosting and simple QA process.

FIGURE (Image of Cohort Selector)

However, not everything on these sites was static. On most pages, a call-to-action ‘selector’ lists courses’ upcoming cohorts, with dates and links that need to stay current. To avoid tediously re-deploying this content each week, the previous developers maintained a database of course schedules in <abbr title='Airtable is a low-code database platform. It provides a user-friendly spreadsheet interface and spreadsheet-like relational tools to manage and link records. Developers can query the tables with a RESTful API.'>Airtable</abbr> and pulled them on page load. The schedule fetch was an effective middle ground between dynamic and static: Airtable streamlined the schedule turnover, while the rest of the site stayed lightweight, reliable, and low-maintenance.

FIGURE (Flowchart of Initial Solution)

The schedule fetch, though, had a critical downside: latency. The cohorts often didn’t load until 5-10 seconds after the rest of the page. Airtable’s API was not designed to be a CDN, so it would frequently give slow responses to the elevated traffic. And more so, the client-side fetch couldn’t even begin until the website’s code had completely finished loading. Together, these factors created an unmistakably long pause between 1. the webpage displaying and 2. the upcoming cohorts _finally_ appearing. A “Loading…” placeholder prevented confusion, but it didn’t make up for leaving this key touchpoint out-of-order for so long.

FIGURE (Videos of initial loading time - home & cohort pages)

This delay was at odds with the websites’ core value to both users and the business. Until the Airtable data loaded, the list of available cohorts—and the enrollment buttons tied to them—were completely absent. For 5-10 additional seconds after page load, which is not insignificant for UX at scale, users are unable to evaluate their options or take their next step. As a mandatory step for enrollment and a critical conversion point, friction here needed to be addressed with priority.

# Searching for a Strategic Intervention

The industry-standard solutions for this issue, unfortunately, would have required sweeping changes. Usually, websites that display dynamic content like this are rendered server-side. A server would be able to remember Airtable’s responses locally and reuse them instantly for each client. A server-side framework, though, would have required a new type of hosting, restructuring QA, and a higher skill floor for an unfamiliar team. Possible, but not a cheap solution for a localized issue. Before committing to this path, I opted to explore some more ‘in-place’ fixes. 

The first solution that came to mind: create a static version of the dynamic content. By periodically downloading the schedules from Airtable and saving them into a local file, the websites could be bundled with all the data they’d need. However, it would be difficult to do this without hard-coding a bunch of data-structure and course-specific logic. 

The websites make a series of inter-dependent Airtable API calls that change based on the course, the month, and the scheduled cohorts. Every time a course or website changes, the script that compiles the data would need to be rewritten. With the risk of tech-debt, combined with the need to automatically update and re-publish the pre-loaded files, I put a pin in this idea.

‘Pre-load’ solutions seemed inherently annoying to implement, as they front-load the complexity of anticipating exactly what the websites need. If a solution responded to website needs in real time instead, it could be a lighter-weight alternative.

I drafted an idea for a simple ‘runtime’ intervention: a service that serves as a middleman between our sites and the Airtable API, cacheing and reusing Airtable’s responses for repeat requests. This service would be easy to implement and would adapt based on the requests that the websites were already making.

# Deploying a Lightweight Proxy

We already had a DigitalOcean droplet that could host an ongoing service like this, so it only took an hour or so to draft and upload a simple Next.js app to test out the idea. After pointing the API calls to the new Next.js app’s URL, the extra load time reduced significantly.

FIGURE (Flow chart of runtime middleman cache)

After an initial ‘<abbr title='All API calls need to be made once before they can be added to a cache. This means the first load still had a full 5-10 delay. Luckily, this only needs to happen once per site per cache, which means end users practically never experience this.'>priming</abbr>’ load, the middleman had a full key-value dictionary of all data the websites needed. Only a few more lines of code were needed for <abbr title='Refreshing cached data periodically by re-requesting data and saving the latest version; keeping data up-to-date'>revalidation</abbr> and <abbr title='Forgetting cached responses when they go unused for an extended period; keeping the cache optimized for current needs'>eviction</abbr>. 

FIGURE (Videos of runtime cache loading time - home & cohort pages)

The implementation was also completely neutral to specific requests, websites, and data structures. No matter how the schedules and API queries are formatted, they can all be stored the same as strings in a request-response dictionary. Future features, courses, and websites would require no additional setup.

FIGURE (Pros Cons chart of initial solutions)

An interesting problem emerged for one of the websites, however. The site for our longest course had an extra latency: two 16-week cohorts appeared quickly, but the third cohort consistently took a full 5-10 seconds, which indicated a cache-miss. The key-value cache relies on a one-to-one relationship between requests and responses. While inspecting the data, I noticed Airtable’s pagination system <abbr title='Airtable generates an ID for each page to prevent ongoing edits from unpredictably offsetting paginated requests.'>generates a random ID for each page over 100 records</abbr>. With an unpredictable ID in the request, the cache would be unable to identify the corresponding responses. There wasn’t a simple way to prevent this, especially with the asynchronous revalidation, so I opted to have the middleman automatically merge paginated data on receipt. This fix unfortunately locked us into Airtable as the API provider, but it was necessary for a compact and reliable middleman.

# Why Wait for the Fetch?

The middleman had stopped the egregious loading times, but a 1-2 second delay was still subpar compared to industry standard. Server-side rendering would insert the data _before_ the page is shown. Our API calls were still only starting _after_ page load. 

Only an aforementioned ‘pre-load’ approach would be able to overcome this limitation; a complete bundle of data being ‘pre-loaded’. I seconded this approach above because these API calls change constantly, and would’ve required a new high-maintenance project just to anticipate.

Luckily, we had just incidentally created a complete, automated inventory of all the necessary data for each website: the middleman’s running cache. The cache has each in-use request and its complete, corresponding response from Airtable. And its kept up-to-date automatically: when a cohort goes off of sale, the unused requests are evicted; when a new cohort is scheduled, all the new responses are added within minutes.

By design, the middleman is maintaining exactly what we would need to ‘pre-load’ our data. If the clients could download this cache as a file, the websites would no longer need to make any network requests at all. Plus, as a static file, it could be downloaded _concurrently_ with the rest of the website. The cached data would be loaded locally before the page even renders. 

FIGURE (Flowchart of preload solution)

I couldn’t find examples of other people downloading caches like this, but it seemed well worth pursuing. In the middleman’s code, I saved the cache dictionaries for each site periodically into a publicly-accessible JavaScript file. Through some pre-written code around the dictionary data, the scripts save the cache to a global variable, allowing our websites to import it concurrently like any other script/font/style asset and use the data anywhere. 

On the front-end, I added a line to the HTML header of each site that imports its JavaScript cache file. In the React code, I had the clients check this downloaded cache anytime they’re about to make a remote fetch. If they find pre-loaded data for the request, they skip making a remote call altogether.

FIGURE (Videos of preload solution loading time - home & cohort pages)

This worked so well, it was hard to believe. The live data appeared instantly, at the same time as all other text on the screen. All the sequential logic—locating upcoming cohorts, fetching their schedules, populating pages and components—was running locally and invisibly; at the full speed of the CPU.

FIGURE (Pros Cons chart of final solutions)

These websites are business-critical. They drive enrollment, which is Center Centre’s primary revenue source. With the unique ‘pre-loaded cache’ setup, the core feature of these sites finally felt fully integrated. At first glance, potential students and clients could now see the website’s full content and design exactly as crafted by our team.

With the middleman service acting as both a runtime cache and a static ‘snapshot provider,’ it is able to provide responses to requests before they are made: effectively ‘anticipating’ anything that the website might ask for. When the schedules roll over and the code starts making new queries, it only takes one priming fetch to add the new cohort to the static bundle. No ongoing maintenance is necessary: this process happens in the background for each new schedule, website, and Airtable configuration.

If the droplet were to freeze or go offline, the client code’s fetch function has a built-in fallback. Since no changes were made to how the Airtable responses are formatted and parsed, everything is backwards compatible with the previous, 5-10 second latency method. So if the static cache misses or fails, the client fetches from the middleman. If the middleman doesn’t respond, the client calls the Airtable API directly. With the fallbacks, the worst case scenario is just business as usual, allowing universal implementation without sacrificing reliability.

# Beyond the Better Latency

Overall, the service only totaled to 270 lines of code. While it is designed to be robust and hands-free, a need for maintenance is always possible. With such a small codebase, though, the ‘tech debt’ footprint is minimized. Equipped with documentation, junior developers were able to take complete ownership and effectively manage the system during the December 2025 Next.js vulnerability. When the droplet became unresponsive, they located the issue and re-deployed the cache service within a few hours.

As we transitioned more Center Centre websites to React, the access to instant dynamic content allowed us to create a range of new features: course schedules aggregated on one page, dynamic links to articles and videos, and data-driven forms. Without the static cache, these powerful marketing and operational tools would have greatly suffered in usability and been far less feasible overall. Instead, they were simple to implement and required no additional configuration of the cache to begin serving new types of content. These features supported the marketing of a number of programs and ended up being critical to the launch of a new product that bundled courses together.

FIGURE (Videos of aggregated schedules on one page)

With an investment into thoughtful system design, our websites were able to receive the benefits of server-side rendering without bulldozing all of our existing technical and operational setup. The unique solution we arrived at excels in its specific use-case—converting dynamic content to static  for zero-latency client-side fetches—with strategically minimized cost, risk, and technical debt. 

If anyone found themselves in a similar situation and wanted to expand on the project, there are a number of opportunities for scalability. While API-specific behaviors proved necessary, those behaviors could be applied dynamically while supporting any API provider. To optimize speed beyond what was necessary for us, the static cache files could be periodically pushed to CDNs, and their infrastructure could take care of the distribution.

The project is a great demonstration for me on how important planning and experimentation are, especially for lightweight solutions. This latency could have easily motivated a high-maintenance or expensive project, but instead it was solved with just a few hundred lines of easy-to-read, self-maintaining code. Often, I feel like opting towards modernization at any cost can miss the opportunity and insight that getting to know problems more intimately can offer.`;
