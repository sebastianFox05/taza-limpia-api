import { Activity } from '../models/activity-model.js';
import { Coffee } from '../models/coffee-model.js';

const groupBy = (field) => [
  { $group: { _id: `$${field}`, total: { $sum: 1 }, averageScore: { $avg: '$score' } } },
  { $project: { _id: 0, label: '$_id', total: 1, averageScore: { $round: ['$averageScore', 1] } } },
  { $sort: { total: -1, label: 1 } },
];

// Hecho con ayuda de IA: el $facet que junta todas las estadisticas en una sola consulta
export const getStats = async (req, res, next) => {
  try {
    const [stats] = await Coffee.aggregate([
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                averageScore: { $avg: '$score' },
                averageAltitude: { $avg: '$altitude' },
                highestAltitude: { $max: '$altitude' },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
                highestAltitude: 1,
                averageScore: { $round: ['$averageScore', 1] },
                averageAltitude: { $round: ['$averageAltitude', 0] },
              },
            },
          ],
          byCountry: groupBy('country'),
          byProcess: groupBy('process'),
          byRoast: groupBy('roast'),
        },
      },
    ]);

    return res.status(200).json({ ...stats, summary: stats.summary[0] ?? null });
  } catch (error) {
    return next(error);
  }
};

export const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.find().sort({ createdAt: -1 }).limit(8);

    return res.status(200).json({ activity });
  } catch (error) {
    return next(error);
  }
};
