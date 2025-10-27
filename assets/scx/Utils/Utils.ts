class Utils {

    static randomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

}

export {
    Utils
}