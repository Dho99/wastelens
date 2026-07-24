export const REWARD_CONFIG = {
    baseReward: 10,
    sizeBonus: { SMALL: 2, MEDIUM: 5, LARGE: 10, UNCERTAIN: 0 } as const,
    riskBonus: { drainage: 10, obstruction: 5 } as const,
};
