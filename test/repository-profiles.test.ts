import assert from "node:assert/strict";
import test from "node:test";

import {
  KEITARO_OPENCLAW_OPS_TARGET_REPO,
  REPOSITORY_PROFILES,
  isAutoCloseAllowed,
  repositoryProfileFor,
} from "../dist/repository-profiles.js";

test("repositoryProfileFor matches mixed-case input against canonical profiles", () => {
  const profile = repositoryProfileFor("OpenClaw/ClawHub");

  assert.equal(profile.targetRepo, "openclaw/clawhub");
  assert.equal(profile.slug, "openclaw-clawhub");
});

test("profile lookup normalizes candidate target repos as well as input", () => {
  const mixedCaseProfile = {
    ...REPOSITORY_PROFILES[0],
    targetRepo: "Example-Org/Mixed-Case-Repo",
    slug: "example-org-mixed-case-repo",
  };
  REPOSITORY_PROFILES.push(mixedCaseProfile);

  try {
    assert.equal(repositoryProfileFor("example-org/mixed-case-repo"), mixedCaseProfile);
    assert.equal(repositoryProfileFor("EXAMPLE-ORG/MIXED-CASE-REPO"), mixedCaseProfile);
  } finally {
    REPOSITORY_PROFILES.pop();
  }
});

test("Keitaro OpenClaw ops backup profile is pilot read-only for close decisions", () => {
  const profile = repositoryProfileFor(KEITARO_OPENCLAW_OPS_TARGET_REPO);

  assert.equal(profile.slug, "keitarooooo-openclaw-workspace-backup");
  assert.equal(profile.checkoutDir, "openclaw-workspace-backup");
  assert.equal(isAutoCloseAllowed(profile, "issue", "implemented_on_main"), false);
  assert.equal(isAutoCloseAllowed(profile, "pull_request", "implemented_on_main"), false);
  assert.equal(isAutoCloseAllowed(profile, "issue", "duplicate_or_superseded"), false);
});
