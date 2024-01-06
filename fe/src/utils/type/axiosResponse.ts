export interface IAxiosResponse {
    statusCode?: number;
    data?: any;
    message?: string | string[];
    error?: string;
}