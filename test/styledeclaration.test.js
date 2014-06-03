'use strict';
var test = require('tape').test;
var StyleDeclaration = require('../js/style/styledeclaration.js');

test('styledeclaration', function(t) {
    var opacity = new StyleDeclaration('opacity', 0, {});
    t.equal(opacity.calculate(10), 0);

    /*
     * waiting on non-canvas color parser
     var color = new StyleDeclaration('color', 'red', {});
     t.deepEqual(color.calculate(10), [1, 0, 0, 1]);
     */

    t.test('parseWidthArray', function(t) {
        var dashFn = new StyleDeclaration('line-dasharray', [0, 10, 5]);
        t.ok(dashFn instanceof StyleDeclaration);
        t.deepEqual(dashFn.calculate(0), [0, 10, 5]);
        t.end();
    });

    t.test('constant', function(t) {
        t.equal((new StyleDeclaration('point-size', 5)).calculate(0), 5);
        t.equal((new StyleDeclaration('point-size', 5)).calculate(100), 5);
        t.end();
    });

    t.test('functions', function(t) {
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'linear' })).calculate(0), 0);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'linear', max: 10, slope: 0.5 })).calculate(10), 5);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'exponential' })).calculate(0), 0);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'min' })).calculate(0), true);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'stops', stops: [] })).calculate(0), 1);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'stops', stops: [0, 5, 10] })).calculate(0), 1);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'stops', stops: [0, 5, 10] })).calculate(10), 1);
        t.equal((new StyleDeclaration('fill-opacity', { fn: 'stops', stops: [0, 5, 10] })).calculate(6), 1);

        t.throws(function() {
            new StyleDeclaration('fill-opacity', { fn: 'blah' });
        }, 'rejects unknown fns');
        t.end();
    });

    t.equal((new StyleDeclaration('unknown-prop')).prop, undefined, 'unknown prop');

    var width = new StyleDeclaration('line-width', 'widthvar', {
        widthvar: 10
    });
    t.equal(width.calculate(10), 10);

    var widthfn = new StyleDeclaration('line-width', function(z) {
        return Math.pow(z, 2);
    });
    t.equal(widthfn.calculate(10), 100);

    t.end();
});