'use strict';

let predefined_patterns = {
    Number: {
        predicate: (n) => { return !Number.isNaN(n); },
        cast: (n) => { return Number(n); }
    }
};

let patterns = Object.assign({}, predefined_patterns);

function init (custom_patterns) {
    return Object.assign(patterns, custom_patterns);
}

function process (pattern, value) {
    let token = get_next_token(pattern);
    switch (token) {
        case '{':
            let sub_patterns = get_sub_patterns(pattern);
            let trim_all = (ps, vs) => {
                if (ps.length === 0) {
                    return { m: true, v: vs };
                } else {
                    let res = process(ps[0], vs);
                    if (res.m) {
                        return trim_all(ps.slice(1), Object.assign({}, vs, res.v));
                    } else {
                        return { m: false, r: res.r };
                    }
                }
            };
            return trim_all(sub_patterns, value);
            break;
        case '@':
            let pair = ((p) => {
                let ps = p.slice(1).split(':');
                return [ps[0], ps.slice(1).join(':')];
            })(pattern);
            let name = pair[0], p = pair[1], v = value[name];

            let res = process(p, v);
            if (res.m) {
                let sup_v = {};
                sup_v[name] = res.v;
                return { m: true, v: sup_v };
            } else {
                return { m: false, r: `${name}: ${res.r}` };
            }
            break;
        case '!':
            if (undefined === value) {
                return { m: false, r: 'miss' };
            } else {
                return process(pattern.slice(1), value);
            }
            break;
        default:
            if (patterns[token]) {
                let pred = patterns[token]['predicate'];
                let cast = patterns[token]['cast'] || id;
                try {
                    let value_after_cast = cast(value);
                    if (pred(value_after_cast)) {
                        return { m: true, v: value_after_cast };
                    } else {
                        return { m: false, r: `${JSON.stringify(value)} not ${token}}` };
                    }
                } catch (e) {
                    return { m: false, r: `${JSON.stringify(value)} fail cast ${token}}` };
                }
            } else {
                return { m: false, r: 'pattern not recognize' };
            }
            break;
    }
}

// input: '{@a:!{@a:!Number,@b:!Number},@c:!Number}'
// output: ['@a:!{@a:!Number,@b:!Number}', '@c:!Number']
function get_sub_patterns (pattern) {
    pattern = pattern.slice(1, -1);
    let level = 0;
    let cur_pattern = '';
    let sub_patterns = [];
    for (let i in pattern) {
        switch (pattern[i]) {
            case ',':
                if (level === 0) {
                    sub_patterns.push(cur_pattern);
                    cur_pattern = '';
                } else {
                    cur_pattern += pattern[i];
                }
                break;
            case '{':
                level += 1;
                cur_pattern += pattern[i];
                break;
            case '}':
                level -= 1;
                cur_pattern += pattern[i];
                break;
            default:
                cur_pattern += pattern[i];
                break;
        }
    }
    sub_patterns.push(cur_pattern);
    return sub_patterns;
}

function get_next_token (pattern) {
    var token = '';
    for (var i in pattern) {
        let c = pattern[i];
        if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
            token += c;
        } else {
            if (token === '') token = c;
            break;
        }
    }
    return token;
}

function id (x) {
    return x;
}

module.exports = {
    init: init,
    process: process
};
