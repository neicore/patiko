const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreUI = document.getElementById('score')

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

const friction = 0.98

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

const centerX = canvas.width / 2
const centerY = canvas.height / 2

const player = new Player(centerX, centerY, 20, 'white')
const projectiles = []
const enemies = []
const particles = []

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
let score = 0
scoreUI.textContent = score

const animate = () => {
  animationId = requestAnimationFrame(animate)

  c.fillStyle = 'rgba(0,0,0, 0.1'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.draw()

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })

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

    // Enemy vs projectile collision
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      )

      if (distance - enemy.radius - projectile.radius < 1) {
        // particle explosion
        for (let i = 0; i <= enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 5),
                y: (Math.random() - 0.5) * (Math.random() * 5),
              }
            )
          )
        }

        if (enemy.radius - 10 > 5) {
          // increse score
          score += 100
          scoreUI.textContent = score

          // shrink enemy
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          })

          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)
        } else {
          // increse score
          score += 250
          scoreUI.textContent = score

          // remove enemy completely
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
