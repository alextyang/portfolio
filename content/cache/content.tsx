export default `In 2025, I owned development and maintenance for Center Centre's course sites, where prospective students compared upcoming cohorts and followed enrollment links. Those controls often appeared 5–10 seconds after the rest of the page.

I built a 270-line Next.js cache service and integrated it in two stages. Warm proxy hits cut the wait to 1–2 seconds; a periodically generated snapshot removed the separate API request on snapshot hits. The sites remained statically hosted, and uncached requests could still fall back to Airtable.

# The problem: enrollment actions arrived last

Center Centre's course sites had recently moved from vanilla HTML, CSS, and JavaScript to React and Vite. They remained statically hosted, which kept deployment inexpensive and easy for a small team to review.

Course schedules could not be static. Dates, topics, and enrollment links changed frequently, so each page fetched current records from Airtable in the browser. This hybrid setup was operationally simple, but slow for prospective students.

FIGURE (Image of Cohort Selector | This selector exposed upcoming cohort dates and enrollment links—the page's main call to action.)

The browser could not request schedule data until the application loaded. Some pages then made several dependent Airtable requests. The shell appeared first, while the information needed to compare cohorts or enroll remained missing for another 5–10 seconds.

FIGURE (Flowchart of Initial Solution)

FIGURE (Videos of initial loading time - home & cohort pages | Before the cache, enrollment content appeared 5–10 seconds after the page shell. Cohort-heavy pages also waited on several dependent Airtable requests.)

# Why I did not move the sites to SSR

Server-side rendering could have put the schedule data into the first response, but adopting it for this latency problem would also have changed hosting and the team's deployment and QA routines. That left a narrower target: keep Airtable and static deployment, and avoid duplicating each site's schedule-query logic in a second system.

My first idea was a periodic static export. I dropped it because the required queries varied by course, month, and cohort; each change would have to be mirrored in the exporter. A proxy keyed by the requests the sites already made could cache those responses without learning each site's data model.

# Phase 1: cache requests at runtime

Center Centre already had a DigitalOcean droplet that could host a small persistent service. Within an hour, I had a Next.js proof of concept running.

The proxy accepted the same requests as Airtable, checked an in-memory cache for a matching response, and returned it when available. On a miss, it forwarded the request to Airtable and stored the response for the next visitor. I then added background refreshes and eviction for requests that were no longer used.

FIGURE (Flow chart of runtime proxy cache)

After the cache warmed, dynamic content appeared in 1–2 seconds instead of 5–10. Except for pagination, the proxy used the request URL as its cache key and did not need to know a site's schema. New courses and query shapes therefore worked after the first miss, with no cache-specific setup.

FIGURE (Videos of runtime cache loading time - home & cohort pages | Phase 1 reduced the wait to 1–2 seconds after warm-up. Data-heavy pages still shifted when the responses arrived.)

FIGURE (Pros Cons chart of initial solutions)

## Resolving an Airtable pagination edge case

Testing uncovered one exception. On the site for Center Centre's longest course, two cohorts loaded quickly while a third consistently missed the cache.

Airtable supplied an opaque \`offset\` token for the next request when a query returned more than 100 records. Because that token changed, second-page URLs did not reliably match earlier cache keys.

I changed the proxy to follow Airtable's pagination itself and cache one merged response under the original request. That gave up provider independence, but these sites already depended on Airtable; reliable revalidation mattered more.

# Phase 2: make cached data available before the request

The proxy removed most of the delay, but the browser still could not ask for data until the application loaded. To remove that remaining round trip, I returned to the static-file idea with a new observation: the proxy had already created an automatically maintained inventory of every response each site used.

The cache contained both sides of the problem: the current request URLs and their complete Airtable responses. Active queries stayed fresh through background revalidation; unused queries were evicted. That made it possible to generate a static snapshot without rebuilding the sites' schedule logic elsewhere.

FIGURE (Flowchart of preload solution)

I periodically serialized each site's active cache into a public JavaScript file. The browser loaded that file alongside the application's other assets and checked it before making a network request.

A snapshot hit resolved locally. A miss fell through to the proxy and, if necessary, directly to Airtable. New queries needed one priming request before appearing in a later snapshot; refresh and eviction happened automatically after that.

FIGURE (Videos of preload solution loading time - home & cohort pages | After phase 2, cached course data rendered with the rest of the page instead of appearing seconds later.)

The first successful snapshot was startling: a cohort-heavy page that had assembled itself over several seconds now appeared complete at once. Finding active cohorts, retrieving their schedules, and populating components could all run against local data without separate API round trips.

FIGURE (Pros Cons chart of final solutions)

# Misses still reached Airtable

The two cache layers sat in front of the original request path:

1. The browser checked the preloaded snapshot.
2. A miss went to the runtime proxy.
3. An unavailable proxy fell through to Airtable.

I did not change the format of Airtable responses or the way the sites parsed them. A snapshot hit avoided a separate API request; a miss or unavailable proxy degraded to the old direct-Airtable behavior.

The tradeoff was freshness. Snapshot data could lag Airtable by the cache-revalidation and file-generation intervals. That was acceptable for schedule data, and a new request shape entered the proxy after one miss and appeared in a later snapshot.

# What the cache enabled

The Next.js service itself totaled 270 lines. Once a site routed its Airtable requests through it, new query shapes did not require cache-specific configuration.

The handoff was tested in practice. During the response to a December 2025 Next.js vulnerability, the droplet became unresponsive; developers new to the service used the deployment and recovery notes to diagnose it and redeploy within a few hours, without my involvement.

The cache later powered an aggregated course schedule, dynamic resource links, and data-driven forms. Those features supported the marketing of several programs and the launch of a bundled-course product.

FIGURE (Videos of aggregated schedules on one page | The cache later supported a unified schedule and other Airtable-backed content spanning Center Centre's courses, programs, and events.)

# What I would repeat

The part I would repeat is the sequence, not this exact cache. The first proxy took about an hour to test and solved most of the latency. Running it exposed the remaining client-side wait—and supplied the request inventory that made the snapshot possible. Learning the existing system closely produced a smaller answer than replacing it.`;
