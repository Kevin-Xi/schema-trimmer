var assert = require('assert');

var trimmer = require('.');

try {
    // case 1:
    var p_1 = '{@a:!Number}';
    var m_1 = {a: '1'};
    var nm_1 = {a: 'abc'};
    assert(trimmer(p_1, m_1).m, 'case 1.1');
    assert(!trimmer(p_1, nm_1).m, 'case 1.2');

    // case 2:
    var p_2 = '{@a:!{@a:!Number,@b:!Number},@c:!Number}';
    var m_2 = {a: {a: 1, b: 2}, c: 3};
    var m_2_1 = {a: {a: '1', b: '2'}, c: 3};
    var nm_2 = {a: {a: 1, c: 2}, b: 3};
    var nm_2_1 = {a: 1};
    assert(trimmer(p_2, m_2).m, 'case 2.1');
    assert(trimmer(p_2, m_2_1).m, 'case 2.2');
    assert(!trimmer(p_2, nm_2).m, 'case 2.3');
    assert(!trimmer(p_2, nm_2_1).m, 'case 2.4');

    // case 3:
    var p_3 = '{@a:!{@b:!{@c:{@d:!Number,@e:!Number}}}}';
    var m_3 = {a: {b: {c: {d: 1, e: 2}}}};
    var nm_3 = {a: {b: {c: {e: 1}}}};
    assert(trimmer(p_3, m_3).m, 'case 3.1');
    assert(!trimmer(p_3, nm_3).m, 'case 3.2');

    console.log('All green.');
} catch (e) {
    console.error(e.message);
}
