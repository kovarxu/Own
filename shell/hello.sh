echo hello
var="variable"
# echo "hello"$var"world"
# echo "hello"${var}"world"

# 条件语句
# if [ $var = "aaa" ] 
# then
#   echo "$var"
# else
#   echo "not eq"
# fi

# 循环语句
# for (( i=1;i<=5;i++ )) 
# do
#   echo $i
# done

# for i in 1 2 3 4 5
# do
#   echo $i
# done

# index=1
# while (( index<6 ))
# do
#   echo $index
#   let index++
# done

# 简单函数
# foo(){
#   read -p "give your first name: " firstName
#   read -p "give your second name: " secondName
#   if [ ${firstName} = "Jack" ]
#   then
#     echo "forbid first name: "${firstName}
#     return 4
#   else
#     echo "your full name is: "${firstName}${secondName}
#     # return 0;
#   fi
# }

# foo
# echo "return: $?"

curbr=`git branch | grep 'dev' | sed '1s/*//g;s/ //g'`
echo $curbr
