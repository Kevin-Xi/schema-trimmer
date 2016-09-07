+ How to modular it?
+ Implement '?', need access token before
+ API design?

In this branch, try in this way:

```javascript
const Trimmer = require('schema-trimmer');
let trimmer = new Trimmer(pattern, init);   // process pattern in this step

trimmer(value);
```
