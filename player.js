export default class Player {
    
    constructor(x, y, pos, size, frames) {
        this.x = x;
        this.y = y;
        this.pos = pos;
        this.size = size;   
        this.frames = frames;
        this.curFrame = 0;
        this.animIndex = 0;
    }

    updatePos(updateVal) {
        this.pos += updateVal;
        if (this.pos > 2) this.pos = 0;
        if (this.pos < 0) this.pos = 2;
        
        this.setAnim(updateVal > 0 ? 3 : 2);
    }

    setAnim(index) {
        if (this.animIndex != index) {
            this.animIndex = index;
        }
        this.curFrame = 0;
    }

    render() {
        switch (this.pos) {
            case 0: 
                this.x = width * 0.25;
                break;
            case 1:
                this.x = width * 0.5;
                break;
            case 2:
                this.x = width * 0.75;
                break;
        }
        const animation = this.frames[this.animIndex];
        image(animation[this.curFrame], this.x, this.y, this.size * 5, this.size * 5);
        if (frameCount % 7 == 0) {
            this.curFrame++;
            if (this.curFrame >= animation.length) {
                this.curFrame = 0;
                this.animIndex = 0;
            }
        }
    }
}