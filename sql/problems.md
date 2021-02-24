
## problems
-----------

1. 筛选出表中重复的记录
2. 查找第n高的数据
3. 多表查询
4. 日期diff
5. 分类汇总的同时求平均
6. 维度转换
7. 连续出现的满足条件的数据
8. 分数排名（重要）
9. 部门工资前三高的所有员工（*）
10. 行程和用户（*）

## answers
-----------

### 筛选出表中重复的记录

表 `borrow_record`：

+----+------+----------+
| id | name | quantity |
+----+------+----------+
|  1 | hua  |        3 |
|  2 | lee  |        9 |
|  3 | qiao |       33 |
|  4 | qiao |        3 |
|  5 | qiao |        2 |
|  6 | hua  |        1 |
+----+------+----------+

分析：

- `select name, count(name) from borrow_record` 是无法执行的，因为name和count(name)的维度不一样

- `select name, count(name) as c from borrow_record group by name` 可以执行，此处name被标记为分组，最后得到结果的行数就是分组个数

- `select name, c from (select name, count(name) as c from borrow_record group by name) as p where p.c > 1` 可以作为本题答案，通过子查询先按组汇总name的名字

- `select name, count(name) as c from borrow_record group by name having c > 1` 更好用

### 查找第n高的数据

- `select * from borrow_record order by quantity desc,name limit {{ n-1 }},1;` 使用排序和limit解决，limit第**1**个参数是offset。

- `select ifnull((select name from borrow_record order by quantity desc,name limit 1,1), null) as 'result';` 这里使用ifnull函数进行处理，但是注意内层select只选择了name属性，这种用法不能选择多个属性。

- 使用函数：

```sql
create function getNthHighestSalary(n int) returns int 
begin
  set n = n - 1;
  return (
    select distinct Salary from Employee order by Salary desc limit n, 1
  );
end
```

### 多表查询

- cross join = (inner) join = ',' ———— cross join 和 ',' 不带 'on' 运算符，而 (inner) join 需要 'on'
- a inner join b: 取a和b的交集
- a left join b: 保留a的所有
- a right join b: 保留b的所有
- a left join b on ... where b is null: 取只属于a不属于b的
- a right join b on ... where a is null: 取只属于b不属于a的

`borrow_users`表：

+----+------+--------+-----+
| id | name | sex    | age |
+----+------+--------+-----+
|  1 | hua  | male   |  20 |
|  2 | lee  | male   |  19 |
|  3 | gui  | female |  19 |
|  4 | nia  | female |  21 |
|  5 | qiao | male   |  21 |
+----+------+--------+-----+

- 获取users表中借过东西的人: `select distinct borrow_users.name from borrow_users inner join borrow_record on borrow_users.name = borrow_record.name;` 这里至于必须使用distinct，因为inner join是取交集，borrow_record中的 hua 和 qiao 记录均出现过多次，不带distinct得到的结果没有去重。

- 获取没借过东西的人：`select borrow_users.name from borrow_users left join borrow_record on borrow_users.name = borrow_record.name where borrow_record.name is null;` 直接使用左连接即可。

注意：

- `{left join, right join, cross join} on true` 都得到相同的笛卡尔积，结果取决于on后面的条件和到底是何种join方式
- `left join on A and B` 和 `left join on A where B` 是不同的，可以简单理解为前者是A和B共同作为筛选条件进行作用，后者是先执行筛选A，后执行筛选B

### 日期diff

timestampdiff 函数用于计算两个时间戳的相差，第一个参数是diff的单位，可以是day, minute, second等，第二个参数是参照时间，第三个参数是待比较的时间 `select (select timestampdiff(second, '2021-01-22 12:00:12', '2021-01-22 12:00:00')) as diffsec;`

`weather`表：

+----+------------+------+
| id | date       | temp |
+----+------------+------+
|  1 | 2015-01-01 |   10 |
|  2 | 2015-01-02 |   25 |
|  3 | 2015-01-03 |   20 |
|  4 | 2015-01-04 |   30 |
+----+------------+------+

