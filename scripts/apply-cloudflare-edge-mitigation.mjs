#!/usr/bin/env node

const API_BASE = "https://api.cloudflare.com/client/v4";
const ZONE_NAME = process.env.CLOUDFLARE_ZONE_NAME ?? "alexya.ng";
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const isDryRun = process.argv.includes("--dry-run");
const includedPhases = process.env.CLOUDFLARE_RULE_PHASES
  ? new Set(process.env.CLOUDFLARE_RULE_PHASES.split(",").map((phase) => phase.trim()).filter(Boolean))
  : null;

const rules = [
  {
    phase: "http_request_dynamic_redirect",
    rulesetName: "Portfolio redirect rules",
    rule: {
      ref: "portfolio_www_to_apex",
      description: "Portfolio: redirect www to apex before Vercel",
      enabled: true,
      expression: `http.host eq "www.${ZONE_NAME}"`,
      action: "redirect",
      action_parameters: {
        from_value: {
          target_url: {
            expression: `concat("https://${ZONE_NAME}", http.request.uri.path)`,
          },
          status_code: 301,
          preserve_query_string: true,
        },
      },
    },
  },
  {
    phase: "http_request_dynamic_redirect",
    rulesetName: "Portfolio redirect rules",
    rule: {
      ref: "portfolio_case_emails_trailing_slash",
      description: "Portfolio: redirect emails case trailing slash before Vercel",
      enabled: true,
      expression: `http.host in {"${ZONE_NAME}" "www.${ZONE_NAME}"} and http.request.uri.path eq "/case/emails/"`,
      action: "redirect",
      action_parameters: {
        from_value: {
          target_url: {
            value: `https://${ZONE_NAME}/case/emails`,
          },
          status_code: 301,
          preserve_query_string: true,
        },
      },
    },
  },
  {
    phase: "http_request_dynamic_redirect",
    rulesetName: "Portfolio redirect rules",
    rule: {
      ref: "portfolio_case_cache_trailing_slash",
      description: "Portfolio: redirect cache case trailing slash before Vercel",
      enabled: true,
      expression: `http.host in {"${ZONE_NAME}" "www.${ZONE_NAME}"} and http.request.uri.path eq "/case/cache/"`,
      action: "redirect",
      action_parameters: {
        from_value: {
          target_url: {
            value: `https://${ZONE_NAME}/case/cache`,
          },
          status_code: 301,
          preserve_query_string: true,
        },
      },
    },
  },
  {
    phase: "http_request_cache_settings",
    rulesetName: "Portfolio cache rules",
    rule: {
      ref: "portfolio_cache_static_site",
      description: "Portfolio: cache static site at Cloudflare before Vercel",
      enabled: true,
      expression: `http.host eq "${ZONE_NAME}" and http.request.method in {"GET" "HEAD"}`,
      action: "set_cache_settings",
      action_parameters: {
        cache: true,
        cache_key: {
          custom_key: {
            query_string: {
              exclude: {
                all: true,
              },
            },
          },
        },
        edge_ttl: {
          mode: "override_origin",
          default: 86400,
          status_code_ttl: [
            {
              status_code_range: { from: 300, to: 399 },
              value: 3600,
            },
            {
              status_code_range: { from: 400, to: 499 },
              value: 300,
            },
            {
              status_code_range: { from: 500 },
              value: -1,
            },
          ],
        },
        browser_ttl: {
          mode: "respect_origin",
        },
      },
    },
  },
  {
    phase: "http_request_firewall_custom",
    rulesetName: "Portfolio WAF custom rules",
    rule: {
      ref: "portfolio_block_non_read_methods",
      description: "Portfolio: block non-GET/HEAD requests before Vercel",
      enabled: true,
      expression: `http.host in {"${ZONE_NAME}" "www.${ZONE_NAME}"} and not http.request.method in {"GET" "HEAD"}`,
      action: "block",
    },
  },
  {
    phase: "http_request_firewall_custom",
    rulesetName: "Portfolio WAF custom rules",
    rule: {
      ref: "portfolio_block_obvious_bot_probes",
      description: "Portfolio: block obvious CMS/env/probe traffic before Vercel",
      enabled: true,
      expression: [
        `(http.host in {"${ZONE_NAME}" "www.${ZONE_NAME}"})`,
        "and",
        "(",
        'starts_with(lower(http.request.uri.path), "/wp-")',
        'or starts_with(lower(http.request.uri.path), "/wordpress")',
        'or starts_with(lower(http.request.uri.path), "/.env")',
        'or starts_with(lower(http.request.uri.path), "/.git")',
        'or starts_with(lower(http.request.uri.path), "/admin")',
        'or starts_with(lower(http.request.uri.path), "/phpmyadmin")',
        'or starts_with(lower(http.request.uri.path), "/vendor/")',
        'or lower(http.request.uri.path) eq "/xmlrpc.php"',
        'or lower(http.request.uri.path) eq "/.well-known/security.txt.php"',
        'or ends_with(lower(http.request.uri.path), ".php")',
        'or ends_with(lower(http.request.uri.path), ".asp")',
        'or ends_with(lower(http.request.uri.path), ".aspx")',
        'or ends_with(lower(http.request.uri.path), ".jsp")',
        'or ends_with(lower(http.request.uri.path), ".cgi")',
        'or ends_with(lower(http.request.uri.path), ".action")',
        'or ends_with(lower(http.request.uri.path), ".do")',
        ")",
      ].join(" "),
      action: "block",
    },
  },
  {
    phase: "http_request_firewall_custom",
    rulesetName: "Portfolio WAF custom rules",
    rule: {
      ref: "portfolio_block_unknown_paths",
      description: "Portfolio: block paths that cannot resolve before Vercel 404s",
      enabled: true,
      expression: [
        `(http.host in {"${ZONE_NAME}" "www.${ZONE_NAME}"})`,
        "and not",
        "(",
        'http.request.uri.path in {"/" "/case/emails" "/case/emails/" "/case/cache" "/case/cache/" "/robots.txt" "/sitemap.xml" "/favicon.ico" "/icon.svg" "/AlexanderYang_Resume.pdf"}',
        'or http.request.uri.path eq "/_next/image"',
        'or starts_with(http.request.uri.path, "/_next/static/")',
        'or (starts_with(http.request.uri.path, "/about/") and ends_with(lower(http.request.uri.path), ".mp4"))',
        'or (starts_with(http.request.uri.path, "/case/cache/") and (ends_with(lower(http.request.uri.path), ".mp4") or ends_with(lower(http.request.uri.path), ".png")))',
        'or (starts_with(http.request.uri.path, "/case/emails/") and (ends_with(lower(http.request.uri.path), ".mp4") or ends_with(lower(http.request.uri.path), ".png")))',
        'or http.request.uri.path in {"/case/brands/poster.png" "/case/iot/poster.png" "/case/songs/poster.png"}',
        'or starts_with(http.request.uri.path, "/cdn-cgi/")',
        ")",
      ].join(" "),
      action: "block",
    },
  },
];

