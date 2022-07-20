
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const table_x = 49;
const table_y = 288;
const table_w = 1234;
const table_h = 672;

// x/y position of the table
const origin_x = (canvas.width / 2) - (table_w / 2);
const origin_y = (canvas.height / 2) - (table_h / 2);

const drawer_limit_hi = 847; // fully open
const drawer_limit_lo = 697; // fully closed
const drawer_off_peek = 30;  // fully closed + this = slightly open

const drawer_l_x = 109 - table_x + origin_x;
const drawer_l_y = drawer_limit_lo + drawer_off_peek - table_y + origin_y;
const drawer_l_w = 292;
const drawer_l_h = 282;
const drawer_r_x = 922 - table_x + origin_x;
const drawer_r_y = drawer_limit_lo - table_y + origin_y;
const drawer_r_w = 292;
const drawer_r_h = 282;
const pen_r_x = 218 - table_x + origin_x;
const pen_r_y = 500 - table_y + origin_y;
const pen_r_w = 16;
const pen_r_h = 186;
const pen_b_x = 251 - table_x + origin_x;
const pen_b_y = 545 - table_y + origin_y;
const pen_b_w = 14;
const pen_b_h = 141;
const lamp_x = 946 - table_x + origin_x;
const lamp_y = 283 - table_y + origin_y;
const lamp_w = 251;
const lamp_h = 320;
const phone_x = 105 - table_x + origin_x;
const phone_y = 520 - table_y + origin_y;
const phone_w = 70;
const phone_h = 138;
const usb_x = 910 - table_x + origin_x;
const usb_y = 591 - table_y + origin_y;
const usb_w = 37;
const usb_h = 109;
const book_c_x = 320 - table_x + origin_x;
const book_c_y = 482 - table_y + origin_y;
const book_c_w = 137;
const book_c_h = 175;
const book_o_x = 146 - table_x + origin_x;
const book_o_y = 701 - table_y + origin_y;
const book_o_w = 271;
const book_o_h = 194;
const cup_x = 963 - table_x + origin_x;
const cup_y = 786 - table_y + origin_y;
const cup_w = 113;
const cup_h = 103;
const shades_x = 981 - table_x + origin_x;
const shades_y = 653 - table_y + origin_y;
const shades_w = 159;
const shades_h = 57;
const mouse_x = 854 - table_x + origin_x;
const mouse_y = 728 - table_y + origin_y;
const mouse_w = 57;
const mouse_h = 96;
const foto_x = 1049 - table_x + origin_x;
const foto_y = 735 - table_y + origin_y;
const foto_w = 128;
const foto_h = 113;
const laptop_x = 495 - table_x + origin_x;
const laptop_y = 560 - table_y + origin_y;
const laptop_w = 330;
const laptop_h = 335;
const chair_x = 475 - table_x + origin_x;
const chair_y = 826 - table_y + origin_y;
const chair_w = 381;
const chair_h = 339;
const paper_x = 173 - table_x + origin_x;
const paper_y = 860 - table_y + origin_y;
const paper_w = 161;
const paper_h = 85;
//const paper_w_2 = paper_w * 10;
//const paper_h_2 = paper_h * 10;
//const paper_x_2 = (canvas.width / 2) - (paper_w_2 / 2);
//const paper_y_2 = (canvas.height / 2) - (paper_h_2 / 2);

const ctx = canvas.getContext('2d');

let restitution = 0.80;
const restitution_border = 0.6;

const g = 9.81; // todo

// the z value for entities in extended state
const z_extended = 10;
// the default animation length
const anim_length_default = 0.2;

// global variables

const mouse_client = {
    x: undefined,
    y: undefined,
    px: undefined,
    py: undefined,
    width: 0.1,
    height: 0.1,
    id: 'mouse_client',
}

let entities = [];
let grid_cells = [];

let entity_current = undefined;

let time_passed = 0;
let time_previous = 0;
let frames_per_second = 0;

// draw flags
let is_draw_bounding = false;
let is_draw_velocity = false;

// client interaction flags
let is_client_dragging = false;
let is_client_interacting = false;

