"use strict";

module.exports = [{
  names: ["closed-code-fence"],
  description: "Fenced code blocks must have a closing fence",
  tags: ["code"],
  parser: "markdownit",
  function: function closedCodeFence(params, onError) {
    const tokens = params.parsers ? params.parsers.markdownit.tokens : params.tokens;
    for (const token of tokens) {
      if (token.type !== "fence") {
        continue;
      }
      // A closed block spans its content plus opening and closing lines.
      const contentLines = (token.content.match(/\n/g) || []).length +
        (token.content && !token.content.endsWith("\n") ? 1 : 0);
      if (token.map[1] - token.map[0] < contentLines + 2) {
        onError({
          lineNumber: token.lineNumber,
          detail: "Add a closing code fence before the end of the block",
          context: token.line
        });
      }
    }
  }
}, {
  names: ["changelog-version-outside-code"],
  description: "Changelog version headings must not be inside JavaScript API blocks",
  tags: ["code"],
  parser: "markdownit",
  function: function changelogVersionOutsideCode(params, onError) {
    if (!/(^|[/\\])CHANGELOG\.md$/i.test(params.name)) {
      return;
    }
    const tokens = params.parsers ? params.parsers.markdownit.tokens : params.tokens;
    for (const token of tokens) {
      if (token.type !== "fence") {
        continue;
      }
      // API examples use JavaScript. Markdown/text examples can legitimately
      // contain version headings and must not trigger this changelog check.
      // Do not require an unclosed fence: a later fence can close the broken
      // API block after it has already swallowed the next release section.
      const language = token.info.trim().split(/\s+/)[0].toLowerCase();
      if (language !== "javascript" && language !== "js") {
        continue;
      }
      const lines = token.content.split("\n");
      for (let index = 0; index < lines.length; index++) {
        if (/^##[ \t]+\d+\.\d+\.\d+(?:\s|$)/.test(lines[index])) {
          onError({
            lineNumber: token.map[0] + index + 2,
            detail: "Check for a missing closing code fence before this version heading",
            context: lines[index]
          });
        }
      }
    }
  }
}];
