# 介绍

## 命令

```go
// 初始化一个包
go mod init example.io/start

// 安装包
go mod tidy

// 打包成二进制包, install安装进 GOBIN 目录
go build
go install

// 打印全部环境变量
go env
// 打印 GOBIN 环境变量
go env GOBIN 

// 运行当前目录中的所有测试程序，测试程序以 *_test.go 命名
go test .

// 运行期当前目录的程序
go run .
```

## 起步

Go是一门编译型语言，Go语言的工具链将源代码及其依赖转换成计算机的机器指令（译注：静态编译）。

Go语言原生支持Unicode，它可以处理全世界任何语言的文本。

Go语言的代码通过包（package）组织，包类似于其它语言里的库（libraries）或者模块（modules）。一个包由位于单个目录下的一个或多个.go源代码文件组成，目录定义包的作用。每个源文件都以一条package声明语句开始，这个例子里就是package main，表示该文件属于哪个包，紧跟着一系列导入（import）的包，之后是存储在这个文件里的程序语句。

Go的标准库提供了100多个包，main包比较特殊。它定义了一个独立可执行的程序，而不是一个库。在main里的main 函数 也很特殊，它是整个程序执行时的入口（译注：C系语言差不多都这样）。

必须恰当导入需要的包，缺少了必要的包或者导入了不需要的包，程序都无法编译通过。这项严格要求避免了程序开发过程中引入未使用的包（译注：Go语言编译过程没有警告信息，争议特性之一）。

Go语言不需要在语句或者声明的末尾添加分号，除非一行上有多条语句。实际上，编译器会主动把特定符号后的换行符转换为分号，因此换行符添加的位置会影响Go代码的正确解析。

Go语言在代码格式上采取了很强硬的态度。gofmt工具把代码格式化为标准格式。

## 常识

### 命令行参数

os.Args, 第一个参数是执行程序名，之后的参数是命令行输入的内容

切片操作：os.Args[1:len(os.Args)] => os.Args[1:]

### for循环

```go
// 1. 累加式
for i := 1; i < 10; i++ {

}

// 2. while式
for i < 10 {

}

// 3. 死循环式
for {

}

// 4. 迭代器式
// 空标识符（即_）可用于在任何语法需要变量名但程序逻辑不需要的时候（如：在循环里）丢弃不需要的循环索引，并保留元素值。大多数的Go程序员都会像上面这样使用range和_写echo程序，因为隐式地而非显式地索引os.Args，容易写对。
// 遍历数组和对象都需要用这中方式
for _, arg := range someMapOrList {

}
```

### cook

声明：共四种 var const type func： `var str string = "string"`

定义数组：var colors = []color.Color{Color.White, Color.Black}

获取随机数：rand.Seed(time.Now().UTC().UnixNano())

多个定义：var a, b, c = 1, "a", true

交互数值：i, j = j, i

类型转换：对于每一个类型T，都有一个对应的类型转换操作T(x)，用于将x转为T类型（译注：如果T是指针类型，可能会需要用小括弧包装T，比如(*int)(0)）。

类型定义：`type Celsius float64`

new函数：创建变量的一种方法，返回一个指针，new是一个函数，可以被复写，不是一个关键字

```go
p := new(int)   // p, *int 类型, 指向匿名的 int 变量
fmt.Println(*p) // "0"
*p = 2          // 设置 int 匿名变量的值为 2
fmt.Println(*p) // "2"
```

## 数据类型

* 整形，int8, int16, int32, int64, 还都有对应的uint版本，int 和 uint类型为平台相关型数据类型
* 浮点数，float32, float64 类型，因为float32的有效bit位只有23个，其它的bit位用于指数和符号；当整数大于23bit能表达的范围时，float32的表示将出现误差
* 字符串类型，是只读类型

### Unicode and UTF8

* unicode编码使用rune(int32)格式编码，每个字符都占用4个字节，比较浪费空间。
* utf8编码方法：

