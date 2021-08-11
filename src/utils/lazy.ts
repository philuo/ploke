export const toggleIntoView = (
    inCb?: (el: any) => void,
    outCb?: (el: any) => void
) => {
    return new IntersectionObserver((entries) => {
        entries.forEach(async (item) => {
            if (item.isIntersecting) {
                inCb && (await inCb(item.target));
            } else {
                outCb && (await outCb(item.target));
            }
        });
    });
};

export const lazyImageObserver = (() => new IntersectionObserver((entries) => {
    entries.forEach(async (item) => {
        const element = item.target as HTMLImageElement;
        if (item.isIntersecting) {
            if (element.src) {
                lazyImageObserver.unobserve(element);
                return;
            }

            if (element.dataset.src) {
                element.src = element.dataset.src;
            }
        }
    });
}))();
