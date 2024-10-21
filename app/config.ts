export const config = {
    /**
     * 7 days
     */
    refreshTokenExp: 1000 * 60 * 60 * 24 * 7,
    /**
     * 7 days
     */
    sessionTimeout: 1000 * 60 * 60 * 24 * 7,
    /**
     * 1 days
     */
    accessTokenExp: 1000 * 60 * 60 * 24 * 1,
} as const