```sql
0xxxxxxx                             runes 0-127    (ASCII)
110xxxxx 10xxxxxx                    128-2047       (values <128 unused)
1110xxxx 10xxxxxx 10xxxxxx           2048-65535     (values <2048 unused)
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  65536-0x10ffff (other values unused)
```

得到字符串的长度：

```go
import "unicode/utf8"

s := "Hello, 世界"
fmt.Println(len(s))                    // "13" 拿到字节数
fmt.Println(utf8.RuneCountInString(s)) // "9" 拿到对应的unicode字符数
```

通过`string`不可把数字转成字符串

```go
fmt.Println(string(65))     // "A", not "65"
fmt.Println(string(0x4eac)) // "京"
fmt.Println(string(1234567)) // "?"
```

unicode包提供了IsDigit、IsLetter、IsUpper和IsLower等类似功能，它们用于给字符分类。

strconv包提供了布尔型、整型数、浮点数和对应字符串的相互转换，还提供了双引号转义相关的转换。

- 整数转字符串，使用 `strconv.Itoa(int)` 或 `strconv.FormatInt(int64, 10)`
- 字符串转数字，使用`x, err := strconv.Atoi("123")`，或者`y, err := strconv.ParseInt("123", 10, 64) // base 10, up to 64 bits`

为了避免转换中不必要的内存分配，bytes包和strings同时提供了许多实用函数。

```go
func Contains(s, substr string) bool
func Count(s, sep string) int
func HasPrefix(s, prefix string) bool
func Index(s, sep string) int
func Join(a []string, sep string) string
func Fields(s string) []string
```

* 常数，常量表达式的值在编译期计算，而不是在运行期。

iota 常量生成器, 从0开始，逐个增加。

```go
const (
    FlagUp Flags = 1 << iota // is up
    FlagBroadcast            // supports broadcast access capability
    FlagLoopback             // is a loopback interface
    FlagPointToPoint         // belongs to a point-to-point link
    FlagMulticast            // supports multicast access capability
)
```
一个常量可以没有确定的基本类型，编译器为这些没有明确基础类型的数字常量提供比基础类型更高精度的算术运算。

* 数组，初始化可以这么做：`var a = [100]int{99: 1} // 数组长100，第99位被初始化为1`

注意，数组的`==`比的是值...

* Slice，可变长数组，这个需要深入去了解一些的。

Slice 的底层数据结构是一个数组，使用 append 往 slice 中添加元素可能引起底层数组的变更。

* map，哈希表结构

构造方法: `make(map[string]int)` 或 `m := map[string]int{}`

禁止对map元素取址的原因是map可能随着元素数量的增长而重新分配更大的内存空间，从而可能导致之前的地址无效。

Map的迭代顺序是不确定的，必须先使用 sort 将键进行排序后再遍历，才可以得到幂等的结果。

`value, ok := m[somekey]`，ok 将告知是否真实存在这个元素。

go 语言中无set结构，使用map来模拟。

* 结构体

结构体成员的输入顺序有重要的意义，不同顺序者规定为不同的结构体。

```go
type Employee struct {
    ID        int
    Name, Address      string
    Address   string
    DoB       time.Time
    Position  string
    Salary    int
    ManagerID int
}

var dilbert Employee
```

以下操作都合法：

```go
dilbert.Salary = 200 // 直接赋值
var employeeOfTheMonth *Employee = &dilbert
employeeOfTheMonth.Position += " (proactive team player)" // 通过指针来赋值，没有使用*语法
```


一个命名为S的结构体类型将不能再包含S类型的成员：因为一个聚合的值不能包含它自身。（该限制同样适应于数组。）但是S类型的结构体可以包含*S指针类型的成员，这可以让我们创建递归的数据结构，比如链表和树结构等。

字面值：`type Point struct { X, Y int }, p := Point{1,2}, q = Point{X: 1, Y: 2}`

`pp := &Point{1, 2}` 的等价写法：`pp := new(Point), *pp = Point{1, 2}`

