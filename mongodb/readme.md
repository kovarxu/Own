# mongodb

## 特征

非关系型数据库，不支持外键，不支持事务，不支持数据类型约定。什么叫非关系型？就是把数据直接放进一个大仓库，不标号、不连线、单纯的堆起来。传统数据库由于受到各种关系的累赘，各种数据形式的束缚，难以处理海量数据以及超高并发的业务场景。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富、最像关系数据库的。由于关系型数据库存储对数据之间存在高度的关联，在数据量达到上万亿比特时，关系型数据库所特有的约束和关联就会成为性能瓶颈。非关系型数据库采用了另一种思维方式，即不考虑数据之间千丝万缕的联系，存储也不需要固定的模式，这样无需多余的操作就能成倍地扩展数据量。

MongoDB 支持的数据结构非常松散，是类似 json 的 bson 格式，因此可以存储比较复杂的数据类型

在 MongoDB 中，一个数据库包含多个集合，类似于 MySQL 中一个数据库包含多个表；一个集合包含多个文档，类似于 MySQL 中一个表包含多条数据。可以把集合记为表，文档记为一条记录。

## mac安装和连接

安装 `brew install mongodb/brew/mongodb-community-shell`

连接 `mongo "mongodb+srv://lord.vxkdg.mongodb.net/<dbname>" --username <username>`

## 添加用户

```sh
use admin 
db.createUser({user:"admin",pwd:"123456",roles:["root"]} # 添加管理员
db.createUser({user: "root", pwd: "123456", roles: [{ role: "dbOwner", db: "test" }]}) # 创建用户
db.auth("admin", "123456") # 认证
```

## 核心概念

### 数据库

```sh
show dbs // 查看所有数据库列表, 不显示空数据库
db // 当前数据库对象或者集合的信息
use test // 连接到test数据库，如果不存在则创建
db.dropDatabase() // 删除数据库
```

### 文档

文档是MongoDB的核心，类似SQLite等关系型数据库的每一行数据。多个键及其关联的值放在一起就是文档。在 Mongodb 中使用一种类 json 的 bson 存储数据，bson 数据可以理解为在 json 的基础上添加了一些 json 中没有的数据类型。

* 文档的逻辑关系

1. 嵌入式关系，把一个放到另一个里面

```js
{
  "name": "lily",
  "address": [
    {
      "ip": "0.0.0.1"
    }
  ]
}
```

2. 引用式关系，两个文档分开，通过引用_id字段建立关系

```js
{
"name": "lily",
  "address": [
    ObjectId("52ffdfa9879000000")
  ]
}
```

### 集合

集合类似于表，在 MongoDB 中可以存储不同的文档结构的文档。
缺陷：关系型数据库一个表的表头字段只需要存储一次即可，但是mongodb由于头可能不同，每条文档都要存储一遍头字段，耗费了额外的空间。

## CRUD

创建数据库：`use mydb`
销毁数据库：`use mydb; db.dropDatabase()`

创建集合：`db.createCollection("users")`
删除集合：`db.users.drop()`
查看集合：`show collections`

### 插入

`db.users.insert([...])` 插入数据，已存在会报错

`db.users.insertOne({})` 插入一条数据

`db.users.insertMany([])` 必须是一个列表

`db.users.save([...])` 通过传入的文档来替换已有文档，save项里面有提供_id则更新，否则为新建

### 更新

`db.users.update({查询条件}, {替代文档}, {选项})`

其中替代文档如果直接写一个文档，是会直接替换掉原文档的

如果只想修改，则可以`{$set: { "name": "lily" }}`

默认每次只更新一条记录，选项可以提供`{ multi: true }`切换成更新全部

使用`{upsert: true}`开启如果没找到目标则插入一条新记录

### 删除

`db.users.remove({查询条件}, {justOne: boolean})`

`db.users.deleteOne({})`

`db.users.deleteMany({})`

### 查询

`db.users.find()` 查询所有记录

`db.users.find().pretty()` 美化输出

#### and / or / not

`db.users.find({"name": "liy", "size": "45"})` 查询符合条件的数据，没有AND操作，等价的SQL语句为：`SELECT * FROM post WHERE name = 'liy' AND size = '45'`

`db.users.find({$or: [{"name": "liy"}, {"size": "45"}]})` 查询符合条件的数据，有OR操作，等价的SQL语句为 `SELECT * FROM post WHERE name = 'liy' OR size = '45'`

#### skip, limit, sort

