module dashboard{
    export class Logger{
        constructor(){
            throw new Error("This class should not be instantiated");
        }

        public static error(message: string) {
        	console.log(message);
        }
        public static warn(message: string) {
        	console.log(message);
        }
        public static info(message: string) {
        	console.log(message);
        }
        public static trace(message: string) {
        	console.log(message);
        }
        public static debug(message: string) {
        	console.log(message);
        }
    }
}