找到所有比前一天温度高的date：`select a.date, a.temp from weather as a cross join weather as b on timestampdiff(day, a.date, b.date) = -1 and a.temp > b.temp;`

这里使用了`cross join`，这个操作计算出两表的笛卡尔积，mysql默认的`join`即为`cross join`。

### 分类汇总的同时求平均

`student`表：

+--------+---------+-------+------------+-----+----------+
| name   | stud_id | klass | start_time | age | subject  |
+--------+---------+-------+------------+-----+----------+
| 小赵   |       1 |     1 | 2016-09-01 |  19 | computer |
| 小钱   |       2 |     1 | 2017-09-01 |  21 | computer |
| 小孙   |       3 |     2 | 2017-09-01 |  19 | finance  |
| 小虫   |       4 |     2 | 2017-09-01 |  20 | finance  |
| 小李   |       5 |     3 | 2017-09-01 |  17 | computer |
| 小周   |       6 |     3 | 2017-09-01 |  20 | computer |
| 小吴   |       7 |     3 | 2017-09-01 |  18 | computer |
+--------+---------+-------+------------+-----+----------+

`grade`表:

+---------+-----------+-------+
| stud_id | course_id | grade |
+---------+-----------+-------+
|       1 |         1 |    90 |
|       2 |         1 |    70 |
|       2 |         2 |    84 |
|       3 |         1 |    90 |
|       3 |         3 |    80 |
|       4 |         1 |    90 |
|       4 |         2 |    60 |
|       5 |         1 |    85 |
|       6 |         2 |    70 |
|       7 |         1 |    88 |
+---------+-----------+-------+

问题是得到每个klass的学生的平均成绩超过80分的人数，并且计算出占比。

```sql
select klass,
  sum(case when p.av >= 80 then 1 else 0 end) as total,
  (sum(case when p.av >= 80 then 1 else 0 end)/count(s.stud_id)) as percent
from 
  (select stud_id, avg(grade) as av from grade group by stud_id) as p 
cross join 
  student as s
on s.stud_id = p.stud_id
group by klass;
```

本题思路：

1. 算出每个学生的平均分得到临时表p
2. 联结p表和学生表，并按照班级来分组
3. 使用`sun...case...when...then...else...end`语法来计算总人数和人数占比

注意：on语句中不可以直接带`p.av >= 80`作为过滤条件，因为过滤后就没法算占比了。

### 维度转换

`cook`表：

+------+-------+-----+
| year | month | val |
+------+-------+-----+
| 2009 |     1 | 1.1 |
| 2009 |     2 | 1.2 |
| 2009 |     3 | 1.3 |
| 2009 |     4 | 1.4 |
| 2010 |     1 |   2 |
| 2010 |     2 | 2.1 |
| 2010 |     3 | 2.4 |
| 2010 |     4 | 2.9 |
+------+-------+-----+

预期得到的结果是：

+------+------+------+------+------+
| year | Jan  | Feb  | Mar  | Apr  |
+------+------+------+------+------+
| 2009 | 1.10 | 1.20 | 1.20 | 1.20 |
| 2010 | 2.00 | 2.09 | 2.09 | 2.09 |
+------+------+------+------+------+

```sql
select year, 
  truncate(max(case month when 1 then val else 0 end), 2) as Jan,
  truncate(max(case month when 2 then val else 0 end), 2) as Feb,
  truncate(max(case month when 3 then val else 0 end), 2) as Mar,
  truncate(max(case month when 4 then val else 0 end), 2) as Apr
from cook
group by year;
```

思路：使用`case`语句操作维度的转换，然后使用`max`汇总（不匹配的得到0，汇总后被自然合并）

### 连续出现的满足条件的数据

思路一：使用自连接然后分别根据“连续”和“满足条件”进行筛选，如果需要连续多个满足条件的数据则自连接可能较多。

思路二：使用变量

`consecutive`表：