函数中使用：

函数需要返回结构体的指针，而不是一个结构体，否则左值赋值将不能编译通过。（因为函数返回结构体时未必是一个变量）

如果要在函数内部修改结构体成员的话，用指针传入是必须的；因为在Go语言中，所有的函数参数都是值拷贝传入的，函数参数将不再是函数调用时的原始变量。

## io

读取文件，拿到句柄：os.Open(filename)，返回值和 os.Stdin 一样都是 *File

创建读取器，bufio.NewScanner(f)，返回值是一个读取器 *bufio.Scanner

读取文件，使用for循环:

```go
func readInFile(f *os.File, counts map[string]int) {
	input := bufio.NewScanner(f)
	for input.Scan() {
		counts[input.Text()] ++
	}
}
```

一次性读取全部数据：`data, err := ioutil.ReadFile(filename)`

## Printf 格式表

%d          十进制整数
%x, %o, %b  十六进制，八进制，二进制整数。
%f, %g, %e  浮点数： 3.141593 3.141592653589793 3.141593e+00
%t          布尔：true或false
%c          字符（rune） (Unicode码点)
%s          字符串
%q          带双引号的字符串"abc"或带单引号的字符'c'
%v          变量的自然形式（natural format）
%T          变量的类型
%%          字面上的百分号标志（无操作数）

## 发送请求

http.Get(url) 可以发送请求

http.Response 是一个结构体

```go
type http.Response struct {
    Header map[string][]string
    Body io.Reader
    StatusCode int
    Status string
}
```

并发：

1. 创建一个channel `ch := make(chan, string)`
2. 发送请求时带上 go 关键字 `go fetch(url, ch)`
3. 在 fetch 中把输出定向到 ch `ch <- fmt.Sprintf(...)`
4. 拿回 ch 的内容并打印 `fmt.Printf(<-ch)`

注意：fetch 里面向 ch 发送的次数应该和外侧拿回 ch 内容的调用次数相同，否则有些内容拿不回来

## json

接口在结构体后面写`json`字段注释即可解析出对应的信息，注意`json:`与后面没有空格

```go
type IssuesSearchResult struct {
	TotalCount int `json:"total_count"`
	Items []*Issue
}
```

快速解析：`err := json.NewDecoder(resp.Body).decode(&result)`

struct -> JSON：`data, err := json.Marshal(data)`（编组过程）或`data, err := json.MarshalIndent(data, "", "  ")`（定制行头和缩进）

JSON -> struct：`err := json.Unmarshal(data, &result)`（解码过程）

## 模板

模板生成：

```go
report, err := template.New("report").
    Funcs(template.FuncMap{"daysAgo": daysAgo}).
    Parse(templ)
if err != nil {
    log.Fatal(err)
}
```

`template.Must`辅助函数可以简化这个致命错误的处理：它接受一个模板和一个error类型的参数，检测error是否为nil（如果不是nil则发出panic异常），然后返回传入的模板.

```go
var report = template.Must(template.New("issuelist").
    Funcs(template.FuncMap{"daysAgo": daysAgo}).
    Parse(templ))
```

`template` 有两个类库，分别是 `text/template` 和 `html/template`，后者会额外做些转义操作。

## 错误处理策略

1. 通过 `return` 返回上级调用链`return nil, fmt.Errorf("parsing %s as HTML: %v", url,err)`

2. 重试

```go
func WaitForServer(url string) error {
    const timeout = 1 * time.Minute
    deadline := time.Now().Add(timeout)
    for tries := 0; time.Now().Before(deadline); tries++ {
        _, err := http.Head(url)
        if err == nil {
            return nil // success
        }
        log.Printf("server not responding (%s);retrying…", err)
        time.Sleep(time.Second << uint(tries)) // exponential back-off
    }
    return fmt.Errorf("server %s failed to respond after %s", url, timeout)
}
```

3. 在 main 中，可以考虑合适的时候使用`os.Exit`退出程式 `log.Fatalf("Site is down: %v\n", err)`

