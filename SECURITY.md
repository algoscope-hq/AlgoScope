# Security Policy

Thanks for helping keep AlgoScope and its users safe.

## Supported Versions

AlgoScope is under active development. Security updates are provided for the
latest release on the `main` branch only. Older tags and forks are not
covered by this policy.

| Version | Supported          |
| ------- | ------------------ |
| `main` (latest) | :white_check_mark: |
| older / archived | :x:                |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security problems.** Public
issues make the vulnerability visible to anyone before a fix can ship, which
puts current users at risk.

Use one of the following private channels instead:

1. **GitHub Private Vulnerability Reporting** (preferred) —
   Open [Report a vulnerability](https://github.com/algoscope-hq/AlgoScope/security/advisories/new)
   on the repository's Security tab. This creates a private advisory only
   visible to the maintainers.
2. **Discord direct message** — Reach a maintainer in the
   [AlgoScope Discord](https://discord.gg/xxFRGj82xS) and request a private
   channel for the disclosure.

When reporting, please include:

- A clear description of the vulnerability and its potential impact.
- Steps to reproduce (proof-of-concept code, screenshots, or a minimal repo
  are very welcome).
- Affected versions or commit SHAs.
- Any suggested remediation, if you have one.

## What to Expect

| Stage                | Target time           |
| -------------------- | --------------------- |
| Initial acknowledgement | within **3 business days** |
| Triage + severity assessment | within **7 business days** |
| Fix or mitigation plan       | within **30 days** for high/critical issues |
| Public disclosure            | coordinated with the reporter, typically after a fix is released |

We will keep you updated as we investigate, and we will credit you in the
release notes once the fix ships (unless you ask us not to).

## Responsible Disclosure

We follow a coordinated-disclosure model. We ask that reporters:

- Give us a reasonable window to investigate and patch before any public
  disclosure.
- Avoid accessing, modifying, or destroying data that does not belong to you
  while researching the issue.
- Avoid degrading the service for other users (no DoS / spam) while testing.

In return, we commit to:

- Responding promptly and treating you respectfully.
- Not pursuing legal action against good-faith security research that
  follows this policy.
- Crediting you for the report unless you prefer to remain anonymous.

## Scope

In scope:

- The AlgoScope web application source in this repository.
- Build, test, and CI configuration committed to this repository.

Out of scope:

- Third-party services we link to (Discord, GitHub Pages, etc.) — please
  report those upstream.
- Vulnerabilities that require physical access to a user's machine or
  pre-installed malware.

---

Thank you for helping keep AlgoScope and its community safe.
