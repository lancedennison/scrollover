const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            // Optionally configure arcade physics settings here
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let menuConfig = {
    fontFamily: 'CustomFont',
    fontSize: '28px',
    color: '#ffffff',
    shadow: {
        color: '#4682B4',
        offsetX: 4,
        offsetY: 4,
        fill: true
    },
    align: 'right',
    padding: {
    x: 20,
    y: 5
    },
    fixedWidth: 0
}

const game = new Phaser.Game(config);

let keyESC;
let circles;
let focusCircle;
let tween;
let play = true;

function preload() {
    this.load.image('circle', 'assets/circle.png');
}

function create() {
    let scene = this
    keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.add.text(10, 590, 'Press (ESC) to Restart at any time', menuConfig);
    circles = this.physics.add.group();
    
    // Create grid of circles
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 15; j++) {
            this.add.sprite(50 + i * 30, 50 + j * 30, 'circle').setTint(0x000000);
            const circle = circles.create(50 + i * 30, 50 + j * 30, 'circle');
            circle.setDisplaySize(20, 20).setAlpha(0.01);
            circle.setTint(0x000000);
            circle.setData('originalTint', 0x000000);
        }
    }
    
    // Set interactive behavior
    circles.children.iterate(circle => {
        circle.setInteractive();
        circle.on('pointerover', () => {
            if(play)
            {
                this.tweens.killTweensOf(circle);
                circle.setAlpha(1);
                if(circle == focusCircle) {
                    this.tweens.killAll();
                    win();
                }
            }
        });
        circle.on('pointerout', () => {
            if(play)
            {
                tween = this.tweens.add({
                    targets: circle,
                    alpha: 0.01,
                    duration: 2000
                });
            }
        });
    });
    reset();
}

function update() {
    if (Phaser.Input.Keyboard.JustDown(keyESC))
        this.scene.restart();
}

function reset() {
    play = true;
    // Randomly select focus circle
    focusCircle = Phaser.Math.RND.pick(circles.getChildren());
    focusCircle.setData('originalTint', 0xffffff);

    circles.children.iterate(circle => {
        const distance = Phaser.Math.Distance.Between(circle.x, circle.y, focusCircle.x, focusCircle.y);
        const brightness = Phaser.Math.Clamp(1 - (distance / 500), 0, 1);
        
        const red = Phaser.Math.Clamp(255 - (255 * brightness), 0, 255);
        const green = Phaser.Math.Clamp((255 * brightness), 0, 255);
        const blue = 0;
        
        const color = Phaser.Display.Color.GetColor(red, green, blue);
        circle.setTint(color);
    });
    focusCircle.setTint(0xffffff);
}

function win() {
    play = false;
    circles.children.iterate(circle => {
        circle.setAlpha(1);
    });
}
