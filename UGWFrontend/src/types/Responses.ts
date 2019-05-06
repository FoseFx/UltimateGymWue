export class MessageResponse {
    error: boolean;
    msg: string;
}
export class DataResponse<T> {
    error: boolean;
    msg?: string;
    data: T;
}