let canvas_position = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', function(e) {

    // Mouse dragged, user is not trying to interact with an entity
    is_client_interacting = false;

    mouse_client.x = e.x - canvas_position.left;
    mouse_client.y = e.y - canvas_position.top;

    if (is_client_dragging) {

        var dx = (mouse_client.px - mouse_client.x);
        var dy = (mouse_client.py - mouse_client.y);
        var nx = entity_current.x - dx;
        var ny = entity_current.y - dy;

        //const entity_position = {
        //    id: entity_current.id,
        //    x: nx,
        //    y: ny,
        //    width: entity_current.width,
        //    height: entity_current.height,
        //}

        switch (entity_current.id) {
            case 'drawer_l':
            case 'drawer_r':

              // todo: maybe just move it relative to other component?

                var dy_0 = drawer_limit_lo - table_y + origin_y;
                if (ny < dy_0) {
                    ny = dy_0;
                }
                var dy_1 = drawer_limit_hi - table_y + origin_y;
                if (ny > dy_1) {
                    ny = dy_1;
                }
                entity_current.y = ny;

                if (entity_current.id == 'drawer_l') {
                    // move dependent entity
                    let paper = get_entity_by_id('paper');
                    let paper_ny = paper.y - dy;

                    var dy_2 = paper_y - drawer_off_peek;
                    if (paper_ny < dy_2) {
                        paper_ny = dy_2;
                    }
                    var dy_3 = (paper_y - drawer_off_peek) + (drawer_limit_hi - drawer_limit_lo);
                    if (paper_ny > dy_3) {
                        paper_ny = dy_3;
                    }

                    paper.y = paper_ny;
                }

                break;
            default:
                var distance = Math.sqrt((nx - entity_current.x)*(nx - entity_current.x) + (ny - entity_current.y)*(ny - entity_current.y));

                //if (!collision_entity(entity_current, false)) {
                    entity_current.x = nx;
                    entity_current.y = ny;
                //}

                entity_current.vx = -dx * (distance / 2);
                entity_current.vy = -dy * (distance / 2);
                break;
        }
        // update previous mouse position
        mouse_client.px = mouse_client.x;
        mouse_client.py = mouse_client.y;
    }
});
canvas.addEventListener('mouseleave', function(e) {
    mouse_client.x = undefined;
    mouse_client.y = undefined;
});
canvas.addEventListener('mousedown', function(e) {

    var entity = collision_entity(mouse_client, false);

    if (entity != undefined) {

        //if (entity.is_interactable()) {
            //is_client_interacting = true;
        //}
        //if (entity.is_draggable()) {
            //is_client_dragging = true;
        //}

        is_client_dragging = entity.is_draggable();
        is_client_interacting = entity.is_interactable();

        entity_current = entity;

        mouse_client.px = mouse_client.x;
        mouse_client.py = mouse_client.y;
    }
});
canvas.addEventListener('mouseup', function(e) {

    let entity_extended = get_entity_extended();
    if (entity_extended) {
        if (entity_extended != collision_entity(mouse_client, false)) {
            entity_extended.animation_start(true);
            //entity_extended.x = entity_extended.anim_x_s;
            //entity_extended.y = entity_extended.anim_y_s;
            //entity_extended.width = entity_extended.anim_w_s;
            //entity_extended.height = entity_extended.anim_h_s;
            //entity_extended.is_extended = false;
        }
    }

    if (!entity_extended && mouse_client.x == mouse_client.px && mouse_client.y == mouse_client.py && is_client_interacting) {
        entity_current.interact();
    }

    is_client_dragging = false;
    is_client_interacting = false;

    entity_current = undefined;

    mouse_client.px = undefined;
    mouse_client.py = undefined;
});

document.addEventListener('keydown', function logKey(e) {
    if (`${e.code}` == 'ArrowRight') {
        if (entity_snake.vx == -1) return;

        entity_snake.vx = 1;
        entity_snake.vy = 0;
    }
    if (`${e.code}` == "ArrowLeft") {
        if (entity_snake.vx == 1) return;

        entity_snake.vx = -1;
        entity_snake.vy = 0;
    }
    if (`${e.code}` == "ArrowDown") {
        if (entity_snake.vy == -1) return;

        entity_snake.vx = 0;
        entity_snake.vy = 1;
    }
    if (`${e.code}` == "ArrowUp") {
        if (entity_snake.vy == 1) return;

        entity_snake.vx = 0
        entity_snake.vy = -1;
    }
});

