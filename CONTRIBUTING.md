# Contributing to AlgoScope

First off, thank you for considering contributing to AlgoScope! It's people like you that make AlgoScope such a great tool for the DSA community.

> [!IMPORTANT]
> If you are looking for a guided path to start your contributions, please refer to our **[Contribution Roadmap](CONTRIBUTION_ROADMAP.md)** which outlines specific phases and recommended projects.

Join our [Discord Community](https://discord.gg/xxFRGj82xS) to connect with other contributors and the maintainers!

## 🚀 How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on GitHub. Include:

- A clear title and description.
- Steps to reproduce the bug.
- Expected vs. actual behavior.
- Screenshots if applicable.

### Suggesting Enhancements

We love new ideas! If you have a suggestion for a new visualization or a feature:

1. Check if the enhancement has already been suggested.
2. Open a new issue with the tag `feature`.
3. Describe the feature and why it would be useful.

## 📋 Issue Claiming Policy

To ensure fair contribution opportunities for everyone, please follow these guidelines before claiming issues:

- Contributors may claim only **1 active issue at a time**.
- A new issue can be claimed only after the previous PR is merged or closed.
- If no meaningful progress/update is provided within **2–3 days**, maintainers may unassign the issue.
- Avoid claiming issues without the intention to actively work on them.
- Maintainers reserve the right to reassign issues in case of inactivity or rule violations.

These rules help maintain smooth collaboration and give all contributors a fair chance to participate in the project.

## 📥 Pull Request Guidelines

To maintain code quality and consistency, please follow these requirements for all Pull Requests:

### PR Format & Description

- **Title:** Use a concise title that describes the change (e.g., `feat: add Heap Sort visualization`).
- **Description:**
  - Explain the **why** and **how** of your changes.
  - Link to the relevant issue (e.g., `Closes #123`).
  - Include screenshots or GIFs for any UI changes.
- **Scope:** Keep PRs focused. If you have multiple unrelated changes, please split them into separate PRs.

### Commit Message Conventions

We follow a simplified version of [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` for new features.
- `fix:` for bug fixes.
- `docs:` for documentation changes.
- `style:` for formatting, missing semi colons, etc; no code change.
- `refactor:` for code changes that neither fix a bug nor add a feature.
- `chore:` for updating build tasks, package manager configs, etc.

Example: `feat: implement Dijkstra animation logic`

## 🛠️ Development & Standards

### Code Style

- **JavaScript/React:** Follow the existing patterns. We use **ESLint** and **Prettier** for consistency.
- **Formatting:** 2-space indentation, no semicolons, single quotes.
- **Components:** Prefer functional components with hooks.

### Test Expectations

- **Manual Verification:** Ensure the visualization works correctly across different input sizes and speeds.
- **Edge Cases:** Test your algorithm with empty inputs, large datasets, and unexpected user interactions.
- **Automated Tests:** While we are expanding our test suite, please ensure your changes do not break existing functionality by running `npm run lint` and `npm run build`.

### Review Timeline

- **Response Time:** We aim to respond to all issue assignment requests and PRs within **24-48 hours**.
- **Feedback Loop:** Be prepared to walk through your implementation or address comments before your PR is approved.

## 📜 Code of Conduct

Please be respectful and professional in all interactions. We aim to foster a welcoming and inclusive community. For more details, see our [Code of Conduct](CODE_OF_CONDUCT.md).

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
