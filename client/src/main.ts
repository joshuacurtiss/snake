import kaboom, {
    AreaComp,
    GameObj,
    PosComp,
    RectComp,
    Vec2,
} from 'kaboom';

const {
    add,
    addLevel,
    area,
    color,
    destroy,
    destroyAll,
    dt,
    onKeyPress,
    onUpdate,
    pos,
    rect,
    vec2,
    UP,
    DOWN,
    LEFT,
    RIGHT,
    wait,
} = kaboom({ global: false });

enum Direction {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right',
}

const BLOCK_SIZE = 20;
const MOVE_DELAY = 0.2;
const SNAKE_SPAWN_LENGTH = 3;

const directions: Record<Direction, Vec2> = {
    [Direction.Up]: UP.scale(BLOCK_SIZE),
    [Direction.Down]: DOWN.scale(BLOCK_SIZE),
    [Direction.Left]: LEFT.scale(BLOCK_SIZE),
    [Direction.Right]: RIGHT.scale(BLOCK_SIZE),
};

let current_direction: Direction = Direction.Right;
let run_action = false;
let snake_body: GameObj<AreaComp & PosComp & RectComp>[] = [];
let timer = 0;

addLevel([
    '##############',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '#            #',
    '##############',
], {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    pos: vec2(0, 0),
    '#': () => [
        rect(BLOCK_SIZE, BLOCK_SIZE),
        color(255, 0, 0),
        area(),
        'wall',
    ],
});

function addSnakeBody(coord: Vec2) {
    return add([
        rect(BLOCK_SIZE, BLOCK_SIZE),
        pos(coord),
        color(0, 0, 255),
        area(),
        'snake',
    ]);
}
function respawnSnake() {
    destroyAll('snake');
    snake_body = [];
    for (let i = 1; i <= SNAKE_SPAWN_LENGTH; i += 1) {
        snake_body.push(addSnakeBody(vec2(BLOCK_SIZE, BLOCK_SIZE * i)));
    }
    current_direction = Direction.Right;
}
function respawnAll() {
    run_action = false;
    wait(0.5, () => {
        respawnSnake();
        run_action = true;
    });
}

// Events

onKeyPress(Direction.Up, () => {
    if (current_direction !== Direction.Down) current_direction = Direction.Up;
});

onKeyPress(Direction.Down, () => {
    if (current_direction !== Direction.Up) current_direction = Direction.Down;
});

onKeyPress(Direction.Left, () => {
    if (current_direction !== Direction.Right) current_direction = Direction.Left;
});

onKeyPress(Direction.Right, () => {
    if (current_direction !== Direction.Left) current_direction = Direction.Right;
});

onUpdate(() => {
    if (!run_action) return;
    timer += dt();
    if (timer < MOVE_DELAY) return;
    timer = 0;

    const move = directions[current_direction];
    const snake_head = snake_body[snake_body.length - 1];
    snake_body.push(addSnakeBody(snake_head.pos.add(move)));
    const snake_tail = snake_body.shift();
    if (snake_tail) destroy(snake_tail);
});

// Init

respawnAll();
