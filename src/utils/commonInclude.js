const commonIncludeOptionsInReview = {
    orderDetail: {
        include: {
            variant: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            thumbnailImage: {
                                select: {
                                    path: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    account: {
        select: {
            id: true,
            fullName: true,
            avatar: {
                select: {
                    path: true,
                },
            }
        },
    },
    reviewImage: {
        select: {
            id: true,
            image: {
                select: {
                    id: true,
                    path: true,
                },
            },
        },
    },
    replyByReview: true,
}

module.exports = {
    commonIncludeOptionsInReview,
};