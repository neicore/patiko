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

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const centerX = canvas.width / 2
const centerY = canvas.height / 2

const player = new Player(centerX, centerY, 30, 'blue')

const projectiles = []

const animate = () => {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)
  player.draw()
  projectiles.forEach((projectile) => {
    projectile.update()
  })
}

addEventListener('click', (e) => {
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  }
  projectiles.push(new Projectile(centerX, centerY, 5, 'red', velocity))
})

animate()
