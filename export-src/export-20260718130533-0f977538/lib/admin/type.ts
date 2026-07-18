export type AdminMe = {
    id: number;
    username: string;
    is_active: boolean;
};

export type AdminLoginResponse = {
    user: {
        id: number;
        username: string;
    };
};

export type AdminLogoutResponse = {
    logged_out: boolean;
};
