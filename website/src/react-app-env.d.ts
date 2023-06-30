/// <reference types="react-scripts" />
// Why it's here: https://stackoverflow.com/a/67263068
// Basically so you could imprort .png .jpg and etc.

// For other formats just need to declare them:
// https://github.com/facebook/create-react-app/issues/6822
declare module '*.webm' {
    const src: string;
    export default src;
}

declare module '*.wav' {
    const src: string;
    export default src;
}
