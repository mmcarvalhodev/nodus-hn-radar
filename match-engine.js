// NODUS HN Radar — Watchlist match engine (Phase 3a)
// ---------------------------------------------------
// Pure logic. Given a rule and an enriched post, return true if the rule
// matches the post. Phase 3a supports flat predicates (implicit AND) over
// 3 numeric fields: points, comments, velocity. Operators: gte, lte, eq.
//
// Phase 3b will extend this with composable AND/OR trees and more fields
// (type, domain, tags, title, op_active, age_hours) — that work plugs
// into evaluatePredicate() and a new evaluateConditionTree().

import { extractDomain, detectItemType } from "./hn-data.js";
import { computeVelocityDetail } from "./storage.js";

// Build an enriched view of a HN post that the engine can read predicates
// against. Centralized so engine, watcher and bell all see the same shape.
export function enrichPost(rawPost) {
  if (!rawPost) return null;
  const type = (detectItemType(rawPost.title) || "plain").toUpperCase();
  const domain = extractDomain(rawPost.url);
  const ageHours = Math.max(
    0,
    (Date.now() / 1000 - (rawPost.time || 0)) / 3600
  );
  const vel = computeVelocityDetail(rawPost);
  return {
    id:         rawPost.id,
    title:      rawPost.title || "",
    url:        rawPost.url || "",
    by:         rawPost.by || "",
    time:       rawPost.time || 0,
    points:     Number(rawPost.score)       || 0,
    comments:   Number(rawPost.descendants) || 0,
    velocity:   Math.round(vel.current || 0),
    velocityDelta: vel.delta,
    type,       // SHOW | ASK | LAUNCH | TELL | POLL | PLAIN
    domain,
    ageHours,
  };
}

const FIELDS = new Set(["points", "comments", "velocity"]); // Phase 3a only
const OPS    = new Set(["gte", "lte", "eq"]);               // Phase 3a only

export function evaluatePredicate(field, pred, enriched) {
  if (!FIELDS.has(field) || !pred || typeof pred !== "object") return false;
  const actual = Number(enriched[field]);
  if (!Number.isFinite(actual)) return false;
  for (const [op, value] of Object.entries(pred)) {
    if (!OPS.has(op)) continue;
    const v = Number(value);
    if (!Number.isFinite(v)) continue;
    if (op === "gte" && !(actual >= v)) return false;
    if (op === "lte" && !(actual <= v)) return false;
    if (op === "eq"  && !(actual === v)) return false;
  }
  return true;
}

// A rule matches when ALL its predicates pass (implicit AND).
// At least one predicate must be defined — empty predicates = always match,
// which is undesirable, so we reject empty rules.
export function evaluateRule(rule, enriched) {
  if (!rule || !rule.enabled) return false;
  const preds = rule.predicates || {};
  const keys = Object.keys(preds);
  if (keys.length === 0) return false;
  for (const field of keys) {
    if (!evaluatePredicate(field, preds[field], enriched)) return false;
  }
  return true;
}

// Human-readable summary of a rule's predicates ("pts ≥ 200 AND comments ≥ 50").
// Used in the Watch tab card. Pure formatting — no i18n yet because the
// operators are universal symbols.
export function summarizeRule(rule) {
  if (!rule || !rule.predicates) return "";
  const parts = [];
  const labels = { points: "pts", comments: "comments", velocity: "velocity" };
  const ops    = { gte: "≥",     lte: "≤",            eq:  "=" };
  for (const [field, pred] of Object.entries(rule.predicates)) {
    const label = labels[field] || field;
    for (const [op, val] of Object.entries(pred || {})) {
      if (!OPS.has(op)) continue;
      parts.push(`${label} ${ops[op]} ${val}`);
    }
  }
  return parts.join(" AND ");
}
