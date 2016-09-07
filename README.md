# schema-trimmer

[WIP]A tool to validate and cast values in Javascript by given schema, with customizable predicate and cast functions.

## Example

```js
const trimmer = require('schema-trimmer');

trimmer.init({
    Phone: {
        predicate: (s) => { return /^\d{11}$/.test(s); },
        cast: (s) => { return s.toString(); }
    }
});

let pattern = '{@phones:!{@Kevin:!Phone,@John:!Phone},@total:!Number}';
let val1 = {
    phones: {
        Kevin: '17700011233',
        John: 17700011234,
    },
    total: '2'
};
let result = trimmer.process(pattern, val1);
assert(result.v.phones.John === '17700011234');
assert(typeof result.v.total === 'number');

let val2 = {
    phones: {
        Kevin: '17700011233',
        John: 17700011234,
    },
    total: 'total'
};
let result2 = trimmer.process(pattern, val2);
assert(!result2.m);
assert(result.r === 'total: "total" not Number');
```

## Installation

```bash
$ npm install schema-trimmer
```
## API

## Tests

```bash
$ npm test
```

## License

[MIT](LICENSE)
