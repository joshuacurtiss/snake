import kaboom, {
    AreaComp,
    ColorComp,
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
    onCollide,
    onKeyPress,
    onUpdate,
    pos,
    rand,
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
let snake_len = SNAKE_SPAWN_LENGTH;
let timer = 0;
let food: GameObj<RectComp & ColorComp & PosComp & AreaComp> | null = null;

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
    snake_len = SNAKE_SPAWN_LENGTH;
    for (let i = 1; i <= snake_len; i += 1) {
        snake_body.push(addSnakeBody(vec2(BLOCK_SIZE, BLOCK_SIZE * i)));
    }
    current_direction = Direction.Right;
}
function respawnFood() {
    const foodPos = rand(vec2(1, 1), vec2(13, 13));
    foodPos.x = Math.floor(foodPos.x);
    foodPos.y = Math.floor(foodPos.y);
    if (food) destroy(food);
    food = add([
        rect(BLOCK_SIZE, BLOCK_SIZE),
        color(0, 255, 0),
        pos(foodPos.scale(BLOCK_SIZE)),
        area(),
        'food',
    ]);
}
function respawnAll() {
    run_action = false;
    wait(0.5, () => {
        respawnSnake();
        respawnFood();
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

onCollide('snake', 'food', () => {
    snake_len += 1;
    respawnFood();
});

onUpdate(() => {
    if (!run_action) return;
    timer += dt();
    if (timer < MOVE_DELAY) return;
    timer = 0;
    const move = directions[current_direction];
    const snake_head = snake_body[snake_body.length - 1];
    snake_body.push(addSnakeBody(snake_head.pos.add(move)));
    if (snake_len < snake_body.length) {
        const snake_tail = snake_body.shift();
        if (snake_tail) destroy(snake_tail);
    }
});

// Init

respawnAll();