// classes

class GameObject {

    constructor(id, x, y, z, width, height, image_path) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.dx = 0;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = image_path;
    }

    update(time_passed) {
        this.x += this.vx * time_passed;
        this.y += this.xy * time_passed;
        this.vy *= restitution;
        this.vx *= restitution;
    }

    draw() {
        // draw entity
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        // draw bounding box
        if (is_draw_bounding) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        // draw velocity vector
        if (is_draw_velocity) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(this.x + (this.width / 2), this.y + (this.height / 2));
            ctx.lineTo(this.x + (this.width / 2) + (this.vx), this.y + (this.height / 2) + (this.vy));
            ctx.stroke();
        }
    }
}

class Entity {

    constructor(id, x, y, z, width, height, restitution, mass, image_path, image_path_highlight, is_drag, interaction) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.restitution = restitution;
        this.mass = mass;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.image_path = image_path;
        this.image_path_highlight = image_path_highlight;
        this.is_drag = is_drag;
        this.is_extended = false;
        this.interaction = interaction;
        this.image = new Image();
        this.image.src = image_path;
        if (this.is_interactable()) {
            this.image_highlight = new Image();
            this.image_highlight.src = image_path_highlight;
        }

        this.is_animation = false;
        this.is_animation_reverted = false;

        // start width/height
        this.anim_w_s = width;
        this.anim_h_s = height;
        // destination width/height
        this.anim_w_d = width * 5;
        this.anim_h_d = height * 5;
        // start x/y/z
        this.anim_x_s = x;
        this.anim_y_s = y;
        this.anim_z_s = z;
        // destination x/y/z
        this.anim_x_d = (canvas.width / 2) - (this.anim_w_d / 2);
        this.anim_y_d = (canvas.height / 2) - (this.anim_h_d / 2);
        this.anim_z_d = z_extended;

