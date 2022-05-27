// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const paginationPipeLine = (page = 1) => {
  const limit = 4
  const skip = (Math.ceil(page) - 1) * limit

  return [
    {
      $match: {
        isApproved: true,
        englishName: { $ne: null },
        rank: /species/i,
      },
    },
    {
      $sort: {
        taxonomyName: -1,
      },
    },

    {
      $facet: {
        total: [
          {
            $count: 'count',
          },
        ],
        items: [
          {
            $addFields: {
              _id: '$_id',
            },
          },
        ],
      },
    },
    {
      $unwind: '$total',
    },

    {
      $project: {
        items: {
          $slice: [
            '$items',
            skip,
            {
              $ifNull: [limit, '$total.count'],
            },
          ],
        },
        page: {
          $literal: skip / limit + 1,
        },
        hasNextPage: {
          $lt: [{ $multiply: [limit, Math.ceil(page)] }, '$total.count'],
        },
        hasPreviousPage: {
          $cond: [
            { $eq: [Math.ceil(page), 0] },
            false,
            { $gt: [Math.ceil(page), Math.ceil(page) - 1] },
          ],
        },
        totalPages: {
          $ceil: {
            $divide: ['$total.count', limit],
          },
        },
        totalItems: '$total.count',
      },
    },
  ]
}
export const unApprovedPipe = [
  {
    $match: {
      isApproved: false,
    },
  },
  {
    $lookup: {
      from: 'users',
      pipeline: [
        {
          $match: {
            $or: [
              {
                role: 'admin',
              },
              {
                role: 'mod',
              },
            ],
          },
        },
        {
          $project: {
            role: 1,
            username: 1,
            _id: 0,
          },
        },
      ],
      as: 'users',
    },
  },
  {
    $unwind: {
      path: '$users',
    },
  },
  {
    $addFields: {
      role: '$users.role',
      contributor: '$users.username',
    },
  },
  {
    $project: {
      users: 0,
    },
  },
]

export const ancestorsPipeLine = ({
  p,
  r,
}: {
  p: RegExp
  r: RegExp
}): any[] => [
  {
    $match: {
      ancestors: p,
      rank: r,
      isApproved: true,
    },
  },
  {
    $project: {
      ancestors: 1,
      _id: 0,
    },
  },
  {
    $limit: 1,
  },
]

export const getByUserPipeLine = ({
  username,
  listName,
}: {
  username: string
  listName: string
}): any[] => [
  {
    $match: {
      listName,
      username,
    },
  },
  {
    $lookup: {
      from: 'taxonomies',
      localField: 'birds.birdId',
      foreignField: '_id',
      as: 'string',
    },
  },
]
