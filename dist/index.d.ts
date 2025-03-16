export default class NOQQ {
    protected openaiApiKey: string;
    user: ProfileManager;
    sample: any;
    serverSideProcessing: boolean;
    private filePath;
    constructor({ openaiApiKey, user, serverSideProcessing }: {
        openaiApiKey: string;
        user: string;
        serverSideProcessing?: boolean;
    });
    initFile(filePath: string): Promise<void>;
    query(userQueryText: string): Promise<unknown>;
    private createResponse;
}
declare class ProfileManager {
    currentProfile: string;
    private conversation;
    constructor();
    setProfile(nextProfile: string): this;
    getProfile(): string;
    getConversation(): object[];
}
export {};