4. 仅输出错误信息，不终止执行

5. 不作处理，忽略掉错误

## 文件结尾错误 io.EOF

```go
for {
    r, _, err := in.ReadRune()
    if err == io.EOF {
        break // finished reading
    }
    if err != nil {
        return fmt.Errorf("read failed:%v", err)
    }
    // ...use r…
}
```

## 函数

* 变长参数  `func (nums...int) int {...}`
* defer  在 return 之后，函数返回之前做的事情
* panic & recover  恐慌和复原，复原时可以接收到恐慌时传入的参数，`panic(x)`中`x`的类型为`interface{}`
* defer 可以改变返回值:

```go
func ChangeReturn() (mark int) {
	mark = 3
	defer func() {
		mark += 3
	}()

	return
}
```

## 方法

接收器：可以是一个类型或者一个指针，如果是类型则无法变更参数的字段

```go
type Point struct {
	X, Y int
}

// 此方法无法变更X字段的值
func (p Point) setX (x int) { 
	p.X = x
}

func (p *Point) setX (x int) {
	p.X = x
}
```

如果采用指针作为 receiver 下面的方法不可生效：`Point{1,3}.setX(33)` 会报编译错误，因为go只能读取到变量的地址，而不能读取到字面量（包括常量的，因为常量在编译时会自动转成字面量）地址。

## 接口

使用 `type Face Interface {}` 来定义接口

常用接口：

* `io.Writer`定义了`Write(p []byte) (n int, err error)`方法
* `io.Reader`定义了`Read(p []byte) (n int, err error)`方法
* `sort.Interface`是一个可排序的接口，包含如下方法

```go
type Interface interface {
    Len() int
    Less(i, j int) bool // i, j are indices of sequence elements
    Swap(i, j int)
}
```

* `http.Handler`接口，实现一个函数`ServeHTTP(w ResponseWriter, r *Request)`

`ListenAndServe` 的第二个参数接收一个`http.Handler`: `log.Fatal(http.ListenAndServe("localhost:8000", db))`

处理路由, mux 将一群handler集合成一个

```go
func main() {
    db := database{"shoes": 50, "socks": 5}
    mux := http.NewServeMux()
    mux.Handle("/list", http.HandlerFunc(db.list))
    mux.Handle("/price", http.HandlerFunc(db.price))
    log.Fatal(http.ListenAndServe("localhost:8000", mux))
}
```

net/http包提供了一个全局的ServeMux实例DefaultServerMux和包级别的http.Handle和http.HandleFunc函数，所以对于一般场景无需创建新的mux

```go
func main() {
    db := database{"shoes": 50, "socks": 5}
    http.HandleFunc("/list", db.list)
    http.HandleFunc("/price", db.price)
    log.Fatal(http.ListenAndServe("localhost:8000", nil))
}
```

* error 接口

```go
type error interface {
    Error() string // 返回错误信息
}
```

errors 包：

```go
package errors

func New(text string) error { return &errorString{text} }

type errorString struct { text string }

func (e *errorString) Error() string { return e.text }
```

调用 `errors.New` 函数是非常稀少的，因为有一个方便的封装函数`fmt.Errorf`，他返回一个 `errors` 实例

不光 errors.errorString 实现了 error 接口，还有 syscall.Errno，后者是更底层的错误

* 类型断言

使用`b, err := a.(T)`的形式进行断言

```go
var w io.Writer
w = os.Stdout
f := w.(*os.File)      // success: f == os.Stdout
c := w.(*bytes.Buffer) // panic: interface holds *os.File, not *bytes.Buffer
```

* 类型开关

`x.(type)`将返回 x 的类型，如果 x 是个结构体也将返回结构体的名称。

