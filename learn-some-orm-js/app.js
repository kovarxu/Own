const Sequelize = require('sequelize')
const config = require('./config.js')

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  }
})

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully')
}).catch((err) => {
  console.log('Unable to connect to the database.', err)
})

const Pet = sequelize.define('pets', {
  id: {
    type: Sequelize.STRING(50),
    primaryKey: true
  },
  name: Sequelize.STRING(100),
  gender: Sequelize.BOOLEAN,
  birth: Sequelize.STRING(10),
  createdAt: Sequelize.BIGINT,
  updatedAt: Sequelize.BIGINT,
  version: Sequelize.BIGINT
  }, {
    timestamps: false,
    insecureAuth: true
  }
)

let now = +new Date()

// 增加条目
const addItem = async () => {
  let dog = await Pet.create({
    id: 'g--' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2007-07-07',
    createdAt: now,
    updatedAt: now,
    version: 0
  })
  console.log('created item successfully!')
}

// 查找匹配条目
const findItem = async () => {
  let pets = await Pet.findAll({
    where: {
      name: 'Gaffey'
    }
  })
  console.log(`find ${pets.length} pets.`)
  for (let p of pets) {
    console.log(JSON.stringify(p))
  }
  return pets
}

// 修改条目
const changeItem = async () => {
  let pets = await findItem()
  for (let p of pets) {
    p.gender = true
    p.updatedAt = +new Date()
    p.version ++
    await p.save()
    console.log('change item successfully.')
  }
}

const destroy = async () => {
  let pets = await findItem()
  for (let p of pets) {
    await p.destroy()
  }
}

// addItem()
// findItem()
changeItem()
