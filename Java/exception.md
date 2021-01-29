1. 异常的继承情况

- Object
- Throwable
- Error, Exception
- Exception: RuntimeException, IOException, ...
- RuntimeException: NullPointerException, IllegalArgumentException, ...

所有错误继承自`Throwable`

- Error: 重大错误，如`OutOfMemoryError, NoClassDefFoundError, StackOverflowError`
- 程序运行时的逻辑处理错误(`Runtime Exception`)，如`NumberFormatException, FileNotFoundException, SocketException`
- 程序本身编写不对导致的错误，如`NullPointerException, IndexOutOfBoundsException`

必须捕获的异常：包括`Exception`及其子类，但不包括`Runtime Exception`及其子类

2. 异常操作

`e.printStackTrace()` 打印错误堆栈信息

`throw new IllegalArgumentException(e)` 抛出异常时带上e作为参数，可以方便追踪异常栈，否则很难调试

3. 标准库的异常类型

> Exception
>> RuntimeException
>>> NullPointerException
>>> IndexOutOfBoundsException
>>> SecurityException
>>> IllegalArgumentException
>>>> NumberFormatException
>>>
>> IOException
>>> UnsupportedCharsetException
>>> FileNotFoundException
>>> SocketException
>>
>> ParseException
>> GeneralSecurityException
>> SQLException
>> TimeoutException
