const prefixes = ["", "k", "M", "G", "T"]

export function filesize(input) {
    let num = parseInt(input)

    if (!num) {
        return input
    }
    
    for (var i = 0; i < prefixes.length && num > 1024; i++) {
        num = num / 1024
    }
    
    return num.toFixed(1) + " " + prefixes[i] + "B"
}
