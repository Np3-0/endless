export default class Enemy {
    constructor(pos, x, y, sizeX, sizeY, speed, frames) {
        this.pos = pos;
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.speed = speed;
        this.frames = frames;
        this.curFrame = 0;
    }

    update() {
        this.y += this.speed;
    }

    render() {
        fill(0, 0, 255);
        switch (this.pos) {
            case 0: 
                this.x = width / 4;
                break;
            case 1:
                this.x = width / 2;
                break;
            case 2:
                this.x = width * 0.75;
                break;
        }
        push();
        translate(this.x, this.y);
        rotate(90);
        image(this.frames[this.curFrame], 0, 0, this.sizeX, this.sizeY);
        pop();
        if (frameCount % 7 == 0) {
            this.curFrame++;
            if (this.curFrame >= this.frames.length) {
                this.curFrame = 0;
            }
        }
    }
}