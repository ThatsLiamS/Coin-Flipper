# Git Commit Message Convention

## TL;DR:

Messages must be matched by the following regex:

```js
/^(revert: )?(feat|fix|refactor|perf|test|style|workflow|chore)(\(.+\))?: .{1,72}/;
```

## Full Message Format

A commit message consists of a **header**, **body** and **footer**. The header has a **type** and **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Header
The **header** is mandatory, although the **scope** of the header is optional.

#### Type

If the prefix is `feat`, `fix` or `perf`, it will appear in the changelog. However, if there is any [BREAKING CHANGE](#footer), the commit will always appear in the changelog.

Other prefixes are up to your discretion. Suggested prefixes are `chore`, `style`, `refactor`, and `test` for non-changelog related tasks.

#### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body, it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.
