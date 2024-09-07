export class SsoProvider {
    code?: SsoProviderCode;
    name?: string;
}

export enum SsoProviderCode {
    internal = 1,
    microsoft = 2,
    facebook = 3,
    google = 4
}
