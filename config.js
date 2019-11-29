module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  db: process.env.MONGODB || 'mongodb://localhost:27017,localhost:27018,localhost:27019/dbapp?replicaSet=rs',
  SECRET_TOKEN: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
}