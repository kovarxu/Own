
### mysql存储引擎

- InnoDB 存储引擎：它是 MySQL 5.5 版本之后默认的存储引擎，最大的特点是支持事务、行级锁定、外键约束等。
- MyISAM 存储引擎：在 MySQL 5.5 版本之前是默认的存储引擎，不支持事务，也不支持外键，最大的特点是速度快，占用资源少。
- Memory 存储引擎：使用系统内存作为存储介质，以便得到更快的响应速度。不过如果 mysqld 进程崩溃，则会导致所有的数据丢失，因此我们只有当数据是临时的情况下才使用 Memory 存储引擎。
- NDB 存储引擎：也叫做 NDB Cluster 存储引擎，主要用于 MySQL Cluster 分布式集群环境，类似于 Oracle 的 RAC 集群。
- Archive 存储引擎：它有很好的压缩机制，用于文件归档，在请求写入时会进行压缩，所以也经常用来做仓库。

# 查看表的信息

- 查看表结构：`desc player;`
- 查看列注释：`select column_name, column_comment from information_schema.columns where table_schema="nba" and table_name="player";`
- 查看DDL： `show create table player;`

### sql语句的执行

Oracle和Mysql都是走 解析器 -- 优化器 -- 执行器 这样的流程来执行sql的，但Oracle使用了共享池，可以把解析分为软解析和硬解析，而mysql8.0之后不再支持查询缓存

mysql语句：

```sql
// 开启监控
select @@profiling
set profiling=1;
// 查询语句
select * from wucai.heros;
// 查看分析结果
show profile;
show profile for query 2;
```

### DDL 数据定义语言

基本操作：`CREATE, DROP, ALTER`

### 约束

- 主键约束：主键起的作用是唯一标识一条记录，不能重复，不能为空，即 UNIQUE+NOT NULL。一个数据表的主键只能有一个。主键可以是一个字段，也可以由多个字段复合组成。在上面的例子中，我们就把 player_id 设置为了主键。
- 外键约束：外键确保了表与表之间引用的完整性。一个表中的外键对应另一张表的主键。外键可以是重复的，也可以为空。比如 player_id 在 player 表中是主键，如果你想设置一个球员比分表即 player_score，就可以在 player_score 中设置 player_id 为外键，关联到 player 表中。
- 唯一性约束：字段在表中的数值是唯一的。唯一性约束相当于创建了一个约束和普通索引，目的是保证字段的正确性，而普通索引只是提升数据检索的速度，并不对字段的唯一性进行约束。
- NOT NULL约束：该字段不应为空，必须有取值。
- DEFAULT约束：表明了字段的默认值。
- CHECK约束：数值的有效范围，如CHECK(height>=0 AND height<3)

### 查询

关键字顺序：`SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...`

指令执行顺序：`FROM(JOIN ON) > WHERE > GROUP BY > HAVING > SELECT的字段 > DISTINCT > ORDER BY(DESC) > LIMIT`

基本原理：每一步的输出都是一个中间虚拟表

### WHERE子句

关键字和运算符：`> < = != BETWEEN...AND... IS NOT AND OR`

模糊搜索：`LIKE` 通配符: `%`匹配0-n个字符，`_`匹配单个字符

### 内置函数

- 数学：`ABS(-2) -- 2, MOD(101, 3) -- 2, ROUND(37.111, 1) -- 37.1`
- 字符串：`CONCAT, LENGTH, CHAR_LENGTH, LOWER, UPPER`等，一个中文占3字节，数字和英文占1个字节
- 转换：`CAST, COALESCE`等 

尽量不使用内置函数，可能引起全表查询造成慢查询

### 聚集函数

这种是把多个数值聚合成为一个的做法，放到`SELECT`之后干

- 总函数：`COUNT` `COUNT(*)`统计总量（包含NULL), `COUNT(some_field)`统计相关列不为NULL的数量
- 最值：`MAX, MIN` 如`MAX(t_age)`
- 统计：`AVG, SUM`, 如`ROUNT(AVG(DISTINCT hp), 2)`算出所有不重复血量的平均值（取2位小数点）

### 排序

`ORDER BY`结合`DESC`用于对得到的数据进行排序。

### 分组

`GROUP BY`用于分组，可以根据某几个字段进行统计，把相同的值汇为一类，一般用于统计和汇总一些数据

如`SELECT subject, year, count(*) FROM student GROUP BY subject, year;` 可以先后按照学科，学习年限进行汇总，最终得到行排列为`english 1 3; english 2 2; mathmatics 2 1;`这种类型的数据

`HAVING`用户分组的条件，可以应用`WHERE`的语法规则

eg: `SELECT num, t_klass1, t_klass_2 FROM t_info WHERE date > 29 AND month > 10 GROUP BY t_class1, t_class2 HAVING num > 5 DESC`

### 子查询

非关联子查询，先子后主的顺序执行，如“获取队名为篮网队的球员信息”，首先在子句中查team表查到篮网队的team_id, 然后用它在player表中找到球员信息。

关联子查询，父子查询之间经过循环的查询过程，如“找到参加了比赛的所有球员信息”，可以先在player_score表中找到所有player_id, 然后循环找是否在player表中存在(`IN`)；也可以先在player表中找到所有player_id, 循环找是否在 player_score 表中出现过(`EXISTS`)

`ANY, ALL`也都是关键字，要结合运算符使用，如“找到任意一个比同队人身高高的球员” `SELECT * FROM player as a WHERE height > ANY(SELECT height FROM player as b WHERE a.team_id = b.team_id);`

统计：分别统计两队的人数：`SELECT DISTINCT (SELECT COUNT(*) FROM player as B where A.team_id = B.team_id) as total_num, team_id FROM player as A;`

### 连接查询

SQL99是较新的标准，支持进行连接查询。

- 内连接：将多个表合在一起，然后进行筛选查询的过程，包括笛卡尔积、等值连接、非等值连接和自连接
- 外连接：两个表进行结合，会返回一个表中的所有记录，以及另一个表中匹配的行，包括左连接、右连接和全连接
- 笛卡尔积：`SELECT * FROM player CROSS JOIN team;` 两个表将使用主键进行笛卡尔积的计算，返回行的个数是二个参数表行数的乘积；
- 等值连接：`SELECT * FROM player JOIN team ON player.team_id = team.team_id;` 输出包含两个team_id列
- 等值连接：`SELECT * FROM player JOIN team USING(team_id);` 输出只有一个team_id列
- 非等值连接：`SELECT player.player_name, height_grades.height_level FROM player JOIN height_grades ON player.height BETWEEN height_grades.height_lowest AND height_highest;`
- 自连接：`select b.player_name, b.height from player as a join player as b where a.player_name="韦斯利-马修斯" and a.height < b.height order by height desc;` 很有意思的自己连接自己（应该尽量使用自连接代替子查询以提高查询性能）
- 左连接：完全保留左侧的表，右侧的表插空 `LEFT JOIN`
- 右连接：完全保留右侧的表，左侧的表插空 `RIGHT JOIN`

### 视图

View是一种很有用的东西，它创建一张虚拟表，之后的查询基于这个表会很方便。

View相当于一种编译好的程序，并不是真实存在的表。临时表是实际存在的表，并在连接断开的时候自动释放。

修改View的数据会使得原表数据对应修改。

- 创建：`CREATE VIEW my_view AS SELECT ...`
- 修改：`ALTER VIEW my_view AS SELECT ...`
- 删除：`DROP VIEW my_view;`

### 存储过程


