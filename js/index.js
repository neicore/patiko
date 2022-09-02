const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

c.fillRect(0, 0, canvas.width, canvas.height)

class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

const centerX = canvas.width / 2
const centerY = canvas.height / 2

const player = new Player(centerX, centerY, 30, 'blue')
player.draw()
