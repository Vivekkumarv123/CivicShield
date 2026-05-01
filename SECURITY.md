# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

CivicShield takes security seriously. If you discover a vulnerability, please report it via the repository issues with the label `security` or contact the maintainers directly.

We implement strict sanitization via **DOMPurify** and runtime schema validation via **Zod** to prevent common vectors like XSS and Injection.
