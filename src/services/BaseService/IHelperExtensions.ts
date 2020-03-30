export interface IHelperExtensions {
    getProjectName(file: string): string | null;
    formatDate(date: Date): string;
    getUserAgent() : string;
}