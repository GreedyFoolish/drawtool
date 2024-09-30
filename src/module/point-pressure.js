export class PointPressure {
    #x = 0
    #y = 0
    #pressure = 0
    #pointRank = [0, 0, 0]

    constructor(x, y, pressure) {
        this.x = x
        this.y = y
        this.pressure = pressure
    }

    get x() {
        return this.#x
    }

    set x(value) {
        this.#x = +value
        this.#pointRank[0] = this.#x
    }

    get y() {
        return this.#y
    }

    set y(value) {
        this.#y = +value
        this.#pointRank[1] = this.#y
    }

    get pressure() {
        return this.#pressure
    }

    set pressure(value) {
        this.#pressure = Math.min(1, Math.max(0, +value))
        this.#pointRank[2] = this.#pressure
    }

    get pointRank() {
        return this.#pointRank
    }
}
