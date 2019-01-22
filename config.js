module.exports = {
  port: process.env.PORT || 3001,
  db: process.env.MONGODB || 'mongodb://localhost:27017/dbapp',
  SECRET_TOKEN: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
}