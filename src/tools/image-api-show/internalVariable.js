import { generateRandomString } from "./utils";

export const InternalVariableArray = [
    (text) => {
        if (text.match(/{{\$time}}/)) {
            return text.replaceAll(/\{\{\$time\}\}/g, (match, p1) => {
                return new String(Date.now());
            });
        }
        return text;
    },
    (text) => {
        if (text.match(/\{\{\s*\$randomInt\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*\}\}/)) {
            return text.replaceAll(/\{\{\s*\$randomInt\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)\s*\}\}/g, (match, p1, p2) => {
                let a = p1, b = p2;
                if (a > b) {
                    [a, b] = [b, a];
                }
                return Math.floor(Math.random() * (b - a + 1) + a);
            });
        }
        return text;
    },
    (text) => {
        if (text.match(/\{\{\s*\$randomString\(\s*(-?\d+)\s*\)\}\}/)) {
            return text.replaceAll(/\{\{\s*\$randomString\(\s*(-?\d+)\s*\)\}\}/g, (match, p1) => {
                return generateRandomString(p1);
            })
        }
        return text;
    }
]