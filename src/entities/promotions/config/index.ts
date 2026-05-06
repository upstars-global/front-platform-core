type PromotionsState = {
    filterItemsFn: <T extends { tags: string[] }>(items: T[]) => T[];
};

const defaultPromotionsState: PromotionsState = {
    filterItemsFn: (items) => items,
};

let promotionsState: PromotionsState = {
    ...defaultPromotionsState,
};

export const configPromotions = {
    getFilterItemsFn: () => {
        return promotionsState.filterItemsFn;
    },
    setFilterItemsFn: (filterItemsFn: PromotionsState["filterItemsFn"]) => {
        promotionsState.filterItemsFn = filterItemsFn;
    },
    resetPromotionsConfig: () => {
        promotionsState = {
            ...defaultPromotionsState,
        };
    },
};
