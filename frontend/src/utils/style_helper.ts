export const getRandomColor = () => {
    const randomNumber = Math.floor(Math.random() * 12);
    switch (randomNumber) {
        case 0: return "red"
        case 1: return "pink"
        case 2: return "grape"
        case 3: return "violet"
        case 4: return "indigo"
        case 5: return "blue"
        case 6: return "cyan"
        case 7: return "teal"
        case 8: return "green"
        case 9: return "lime"
        case 10: return "yellow"
        case 11: return "orange"
        default: return "gray"
    }
}
