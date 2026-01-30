export default `In 2025, I served as the Web Development Fellow at Center Centre, a UX-focused professional education company. During the fellowship, I owned the maintenance and development of Center Centre's suite of websites. As a fully online organization, its websites are essential to its operation: they function as a central public presence, the primary place for information on courses, and the point-of-sale for enrolling students.

Each course that Center Centre offers has a dedicated website with topics, schedules, and enrollment options. When I joined, these sites had just been migrated from vanilla HTML/CSS to a React and Vite stack. React was chosen as a modern foundation for new development, while Vite was selected for a smooth transition. Vite bundles the React code into a static site, which can be deployed in the same way as the HTML/CSS versions. With this client-side framework, we were able to keep our cost-efficient hosting setup and simple QA process despite the big transition.

FIGURE (Image of Cohort Selector)

Not everything on the course sites could be statically bundled, though. On almost every page, there is a call-to-action ‘selector’ that lists the upcoming cohorts for each course, information and links that need to stay current. To avoid tediously re-deploying this content each week, the previous developers maintained a database of upcoming cohort schedules in Airtable and fetched them dynamically on page load. This was a great middle ground between dynamic and static: Airtable made the continuous schedule turnover simple, while the rest of the site stayed lightweight, reliable, and low-maintenance.

FIGURE (Flowchart of Initial Solution)

The downside of this Airtable solution was latency. The cohorts usually didn’t load until 5-10 seconds after the rest of the page. Airtable’s API was slow, but since the sites are fully client-rendered, API calls couldn't even start until all the React had completely finished loading. This left an unavoidably long pause between the webpage loading and the CTAs appearing. Until I arrived, a “Loading…” placeholder was the stopgap. It prevented any confusion, but it didn’t make up for leaving this key touchpoint out-of-order for so long.

FIGURE (Videos of initial loading time - home & cohort pages)

This delay was negatively impacting the websites’ core value to both the users and Center Centre. Until the Airtable data loaded, the list of available cohorts—and the enrollment buttons tied to them—were missing. For 5-10 visible seconds, which is small but not insignificant in UX terms, users were unable to evaluate their options or take their next step. As a mandatory step in the enrollment journey, any added friction here needed to be addressed with priority.

The industry-standard solutions for this issue would have required sweeping changes. Usually, websites that need to display dynamic content like this are rendered server-side. A server would be able to remember Airtable’s responses locally and reuse them for each client. As a persistent process,  it could refresh its data in the background while providing a cached version of the schedules instantly. Migrating to a server-side framework, though, would have required a new type of hosting setup, a restructured QA process, and a suddenly higher skill floor for developers and collaborators. This would have been possible, but would not be a cheap solution for such a localized issue. Before committing to this path, I opted to invest in exploring some more surgical fixes. 

The first solution that came to mind was simple: create a static version of any dynamic content by pre-loading the schedules into a file. It would be difficult to implement this, though, without hard-coding data-structure and course-specific logic. The websites make a series of inter-dependent Airtable API calls that change month-to-month, and this logic would need to be replicated in a pre-load script. Every time a course or website changes, the script that compiled the data would need to be rewritten. Additionally, this file would need to be regenerated and deployed periodically, either by hand or in a dedicated server. 

All ‘pre-load’ solutions would introduce a level of development complexity, as they would need to anticipate website needs and keep themselves up-to-date independently. While doable, a ‘runtime’ solution could learn and adapt to website needs in real time instead, which could be a lighter-weight alternative.

A lightweight web service could serve as a ‘middleman’ between our sites and the Airtable API, keeping a persistent cache of responses it could reuse. We already had a DigitalOcean droplet that could host an ongoing service, so it only took a couple minutes to upload a Next.js app on the droplet to test it out. 

FIGURE (Videos of runtime cache loading time - home & cohort pages)

With the client code’s API calls switched to use the Next.js URL, it now took only 1-2 seconds to load cohorts. After one initial ‘priming’ load for each website, the middleman had a full key-value dictionary of necessary data. Through a string request-response dictionary, the data structure stays completely agnostic to the format of both the API requests and Airtable data; any change to the schedules or courses would work seamlessly. Only a few more lines of code were needed for revalidation (refreshing the data periodically) and eviction (forgetting unused responses).

FIGURE (Pros Cons chart of initial solutions)

FIGURE (Flow chart of runtime middleman cache)

There was a caveat to this approach. Our longest course had a strange extra latency: the first two 16-week cohorts appeared quickly, but the last cohort consistently took a full 5-10 seconds, which indicated a cache-miss. This key-value cache relies on a deterministic relationship between the requests and responses. Airtable’s pagination system, however, generates a random ID for each page over 100 records. With an unpredictable ID in the mix, some desired responses wouldn’t correspond to their stored request. Without a simple way to prevent this during revalidation, I opted to have the middleman automatically merge paginated data. While this hotfix locked us into Airtable as the API provider, it kept the cache dictionary compact and reliable.

The middleman had stopped the egregious loading times, but a 1-2 second delay was still subpar compared to industry standard: server-side rendering would insert the data _before_ the page is shown. Our API calls were still only starting _after_ page load. As mentioned above, only a ‘pre-load’ approach would be able to overcome this limitation. We avoided this approach because our API calls would have been difficult to anticipate, changing month-to-month based on the schedules currently on display. Manually locating which schedules to pre-load for each website would’ve required a new high-maintenance codebase, separate from all other projects.

Luckily for us, we had just incidentally created a self-maintaining inventory of API calls: _the middleman service’s cache_. This cache has every in-use request and its complete, corresponding response from Airtable. When a cohort goes off of sale, the old data is automatically evicted. When a new schedule is shown, all the website’s new requests are added immediately. 

As a system, the middleman is maintaining exactly what we would need to ‘pre-load’ our data. If the clients could download this cache as a file, the websites would no longer need to make any network requests at all. Plus, as a static file, it could be downloaded _concurrently_ with the rest of the website. This data could be loaded before the page even renders. I couldn’t find examples of other people downloading caches like this, but it seemed like an idea well worth pursuing in our situation.

In the middleman’s code, I saved the cache dictionaries for each site into a public JavaScript file. Through some pre-written code around the cache JSON, the text files save the cache data to a global variable, allowing our websites to import it concurrently like any other script/font/style asset and use that data anywhere. On the front-end, I imported each website’s cache file in the HTML header. Then, I had the clients check the downloaded cache anytime before every ‘fetch’. If it finds a pre-loaded response for its request, it skips making a remote call altogether.

FIGURE (Videos of preload solution loading time - home & cohort pages)

This worked so well, it was hard to believe. The live data appeared instantly, at the same time as all other text on the screen. All the sequential logic—locating upcoming cohorts, fetching their schedules, populating pages and components—was running synchronously and invisibly; at the full speed of the CPU.

FIGURE (Pros Cons chart of final solutions)

The course websites are business-critical. They drive enrollment, Center Centre’s primary revenue stream. With the unique ‘pre-loaded cache’ setup, the core features of these sites finally felt fully integrated. At their first glance, potential students and clients now see the website’s full content and design exactly as crafted by our team.

Between the middleman service acting both as a runtime cache and as a static snapshot provider, it is able to provide responses to requests before they are made: it effectively ‘anticipates’ any data that the website might ask for. If the websites code rolls over and starts requesting a new schedule, it only takes one priming fetch for that new cohort to begin being served in the static file. No ongoing maintenance is necessary: this process happens in the background, automatically adapting to new schedules, websites, and Airtable configurations.

FIGURE (Flowchart of preload solution)

If the droplet were to freeze or go offline, the client code’s fetch function has a built-in fallback. Since no changes were made to how the Airtable responses are formatted and parsed, everything is backwards compatible with the previous, 5-10 second latency method. So if the instant cache misses, the client calls to the middleman. And if the middleman doesn’t respond, the client calls the Airtable API directly. With the fallbacks, the worst case scenario is just business as usual, allowing the middleman to be implemented without sacrificing any reliability.

Overall, the service only totaled to two hundred lines of code. While it is designed to adapt in the background, a need for maintenance is always possible. With such a small codebase, though, the middleman had a minimized ‘tech debt’ footprint. Equipped with the documentation, junior developers were able to take complete ownership and effectively managed the system during the Next.js vulnerability. When the droplet became unresponsive, they isolated the issue and were able to rebuild and deploy the cache service within hours.

As more websites were transitioned to React, the instant dynamic content allowed us to create a range of new features: all courses’ schedules on one page, dynamic links to articles and videos, and data-driven enrollment forms. Without the static cache, these powerful marketing and operational tools would have suffered in usability, and been less feasible overall. Instead, they were simple to implement in the client code and the cache required no configuration to begin serving the new content. These features were critical to launching a new product that bundled courses together, and support the marketing of a number of services.

FIGURE (Videos of aggregated schedules on one page)

With an investment into thoughtful system design, our websites were able to receive the benefits of server-side rendering without bulldozing all of our existing technical and operational setup. Our unique solution excels in its specific use-case—zero-latency client-side fetches—by converting dynamic content to static with highly minimized cost, risk, and technical debt. 

If I wanted to expand on the project, I would make it scalable beyond what was necessary for us. While API-specific behaviors were necessary, it could easily middleman for any API provider or database, and it could integrate those specific fixes dynamically. To reach the logical limit of speed, you could also periodically push the static cache files to CDNs, and let their infrastructure take care of the distribution.

The project taught me how important planning and experimentation are for lightweight solutions. This latency could have turned into a thousand lines of high-maintenance code, but instead it was solved with just a hundred lines of easy-to-read, self-maintaining code. It also reaffirmed my love for lightweight interventions. Technically, a full-stack migration would have been doable but, operationally, would have introduced a significant set of challenges for other members of the team. Often, newer engineers opt towards modernization at any cost, and miss the opportunities that getting to know problems _more intimately_ can offer.`;