+----+------+
| id | rank |
+----+------+
|  1 |    1 |
|  2 |    2 |
|  3 |    2 |
|  4 |    2 |
|  5 |    3 |
|  6 |    4 |
|  7 |    4 |
|  8 |    5 |
|  9 |    5 |
| 10 |    5 |
| 11 |    5 |
| 12 |    6 |
+----+------+

要找到连续存在3次的rank数据，即：

+------+-------+
| rank | total |
+------+-------+
|    2 |     3 |
|    5 |     4 |
+------+-------+

sql语句：

```sql
select rank, total from (
  select rank, max(
    (case when @prev = rank then @cur := @cur + 1
    when @prev := rank then @cur := 1
    end)
  ) as total
  from consecutive, (select @cur := 0, @prev := 0) as t
  group by rank
) as k 
where total > 3;
```

### 分数排名

`scores` 表：

+----+-------+
| id | score |
+----+-------+
| 1  | 3.50  |
| 2  | 3.65  |
| 3  | 4.00  |
| 4  | 3.85  |
| 5  | 4.00  |
| 6  | 3.65  |
+----+-------+

要将表进行排名成下表：

+-------+------+
| score | rank |
+-------+------+
| 4.00  | 1    |
| 4.00  | 1    |
| 3.85  | 2    |
| 3.65  | 3    |
| 3.65  | 3    |
| 3.50  | 4    |
+-------+------+

* 方法1：子查询，最慢

```sql
select score,
  (select count(distinct score) from scores where score >= s.score) as 'rank'
from scores s
order by score desc;
```

* 方法2：联结

```sql
select a.score, count(distinct b.score) + 1 as 'rank'
from scores as a left join scores as b
on a.score < b.score
group by a.id
order by a.score desc;
```

在上面的sql语句中把第一行的`b.score`换成`b.salary`即可将rank设置为非连续变化。

* 方法3：窗口函数(mysql 8以后支持)

```sql
select score, dense_rank() over(order by score desc) as 'rank' from scores;
```

* 方法4：case when（最快）

```sql
select score,
  cast((case
    when @prev = score then @cur
    when @prev := score then @cur := @cur + 1
    when score <= 0 then @cur := @cur + 1
    end
  ) as signed) as 'rank'
from scores,
  (select @cur := 0, @prev := null) r -- 此r无意义，可换成任何名字
order by score desc;
```

- `cast(A as signed)` 函数将 A 转化为符号整数，因为 case when 得到的是字符串
- 赋值一定需要使用`:=`

### 部门工资前三高的所有员工

`employee`表：

+----+-------+--------+--------------+
| Id | Name  | Salary | DepartmentId |
+----+-------+--------+--------------+
| 1  | Joe   | 85000  | 1            |
| 2  | Henry | 80000  | 2            |
| 3  | Sam   | 60000  | 2            |
| 4  | Max   | 90000  | 1            |
| 5  | Janet | 69000  | 1            |
| 6  | Randy | 85000  | 1            |
| 7  | Will  | 70000  | 1            |
+----+-------+--------+--------------+

`department`表：

+----+----------+
| Id | Name     |
+----+----------+
| 1  | IT       |
| 2  | Sales    |
+----+----------+

需要的结果：按照`departmentid`确定每个部门前三薪资的所有员工，返回如下：

+------------+----------+--------+
| Department | Employee | Salary |
+------------+----------+--------+
| IT         | Max      | 90000  |
| IT         | Randy    | 85000  |
| IT         | Joe      | 85000  |
| IT         | Will     | 70000  |
| Sales      | Henry    | 80000  |
| Sales      | Sam      | 60000  |
+------------+----------+--------+

* 题解：

本题的核心是找到*部门前三的所有员工id*，使用的sql语句为：

```sql
-- e1中的salary小于e2中salary的个数不大于2，说明e1就是前三
select e1.id, e1.departmentid
-- 必须left join，只用join的化每个department的第一名无法检索出来
from employee as e1 left join employee as e2
on e1.departmentid = e2.departmentid
and e1.salary < e2.salary
-- 注意这里需要在having中使用聚类函数
having count(distinct(e2.salary) <= 2);
```