```go
func readType(z interface{}) {
	switch z := z.(type) {
	case nil:
		fmt.Printf("[nil]: %v\n", z)
	case int, uint:
		fmt.Printf("[integer]: %d\n", z)
	case string:
		fmt.Printf("[string]: %s\n", z)
	case float32, float64:
		fmt.Printf("[float]: %.8f\n", z)
	case bool:
		fmt.Printf("[bool]: %v\n", z)
	case rune:
		fmt.Printf("[bool]: %c\n", z)
	default:
		fmt.Printf("[other]: %v\n", z)
	}
}

```

## 并发

使用`go func(){}()`的方式启动一个routine，main退出之前 routine 也会退出。

chan用来沟通多个routine，每个chan都是有类型的，我们也可以指定第二个整形参数，对应channel的容量。如果channel的容量大于零，那么该channel就是带缓存的channel。

一个基于无缓存Channels的发送操作将导致发送者goroutine阻塞，直到另一个goroutine在相同的Channels上执行接收操作，当发送的值通过Channels成功传输之后，两个goroutine可以继续执行后面的语句。`c := make(chan struct{})`

```go
func main()  {
	dial, err := net.Dial("tcp", "localhost:8001")
	if err != nil {
		log.Fatal(err)
	}
	c := make(chan struct{}) // 生成一个chan
	//defer dial.Close() // defer 发生在return之后，程式退出之前
	go func() {
		MustCopy(os.Stdout, dial)
		dial.(*net.TCPConn).CloseRead()
		c <- struct{}{} // 由于chan没有缓存，main将等待go routine中执行完毕才会退出
	}()
	MustCopy(dial, os.Stdin) // 这种重定向标准输入/输出的命令会一直阻塞，fd里面有描述
	dial.(*net.TCPConn).CloseWrite()
	//dial.Close()
	<- c // 消费 chan 的值，恢复 main 运行
	log.Printf("main closed!")
}

func MustCopy(writer io.Writer, reader io.Reader) {
	if _, err := io.Copy(writer, reader); err != nil {
		log.Fatal(err)
	}
	log.Printf("copy closed!")
}

```

关闭chan：`close(chan)`，但是关闭后取用者还是可以取到一个零值，如`d := <-ch`, ch关闭后，d还是可以取到值；使用`d, err := <-ch`, err 可以标识ch是否还开启着；在循环中甚至可以 `for c := range ch { /* do something */ }`

以下几种情况都会panic：

1. 当一个channel被关闭后，再向该channel发送数据
2. 重复关闭一个channel
3. 关闭一个nil值的channel

作为函数参数时的单向channel：类型`chan<- int`表示一个只发送int的channel，只能发送不能接收。相反，类型`<-chan int`表示一个只接收int的channel，只能接收不能发送。（箭头<-和关键字chan的相对位置表明了channel的方向。）这种限制将在编译期检测。

对一个只接收的channel调用close将产生一个编译错误。

```go
func writeSomething (in chan<- string) {
	in <- "something"
}

func readSomething (out <-chan string) {
	fmt.Println(<- out)
}

func main()  {
	ch := make(chan string)
	go writeSomething(ch) // 这个函数必须用go启动
	readSomething(ch) // 这个函数阻塞在main中，不可以加go
}
```

带缓存的channel：如果我们使用了无缓存的channel，那么两个慢的goroutines将会因为没有人接收而被永远卡住。这种情况，称为goroutines泄漏，这将是一个BUG。和垃圾变量不同，泄漏的goroutines并不会被自动回收，因此确保每个不再需要的goroutine能正常退出是重要的。

```go
// 这个例子相当于 Promise.allSettled
func many() {
	var wg sync.WaitGroup
	c := make(chan string, 2)
	wg.Add(3)
	go request("https://www.qq.com", c)
	go request("https://imis.bytedance.net", c)
	go request("http://www.a,d,b", c)
	go func(){
		wg.Wait()
		close(c) // chan 必须被关闭后，下面的循环才能结束
	}()
	for s := range c {
		l := math.Min(100, float64(len(s)))
		fmt.Println(s[:int(l)])
		wg.Done()
	}
}
```

使用channel解决爬虫的并发数问题：