        this.anim_length = anim_length_default;
        this.anim_time = 0;
    }

    is_draggable() {
        return !this.is_extended && this.is_drag;
    }

    is_interactable() {
        return !this.is_extended && this.interaction != undefined && this.interaction != null;
    }

    interact() {
        if (this.is_interactable()) {
            this.interaction();
        }
    }

    animation_start(is_animation_reverted) {

        // clear entity movement before animating
        this.vx = 0;
        this.vy = 0;

        this.is_animation = true;
        this.is_animation_reverted = is_animation_reverted;
        this.anim_time = 0;

        if (!is_animation_reverted) {
            this.anim_x_s = this.x;
            this.anim_y_s = this.y;
            this.anim_w_s = this.width;
            this.anim_h_s = this.height;
            this.z = this.anim_z_d; // z level 10 == extended entity; z level 9 == black, transparent object
            entities_sort_by_z();
        }
    }

    animation_update(time_passed) {
        this.anim_time += time_passed;

        // not sure if this can even ever happen
        if (this.anim_time == 0) return;

        // check if animation is done
        if (this.anim_time > this.anim_length) {
            this.anim_time = this.anim_length;
            this.is_animation = false;
            this.is_extended = !this.is_animation_reverted;

            if (this.is_animation_reverted) {
                this.z = this.anim_z_s;
                entities_sort_by_z();
            }
        }

        let nx, ny, nw, nh, anim_progress;

        anim_progress = (this.anim_time / this.anim_length);

        if (!this.is_animation_reverted) {
            nx = this.anim_x_s + (anim_progress * (this.anim_x_d - this.anim_x_s));
            ny = this.anim_y_s + (anim_progress * (this.anim_y_d - this.anim_y_s));
            nw = this.anim_w_s + (anim_progress * (this.anim_w_d - this.anim_w_s));
            nh = this.anim_h_s + (anim_progress * (this.anim_h_d - this.anim_h_s));
        } else {
            nx = this.anim_x_d - (anim_progress * (this.anim_x_d - this.anim_x_s));
            ny = this.anim_y_d - (anim_progress * (this.anim_y_d - this.anim_y_s));
            nw = this.anim_w_d - (anim_progress * (this.anim_w_d - this.anim_w_s));
            nh = this.anim_h_d - (anim_progress * (this.anim_h_d - this.anim_h_s));
        }

        this.x = nx;
        this.y = ny;
        this.width = nw;
        this.height = nh;
    }

    update(time_passed) {

        if (this.is_animation) {
            this.animation_update(time_passed);
        }

        // move based on velocity
        if (!entity_current || !(entity_current.id == this.id)) {

            this.x += this.vx * time_passed;
            this.y += this.vy * time_passed;
            // decrease velocity based on gravity
            /*
            if (this.vx > 0) {
                this.vx = Math.max(0, this.vx * (g * time_passed * 1));
            } else if (this.vx < 0) {
                this.vx = Math.min(0, this.vx * (g * time_passed * 1));
            }
            if (this.vy > 0) {
                this.vy = Math.max(0, this.vy * (g * time_passed * 1));
            } else if (this.vy < 0) {
                this.vy = Math.min(0, this.vy * (g * time_passed * 1));
            }*/
            // decrease velocity based on friction
            this.vy *= restitution;
            this.vx *= restitution;

        }
        // calculate angle
        //var radians = Math.atan2(this.vy, this.vx);
        // convert to degree
        //var degrees = 180 * radians / Math.pi;
    }

    draw() {

        var nx = undefined;
        var ny = undefined;

        // if entity is interactable and hovered by mouse
        if (!(this.is_extended || this.is_animation) && this.is_interactable() && mouse_client.x && mouse_client.y && collision_entity(mouse_client, true) == this) {

            switch(this.id) {
                case 'drawer_l':
                case 'drawer_r':
                    // Only make hover effect if drawer is closed
                    if (this.y == drawer_limit_lo) {
                        nx = this.x;
                        ny = this.y + 5;
                    } else {
                        nx = this.x;
                        ny = this.y;
                    }
                    break;
                default:
                    nx = this.x + 5;
                    ny = this.y - 5;
                    break;
            }

            var hx = nx - ((this.image_highlight.width - this.image.width) / 2);
            var hy = ny - ((this.image_highlight.height - this.image.height) / 2);
            ctx.drawImage(this.image_highlight, hx, hy);

        } else {
            nx = this.x;
            ny = this.y;
        }

        if ((this.is_animation || this.is_extended) && !this.is_animation_reverted) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // draw entity
        ctx.drawImage(this.image, nx, ny, this.width, this.height);
        // draw bounding box
        if (is_draw_bounding) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(nx, ny, this.width, this.height);
        }
        // draw entity velocity vector
        if (is_draw_velocity) {
            ctx.strokeStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(nx + (this.width / 2), ny + (this.height / 2));
            ctx.lineTo(nx + (this.width / 2) + (this.vx) / 10, ny + (this.height / 2) + (this.vy) / 10);
            ctx.stroke();
        }
    }
}

class Cell {

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

let size_cell = 10;

let grid_x;
let grid_y;
let grid_w;
let grid_h;

//let entity_snake;
let entity_snake_fruit;

let time_passed_snake;

let time_snake_update = 0.1;

class Snake {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.parts = [];
        this.parts.push(new SnakePart(x, y+1, size_cell, size_cell));
        this.parts.push(new SnakePart(x, y+2, size_cell, size_cell));
        this.parts.push(new SnakePart(x, y+3, size_cell, size_cell));
        this.parts.push(new SnakePart(x, y+4, size_cell, size_cell));
        this.parts.push(new SnakePart(x, y+5, size_cell, size_cell));
        this.parts.push(new SnakePart(x, y+6, size_cell, size_cell));
        this.parts.push(new SnakePart(x, y+7, size_cell, size_cell));
    }

