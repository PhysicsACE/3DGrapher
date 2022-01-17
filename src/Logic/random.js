const random = [['z = (p / (abs(sqrt(x*x + y*y)) + (p / 4))) * sin(sqrt(x*x + y*y))', {'p': [0, 10, 2, false]}], ['z = sin(p * x * y)', {'p': [-0.1, 0.1, 0, false]}], ['z = asin(sin(p * x)) + acos(cos(p * y))', {'p': [0, 1, 0, false]}]]

export function randomEq() {
    const randomnum = Math.floor(Math.random() * 3)
    return random[randomnum]
}