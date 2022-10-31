export interface AuthInterface {
    login: (username: string, password: string) => Promise<any>,
    updateAccount: (data: any) => Promise<any>,
}