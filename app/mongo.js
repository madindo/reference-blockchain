db.friends.aggregate([ 
    { $project: { _id: 0, scores: { $filter: { input: "$examScores", as: "sc", cond: { $gt: ["$$sc.score", 60] } } } } }
])

db.friends.aggregate([ 
  { $unwind: "$examScores"  },
  { $project: { _id: 1, name: 1, age: 1, score: "$examScores.score"} },
  { $sort: { score: -1} },
  { $group: {_id: "$_id", name: { $first: "$name" }, maxScore: { $max: "$score"}}},
  { $sort: { maxScore: -1 } }
])

// analytics
db.persons.aggregate([ 
  { 
    $bucket: { 
      groupBy: "$dob.age", 
      boundaries: [18, 30, 40,50,60, 120],
      output: {
        numPerson: { $sum: 1 },
        averageAge: {$avg: "$dob.age"}
      }
    } 
  }
])


db.persons.aggregate([ 
  { 
    $bucketAuto: { 
      groupBy: "$dob.age", 
      buckets: 5,
      output: {
        numPerson: { $sum: 1 },
        averageAge: {$avg: "$dob.age"}
      }
    } 
  }
])

db.persons.aggregate([
  { $match: {gender: "male"} },
  { $project: {_id: 0, name: { $concat: ["$name.first", " ", "$name.last"] }, birthdate: { $toDate: "$dob.date"} } },
  { $sort: { birthdate: 1 } },
  { $skip: 10 },
  { $limit: 10 },
  { $out: "newPersons" }
])

db.newPersons.createIndex({location: "2dsphere"})
db.newPersons.aggregate([
  { 
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-18.4, -42.8]
      },
      maxDistance: 10000,
      num: 10,
      query: {
        age: {
          $gt: 30
        },
      },
      distanceField: "distance"
    }
  }
])