function printDryRun() {
  console.log(JSON.stringify({ zoneName: ZONE_NAME, zoneId: ZONE_ID ?? null, rules: getIncludedRules() }, null, 2));
}

function getIncludedRules() {
  if (!includedPhases) return rules;
  return rules.filter((rule) => includedPhases.has(rule.phase));
}

async function cloudflare(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${API_TOKEN}`,
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const bodyText = await response.text();
  const body = bodyText ? JSON.parse(bodyText) : null;

  if (!response.ok || body?.success === false) {
    const message = body?.errors?.map((error) => error.message).join("; ") || response.statusText;
    const error = new Error(`Cloudflare API failed: ${response.status} ${message}`);
    error.response = body;
    throw error;
  }

  return body;
}

async function resolveZoneId() {
  if (ZONE_ID) return ZONE_ID;

  const response = await cloudflare(`/zones?name=${encodeURIComponent(ZONE_NAME)}`);
  const zone = response.result?.[0];
  if (!zone?.id) {
    throw new Error(`Could not find Cloudflare zone for ${ZONE_NAME}`);
  }

  return zone.id;
}

async function getEntrypointRuleset(zoneId, phase) {
  const response = await fetch(`${API_BASE}/zones/${zoneId}/rulesets/phases/${phase}/entrypoint`, {
    headers: {
      authorization: `Bearer ${API_TOKEN}`,
      "content-type": "application/json",
    },
  });

  const bodyText = await response.text();
  const body = bodyText ? JSON.parse(bodyText) : null;

  if (response.status === 404) return null;
  if (!response.ok || body?.success === false) {
    const message = body?.errors?.map((error) => error.message).join("; ") || response.statusText;
    throw new Error(`Could not read ${phase} entrypoint: ${response.status} ${message}`);
  }

  return body.result;
}

async function upsertRule(zoneId, { phase, rulesetName, rule }) {
  const existing = await getEntrypointRuleset(zoneId, phase);

  if (!existing) {
    await cloudflare(`/zones/${zoneId}/rulesets`, {
      method: "POST",
      body: JSON.stringify({
        name: rulesetName,
        kind: "zone",
        phase,
        rules: [rule],
      }),
    });
    console.log(`created ${phase}: ${rule.ref}`);
    return;
  }

  const existingRules = existing.rules ?? [];
  const ruleIndex = existingRules.findIndex((existingRule) => existingRule.ref === rule.ref);
  const nextRules =
    ruleIndex === -1
      ? [...existingRules, rule]
      : existingRules.map((existingRule, index) => (index === ruleIndex ? { ...existingRule, ...rule } : existingRule));

  await cloudflare(`/zones/${zoneId}/rulesets/${existing.id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: existing.name || rulesetName,
      kind: existing.kind || "zone",
      phase,
      rules: nextRules,
    }),
  });

  console.log(`${ruleIndex === -1 ? "added" : "updated"} ${phase}: ${rule.ref}`);
}

async function main() {
  if (isDryRun) {
    printDryRun();
    return;
  }

  if (!API_TOKEN) {
    throw new Error("Set CLOUDFLARE_API_TOKEN before running this script.");
  }

  const zoneId = await resolveZoneId();
  console.log(`using zone ${ZONE_NAME} (${zoneId})`);

  for (const rule of getIncludedRules()) {
    await upsertRule(zoneId, rule);
  }
}

main().catch((error) => {
  console.error(error.message);
  if (error.response) console.error(JSON.stringify(error.response, null, 2));
  process.exit(1);
});
