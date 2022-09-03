const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

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

class Enemy {
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

const player = new Player(centerX, centerY, 20, 'white')
const projectiles = []
const enemies = []

const spawnEnemies = () => {
  setInterval(() => {
    const radius = Math.random() * (30 - 5) + 5

    let x
    let y

    if (Math.random() <= 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const color = `hsl(${Math.random() * 360},100%,60%)`

    const angle = Math.atan2(centerY - y, centerX - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    }
    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let animationId

const animate = () => {
  animationId = requestAnimationFrame(animate)

  c.fillStyle = 'rgba(0,0,0, 0.1'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()

  projectiles.forEach((projectile, index) => {
    projectile.update()

    //   Clear projectiles when they reach the edge of the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })

  enemies.forEach((enemy, index) => {
    enemy.update()

    //   End game
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    if (distance - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
    }

    projectiles.forEach((projectile, projectileIndex) => {
      // Enemy vs projectile collision
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      )

      if (distance - enemy.radius - projectile.radius < 1) {
        console.log(enemy.radius)
        if (enemy.radius - 10 > 5) {
          gsap.to(enemy, {
           radius: enemy.radius - 10
         })

          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {
          setTimeout(() => {
            enemies.splice(index, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }
      }
    })
  })
}

addEventListener('click', (e) => {
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5,
  }
  projectiles.push(new Projectile(centerX, centerY, 5, 'white', velocity))
})

animate()
spawnEnemies()
