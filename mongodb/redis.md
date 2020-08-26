## Redis

Redis是一款数据结构服务器，键值可以包括字符串类型，同时可以包括哈希、列表、集合和有序集合等数据类型。

Redis的优点：

* 性能极高：Redis 能支持超过 100K+ 每秒的读写频率。
* 丰富的数据类型：Redis 支持二进制案例的 Strings，Lists，Hashes，Sets 及 Ordered Sets 数据类型操作。
* 原子：Redis 的所有操作都是原子性的，同时 Redis 还支持对几个操作全并后的原子性执行。
* 丰富的特性：Redis 还支持 publish/subscribe，通知，key 过期等等特性。

数据的存入和读取：

`set ${mykey} ${somevalue}` set命令将取代现有的任何已存在的key
`get ${mykey}` 获取key对应的值
`mset a 10 b 20 c 30` 一次性设置多个值
`mget a b c` 一次性获取多个值

列表：

`rpush, lpush, rpop, lpop`操作数组 `lrange list 0 -1` 打印结果，一个列表最多可容纳2^32-1个元素
