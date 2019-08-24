本文主要内容是git的基本使用，是对[git pro](https://gitee.com/progit), 主要包含以下几个方面：
1. 
2. 
3. 

### git基本命令
----------------------

> `git init`初始化git仓库 会创建一个`.git`文件, git保存的不是文件差异或者变化量，而只是一系列文件快照。

> `git clone git://github.com/xyz/qwas.git [dirname]`从线上仓库克隆, 可以赋予一个新的文件夹名

> `git add [file]`添加文件

> `git commit -m [string]`提交文件到版本库 -m 参数加入了一行提交注释, 必填项

> 可以简单把`git add`和`git commit -m`合并为`git commit -am [string]`

> `git status`查看文件状态

> `git diff`查看modified和staged文件的差别, 查看staged文件和上次commit文件的差别`git diff --staged`

> `git mv [file_from] [file_to]`移动文件

### git对文件的追踪方式
----------------------

[](image/git_filestate.png)

> 在git中，文件有四种状态: untracked(文件压根没被git管理), unmodified(文件已经纳入管理但未被修改), modified(有修改) 和 staged(文件已被提交到暂存区)

> `git add`命令有两种含义: 一是将untracked的文件状态变为staged, 即将文件纳入版本管理之下；二是将已经修改过的文件(modified状态)变为staged状态, 即添加到暂存区

> `git commit`命令将版本变化提交到版本库，然后现在工作区内的文件状态恢复为unmodified

> `git rm [file]`将文件从版本库**和硬盘**删除, 如果文件已被暂存需要加入 -f 选项强制删除

> `git rm --cached [file]`将文件踢出版本控制(状态变为untracked), 但不实际从硬盘删除

### 撤销操作
----------------------

> `git commit --amend`重新提交，使用新的staged文件重新commit以覆盖上次commit的版本, 也可以用于修改commit注释

> `git reset HEAD [filename]`取消暂存，将staged文件回到modified状态

> `git checkout -- [filename]`放弃修改，将modified文件回到unmodified状态

> `git reset HEAD~1` 回退一个版本，默认使用`--mixed`参数，还有`--soft, --hard`参数

>> `HEAD`指向目前工作的稳定版本，`Index`指向即将被提交的版本(add版本)，`Working Copy`指向正在工作的版本，包含尚未被`add`但是发生修改保存的文件。`--mixed`参数回退到`HEAD = Index < Working`状态，`--soft`回退到`HEAD < Index = Working`状态，`--hard`回退到`HEAD = Index = Working`状态，即放弃修改，此种操作较为危险，可能丢失数据，可以使用`git reflog`找回。

>> 本地回退后`git push --force`回退远程分支，或者`git push origin HEAD --force`

>> 使用`git revert HEAD~1`代替`reset`操作，revert相当于一次新的提交

>

> `git stash` 保存当前工作区的内容，恢复到未修改之前，这条命令不会消除未被追踪(未被add进版本库文件)的信息。

>> `git stash list`查看保存的stash

>> `git stash apply [id]`恢复工作区内容

>

> `git merge --abort`当合并操作冲突时，撤销合并

> `git commit --amend`修改提交内容，并入前一次的修改中

### 远程仓库
----------------------

> `git remote`查看所有的远程仓库 `git remote -v`显示远程仓库的对应克隆地址

> `git remote add [remote_name] [repo_url]` 添加一个远程仓库，使用`[remote_name]`命名

> `git checkout --track origin/xxxx`或者`git checkout -b xxx origin/xxx`创建本地分支追踪远程分支

> `git fetch [remote_name]`拉取远程仓库的所有更新，**但不自动合并**, 远程仓库对应的分支名称形式为`[remote_name]/[branch_name]`如`origin/master`, `origin`是初次`git clone`自动生成的远程仓库名

> `git pull`拉取远程仓库分支并自动与本地追踪分支合并, 相当于`git fetch; git merge [] []`

> 推送本地仓库到远程`git push [remote_name] [branch_name]`

> `git remote show [remote_name]`查看远程仓库信息

> `git remote rename [old_name] [new_name]`修改本地远程仓库名，仅限本地修改


### git分支基本原理
----------------------

### .gitignore
----------------------
`.gitignore`文件用于记录一些无需纳入git管理的文件或文件夹, 例如node_modules、dist等
> `#`开头的行是注释

> 最后跟`/`说明要忽略的是目录

> 开头加入`!`取反

> 适用标准的glob模式(简化版正则), `*`匹配零个或多个任意字符；`[abc]`匹配任何一个列在方括号中的字符（这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）;`?`只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符，表示所有在这两个字符范围内的都可以匹配（比如 `[0-9]` 表示匹配所有 0 到 9 的数字）

### 查看提交历史
----------------------

简单地使用`git log`命令可以查看提交记录，git提供了多种查看选项，包含版本SHA-1校验和、作者和提交者、提交时间、提交注释等信息，以下是`git log `可以跟的命令以及它们显示的内容：

|参数|校验和|提交者|提交时间|注释|内容追踪|
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
|-p|`:o:`|`:o:`|`:o:`|`:o:`|显示详细修改|
|--stat|`:o:`|`:o:`|`:o:`|`:o:`|显示单个文件增删改的行数|
|--shortstat|`:o:`|`:o:`|`:o:`|`:o:`|显示文件增删改的总数|
|--name-only|`:o:`|`:o:`|`:o:`|`:o:`|显示发生变化的文件名|
|--abbrev-commit|`:o:`|`:o:`|`:o:`|`:o:`|`:x:`|
|--pretty=oneline|`:o:`|`:x:`|`:x:`|`:o:`|`:x:`|
|--pretty=short|`:o:`|`:o:`|`:x:`|`:o:`|`:x:`|

> `git log --graph`采用ASCII图形化显示合并历史

> `git reflog`查看最近的操作，可看到修改对应的版本号,可添加`--author`制定作者

> `gitk`使用图形化工具查看提交和合并历史
gitk基本上相当于`git log`命令的可视化版本，凡是`git log`可以用的选项也都能用在gitk上, 这篇文章列出了部分基础实践[Use gitk to understand git](https://lostechies.com/joshuaflanagan/2010/09/03/use-gitk-to-understand-git/)。

gitk的好处是一目了然地观察出提交和合并的记录，并且可以随之查看不同版本间文件的差异。它有一个版本分支结构图，绿色标签为分支，加粗字体为当前分支名；用实线同时联结下方两个版本的文件版本发生了一次合并，相同提交者提交的版本用带颜色的实线联结。
例如下面这样：

怎么样，是不是非常直观，非常清晰地观察到了每次的提交和合并。

当然，更多时候是这样：

好吧，只要你看清上面几条规则，也是能捋清楚的（跑


#### Additions：
----------------------

> git可以支持`https://, git://, user@server:/path.git`等协议

> 在git命令行界面, 敲击对应命令后连按Tab键会出现输入命令提示, 适合命令记忆模糊时查找

> git命令命名, 关心程序员, 少按几次键。  

>>形式为`git config --global alias.[directive_name] '[directive]'`

>> `git config --global alias.unstaged 'reset HEAD --'`然后就可以直接`git unstaged [filename]`来取消文件修改  

>> `[directive]`以`!`开头表明对应的是外部命令，而非git命令，例如`git config --global alias.visual 'gitk'`然后运行`visual`即可启动gitk

常用的实践方式：
>> `git config --global alias.br branch` 

>> `git config --global alias.co checkout` 

>> `git config --global alias.st status` 

>> `git config --global alias.cm "commit -m"` 

>> `git config --global alias.bl "branch --list -a"` 再加通配符查看分支更方便`git bl *author*`查看所有本地和远程包含`author`的分支, `git bl *origin/*`查看所有在origin上的远程分支

>
> git mergetool ==> beyond compare4 的相关配置

#### 开发流程
----------------------

结合现在公司的流程进行描述：
公司有master, beta, gamma三个主分支，其中master对应线上稳定版本的分支，beta对应测试分支，gamma对应预发布分支

开发人员步骤：

0. 接到需求，诅咒产品经理一秒
1. 基于origin/master新建分支origin/xxx_yyy_zzz
2. 新建本地跟踪分支`git checkout --track origin/xxx_yyy_zzz`
3. 在本地分支开发，进行若干次提交
4. 开发到一阶段，需要提交到线上，先`git pull`拉取远程分支，*因为可能多人共用同一分支开发，比如前端人员在后端分支上修改了一点东西之类的，这一步先`pull`解决冲突*
5. 提交到线上`git push`
6. 开发 -- 提交 -- ... -- 开发 -- 提交
7. 开发完，产品体验通过后，需要合并到`beta`环境进行测试，先`git checkout beta`切换到beta环境，然后`git pull`拉取beta分支最新的代码
8. 合并本地分支`git merge xxx_yyy_zzz`  
<span style="color: red;">注意：</span>**千万不要把beta合到自己的分支**、**千万不要把beta合到自己的分支**、**千万不要把beta合到自己的分支**，beta上都是正在测试未经发布的代码，有一堆的bug，一不小心合到本地分支还好，万一推到master环境，后果是很严重的，不要问我为什么写这个
9. 推送beta分支`git push beta`, 操作beta都有可能冲突，因为可能有几个人同时在修改一份文件
8. 测试通过，要发布需求，一般开发人员是没有权限合并到master的
7. 切换到master分支并更新`git checkout master; git pull`
6. 切换到自己的分支，与master分支合并`git checkout xxx_yyy_zzz; git merge master`, 解决冲突
5. 推送本地分支`git push`
4. 将分支名`xxx_yyy_zzz`告知测试，通知发布

测试人员步骤：

*****