```go
package main

import (
	"fmt"
	"golang.org/x/net/html"
	"net/http"
	"strings"
)

func Plink(startUrl string, maxVisit int) {
	ch := make(chan string)
	visitedNum := 0
	visitedLink := make(map[string]bool)
	go func() {
		ch <- startUrl
	}()
	for link := range ch {
		if visitedLink[link] {
			continue
		}
		if visitedNum > maxVisit {
			close(ch) // 这里close不会报错
			return
		}
		visitedLink[link] = true
		visitedNum += 1
		fmt.Printf("[start to parse]: %s\n", link)
		go func(link string) {
			parseUrl(link, ch)
		}(link)
	}
}

var tokens = make(chan struct{}, 20) // 1, 这三句代码给并发加了个限制，防止dns查询超时的错误

func parseUrl(url string, ch chan<- string) {
	tokens <- struct{}{} // 2,
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("request error: %s %s\n", url, err)
		return
	}
	defer func() {
		resp.Body.Close()
		<-tokens // 3,
	}()

	doc, err := html.Parse(resp.Body)
	if err != nil {
		fmt.Printf("parse error: %s\n", url)
		return
	}

	traverse(doc, ch)
}

func traverse(doc *html.Node, ch chan<- string) {
	if doc == nil {
		return
	}

	if doc.Type == html.ElementNode && doc.Data == "a" {
		for _, a := range doc.Attr {
			if a.Key == "href" && strings.HasPrefix(a.Val, "http") {
				ch <- a.Val
			}
		}
	}

	traverse(doc.FirstChild, ch)
	traverse(doc.NextSibling, ch)
}
```

* 死锁的基本情况

```go
func main() {
	m := make(chan int)
	// m <- 1 如果main里面有这句，而且m没有buffer的话，一定会死锁，不论是否在go语句中取出m的值
	go func() {
		m <- 1 // 这样才能不发生死锁
		<-m
	}()
	fmt.Println("end")
}
```

* `select case default` 语句

一种分支语句，可以实现类似 `Promise.race` 的效果

case中的分支选取可能执行的进行执行，如果都有可能则随机选择一个来执行

```go
func rawSelect() {
	// m := make(chan int) 这种情况下，channel发生死锁
	// m := make(chan int, 1) 这种情况下，打印出不变的序列
	m := make(chan int, 2) // 这种情况下，打印出的序列是不固定的，因为存在一个select中两个case均有可能发生的情况
	for i := 0; i < 100; i++ {
		select {
		case num := <-m:
			fmt.Printf("%d\n", num)
		case m <- i:
		}
	}
}

func main() {
	rawSelect()
}
```

下面是一个发射火箭的例子

```go
func launch() {
	fmt.Println("soar!!!")
}

func stopManually(ch chan <- struct{}) {
	os.Stdin.Read(make([]byte, 1)) // 读取一个enter输入
	ch <- struct{}{}
}

func selectLaunch() {
	tch := time.Tick(1 * time.Second)
	stop := make(chan struct{})
	go stopManually(stop)
	for i := 10; i >= 0; i-- {
		select {
		case <-tch:
			fmt.Printf("[count down]: %ds\n", i)
		case <-stop:
			fmt.Println("launch stopped")
			return
		//default: 如果这个放开的话，launch将直接被执行
		//	fmt.Println("hanging...")
		}
	}
	launch()
}
```

串行和并行的差异，做法2使用了sync.WaitGroup

```go
	/* 做法1，串行递归访问文件 */
	//fileSize := make(chan int64)
	//go func() {
	//	for _, root := range roots {
	//		Walkdir(root, fileSize)
	//	}
	//	close(fileSize)
	//}()

	/* 做法2，并行扫描文件 */
	fileSize := make(chan int64)
	for _, root := range roots {
		n.Add(1)
		go Walkdir(root, fileSize)
	}
	go func() {
		n.Wait()
		close(fileSize)
	}()
```

## 共享变量的并发
