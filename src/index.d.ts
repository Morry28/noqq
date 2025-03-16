declare module "noqq" {
    export default class NOQQ {
        constructor(options: { apiKey: string; profile?: string; file?: string; serverSideProcessing?: boolean });
        file: any;
    }
}
