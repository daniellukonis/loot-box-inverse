// author : daniellukonis

class Gen3artTools{
    constructor(canvasObject){
        this.canvas = canvasObject || document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.source = ['source-over','source-in','source-out','source-atop',
            'destination-over','destination-in','destination-out',
            'destination-atop']
    }

    resizeCanvas(width,height){
        this.canvas.width = width
        this.canvas.height = height
    }

    resizeCanvasParent(){
        const parent = this.canvas.parentElement
        const parentSize = parent.getBoundingClientRect()
        this.canvas.width = parentSize.width
        this.canvas.height = parentSize.height
    }

    resizeCanvasFull(margin = 0){
        const width = window.innerWidth
        const height = window.innerHeight
        this.canvas.width = width - margin
        this.canvas.height = height - margin
    }

    resizeCanvasFullSquare(margin = 0){
        let width = window.innerWidth
        let height = window.innerHeight
        width > height ? width = height : height = width;
        this.canvas.width = width - margin
        this.canvas.height = height - margin
    }

    clearCanvas(){
        this.context.save()
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.context.restore()
    }

    fillCanvas(color){
        this.context.save()
        this.context.fillStyle = color || 'white'
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.context.restore()
    }

    drawFilledCircle(color){
        this.context.save()
        this.context.fillStyle = color || 'red'
        this.context.arc(0, 0, 400, 0, Math.PI * 2)
        this.context.fill()
        this.context.restore()
    }

    degToRand(degree){
        return degree * Math.PI / 180
    }
}

const g3t = new Gen3artTools()
g3t.resizeCanvasFullSquare()
g3t.fillCanvas('black')

class Box{
    constructor(canvas){
        this.canvas = canvas || document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.boxWidth = this.canvas.width * 0.1
        this.angle = this.degToRad(60)
        this.hypot = this.boxWidth / 2 * Math.sqrt(3)
        this.hslColor = Math.round(360 * fxrand())
        this.hc1 = this.hslColor
    }

    degToRad(degree){
        return degree * Math.PI / 180
    }

    randomDirection(){
        return fxrand() >= 0.5 ? 1 : -1
    }

    drawSide(color,{context} = this){
        context.save()
        context.lineWidth = 1
        context.fillStyle = color
        context.shadowBlur = this.canvas.width * 0.15 * fxrand()
        context.shadowColor = color
        context.beginPath()
        context.moveTo(0,0)
        context.rotate(-this.angle * 0.5)
        context.lineTo(this.boxWidth,0)
        context.rotate(-this.angle)
        context.lineTo(this.boxWidth,0)
        context.rotate(-this.angle)
        context.lineTo(this.boxWidth,0)
        context.rotate(-this.angle)
        context.lineTo(0,0)
        context.fill()
        context.restore()
    }

    drawBox({context} = this){
        const hColor = this.hc1
        const h1 = `hsl(${hColor},100%,50%)`
        const h2 = `hsl(${hColor + 10},100%,50%)`
        const h3 = `hsl(${hColor + 20},100%,50%)`
        context.save()
        this.drawSide(h1)
        context.rotate(this.angle * 2)
        this.drawSide(h2)
        context.rotate(this.angle * 2)
        this.drawSide(h3)
        context.restore()
        this.hc1 += 2
    }

    boxMarch({context} = this){
        context.save()
        for(let i = 0; i < this.canvas.width * 0.01; i++){
            this.drawBox()
            this.randomXY()
        }
        context.restore()
    }

    randomXY(){
        fxrand() >= 0.5 ? this.boxRandomY() : this.boxRandomX()
    }

    boxRandomY({context} = this){
        const d = this.randomDirection()
        context.translate(0,this.boxWidth * d)
    }
    
    boxRandomX({context} = this){
        const d = this.randomDirection()
        context.translate(this.hypot*2 * d,0)           
    }

    randomMarch({context} = this){
        for(let i = 0; i < this.canvas.width * 0.01; i++){
            context.save()
            context.translate(this.canvas.width * fxrand(), this.canvas.width * fxrand())
            this.boxMarch()
            context.restore()
        }
        this.createBorder()
    }

    createBorder({context} = this){
        context.save()
        const g = context.createLinearGradient(0,0,this.canvas.width,this.canvas.width)
        g.addColorStop(0,`hsl(${this.hslColor},100%,50%)`)
        g.addColorStop(1, `hsl(${this.hc1},100%,50%)`)
        context.strokeStyle = g
        context.lineWidth = 30
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(this.canvas.width,0)
        context.lineTo(this.canvas.width,this.canvas.width)
        context.lineTo(0,this.canvas.width)
        context.lineTo(0,0)
        context.stroke()
        context.restore()
    }
}

const box = new Box()
console.log(fxhash)
box.randomMarch()

window.addEventListener("contextmenu",e => e.preventDefault())
window.addEventListener('resize',()=>{
    resizeCanvasFullSquare()
    fillCanvas()
    box.randomMarch()
})

// setInterval(()=>{location.reload()},'1000')