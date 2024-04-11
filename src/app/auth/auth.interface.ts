export interface AuthResponse {
    idToken: String;
    email: String;
    refreshToken: String;
    expiresIn: String;
    localId: String;
    registered?: boolean;
}