上一步是关键步骤，之后是连表查询：

```sql
select
  department.name as 'department',
  employee.name as 'employee',
  employee.salary as 'salary'
from 
  employee, 
  (select e1.id, e1.departmentid 
  from employee as e1
  left join employee as e2
  on e1.departmentid = e2.departmentid
  and e1.salary < e2.salary
  group by e1.id
  having count(distinct e2.salary) <= 2) as top3,
  department
where
  employee.departmentid = top3.departmentid
  and employee.id = top3.id
  and employee.departmentid = department.id;
```

### 行程和用户

`trips`表：

+----+-----------+-----------+---------+---------------------+------------+
| Id | Client_Id | Driver_Id | City_Id | Status              | Request_at |
+----+-----------+-----------+---------+---------------------+------------+
| 1  | 1         | 10        | 1       | completed           | 2013-10-01 |
| 2  | 2         | 11        | 1       | cancelled_by_driver | 2013-10-01 |
| 3  | 3         | 12        | 6       | completed           | 2013-10-01 |
| 4  | 4         | 13        | 6       | cancelled_by_client | 2013-10-01 |
| 5  | 1         | 10        | 1       | completed           | 2013-10-02 |
| 6  | 2         | 11        | 6       | completed           | 2013-10-02 |
| 7  | 3         | 12        | 6       | completed           | 2013-10-02 |
| 8  | 2         | 12        | 12      | completed           | 2013-10-03 |
| 9  | 3         | 10        | 12      | completed           | 2013-10-03 |
| 10 | 4         | 13        | 12      | cancelled_by_driver | 2013-10-03 |
+----+-----------+-----------+---------+---------------------+------------+

`users`表：

+----------+--------+--------+
| Users_Id | Banned | Role   |
+----------+--------+--------+
| 1        | No     | client |
| 2        | Yes    | client |
| 3        | No     | client |
| 4        | No     | client |
| 10       | No     | driver |
| 11       | No     | driver |
| 12       | No     | driver |
| 13       | No     | driver |
+----------+--------+--------+

从trips表中的client_id，driver_id都不users.banned = 'yes'的数据，然后计算订单未取消的几率，按Request_at时间分类。

本题难点是求出前半部分，即client_id，driver_id都不users.banned = 'yes'的数据。

* 思路一，子查询分别搜索

```sql
select trips.id, trips.request_at from trips 
where trips.client_id not in (select users_id from users where banned='yes') 
and trips.driver_id not in (select users_id from users where banned='yes');
```

* 思路二，联结两次

伪代码：

```js
if (
  (trips.client_id == users.users_id && users.banned == 'no') || 
  (trips.driver_id == users.users_id && users.banned == 'no')
) then ...
```

```sql
select trips.id, trips.request_at
from trips 
join users on trips.client_id = users.users_id and users.banned != 'yes'
join users as u on trips.driver_id = u.users_id and u.banned != 'yes';
```

* 思路三，联结两次

伪代码：

```js
if (
  !(trips.client_id == users.users_id && users.banned == 'yes') &&
  !(trips.driver_id == users.users_id && users.banned == 'yes')
) then ...
```

```sql
select trips.id, trips.request_at 
from trips 
left join (select users_id from users where banned = 'yes') as A on (trips.client_id = A.users_id) 
left join (select users_id from users where banned = 'yes') as A1 on (trips.driver_id = A1.users_id) 
where A.users_id is null and A1.users_id is null;
```

都需要将`client_id`和`driver_id`分开进行计算。

整体答案：

```sql
select
  request_at as 'Day',
  round(count(if(status != 'completed', status, null)) / count(client_id), 2) as 'Cancellation Rate'
from trips
  join users on trips.client_id = users.users_id and users.banned != 'Yes'
  join users as u on trips.driver_id = u.users_id and users.banned != 'Yes'
where trips.request_at >= '2013-10-01' and trips.request_at <= '2013-10-03'
group by request_at;
```
