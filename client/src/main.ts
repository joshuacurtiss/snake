import kaboom from 'kaboom';

const { add, text, pos } = kaboom();

add([
    text('hello world'),
    pos(120, 80),
]);
