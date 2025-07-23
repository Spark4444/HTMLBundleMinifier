1. Add a -m option to specify whether to not mangle the JS code (--no-mangle-js).
2. Add a -C option whether to keep comments or not (--keep-comments).
3. Add a -l option whether to keep console statements or not (--keep-console).
4. Add a -p option to specify whether to skip HTML prettification (--no-pretty-html).
5. Add a -w option to specify whether to skip whitespace removal (--no-collapse-whitespace).
6. Rework the options to be in a single object instead of multiple boolean flags.
7. For the fullPrompt mode add all the above options to the prompt.
8. Fix problem with css links being incorrect when bundled into html (e.g. links that were relative to css should be relative to html).