    draw() {

        for (let i = 0; i < this.parts.length; i++) {
            this.parts[i].draw();
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(grid_x + (this.x * this.width), grid_y + (this.y * this.height), this.width, this.height);
    }

    update() {

        if (this.parts.length > 0 && (this.vx != 0 || this.vy != 0)) {

            for (let i = this.parts.length - 1; i > 0; i--) {
                this.parts[i].x = this.parts[i-1].x;
                this.parts[i].y = this.parts[i-1].y;
            }

            this.parts[0].x = this.x;
            this.parts[0].y = this.y;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    extend() {
        this.parts.push(new SnakePart(this.parts[this.parts.length - 1].x + (-1 * this.vx), this.parts[this.parts.length - 1].y + (-1 * this.vy), size_cell, size_cell));
    }
}

class SnakePart {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(grid_x + (this.x * this.width) + 1, grid_y + (this.y * this.height) + 1, this.width - 2, this.height - 2);
    }
}

// functions

function scene_create() {
    // define entities of the scene
    entities.push(new Entity('drawer_l', drawer_l_x, drawer_l_y, -2, drawer_l_w, drawer_l_h, 0, 1, '.\\entity\\drawer_l.svg', '.\\entity\\drawer_l_hl.png',  true, function(){console.log('[i] DRAWER (LEFT)');}));
    entities.push(new Entity('drawer_r', drawer_r_x, drawer_r_y, -2, drawer_r_w, drawer_r_h, 0, 1, '.\\entity\\drawer_r.svg', '.\\entity\\drawer_r_hl.png',  true, function(){console.log('[i] DRAWER (RIGHT)');}));
    entities.push(new Entity('paper',       paper_x,    paper_y, -1,    paper_w,    paper_h, 0, 1, '.\\entity\\paper.svg',       '.\\entity\\paper_hl.png', false, function(){console.log('[i] PAPER');this.animation_start();}));
    entities.push(new Entity('table',      origin_x,   origin_y,  0,    table_w,    table_h, 0, 1, '.\\entity\\table2.svg',                           null, false, undefined));
    entities.push(new Entity('foto',         foto_x,     foto_y,  1,     foto_w,     foto_h, 1, 1, '.\\entity\\foto.svg',         '.\\entity\\foto_hl.png',  true, function(){console.log('[i] FOTO');this.animation_start();is_draw_bounding = !is_draw_bounding;}));
    entities.push(new Entity('pen_b',       pen_b_x,    pen_b_y,  1,    pen_b_w,    pen_b_h, 1, 1, '.\\entity\\pen_b.svg',       '.\\entity\\pen_b_hl.png',  true, function(){console.log('[i] PEN (BLUE)');this.animation_start();}));
    entities.push(new Entity('pen_r',       pen_r_x,    pen_r_y,  1,    pen_r_w,    pen_r_h, 1, 1, '.\\entity\\pen_r.svg',       '.\\entity\\pen_r_hl.png',  true, function(){console.log('[i] PEN (RED)');this.animation_start();}));
    entities.push(new Entity('laptop',     laptop_x,   laptop_y,  2,   laptop_w,   laptop_h, 1, 3, '.\\entity\\laptop.svg',     '.\\entity\\laptop_hl.png',  true, function(){console.log('[i] LAPTOP');this.animation_start();}));
    entities.push(new Entity('book_c',     book_c_x,   book_c_y,  2,   book_c_w,   book_c_h, 1, 1, '.\\entity\\book_c.svg',     '.\\entity\\book_c_hl.png',  true, function(){console.log('[i] BOOK (CLOSED)');this.animation_start();}));
    entities.push(new Entity('book_o',     book_o_x,   book_o_y,  2,   book_o_w,   book_o_h, 1, 2, '.\\entity\\book_o.svg',     '.\\entity\\book_o_hl.png',  true, function(){console.log('[i] BOOK (OPEN)');this.animation_start();}));
    entities.push(new Entity('phone',       phone_x,    phone_y,  2,    phone_w,    phone_h, 1, 1, '.\\entity\\phone.svg',       '.\\entity\\phone_hl.png',  true, function(){console.log('[i] PHONE');this.animation_start();if(restitution==1.0)restitution=0.8;else restitution=1.0;}));
    entities.push(new Entity('usb',           usb_x,      usb_y,  2,      usb_w,      usb_h, 1, 1, '.\\entity\\usb.svg',           '.\\entity\\usb_hl.png',  true, function(){console.log('[i] USB');this.animation_start();}));
    entities.push(new Entity('mouse',       mouse_x,    mouse_y,  2,    mouse_w,    mouse_h, 1, 1, '.\\entity\\mouse.svg',       '.\\entity\\mouse_hl.png',  true, function(){console.log('[i] MOUSE');this.animation_start();}));
    entities.push(new Entity('shades',     shades_x,   shades_y,  2,   shades_w,   shades_h, 1, 1, '.\\entity\\shades.svg',     '.\\entity\\shades_hl.png',  true, function(){console.log('[i] SHADES');this.animation_start();}));
    entities.push(new Entity('mug',           cup_x,      cup_y,  2,      cup_w,      cup_h, 1, 1, '.\\entity\\cup.svg',           '.\\entity\\cup_hl.png',  true, function(){console.log('[i] MUG');this.animation_start();is_draw_velocity = !is_draw_velocity;}));
    entities.push(new Entity('lamp',         lamp_x,     lamp_y,  3,     lamp_w,     lamp_h, 1, 3, '.\\entity\\lamp.svg',                             null, false, undefined));
    entities.push(new Entity('chair',       chair_x,    chair_y, -1,    chair_w,    chair_h, 1, 1, '.\\entity\\chair.svg',                            null, false, undefined));

    entities_sort_by_z();
}
scene_create();

function scene_create_phone() {

    let phone = get_entity_extended();

    grid_x = phone.x + 45;
    grid_y = phone.y + 60;
    grid_w = (phone.x + phone.width) - 20;
    grid_h = (phone.y + phone.height) - 110;

    entity_snake = new Snake(14, 20, size_cell, size_cell);

    for (let y = grid_y; y < grid_h; y += size_cell) {
        for (let x = grid_x; x < grid_w; x += size_cell) {
            grid_cells.push(new Cell(x, y, size_cell, size_cell));
        }
    }
}
//scene_create_phone();

function scene_handle(time_passed) {

    let entity_extended = get_entity_extended();

    if (entity_extended == undefined || entity_extended.is_animation) {
        // update entities
        for (let i = 0; i < entities.length; i++) {
            entities[i].update(time_passed);
        }

        // check for collision
        scene_handle_collisions();
        scene_handle_collision_edges();
    }

    // draw entities
    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }

    if (entity_extended) {
        switch (entity_extended.id) {
            case 'phone':
                console.log('phone');
                scene_handle_phone(time_passed);
                break;
            default:
                break;
        }
    }

    /* if (stage == 'paper') {

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let paper = get_entity_by_id('paper');
        ctx.drawImage(paper.image, paper_x_2,paper_y_2, paper_w_2, paper_h_2);

        ctx.save();
        ctx.rotate(7.0 * (Math.PI / 180));

        ctx.fillStyle = 'black';
        ctx.font = '48px serif';
        ctx.fillText('Aaron Priesterroth', paper_x_2 + 250, paper_y_2 + 100);
        ctx.fillText('Winkelgasse 6a', paper_x_2 + 250, paper_y_2 + 160);
        ctx.fillText('55129 Mainz', paper_x_2 + 250, paper_y_2 + 220);

        ctx.fillText('Tel.: +4915140130568', paper_x_2 + 250, paper_y_2 + 300);
        ctx.fillText('E-Mail: aaron@priesterroth.de', paper_x_2 + 250, paper_y_2 + 360);
        //ctx.rotate(0.5 * (Math.PI / 180));
        ctx.restore();
    }*/
}

/*
const entity_snake = {
    x: undefined,
    y: undefined,
    length: 1,

    parts: [],

    length: function() {
        return this.parts.length;
    },

    draw: function() {
        console.log('snake draw');
    },

    update: function() {
        console.log('snake update');
    }
}*/

function scene_handle_phone(time_passed) {

    if (time_passed_snake == undefined) {
        time_passed_snake = 0;
        scene_create_phone();
    }

    time_passed_snake += time_passed;

    //for (let i = 0; i < grid_cells.length; i++) {
      //grid_cells[i].draw();
    //}

    // do game here
    entity_snake.draw();

    if (time_passed_snake > time_snake_update) {
        entity_snake.update();
        
        //console.log(entity_snake.length());
        time_passed_snake -= time_snake_update;
    }
}

function scene_handle_collisions() {

    let obj1;
    let obj2;

    for (let i = 0; i < entities.length; i++) {
        obj1 = entities[i];

        if (obj1.z < 1 || obj1.z == 10) continue; // z = 10 -> extended entity

        for (let j = i + 1; j < entities.length; j++) {
            obj2 = entities[j];

            if (obj2.z < 1 ||obj2.z == 10) continue; // z = 10 -> extended entity

            if (collision(obj1, obj2)) {

                var obj1vx = obj1.x + (obj1.width / 2);
                var obj1vy = obj1.y + (obj1.height / 2);
                var obj2vx = obj2.x + (obj2.width / 2);
                var obj2vy = obj2.y + (obj2.height / 2);

                // calculate collision vector
                let v_collision = {x: obj2vx - obj1vx, y: obj2vy - obj1vy};
                // calculate distance of collision vector
                let distance = Math.sqrt((v_collision.x * v_collision.x) + (v_collision.y * v_collision.y));
                // calculate collision normal vector
                let v_collision_norm = {x: v_collision.x / distance, y: v_collision.y / distance};
                // calculate relative velocity
                let v_relative_velocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                // calculate speed
                let speed = (v_relative_velocity.x * v_collision_norm.x) + (v_relative_velocity.y * v_collision_norm.y);

                // decrease speed based on collision
                speed *= Math.min(obj1.restitution, obj2.restitution);

                if (speed < 0) break;

                let impulse = 2 * speed / (obj1.mass + obj2.mass);

                obj1.vx -= (impulse * obj2.mass * v_collision_norm.x);
                obj1.vy -= (impulse * obj2.mass * v_collision_norm.y);
                obj2.vx += (impulse * obj1.mass * v_collision_norm.x);
                obj2.vy += (impulse * obj1.mass * v_collision_norm.y);
            }
        }
    }

}

function scene_handle_collision_edges() {

    let obj;

    for (let i = 0; i < entities.length; i++) {

        obj = entities[i];

        if (obj.z < 1) continue;

        if (obj.x < 0) {
            obj.vx = Math.abs(obj.vx) * restitution_border;
            obj.x = 0;
        } else if ((obj.x + obj.width) > canvas.width) {
            obj.vx = -Math.abs(obj.vx) * restitution_border;
            obj.x = canvas.width - obj.width;
        }

        if (obj.y < 0) {
            obj.vy = Math.abs(obj.vy) * restitution_border;
            obj.y = 0;
        } else if ((obj.y + obj.height) > canvas.height) {
            obj.vy = -Math.abs(obj.vy) * restitution_border;
            obj.y = canvas.height - obj.height;
        }
    }
}

function animate(time_now) {

    time_passed = (time_now - time_previous) / 1000;
    time_previous = time_now;

    frames_per_second = Math.round(1 / time_passed);
    //console.log(frames_per_second);

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw background
    ctx.fillStyle = "#efe5cb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // update and draw entities
    scene_handle(time_passed);

    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function collision_entity(first, include_table) {
    var entity = undefined;

    for (let i = entities.length - 1; i >= 0; i--) {

        if (entities[i].id == first.id) {
            continue;
        }

        if ((entities[i].is_interactable() || entities[i].is_draggable()) ||
            (include_table && entities[i].id == 'table')) {

            if (collision(first, entities[i])) {
                entity = entities[i];
                break;
            }
        }
    }
    return entity;
}

function collision(first, second) {
    if(!(
        first.x > second.x + second.width ||
        first.x + first.width < second.x ||
        first.y > second.y + second.height ||
        first.y + first.height < second.y
    )) {
      return true;
    }
}

function get_entity_by_id(id) {
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].id == id) {
            return entities[i];
        }
    }
    return undefined;
}

function get_entity_extended() {

    let e = entities[entities.length - 1];

    if (e.is_extended)
        return e;

    return undefined;
}

function entities_sort_by_z() {
    // sort by z-level
    entities = entities.sort((a, b) => (a.z > b.z ? 1 : -1));
}