`db.users.find({"name": "liy", "size": "45"}).limit(1).skip(1)` 只读取一条数据，且跳过第一条

`db.users.find({"name": "lily"}).sort({"score": -1})` sort：1为升序，-1为降序，默认升序

`db.articles.remove({data: {$not: {$in: [1, 2]}}})` not: 非，nor: 并行条件均不

#### in, nin, all

`db.users.find({"name": {$in: ['lily', 'lucy', 'tom']}}).pretty()` in 包含，nin不包含

all比较特殊，用于列表型的字段记录，待检索项必须同时包含all指定的条目

#### exists, null

`db.users.find({"email: {$exists: true, $in: [null]}})` 查找所有email字段存在，但是为null的记录

#### 其他

`$lt, $gt, $gte, $lte, $ne, $mod` 数学运算

`db.user.find({'score': {$gt: 120}}).count()` 获取条目数量

#### 子表

`db.users.distinct("name")` 获取所有用户的名字信息

#### 正则

`db.users.find({"name": /^(liy|jone)/})` MongoDB模糊查询支持正则表达式

## 高级

### 索引

简单的说，索引就是将文档按照某个（或某些）字段顺序组织起来，以便能根据该字段高效的查询。可以显著提高查询、更新、删除、排序等场景的效率。它的本质类似依照次字段创建一棵B树，提高操作的效率。

1. MongoDB默认会为集合创建_id字段的索引。
2. `db.person.createIndex( {age: 1} )`单字段索引, age: 1表示升序索引。
3. `db.person.createIndex( {age: 1, name: 1} )` 复合索引，先按第一个字段排序，第一个字段相同的文档按第二个字段排序，依次类推。
4. 

`db.person.createIndex( {name: 1, age: 1} ) `

除了查询的需求能够影响索引的顺序，字段的值分布也是一个重要的考量因素，即使person集合所有的查询都是『name和age字段组合』（指定特定的name和age），字段的顺序也是有影响的。

age字段的取值很有限，即拥有相同age字段的文档会有很多；而name字段的取值则丰富很多，拥有相同name字段的文档很少；显然先按name字段查找，再在相同name的文档里查找age字段更为高效。

### 聚合 aggregate

* `$match` 筛选
* `$project` 投射，用于去掉、修改和包含某些字段
* `$group` 分组
* `$sort`
* `$limit`
* `$skip`

```sql
db.my_col.aggregate([
    {$match: {"name": "oliviawzhu"}},   #查找 oliviawzhu 同学的课程成绩
    {$project: {"_id":  0}},   #不需要_id字段
    {$sort: {"score":  -1, "class": 1}},  #按分数降序排序；同样分数的，按课程名字升序排序
    {$skip: 1},    #跳过一条数据
    {$limit: 1}    #只显示一条数据
])
```

#### group聚合实例

```sql
{
	"_id" : ObjectId("5f2f5ab7340034ff775cf568"),
	"name" : "xiaozhi",
	"subject" : "math",
	"score" : 112
}
{
	"_id" : ObjectId("5f2f5adb340034ff775cf569"),
	"name" : "xiaozhi",
	"subject" : "englist",
	"score" : 98
}
{
	"_id" : ObjectId("5f2f5ae5340034ff775cf56a"),
	"name" : "xiaozhi",
	"subject" : "chinese",
	"score" : 98
}
{
	"_id" : ObjectId("5f2f5af3340034ff775cf56b"),
	"name" : "xiaozhang",
	"subject" : "math",
	"score" : 123
}
{
	"_id" : ObjectId("5f2f5b07340034ff775cf56c"),
	"name" : "xiaozhang",
	"subject" : "chinese",
	"score" : 91
}
{
	"_id" : ObjectId("5f2f5b15340034ff775cf56d"),
	"name" : "xiaozhang",
	"subject" : "englist",
	"score" : 68
}
```

使用语句聚合`db.scores.aggregate({ $group: {_id: "$name", total: {$sum: "$score"}}})`得到：

```sql
{ "_id" : "xiaozhang", "total" : 282 }
{ "_id" : "xiaozhi", "total" : 308 }
```

聚合函数包括 `sum, avg, max, min` 等

### 备份

使用Mongodb altas可以在`Command Line Tools`中找到指引
`mongodump --uri mongodb+srv://<username>:<password>@lord.vxkdg.mongodb.net/<dbname> --collection=article -o <outputdir>`

### 还原

`mongorestore -h <localhost:27017> -d <dbname> <dir>`
