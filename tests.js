var assert = require('assert');

var trimmer = require('.');

trimmer.init({
    Phone: {
        predicate: (s) => { return /^\d{11}$/.test(s); },
        cast: (s) => { return s.toString(); }
    }
});

try {
    // case 1:
    var p_1 = '{@a:!Number}';
    var m_1 = {a: '1'};
    var nm_1 = {a: 'abc'};
    assert(trimmer.process(p_1, m_1).m, 'case 1.1');
    assert(!trimmer.process(p_1, nm_1).m, 'case 1.2');

    // case 2:
    var p_2 = '{@a:!{@a:!Number,@b:!Number},@c:!Number}';
    var m_2 = {a: {a: 1, b: 2}, c: 3};
    var m_2_1 = {a: {a: '1', b: '2'}, c: 3};
    var nm_2 = {a: {a: 1, c: 2}, b: 3};
    var nm_2_1 = {a: 1};
    assert(trimmer.process(p_2, m_2).m, 'case 2.1');
    assert(trimmer.process(p_2, m_2_1).m, 'case 2.2');
    assert(!trimmer.process(p_2, nm_2).m, 'case 2.3');
    assert(!trimmer.process(p_2, nm_2_1).m, 'case 2.4');

    // case 3:
    var p_3 = '{@a:!{@b:!{@c:{@d:!Number,@e:!Number}}}}';
    var m_3 = {a: {b: {c: {d: 1, e: 2}}}};
    var nm_3 = {a: {b: {c: {e: 1}}}};
    assert(trimmer.process(p_3, m_3).m, 'case 3.1');
    assert(!trimmer.process(p_3, nm_3).m, 'case 3.2');

    // case 4:
    var p_4 = '{@a:!Phone}';
    var m_4_1 = {a: 17700011233};
    var m_4_2 = {a: '17700011233'};
    var nm_4_1 = {a: '177000112334'};
    var nm_4_2 = {b: '17700011233'};
    assert(trimmer.process(p_4, m_4_1).m, 'case 4.1');
    assert(trimmer.process(p_4, m_4_2).m, 'case 4.2');
    assert(!trimmer.process(p_4, nm_4_1).m, 'case 4.3');
    assert(!trimmer.process(p_4, nm_4_2).m, 'case 4.4');

    // case 5:
    var p_5 = '{@phoneList:!{@Kevin:!Phone,@John:!Phone},@total:!Number}';
    var m_5_1 = {phoneList: {Kevin: '17700011233', John: '17700011234'}, total: 2};
    var m_5_2 = {phoneList: {Kevin: 17700011233, John: '17700011234'}, total: '2'};
    var nm_5_1 = {phoneList: {Kevin: '17700011233', John: '17700011234'}, total: 'total'};
    var nm_5_2 = {phoneList: {Kevin: '17700011233', John: {phone: '17700011234'}}, total: '12'};
    assert(trimmer.process(p_5, m_5_1).m, 'case 5.1');
    assert(trimmer.process(p_5, m_5_2).m, 'case 5.2');
    assert(!trimmer.process(p_5, nm_5_1).m, 'case 5.3');
    assert(!trimmer.process(p_5, nm_5_2).m, 'case 5.4');

    console.log('All green.');
} catch (e) {
    console.error(e.message);
}
